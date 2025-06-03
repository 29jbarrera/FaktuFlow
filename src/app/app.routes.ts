import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { NavComponent } from './components/nav/nav.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { FacturasComponent } from './pages/facturas/facturas.component';
import { GastosComponent } from './pages/gastos/gastos.component';
import { IngresosComponent } from './pages/ingresos/ingresos.component';
import { authGuard } from './guards/auth.guard';
import { InfoComponent } from './components/info/info.component';
import { AvisoLegalComponent } from './pages/aviso-legal/aviso-legal.component';
import { PoliticaCookiesComponent } from './pages/politica-cookies/politica-cookies.component';
import { PoliticaPrivacidadComponent } from './pages/politica-privacidad/politica-privacidad.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { TerminosDeUsoComponent } from './pages/terminos-de-uso/terminos-de-uso.component';
import { FacturaDigitalComponent } from './blogs/factura-digital/factura-digital.component';
import { ConsejosFinancierosComponent } from './blogs/consejos-financieros/consejos-financieros.component';
import { ImpuestosComponent } from './blogs/impuestos/impuestos.component';
import { ProductividadComponent } from './blogs/productividad/productividad.component';
import { AboutUsComponent } from './blogs/about-us/about-us.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'login',
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
    path: 'aviso-legal',
    component: AvisoLegalComponent,
  },
  {
    path: 'politica-privacidad',
    component: PoliticaPrivacidadComponent,
  },
  {
    path: 'politica-cookies',
    component: PoliticaCookiesComponent,
  },
  {
    path: 'terminos-de-uso',
    component: TerminosDeUsoComponent,
  },
  {
    path: 'sobre-nosotros',
    component: AboutUsComponent,
  },
  {
    path: 'blog/factura-digital',
    component: FacturaDigitalComponent,
  },
  {
    path: 'blog/consejos-financieros',
    component: ConsejosFinancierosComponent,
  },
  {
    path: 'blog/impuestos',
    component: ImpuestosComponent,
  },
  {
    path: 'blog/mejora-la-productividad-de-tu-negocio',
    component: ProductividadComponent,
  },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: '**',
    redirectTo: '',
  },
];
