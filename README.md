# FlowOps — Enterprise Workflow & Incident Intelligence Platform

**FlowOps** is an enterprise-oriented workflow and incident management platform designed to centralize operational visibility, streamline incident handling, and improve workflow coordination.

The platform provides a unified workspace for monitoring incidents, managing workflows, tracking operational activities, and organizing work through a structured interface.

The project is being developed with a modern full-stack architecture using **Angular, ASP.NET Core, and Microsoft SQL Server**, with an emphasis on maintainability, scalability, modular development, and a clean user experience.

---

## Table of Contents

1. [Project Overview](#-project-overview)
2. [Key Objectives](#-key-objectives)
3. [Features and Modules](#-features-and-modules)
4. [Technology Stack](#-technology-stack)
5. [Application Architecture](#-application-architecture)
6. [Project Structure](#-project-structure)
7. [Prerequisites](#-prerequisites)
8. [Getting Started](#-getting-started)
9. [Running the Application](#-running-the-application)
10. [Backend Configuration](#-backend-configuration)
11. [Database Configuration](#-database-configuration)
12. [Development Workflow](#-development-workflow)
13. [Testing](#-testing)
14. [Docker Support](#-docker-support)
15. [Security Considerations](#-security-considerations)
16. [Roadmap](#-roadmap)
17. [Contributing](#-contributing)
18. [Author](#-author)

---

## 🚀 Project Overview

In enterprise environments, operational teams often deal with incidents, service requests, workflows, and multiple activities across different systems.

FlowOps aims to bring these operational processes together in one centralized application.

It provides a structured workspace where users can:

- Monitor operational activities.
- Explore and manage incidents.
- Visualize incident statuses using a Kanban board.
- Organize workflows.
- Build and manage workflow definitions.
- Access operational information through a centralized interface.

The application follows a modular architecture, allowing new capabilities to be introduced without tightly coupling individual modules.

### Project Vision

Build an extensible enterprise platform that combines incident intelligence, workflow management, and operational visibility into a single application.

---

## 🎯 Key Objectives

- Centralize incident and workflow management.
- Improve visibility into operational activities.
- Provide an intuitive interface for enterprise users.
- Build reusable and maintainable application components.
- Establish a scalable backend architecture.
- Support integration with relational databases.
- Enable future cloud deployment and automation.
- Create a foundation for advanced operational analytics.

---

## ✨ Features and Modules

### 1. Command Center

The Command Center serves as the central landing page for the application.

Its purpose is to provide a consolidated operational overview.

Planned capabilities include:

- Operational summary.
- Incident visibility.
- Activity overview.
- Status-based indicators.
- Quick navigation to application modules.

### 2. Incident Explorer

The Incident Explorer provides a centralized interface for exploring incident records.

Core capabilities include:

- Incident listing.
- Incident identification and tracking.
- Incident status visibility.
- Access to individual incident details.
- Structured incident information.

### 3. Incident Details

The Incident Details module provides a focused view of an individual incident.

It is intended to support:

- Incident information.
- Status and priority visibility.
- Associated operational information.
- Activity and comment history.
- Incident investigation and tracking.

### 4. Incident Kanban Board

The Kanban module provides a visual representation of incident progress.

It organizes incidents into status-based columns to make operational work easier to understand.

Potential capabilities include:

- Status-based incident grouping.
- Visual incident tracking.
- Drag-and-drop interactions.
- Easier identification of pending work.
- Improved workflow visibility.

### 5. Workflow Management

The Workflow Management module provides a centralized place to organize workflow definitions.

Its purpose is to make operational processes easier to manage and extend.

### 6. Workflow Builder

The Workflow Builder provides the foundation for creating and managing workflow definitions.

The intended direction includes:

- Workflow creation.
- Structured workflow configuration.
- Workflow steps and definitions.
- Extensible workflow design.
- Future integration with execution and automation services.

### 7. SLA Management

The SLA module is part of the planned operational management experience.

Its intended capabilities include:

- SLA tracking.
- Response and resolution monitoring.
- SLA compliance visibility.
- Identification of overdue activities.

### 8. Audit Explorer

The Audit Explorer is intended to provide visibility into important application activities and operational changes.

Potential capabilities include:

- Activity history.
- Change tracking.
- Audit records.
- Operational traceability.

### 9. Teams

The Teams module is intended to provide a foundation for organizing users and operational responsibilities.

---

## 🛠 Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 22 |
| Programming Language | TypeScript |
| UI Styling | SCSS |
| Frontend Architecture | Angular Standalone Components |
| State Management | Angular Signals |
| Reactive Programming | RxJS |
| Backend | ASP.NET Core Web API |
| Backend Language | C# |
| ORM | Entity Framework Core |
| Database | Microsoft SQL Server |
| Mock API | JSON Server |
| API Communication | HTTP / REST |
| Containerization | Docker |
| Version Control | Git |
| Source Hosting | GitHub |

### Frontend Technologies

**Angular**

Used to develop the modular frontend application with standalone components, routing, and reusable UI elements.

**TypeScript**

Provides type safety, maintainability, and structured application development.

**SCSS**

Used for modular styling, reusable design patterns, and responsive layouts.

**Angular Signals and RxJS**

Used to support reactive application behavior and data flow.

### Backend Technologies

**ASP.NET Core Web API**

Provides the foundation for backend services and RESTful API development.

**C#**

Used to implement backend business logic and application services.

**Entity Framework Core**

Provides object-relational mapping and database interaction capabilities.

**Microsoft SQL Server**

Acts as the relational database platform for persistent application data.

### Development and Infrastructure

- Git and GitHub for version control.
- JSON Server for mock API development.
- Docker and Docker Compose for containerization support.

---

## 🏗 Application Architecture

FlowOps follows a layered full-stack architecture.

```text
                   FLOWOPS PLATFORM
                          |
             +------------+------------+
             |                         |
       Angular Frontend          Backend API
             |                         |
       Angular Router            ASP.NET Core
             |                         |
       Feature Modules           Controllers
             |                         |
       Components                Business Logic
             |                         |
       Angular Services          Data Access Layer
             |                         |
       HTTP Client                Entity Framework Core
             |                         |
             +------------+------------+
                          |
                   SQL Server Database
```

### Frontend Architecture

The frontend is organized into feature-oriented modules.

Main responsibilities include:

- Rendering application pages.
- Handling navigation.
- Managing reusable components.
- Communicating with backend services.
- Managing client-side state.
- Providing responsive user interfaces.

### Backend Architecture

The backend is structured around API endpoints, business logic, and data access.

Main responsibilities include:

- Exposing RESTful endpoints.
- Processing application requests.
- Implementing business rules.
- Validating incoming data.
- Managing database operations.
- Returning structured API responses.

### Data Layer

Microsoft SQL Server is the intended persistent data store, with Entity Framework Core providing the ORM layer.

JSON Server is also available for frontend development using mock data.

---

## 📁 Project Structure

The repository is organized into frontend and backend applications.

```text
FlowOps/
│
├── flowops-ui/
│   │
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── services/
│   │   │   │   └── models/
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── app-shell/
│   │   │   │   ├── sidebar/
│   │   │   │   └── topbar/
│   │   │   │
│   │   │   ├── features/
│   │   │   │   ├── command-center/
│   │   │   │   ├── incidents/
│   │   │   │   └── workflows/
│   │   │   │
│   │   │   ├── app.config.ts
│   │   │   ├── app.routes.ts
│   │   │   ├── app.ts
│   │   │   └── app.html
│   │   │
│   │   ├── styles.scss
│   │   └── index.html
│   │
│   ├── db.json
│   ├── angular.json
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
│
├── flowops-api/
│   │
│   ├── Controllers/
│   ├── Models/
│   ├── Data/
│   ├── Services/
│   ├── appsettings.json
│   └── Program.cs
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

*Note: This is a logical overview of the project structure. Individual folders and files may vary as development progresses.*

---

## ⚙️ Prerequisites

Install the following tools before running the application.

| Tool | Purpose |
|---|---|
| Node.js | Frontend runtime |
| npm | Package management |
| Angular CLI | Angular development |
| .NET SDK | Backend development |
| SQL Server | Relational database |
| Git | Version control |
| Visual Studio Code | Development environment |
| Docker Desktop | Optional container support |

Verify your installations:

```bash
node --version
npm --version
ng version
dotnet --version
git --version
docker --version
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/tapan0810/FlowOps.git
```

Navigate to the project directory:

```bash
cd FlowOps
```

### 2. Set Up the Angular Frontend

Navigate to the frontend directory:

```bash
cd flowops-ui
```

Install dependencies:

```bash
npm ci
```

If you do not have a lockfile, use:

```bash
npm install
```

### 3. Start the Mock API

FlowOps includes JSON Server for mock API development.

Run:

```bash
npm run api
```

The mock API will be available at:

```text
http://localhost:3000
```

Keep this terminal running.

### 4. Start the Angular Application

Open another terminal:

```bash
cd FlowOps/flowops-ui
```

Run:

```bash
npm start
```

The frontend will be available at:

```text
http://localhost:4200
```

### 5. Build the Frontend

To generate a production build:

```bash
npm run build
```

The generated output will be available inside:

```text
flowops-ui/dist/
```

---

## ▶️ Running the Application

For local frontend development, use two separate terminals.

**Terminal 1 — Mock API**

```bash
cd FlowOps/flowops-ui
npm run api
```

**Terminal 2 — Angular Frontend**

```bash
cd FlowOps/flowops-ui
npm start
```

Open your browser:

```text
http://localhost:4200
```

### Application Routes

The frontend currently defines the following main navigation routes:

| Route | Module |
|---|---|
| `/command-center` | Command Center |
| `/incidents` | Incident Explorer |
| `/incidents/board` | Incident Kanban |
| `/incidents/:id` | Incident Details |
| `/workflows` | Workflow Management |
| `/workflows/new` | Workflow Builder |

---

## 🔧 Backend Configuration

Navigate to the backend project:

```bash
cd flowops-api
```

Restore dependencies:

```bash
dotnet restore
```

Build the backend:

```bash
dotnet build
```

Run the API:

```bash
dotnet run
```

The actual API URL and port are determined by the backend launch configuration and application settings.

Check the terminal output to identify the address on which the API is listening.

### API Integration

The Angular application communicates with backend services through HTTP requests.

A typical frontend-to-backend communication flow is:

```text
Angular Component
       |
       v
Angular Service
       |
       v
HttpClient
       |
       v
ASP.NET Core Web API
       |
       v
Business Logic
       |
       v
Entity Framework Core
       |
       v
SQL Server
```

JSON Server can be used during frontend development when the corresponding backend endpoints are not yet integrated.

---

## 🗄 Database Configuration

FlowOps uses Microsoft SQL Server as its intended relational database platform.

Configure the database connection through application configuration or environment variables.

Example connection string format:

```json
{
  "ConnectionStrings": {
    "FlowOps": "Server=YOUR_SERVER;Database=FlowOpsDb;User Id=YOUR_USER;Password=YOUR_PASSWORD;TrustServerCertificate=True;"
  }
}
```

**Important:** Do not commit real database credentials or production secrets to GitHub.

### Entity Framework Core Migrations

If the backend uses the EF Core Code First approach, migrations can be managed using:

```bash
dotnet ef migrations add InitialCreate
```

Apply migrations:

```bash
dotnet ef database update
```

If the EF Core CLI is not installed:

```bash
dotnet tool install --global dotnet-ef
```

These commands assume that the backend has an appropriately configured `DbContext` and migration project.

---

## 🔄 Development Workflow

The recommended development workflow is:

1. Identify the feature or issue.
2. Create or update the relevant frontend or backend module.
3. Implement the required business logic.
4. Integrate the API.
5. Validate the UI and application behavior.
6. Run the build and relevant tests.
7. Commit the changes.
8. Push the changes to GitHub.

### Git Commands

Check the current state:

```bash
git status
```

Stage changes:

```bash
git add .
```

Commit changes:

```bash
git commit -m "Describe your changes"
```

Push to the main branch:

```bash
git push origin main
```

For feature development, use a separate branch:

```bash
git checkout -b feature/incident-management
```

---

## 🧪 Testing

Frontend tests can be executed using:

```bash
cd flowops-ui
npm test
```

Frontend production build validation:

```bash
npm run build
```

Backend build validation:

```bash
cd flowops-api
dotnet build
```

Testing should cover:

- Component rendering.
- Application routing.
- Form validation.
- Service behavior.
- API integration.
- Backend business logic.
- Database operations.
- Error handling.

For API-dependent frontend tests, use mocked HTTP responses or Angular HTTP testing utilities rather than requiring a live JSON Server instance.

---

## 🐳 Docker Support

The repository includes a `docker-compose.yml` file as a foundation for containerized development.

Docker can be used to simplify local infrastructure and support consistent development environments.

Check Docker availability:

```bash
docker --version
docker compose version
```

If the Compose configuration is fully configured, start the defined services with:

```bash
docker compose up --build
```

Stop the services:

```bash
docker compose down
```

Container configuration, service names, ports, and environment variables should be checked against the current Compose file before running these commands.

---

## 🔐 Security Considerations

Security is an important consideration for an enterprise application.

Recommended practices:

- Store credentials outside source control.
- Use environment variables or a secret-management service.
- Validate incoming API requests.
- Implement proper exception handling.
- Configure authentication and authorization before production deployment.
- Apply role-based access control where required.
- Use HTTPS for application communication.
- Avoid exposing sensitive information in application logs.
- Validate and sanitize user input.
- Apply database access restrictions.

Never store real passwords, connection strings, API keys, or access tokens in committed configuration files.

---

## 🗺 Roadmap

FlowOps is designed to evolve into a more comprehensive enterprise platform.

Potential development milestones include:

- [ ] Complete the Command Center with operational metrics.
- [ ] Expand Incident Explorer functionality.
- [ ] Complete incident lifecycle management.
- [ ] Implement incident comments and activity tracking.
- [ ] Enhance the Kanban board with drag-and-drop operations.
- [ ] Complete workflow creation and configuration.
- [ ] Implement workflow execution capabilities.
- [ ] Integrate SLA tracking and monitoring.
- [ ] Develop Audit Explorer functionality.
- [ ] Implement team and user management.
- [ ] Integrate persistent SQL Server storage.
- [ ] Complete frontend-to-backend API integration.
- [ ] Implement authentication and role-based authorization.
- [ ] Add comprehensive unit and integration tests.
- [ ] Improve Docker-based deployment.
- [ ] Explore operational analytics and AI-assisted incident intelligence.

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Implement your changes.
4. Test the implementation.
5. Commit your changes with a meaningful message.
6. Submit a pull request.

Please keep changes modular and follow the existing application architecture.

---

## 👨‍💻 Author

**Tapan Ray**

Software Engineer | Full-Stack Development | .NET | Angular | Microsoft Azure

GitHub: [@tapan0810](https://github.com/tapan0810)

Project Repository: [FlowOps](https://github.com/tapan0810/FlowOps)

---

## 📄 License

This project is currently maintained as a personal software engineering project.

A formal open-source license can be added to the repository when the licensing terms are finalized.

---

<p align="center">
  <strong>FlowOps — Bringing Incidents, Workflows, and Operations Together.</strong>
</p>
