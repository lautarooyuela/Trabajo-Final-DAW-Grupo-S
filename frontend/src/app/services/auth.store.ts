import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class AuthStore {
    guardarToken(token: string): void {
        sessionStorage.setItem("accessToken", token);
    }

    obtenerToken(): string | null {
        return sessionStorage.getItem("accessToken");
    }

    cerrarSesion(): void {
        sessionStorage.removeItem("accessToken");
    }
}
