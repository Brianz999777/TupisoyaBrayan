import { Injectable, OnDestroy } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
// @ts-ignore - sockjs-client tiene problemas de tipos con bundler
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class ChatWebSocketService implements OnDestroy {
  private client: Client | null = null;
  private suscripciones: Map<string, any> = new Map();
  private conectado = false;

  constructor() {}

  conectar(token: string): void {
    if (this.conectado) return;

    this.client = new Client({
      webSocketFactory: () => new SockJS(`https://tupisoyajava.onrender.com/tupisoya/ws-chat`),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: () => {}
    });

    this.client.onConnect = () => {
      this.conectado = true;
    };

    this.client.onStompError = (frame) => {
      console.error(`Error STOMP: ${frame.headers['message']}`, frame);
      this.conectado = false;
    };

    this.client.onWebSocketClose = () => {
      this.conectado = false;
    };

    this.client.activate();
  }

  desconectar(): void {
    if (this.client && this.conectado) {
      this.limpiar_suscripciones();
      this.client.deactivate();
      this.conectado = false;
    }
  }

  enviar_mensaje(destino: string, cuerpo: any): void {
    if (!this.client || !this.conectado) return;

    this.client.publish({
      destination: destino,
      body: JSON.stringify(cuerpo)
    });
  }

  suscribirse(destino: string, callback: (mensaje: any) => void): void {
    if (!this.client || !this.conectado) return;

    this.desuscribirse(destino);

    const suscripcion = this.client.subscribe(destino, (mensaje: IMessage) => {
      try {
        const cuerpo = JSON.parse(mensaje.body);
        callback(cuerpo);
      } catch (e) {
        console.error(`Error al parsear mensaje de ${destino}`, e);
      }
    });

    this.suscripciones.set(destino, suscripcion);
  }

  desuscribirse(destino: string): void {
    const suscripcion = this.suscripciones.get(destino);
    if (suscripcion) {
      suscripcion.unsubscribe();
      this.suscripciones.delete(destino);
    }
  }

  private limpiar_suscripciones(): void {
    this.suscripciones.forEach((_, destino) => {
      this.desuscribirse(destino);
    });
    this.suscripciones.clear();
  }

  esta_conectado(): boolean {
    return this.conectado;
  }

  ngOnDestroy(): void {
    this.desconectar();
  }
}
