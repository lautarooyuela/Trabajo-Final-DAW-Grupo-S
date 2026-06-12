import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoginApiClient {
    private readonly client: HttpClient = inject(HttpClient)

    iniciarSesion(nombre: string, clave: string): Observable<{ accessToken: string }> {
        // Usamos /api/auth que es el endpoint definido en el backend
        return this.client.post<{ accessToken: string }>("/api/auth", { nombre, clave });
    }
}
