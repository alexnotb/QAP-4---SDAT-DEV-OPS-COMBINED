# Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  Postman  │  Web Browser  │  Mobile App  │  Other HTTP Clients  │
└─────────────┬───────────────────────────────────────────────────┘
              │
              │ HTTP/JSON
              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API LAYER (Port 3000)                       │
├─────────────────────────────────────────────────────────────────┤
│                        Express.js Server                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Routes (REST API)                      │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │  /api/members         │  /api/tournaments                 │  │
│  │  - POST /             │  - POST /                         │  │
│  │  - GET /              │  - GET /                          │  │
│  │  - GET /:id           │  - GET /:id                       │  │
│  │  - PUT /:id           │  - PUT /:id                       │  │
│  │  - DELETE /:id        │  - DELETE /:id                    │  │
│  │  - GET /search/*      │  - POST /:tid/members/:mid        │  │
│  │                       │  - GET /:id/members               │  │
│  │                       │  - GET /search/*                  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Sequelize ORM                           │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │  Member Model    │  Tournament Model  │  TournamentMember │  │
│  │  - Validation    │  - Validation      │  - Junction Table │  │
│  │  - Associations  │  - Associations    │  - Timestamps     │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────┬───────────────────────────────────────────────────┘
              │
              │ SQL Queries
              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   DATABASE LAYER (Port 5432)                     │
├─────────────────────────────────────────────────────────────────┤
│                     PostgreSQL 15 Database                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                        Tables                             │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │  members              tournaments        tournament_members│ │
│  │  ├── id (PK)          ├── id (PK)        ├── id (PK)      │  │
│  │  ├── name             ├── startDate      ├── memberId (FK)│  │
│  │  ├── address          ├── endDate        ├── tournamentId │  │
│  │  ├── email            ├── location       │    (FK)        │  │
│  │  ├── phone            ├── entryFee       ├── createdAt    │  │
│  │  ├── membership...    ├── cashPrize      └── updatedAt    │  │
│  │  ├── createdAt        ├── createdAt                       │  │
│  │  └── updatedAt        └── updatedAt                       │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘


                    DEPLOYMENT OPTIONS

┌──────────────────────────┐     ┌──────────────────────────┐
│   LOCAL DEVELOPMENT      │     │   PRODUCTION (AWS)       │
├──────────────────────────┤     ├──────────────────────────┤
│  Docker Compose          │     │  EC2 Instance            │
│  ┌────────────────────┐  │     │  ┌────────────────────┐  │
│  │  API Container     │  │     │  │  Node.js App       │  │
│  │  (Node.js)         │  │     │  │  (Port 3000)       │  │
│  └────────────────────┘  │     │  └────────────────────┘  │
│           │              │     │           │              │
│           ▼              │     │           ▼              │
│  ┌────────────────────┐  │     │  ┌────────────────────┐  │
│  │  DB Container      │  │     │  │  AWS RDS           │  │
│  │  (PostgreSQL)      │  │     │  │  (PostgreSQL)      │  │
│  └────────────────────┘  │     │  └────────────────────┘  │
│                          │     │                          │
│  Volume: postgres_data   │     │  Multi-AZ, Automated     │
│  Network: bridge         │     │  Backups, Encrypted      │
└──────────────────────────┘     └──────────────────────────┘


                    DATA FLOW EXAMPLE

1. CREATE MEMBER
   Client → POST /api/members → Express Route → Sequelize Model
   → INSERT INTO members → PostgreSQL → Return Member Object

2. ADD MEMBER TO TOURNAMENT
   Client → POST /api/tournaments/1/members/5 → Express Route
   → Sequelize Association → INSERT INTO tournament_members
   → PostgreSQL → Return Updated Tournament

3. SEARCH TOURNAMENTS BY LOCATION
   Client → GET /api/tournaments/search/location/augusta
   → Express Route → Sequelize Query (WHERE location ILIKE '%augusta%')
   → PostgreSQL → Return Matching Tournaments with Members


                    DOCKER ARCHITECTURE

┌─────────────────────────────────────────────────────────────────┐
│                      Docker Host                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │               Docker Network: Bridge                      │  │
│  │                                                           │  │
│  │  ┌─────────────────────┐    ┌─────────────────────────┐  │  │
│  │  │   golf_club_api     │    │   golf_club_db          │  │  │
│  │  ├─────────────────────┤    ├─────────────────────────┤  │  │
│  │  │ Image: node:18-alpine│   │ Image: postgres:15-alpine│ │  │
│  │  │ Port: 3000→3000     │    │ Port: 5432→5432         │  │  │
│  │  │ Env: DB_HOST=postgres│   │ Env: POSTGRES_DB=...    │  │  │
│  │  │ Depends: postgres   │    │ Volume: postgres_data   │  │  │
│  │  │ Health: HTTP check  │    │ Health: pg_isready      │  │  │
│  │  └─────────────────────┘    └─────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Docker Volume: postgres_data                 │  │
│  │  (Persistent storage for PostgreSQL database)             │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘


                 CI/CD PIPELINE (GitHub Actions)

┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Push to   │      │   GitHub     │      │   Docker    │
│   master    │ ───> │   Actions    │ ───> │    Hub      │
└─────────────┘      └──────────────┘      └─────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │ 1. Checkout  │
                     │ 2. Build     │
                     │ 3. Test      │
                     │ 4. Push      │
                     └──────────────┘


              RELATIONSHIP DIAGRAM (Many-to-Many)

         Members                    Tournaments
    ┌─────────────┐            ┌─────────────┐
    │ id          │            │ id          │
    │ name        │            │ startDate   │
    │ email       │            │ location    │
    │ phone       │            │ entryFee    │
    │ ...         │            │ ...         │
    └──────┬──────┘            └──────┬──────┘
           │                          │
           │    ┌──────────────┐      │
           └───>│ Tournament   │<─────┘
                │   Members    │
                ├──────────────┤
                │ memberId     │
                │ tournamentId │
                └──────────────┘
                (Junction Table)

     One Member can join Many Tournaments
     One Tournament can have Many Members
