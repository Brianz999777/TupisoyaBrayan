import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-footer-widget',
    standalone: true,
    imports: [RouterModule],
    template: `
        <footer class="bg-gray-900 dark:bg-gray-950 text-gray-300">
            <div class="max-w-[90rem] mx-auto px-8 lg:px-24 py-16">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    <!-- Brand -->
                    <div class="lg:col-span-1">
                        <a class="flex items-center gap-3 cursor-pointer mb-4" (click)="router.navigate(['/landing'])">
                            <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                                <i class="pi pi-home text-white text-sm"></i>
                            </div>
                            <span class="text-lg font-bold text-white">TuPisoYa</span>
                        </a>
                        <p class="text-sm text-gray-400 leading-relaxed mb-6">
                            La plataforma inteligente que transforma la forma de encontrar tu hogar ideal en Zaragoza.
                        </p>
                        <div class="flex gap-3">
                            <div class="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-emerald-500/20 transition-colors cursor-pointer">
                                <i class="pi pi-facebook text-sm text-gray-400"></i>
                            </div>
                            <div class="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-emerald-500/20 transition-colors cursor-pointer">
                                <i class="pi pi-twitter text-sm text-gray-400"></i>
                            </div>
                            <div class="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-emerald-500/20 transition-colors cursor-pointer">
                                <i class="pi pi-instagram text-sm text-gray-400"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Links -->
                    <div>
                        <h4 class="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Navegación</h4>
                        <ul class="space-y-3">
                            <li><a (click)="router.navigate(['/comprar'])" class="text-sm text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer">Comprar</a></li>
                            <li><a (click)="router.navigate(['/alquilar'])" class="text-sm text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer">Alquilar</a></li>
                            <li><a (click)="router.navigate(['/servicios'])" class="text-sm text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer">Servicios</a></li>
                            <li><a (click)="router.navigate(['/nosotros'])" class="text-sm text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer">Nosotros</a></li>
                            <li><a (click)="router.navigate(['/contacto'])" class="text-sm text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer">Contacto</a></li>
                        </ul>
                    </div>

                    <!-- Services -->
                    <div>
                        <h4 class="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Servicios</h4>
                        <ul class="space-y-3">
                            <li><span class="text-sm text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer">Tasación Gratuita</span></li>
                            <li><span class="text-sm text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer">Asesoría Legal</span></li>
                            <li><span class="text-sm text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer">Gestión de Alquiler</span></li>
                            <li><span class="text-sm text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer">Oportunidades Inversión</span></li>
                        </ul>
                    </div>

                    <!-- Contact -->
                    <div>
                        <h4 class="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Contacto</h4>
                        <ul class="space-y-3">
                            <li class="flex items-center gap-3 text-sm text-gray-400">
                                <i class="pi pi-phone text-emerald-400"></i>
                                +34 900 123 456
                            </li>
                            <li class="flex items-center gap-3 text-sm text-gray-400">
                                <i class="pi pi-envelope text-emerald-400"></i>
                                info@tupisoya.com
                            </li>
                            <li class="flex items-center gap-3 text-sm text-gray-400">
                                <i class="pi pi-map-marker text-emerald-400"></i>
                                Zaragoza, España
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p class="text-sm text-gray-500">&copy; 2026 TuPisoYa. Todos los derechos reservados.</p>
                    <div class="flex gap-6">
                        <span class="text-sm text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">Privacidad</span>
                        <span class="text-sm text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">Términos</span>
                        <span class="text-sm text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">Cookies</span>
                    </div>
                </div>
            </div>
        </footer>
    `
})
export class FooterWidget {
    constructor(public router: Router) {}
}
