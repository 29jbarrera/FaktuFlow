import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { NavComponent } from './components/nav/nav.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { FacturasComponent } from './pages/facturas/facturas.component';
import { GastosComponent } from './pages/gastos/gastos.component';
import { IngresosComponent } from './pages/ingresos/ingresos.component';
import { authGuard } from './guards/auth.guard';
import { InfoComponent } from './components/info/info.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
  },
  {
    path: 'dashboard',
    component: NavComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'resumen',
        pathMatch: 'full',
      },
      {
        path: 'resumen',
        component: DashboardComponent,
      },
      {
        path: 'admin',
        component: AdminComponent,
      },
      {
        path: 'clientes',
        component: ClientesComponent,
      },
      {
        path: 'facturas',
        component: FacturasComponent,
      },
      {
        path: 'gastos',
        component: GastosComponent,
      },
      {
        path: 'ingresos',
        component: IngresosComponent,
      },
      {
        path: 'info',
        component: InfoComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '', // Redirecciona rutas no encontradas a auth
  },
];
