import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente.service';
import { AuthService } from '../../services/auth.service';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import { COUNTRIES, Country } from '../../models/countries';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="form-container">
      <div class="card">
        <h2>{{ editando ? 'Editar' : 'Nuevo' }} Cliente</h2>
        <form (ngSubmit)="guardar()">
          <label>Nombre:</label>
          <input type="text" [(ngModel)]="cliente.nombre" name="nombre" required />

          <label>Email:</label>
          <input type="email" [(ngModel)]="cliente.email" (blur)="validarEmail()" name="email" placeholder="usuario@dominio.com" required />
          @if (emailError()) {
            <p class="error-msg">{{ emailError() }}</p>
          }

          <label>Teléfono:</label>
          <div class="telefono-container">
            <select [(ngModel)]="paisSeleccionado" (change)="onPaisChange()" name="pais" required>
              @for (pais of paisesDisponibles; track pais.code) {
                <option [value]="pais.code">{{ pais.flag }} +{{ pais.dialCode }}</option>
              }
            </select>
            <input 
              type="tel" 
              [(ngModel)]="cliente.telefono" 
              (blur)="validarTelefono()" 
              name="telefono" 
              [placeholder]="paisActual()?.format || '+XX XXX XXX XXXX'"
              inputmode="numeric"
              required 
            />
          </div>
          @if (telefonoError()) {
            <p class="error-msg">{{ telefonoError() }}</p>
          }
          
          <div class="actions">
            <button type="submit" class="btn-guardar">Guardar</button>
            <button type="button" class="btn-cancelar" (click)="volver()">Cancelar</button>
          </div>
        </form>
        @if (error()) {
          <p class="error">{{ error() }}</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .form-container { display: flex; justify-content: center; padding: 40px; background-color: #f5f5f5; height: 100vh; }
    .card { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 100%; max-width: 500px; height: fit-content; }
    label { display: block; margin-bottom: 8px; font-weight: bold; color: #555; }
    input, select { width: 100%; padding: 10px; margin-bottom: 5px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-family: inherit; }
    input:invalid:not(:placeholder-shown) { border-color: #d32f2f; }
    .telefono-container { display: flex; gap: 8px; margin-bottom: 20px; }
    .telefono-container select { flex: 0 0 35%; padding: 10px; margin-bottom: 0; }
    .telefono-container input { flex: 1; margin-bottom: 0; }
    .error-msg { color: #d32f2f; font-size: 0.9em; margin-top: -15px; margin-bottom: 10px; }
    .actions { display: flex; gap: 10px; margin-top: 20px; }
    button { padding: 10px 20px; border-radius: 4px; border: none; cursor: pointer; font-weight: bold; }
    .btn-guardar { background-color: #2e7d32; color: white; flex: 1; }
    .btn-cancelar { background-color: #f5f5f5; color: #555; border: 1px solid #ddd; flex: 1; }
    .error { color: #d32f2f; margin-top: 15px; text-align: center; }
  `]
})
export class ClienteFormComponent implements OnInit {
  cliente: Partial<Cliente> = { nombre: '', email: '', telefono: '' };
  editando = false;
  id: number | null = null;
  error = signal('');
  emailError = signal('');
  telefonoError = signal('');

  paisesDisponibles = COUNTRIES;
  paisSeleccionado = 'AR'; // País por defecto: Argentina
  paisActual = signal<Country | undefined>(COUNTRIES.find(p => p.code === 'AR'));

  constructor(
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (!this.authService.puedeGestionarClientes()) {
      this.router.navigate(['/clientes']);
      return;
    }

    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      this.editando = true;
      this.id = Number(param);
      this.clienteService.obtenerPorId(this.id).subscribe(c => {
        this.cliente = {
          nombre: c.nombre,
          email: c.email,
          telefono: c.telefono,
        };
        // Extraer código de país del teléfono E.164
        if (c.telefono) {
          this.extraerPaisDelTelefono(c.telefono);
        }
      });
    }
  }

  onPaisChange() {
    const pais = COUNTRIES.find(p => p.code === this.paisSeleccionado);
    this.paisActual.set(pais);
    // Limpiar error cuando cambia país
    this.telefonoError.set('');
  }

  extraerPaisDelTelefono(telefonoE164: string) {
    try {
      const parsed = parsePhoneNumber(telefonoE164);
      if (parsed && parsed.country) {
        this.paisSeleccionado = parsed.country;
        this.onPaisChange();
        // Extraer solo el número sin el +34 o similar
        const numeroSinPais = telefonoE164.replace(/^\+\d{1,3}/, '');
        this.cliente.telefono = numeroSinPais;
      }
    } catch (e) {
      // Si no se puede parsear, mantener como está
    }
  }

  validarEmail() {
    const email = this.cliente.email || '';
    if (!email) {
      this.emailError.set('El email es requerido');
    } else if (!this.esEmailValido(email)) {
      this.emailError.set('El email debe ser válido (ej: usuario@dominio.com)');
    } else {
      this.emailError.set('');
    }
  }

  validarTelefono() {
    const telefonoLocal = (this.cliente.telefono || '').replace(/\D/g, '');
    
    if (!telefonoLocal) {
      this.telefonoError.set('El teléfono es requerido');
      return;
    }

    const pais = COUNTRIES.find(p => p.code === this.paisSeleccionado);
    if (!pais) {
      this.telefonoError.set('País no válido');
      return;
    }

    const telefonoE164 = '+' + pais.dialCode + telefonoLocal;

    try {
      if (!isValidPhoneNumber(telefonoE164, this.paisSeleccionado as any)) {
        this.telefonoError.set(`Teléfono no válido para ${pais.name}`);
        return;
      }
      this.telefonoError.set('');
    } catch (e) {
      this.telefonoError.set('Error al validar teléfono');
    }
  }

  obtenerTelefonoE164(): string {
    const telefonoLocal = (this.cliente.telefono || '').replace(/\D/g, '');
    const pais = COUNTRIES.find(p => p.code === this.paisSeleccionado);
    if (!pais || !telefonoLocal) return this.cliente.telefono || '';
    return '+' + pais.dialCode + telefonoLocal;
  }

  esEmailValido(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  guardar() {
    if (!this.authService.puedeGestionarClientes()) {
      this.router.navigate(['/clientes']);
      return;
    }

    this.validarEmail();
    this.validarTelefono();

    if (this.emailError() || this.telefonoError()) {
      this.error.set('Por favor corrige los errores');
      return;
    }

    const clienteAEnviar = {
      ...this.cliente,
      telefono: this.obtenerTelefonoE164(),
    };

    if (this.editando && this.id) {
      this.clienteService.actualizar(this.id, clienteAEnviar).subscribe({
        next: () => this.router.navigate(['/clientes']),
        error: (err) => this.error.set(err.error?.message || 'Error al actualizar')
      });
    } else {
      this.clienteService.crear(clienteAEnviar).subscribe({
        next: () => this.router.navigate(['/clientes']),
        error: (err) => this.error.set(err.error?.message || 'Error al crear')
      });
    }
  }

  volver() {
    this.router.navigate(['/clientes']);
  }
}