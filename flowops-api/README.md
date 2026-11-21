# FlowOps API

ASP.NET Core 9 Web API + Entity Framework Core + SQL Server.

## Run locally

1. Start SQL Server (the repository-level `docker-compose.yml` provides a local SQL Server container).
2. From this directory:

   ```bash
   dotnet restore
   dotnet run
   ```

3. Open Swagger at the URL printed by `dotnet run` plus `/swagger`; health check is `/health`.

The API uses `EnsureCreated` for a zero-friction development database. For production, replace this with EF Core migrations, secrets management, authentication/authorization, request validation, structured logging, rate limiting, and audited domain services before exposing it publicly.

Endpoints: `GET/POST /incidents`, `GET/PATCH/DELETE /incidents/{id}`, `GET/POST /comments`, `GET/POST /activities`.

The Angular starter currently points at JSON Server (`http://localhost:3000`) so the existing demo remains runnable without the .NET API. To switch the UI to this API, change the base URL in `flowops-ui/src/app/features/incidents/services/incident-api.ts` and `activity-api.ts` to the API origin. Routes intentionally match the current client service paths.
