import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',
        loadComponent:()=>
            import('./core/layout/app-shell/app-shell')
            .then(m =>m.AppShell),

        children:[
            {
                path:'',
                pathMatch:'full',
                redirectTo:'command-center'
            },
            {
                path:'command-center',
                loadComponent:()=>
                    import('./features/command-center/pages/command-center-page/command-center-page')
                    .then(m =>m.CommandCenterPage)
            }
        ]
    }
];
