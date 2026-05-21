import { Component, OnInit, ChangeDetectorRef, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PropiedadVenta, PropiedadAlquiler } from '../../interfaces/inmueble';
import { InmuebleService } from '../../service/inmueble.service';
import { GalleriaModule } from 'primeng/galleria';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-detalle-inmueble',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    GalleriaModule,
    TagModule,
    ButtonModule,
    DividerModule,
    InputTextModule,
    TextareaModule
  ],
  templateUrl: './detalle-inmueble.html',
  styleUrl: './detalle-inmueble.scss',
})
export class DetalleInmueble implements OnInit, OnChanges {
  @Input() idInput: number | null = null;
  @Input() tipoInput: 'venta' | 'alquiler' | null = null;

  id: number | null = null;
  tipo: 'venta' | 'alquiler' = 'venta';
  inmuebleVenta?: PropiedadVenta;
  inmuebleAlquiler?: PropiedadAlquiler;
  mapUrl: SafeResourceUrl | null = null;
  loading = false;
  error = false;
  fullscreenImg: string | null = null;
  fullscreenIndex = 0;
  
  responsiveOptions: any[] = [
    { breakpoint: '1024px', numVisible: 5 },
    { breakpoint: '768px', numVisible: 3 },
    { breakpoint: '560px', numVisible: 1 }
  ];

  router = inject(Router);

  constructor(
    private route: ActivatedRoute,
    private inmuebleService: InmuebleService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  volver() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { detalle: null, tipo: null },
      queryParamsHandling: 'merge'
    });
  }
  ngOnInit() {
    // Si ya tenemos inputs (vía @Input), cargamos directamente
    if (this.idInput && this.tipoInput) {
      this.cargarDatos(this.idInput, this.tipoInput);
      return;
    }
    // Fallback: intentar sacar de la ruta (para rutas tipo /detalle-venta/:id)
    this.route.params.subscribe(params => {
      const idFromRoute = +params['id'];
      if (idFromRoute && !isNaN(idFromRoute)) {
        const path = this.route.snapshot.url.map(s => s.path).join('/');
        const tipoFromRoute = path.includes('venta') ? 'venta' : 'alquiler';
        this.cargarDatos(idFromRoute, tipoFromRoute as any);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['idInput'] || changes['tipoInput']) && this.idInput && this.tipoInput) {
      this.cargarDatos(this.idInput, this.tipoInput);
    }
  }

  private cargarDatos(id: number, tipo: 'venta' | 'alquiler') {
    this.id = id;
    this.tipo = tipo;
    this.loading = true;
    this.error = false;
    this.inmuebleVenta = undefined;
    this.inmuebleAlquiler = undefined;

    if (this.tipo === 'venta' && this.id) {
      this.inmuebleService.getVentaById(this.id).subscribe({
        next: (res) => {
          console.log('[DetalleInmueble] Respuesta venta:', res);
          console.log('[DetalleInmueble] fotos_urls:', (res as any)?.fotos_urls);
          this.inmuebleVenta = res;
          this.loading = false;
          this.generarMapaUrl();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("Error obteniendo detalle venta", err);
          this.loading = false;
          this.error = true;
          this.cdr.detectChanges();
        }
      });
    } else if (this.tipo === 'alquiler' && this.id) {
      this.inmuebleService.getAlquilerById(this.id).subscribe({
        next: (res) => {
          console.log('[DetalleInmueble] Respuesta alquiler:', res);
          console.log('[DetalleInmueble] fotos_urls:', (res as any)?.fotos_urls);
          this.inmuebleAlquiler = res;
          this.loading = false;
          this.generarMapaUrl();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("Error obteniendo detalle alquiler", err);
          this.loading = false;
          this.error = true;
          this.cdr.detectChanges();
        }
      });
    }
  }

  private generarMapaUrl() {
    const info = this.generalInfo;
    if (info) {
      const query = encodeURIComponent(`${info.direccion_prop}, ${info.cp_prop}, ${info.provincia_prop}, España`);
      const url = `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
      this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }

  get generalInfo() {
    return this.inmuebleVenta || this.inmuebleAlquiler;
  }

  /**
   * Construye la URL completa de una foto, añadiendo el base del backend si es relativa.
   */
  private construirUrlFoto(url: string): string {
    if (!url) return '/demo/images/galleria/no_photo.png';
    // Si es base64 (data:image/...), la devolvemos tal cual
    if (url.startsWith('data:image')) {
      return url;
    }
    // Si ya es URL absoluta o del demo, la devolvemos tal cual
    if (url.startsWith('http') || url.startsWith('/demo')) {
      return url;
    }
    // Si es relativa (empieza con / o es un path simple), añadimos el base del backend
    const path = url.startsWith('/') ? url.substring(1) : url;
    return `http://localhost:8080/tupisoya/${path}`;
  }

  openFullscreen(url: string) {
    this.fullscreenImg = url;
    this.fullscreenIndex = this.fotos.findIndex(f => f.url_foto === url);
    if (this.fullscreenIndex === -1) this.fullscreenIndex = 0;
    document.body.style.overflow = 'hidden';
  }

  closeFullscreen() {
    this.fullscreenImg = null;
    document.body.style.overflow = '';
  }

  prevFullscreen() {
    if (this.fotos.length <= 1) return;
    this.fullscreenIndex = (this.fullscreenIndex - 1 + this.fotos.length) % this.fotos.length;
    this.fullscreenImg = this.fotos[this.fullscreenIndex].url_foto;
  }

  nextFullscreen() {
    if (this.fotos.length <= 1) return;
    this.fullscreenIndex = (this.fullscreenIndex + 1) % this.fotos.length;
    this.fullscreenImg = this.fotos[this.fullscreenIndex].url_foto;
  }

  get fotos(): { url_foto: string }[] {
    // El backend devuelve las fotos en el campo 'fotos_urls' (array de strings base64 o null)
    const info: any = this.generalInfo;
    const fotosRaw = info?.fotos_urls || info?.fotos;
    if (fotosRaw && Array.isArray(fotosRaw) && fotosRaw.length > 0) {
      return fotosRaw.map((f: any) => {
        // Caso 1: es un string (URL directa o base64)
        if (typeof f === 'string') {
          return { url_foto: this.construirUrlFoto(f) };
        }
        // Caso 2: es un objeto con alguna propiedad de URL
        const url = f.url_foto || f.url || f.foto || f.ruta || f.imagen || '';
        return { url_foto: this.construirUrlFoto(url) };
      });
    }
    // Fallback: foto por defecto
    return [{ url_foto: '/demo/images/galleria/no_photo.png' }];
  }

}
