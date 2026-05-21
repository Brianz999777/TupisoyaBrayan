import { PersonaNatural } from "./persona-natural";
import { PersonaJuridica } from "./persona-juridica";

export interface RegisterRequest {
  email: string;
  password: string;
  estado_usu: string;
  rol: string;
  persona: PersonaNatural | PersonaJuridica;
}
