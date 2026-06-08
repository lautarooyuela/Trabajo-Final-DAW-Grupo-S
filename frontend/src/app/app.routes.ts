import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'clientes', loadComponent: () => import('./components/cliente-list/cliente-list.component').then(m => m.ClienteListComponent) },
      { path: 'clientes/nuevo', loadComponent: () => import('./components/cliente-form/cliente-form.component').then(m => m.ClienteFormComponent) },
      { path: 'clientes/:id/editar', loadComponent: () => import('./components/cliente-form/cliente-form.component').then(m => m.ClienteFormComponent) },
      { path: 'proyectos', loadComponent: () => import('./components/proyecto-list/proyecto-list.component').then(m => m.ProyectoListComponent) },
      { path: 'proyectos/nuevo', loadComponent: () => import('./components/proyecto-form/proyecto-form.component').then(m => m.ProyectoFormComponent) },
      { path: 'proyectos/:id', loadComponent: () => import('./components/proyecto-detail/proyecto-detail.component').then(m => m.ProyectoDetailComponent) },
      { path: 'proyectos/:id/editar', loadComponent: () => import('./components/proyecto-form/proyecto-form.component').then(m => m.ProyectoFormComponent) },
      { path: 'usuarios', loadComponent: () => import('./components/usuarios-admin/usuarios-admin.component').then(m => m.UsuariosAdminComponent), canActivate: [adminGuard] },
      { path: '', redirectTo: 'proyectos', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
