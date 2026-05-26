import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Documentation } from './app/pages/documentation/documentation';
import { Notfound } from './app/pages/notfound/notfound';
import { BuquedaAlquiler } from './app/pages/pagina/buqueda-alquiler/buqueda-alquiler';
import { BuquedaVenta } from './app/pages/pagina/buqueda-venta/buqueda-venta';
import { DetalleInmueble } from './app/pages/pagina/detalle-inmueble/detalle-inmueble';
import { LogIn } from './app/pages/pagina/log-in/log-in';
import { Perfil } from './app/pages/pagina/perfil/perfil';
import { Publicaciones } from './app/pages/pagina/publicaciones/publicaciones';
import { PublicarAnuncio } from './app/pages/pagina/publicar-anuncio/publicar-anuncio';
import { Register } from './app/pages/pagina/register/register';
import { Landing } from './app/pages/landing/landing';
import { Nosotros } from './app/pages/pagina/nosotros/nosotros';
import { Servicios } from './app/pages/pagina/servicios/servicios';
import { Contacto } from './app/pages/pagina/contacto/contacto';
import { Mensajes } from './app/pages/pagina/mensajes/mensajes';
import { MapaBusqueda } from './app/pages/pagina/mapa-busqueda/mapa-busqueda';
import { ResultadosMapa } from './app/pages/pagina/resultados-mapa/resultados-mapa';

export const appRoutes: Routes = [
    // ── Rutas independientes (sin AppLayout, con su propio topbar) ────
    { path: 'mapa-busqueda', component: MapaBusqueda },
    { path: 'resultados-mapa', component: ResultadosMapa },
    { path: 'detalle-venta/:id', component: DetalleInmueble },
    { path: 'detalle-alquiler/:id', component: DetalleInmueble },
    { path: 'perfil', component: Perfil },
    { path: 'publicaciones', component: Publicaciones },
    { path: 'publicar-anuncio', component: PublicarAnuncio },
    { path: 'landing', component: Landing },
    { path: 'nosotros', component: Nosotros },
    { path: 'servicios', component: Servicios },
    { path: 'contacto', component: Contacto },
    { path: 'notfound', component: Notfound },
    { path: 'register', component: Register },
    { path: 'login', component: LogIn },
    { path: 'mensajes', component: Mensajes },
    { path: 'busqueda-venta', component: BuquedaVenta },
    { path: 'busqueda-alquiler', component: BuquedaAlquiler },
    { path: 'documentation', component: Documentation },
    { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
    { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },

    // ── AppLayout (solo para la raíz vacía) ───────────────────────────
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', redirectTo: '/landing', pathMatch: 'full' }
        ]
    },

    // ── Catch-all ─────────────────────────────────────────────────────
    { path: '**', redirectTo: '/notfound' }
];
