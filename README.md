# FlowOps — Enterprise Workflow & Incident Intelligence

FlowOps is a portfolio-grade operations console built around incident response, SLA visibility, and workflow automation.

## Included

- Angular 22 standalone application with lazy-loaded routes and SCSS.
- Command Center, incident explorer, incident detail view, Kanban board, workflow list, and workflow builder.
- Incident lifecycle transitions, engineer assignment, persisted comments, and activity history through the demo REST API.
- SLA calculation and workflow condition evaluation.
- JSON Server mock API for a quick local demo.
- ASP.NET Core 9 + EF Core + SQL Server API foundation with matching incident, comment, and activity endpoints.
- Docker Compose for local SQL Server.

## Requirements

- Node.js **24.15+** (recommended; Angular 22 requires a supported recent Node release).
- npm 11+
- .NET SDK 9.0 for the ASP.NET Core API.
- Docker Desktop only if you want SQL Server in a container.

## Quick start: Angular + mock API

Open two terminals.

Terminal 1:

```bash
cd flowops-ui
npm ci
npm run api
```

Terminal 2:

```bash
cd flowops-ui
npm start
```

Open http://localhost:4200. JSON Server runs at http://localhost:3000.

The Angular app intentionally defaults to JSON Server so the existing project and seeded demo data work without requiring SQL Server.

## Start the .NET + SQL Server backend

From the repository root:

```bash
docker compose up -d sqlserver
cd flowops-api
dotnet restore
dotnet run
```

Open `/swagger` at the API URL printed by `dotnet run`; `/health` is the health endpoint.

The API uses the same resource paths as the Angular services. To use it instead of JSON Server, update the base URL in:
- `flowops-ui/src/app/features/incidents/services/incident-api.ts`
- `flowops-ui/src/app/features/incidents/services/activity-api.ts`

Set both to the ASP.NET API origin (for example `http://localhost:5000`).

## Important architecture / security notes

- JSON Server and browser localStorage are demo persistence only. They are not secure multi-user storage.
- The included .NET API is a functional CRUD foundation, not a production-hardened deployment. It currently has no authentication/authorization, tenant isolation, role enforcement, rate limiting, or production secret management.
- The workflow engine evaluates triggers and conditions. It intentionally returns matched actions for inspection; it does **not** execute privileged actions from the browser. Real action execution should happen in a backend worker with authorization, idempotency, retries, and an audit trail.
- The API uses EF Core `EnsureCreated` to create a development database. Use versioned EF Core migrations for production schema evolution.
- Configure connection strings and passwords through environment variables or a secret store before deployment. The compose password is local-development-only.

## Project layout

```text
FlowOps/
├── flowops-ui/       # Angular app and JSON Server mock API
├── flowops-api/      # ASP.NET Core 9 Web API
├── docker-compose.yml
└── README.md
```

## Suggested next production milestones

1. Add ASP.NET Core Identity/JWT and role-based authorization.
2. Add EF Core migrations, DTO validation, and centralized exception handling.
3. Move workflow definitions and executions into SQL Server.
4. Implement a background worker/outbox for reliable workflow action execution.
5. Add audit retention, observability, integration tests, and CI/CD.
