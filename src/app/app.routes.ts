import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./shared/components/layout/layout.component'),
        children: [
            {
                path: 'home',
                loadComponent: () => import('./business/home/home.component')
            },
            {
                path: 'adopt',
                loadComponent: () => import('./business/adopt/adopt.component')
            },
            {
                path: 'sponsor',
                loadComponent: () => import('./business/sponsor/sponsor.component')
            },
            {
                path: 'blog',
                loadComponent: () => import('./business/blog/blog.component')
            },
            {
                path: 'contact',
                loadComponent: () => import('./business/contact/contact.component')
            },
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'auth',
        loadComponent: () => import('./auth/auth/auth.component')
    },
    {
        path: '**',
        redirectTo: 'home',
        pathMatch: 'full'
    }
];
