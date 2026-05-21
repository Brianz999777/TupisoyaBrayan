import { UserDTO } from "./user-dto";

export interface Login {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: UserDTO;
}
