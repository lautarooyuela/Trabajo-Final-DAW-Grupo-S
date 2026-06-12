import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente.service';
import { AuthService } from '../../services/auth.service';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import { COUNTRIES, Country } from '../../models/countries';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [FormsModule, MatIconModule],
  template: `
    <div class="form-container">
      <div class="card">
        <div class="form-header">
          <mat-icon class="header-icon">{{ editando ? 'edit' : 'person_add' }}</mat-icon>
          <h2>{{ editando ? 'Editar' : 'Nuevo' }} Cliente</h2>
        </div>
        
        <form (ngSubmit)="guardar()">
          <div class="field">
            <label>Nombre Completo / Empresa</label>
            <input type="text" [(ngModel)]="cliente.nombre" name="nombre" placeholder="Ej: Juan Pérez o Tech Solutions" required />
          </div>

          <div class="field">
            <label>Correo Electrónico</label>
            <input type="email" [(ngModel)]="cliente.email" (blur)="validarEmail()" name="email" placeholder="cliente@ejemplo.com" required />
            @if (emailError()) {
              <p class="error-msg">{{ emailError() }}</p>
            }
          </div>

          <div class="field">
            <label>Teléfono de Contacto</label>
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
          </div>
          
          <div class="actions">
            <button type="submit" class="btn-guardar">
              <mat-icon>save</mat-icon> Guardar Cliente
            </button>
            <button type="button" class="btn-cancelar" (click)="volver()">
              Cancelar
            </button>
          </div>
        </form>
        @if (error()) {
          <div class="alert error-alert">
            <mat-icon>error</mat-icon> {{ error() }}
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .form-container { 
      display: flex; 
      justify-content: center; 
      padding: 60px 24px; 
      background-color: var(--bg-main); 
      min-height: 100vh; 
    }

    .card { 
      background: var(--bg-card); 
      padding: 48px; 
      border-radius: 24px; 
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); 
      width: 100%; 
      max-width: 540px; 
      height: fit-content;
      border: 1px solid var(--border-color);
    }

    .form-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 32px;
    }

    .header-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: var(--primary-color);
    }

    h2 { margin: 0; color: var(--text-primary); font-weight: 800; font-size: 1.8em; }

    .field { margin-bottom: 24px; }

    label { 
      display: block; 
      margin-bottom: 10px; 
      font-weight: 600; 
      color: var(--text-secondary); 
      font-size: 0.85em;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    input, select { 
      width: 100%; 
      padding: 14px 18px; 
      background-color: #0f172a !important;
      border: 1px solid var(--border-color) !important; 
      border-radius: 12px !important; 
      box-sizing: border-box; 
      font-family: inherit;
      color: var(--text-primary) !important;
      font-size: 1em;
      transition: all 0.2s;
    }

    input:focus, select:focus {
      outline: none;
      border-color: var(--primary-color) !important;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15) !important;
    }

    .telefono-container { display: flex; gap: 12px; }
    .telefono-container select { flex: 0 0 40%; }
    .telefono-container input { flex: 1; }

    .error-msg { color: var(--danger-color); font-size: 0.85em; margin-top: 8px; font-weight: 600; }

    .actions { display: flex; gap: 16px; margin-top: 40px; }

    button { 
      padding: 14px 28px; 
      border-radius: 12px; 
      border: none; 
      cursor: pointer; 
      font-weight: 700; 
      transition: all 0.2s;
      font-size: 1em;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .btn-guardar { 
      background-color: var(--primary-color) !important; 
      color: white !important; 
      flex: 2; 
    }
    .btn-guardar:hover { filter: brightness(1.1); transform: translateY(-1px); }

    .btn-cancelar { 
      background-color: transparent !important; 
      color: var(--text-secondary) !important; 
      border: 1px solid var(--border-color) !important; 
      flex: 1; 
    }
    .btn-cancelar:hover { background-color: rgba(255, 255, 255, 0.05) !important; color: var(--text-primary) !important; }

    .alert {
      margin-top: 32px;
      padding: 16px;
      border-radius: 12px;
      font-size: 0.95em;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .error-alert { background-color: rgba(239, 68, 68, 0.1); color: var(--danger-color); border: 1px solid rgba(239, 68, 68, 0.2); }
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
