import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'footer-widget',
    imports: [RouterModule],
    template: `
        <div class="py-12 px-12 mx-0 mt-20 lg:mx-20">
            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-12 md:col-span-2">
                    <a (click)="router.navigate(['/landing'])" class="flex flex-wrap items-center justify-center md:justify-start md:mb-0 mb-6 cursor-pointer">
                        <img src="/demo/images/galleria/logo.png" alt="TuPisoYa Logo" class="h-20">
                    </a>
                </div>

                <div class="col-span-12 md:col-span-10">
                    <div class="grid grid-cols-12 gap-8 text-center md:text-left">
                        <div class="col-span-12 md:col-span-3">
                            <h4 class="font-medium text-2xl leading-normal mb-6 text-surface-900 dark:text-surface-0">Empresa</h4>
                            <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100 hover:text-primary-500 transition-colors">Sobre Nosotros</a>
                            <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100 hover:text-primary-500 transition-colors">Noticias</a>
                            <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100 hover:text-primary-500 transition-colors">Inversores</a>
                            <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100 hover:text-primary-500 transition-colors">Empleo</a>
                            <a class="leading-normal text-xl block cursor-pointer text-surface-700 dark:text-surface-100 hover:text-primary-500 transition-colors">Kit de Prensa</a>
                        </div>

                        <div class="col-span-12 md:col-span-3">
                            <h4 class="font-medium text-2xl leading-normal mb-6 text-surface-900 dark:text-surface-0">Recursos</h4>
                            <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100 hover:text-primary-500 transition-colors">Empezar</a>
                            <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100 hover:text-primary-500 transition-colors">Aprender</a>
                            <a class="leading-normal text-xl block cursor-pointer text-surface-700 dark:text-surface-100 hover:text-primary-500 transition-colors">Casos de Estudio</a>
                        </div>

                        <div class="col-span-12 md:col-span-3">
                            <h4 class="font-medium text-2xl leading-normal mb-6 text-surface-900 dark:text-surface-0">Comunidad</h4>
                            <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100 hover:text-primary-500 transition-colors">Discord</a>
                            <a class="leading-normal text-xl flex items-center justify-center md:justify-start cursor-pointer mb-2 text-surface-700 dark:text-surface-100 hover:text-primary-500 transition-colors">Eventos<img src="https://primefaces.org/cdn/templates/sakai/landing/new-badge.svg" alt="badge" class="ml-2" /></a>
                            <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100 hover:text-primary-500 transition-colors">Preguntas Frecuentes</a>
                            <a class="leading-normal text-xl block cursor-pointer text-surface-700 dark:text-surface-100 hover:text-primary-500 transition-colors">Blog</a>
                        </div>

                        <div class="col-span-12 md:col-span-3">
                            <h4 class="font-medium text-2xl leading-normal mb-6 text-surface-900 dark:text-surface-0">Legal</h4>
                            <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100 hover:text-primary-500 transition-colors">Política de Marca</a>
                            <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100 hover:text-primary-500 transition-colors">Política de Privacidad</a>
                            <a class="leading-normal text-xl block cursor-pointer text-surface-700 dark:text-surface-100 hover:text-primary-500 transition-colors">Términos de Servicio</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class FooterWidget {
    constructor(public router: Router) {}
}
