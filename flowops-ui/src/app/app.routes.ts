
import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./core/layout/app-shell/app-shell')
                .then(m => m.AppShell),

        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'command-center'
            },
            {
                path: 'command-center',
                loadComponent: () =>
                    import('./features/command-center/pages/command-center-page/command-center-page')
                        .then(m => m.CommandCenterPage)
            },

            // Static routes first
            {
                path: 'incidents/board',
                loadComponent: () =>
                    import('./features/incidents/pages/incident-kanban-page/incident-kanban-page')
                        .then(m => m.IncidentKanbanPage)
            },
            {
                path: 'incidents',
                loadComponent: () =>
                    import('./features/incidents/pages/incident-list-page/incident-list-page')
                        .then(m => m.IncidentListPage)
            },

            // Dynamic route last
            {
                path: 'incidents/:id',
                loadComponent: () =>
                    import('./features/incidents/pages/incident-details-page/incident-details-page')
                        .then(m => m.IncidentDetailsPage)
            },
            {
                path: 'workflows',
                loadComponent: () =>
                    import('./features/workflows/pages/workflow-list-page/workflow-list-page')
                        .then(m => m.WorkflowListPage)
            },
            {
                path: 'workflows/new',
                loadComponent: () =>
                    import('./features/workflows/pages/workflow-builder-page/workflow-builder-page')
                        .then(m => m.WorkflowBuilderPage)
            },
            {
                path: 'workflows',
                loadComponent: () =>
                    import('./features/workflows/pages/workflow-list-page/workflow-list-page')
                        .then(m => m.WorkflowListPage)
            },
        ]
    }
];
