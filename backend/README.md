# Backend - TeamEventPlanner.Api

## Requirements
- .NET 7 SDK
- dotnet-ef tool (for migrations) if you want to recreate DB

## Run
From backend/TeamEventPlanner.Api:
  dotnet restore
  dotnet run

By default the API uses SQLite file `team_event_planner.db` in the working dir.
Seed data will be inserted automatically on first run.

## Example tenants (seeded)
- Tenant A: 11111111-1111-1111-1111-111111111111
- Tenant B: 22222222-2222-2222-2222-222222222222

Endpoints:
- POST /api/events (header X-Tenant-ID required)
- GET  /api/events (header X-Tenant-ID required)
- GET  /api/reports/data?start=...&end=...&clientLocalTime=... (header X-Tenant-ID required)
