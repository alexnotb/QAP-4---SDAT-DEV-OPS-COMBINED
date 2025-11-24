# Testing Guide

This guide will help you test the Golf Club API with sample data and verify all features are working correctly.

## Prerequisites

- API running on `http://localhost:3000`
- Postman or similar API testing tool (or use curl)

## Test Workflow

### 1. Create Members

**Request 1: Create First Member**
```bash
POST http://localhost:3000/api/members
Content-Type: application/json

{
  "name": "John Doe",
  "address": "123 Main St, Augusta, GA",
  "email": "john.doe@example.com",
  "phone": "555-1234",
  "membershipStartDate": "2024-01-01",
  "membershipDuration": 12
}
```

**Request 2: Create Second Member**
```bash
POST http://localhost:3000/api/members
Content-Type: application/json

{
  "name": "Jane Smith",
  "address": "456 Oak Ave, Pebble Beach, CA",
  "email": "jane.smith@example.com",
  "phone": "555-5678",
  "membershipStartDate": "2024-02-15",
  "membershipDuration": 24
}
```

**Request 3: Create Third Member**
```bash
POST http://localhost:3000/api/members
Content-Type: application/json

{
  "name": "Bob Johnson",
  "address": "789 Pine Rd, St Andrews, Scotland",
  "email": "bob.johnson@example.com",
  "phone": "555-9012",
  "membershipStartDate": "2023-12-01",
  "membershipDuration": 12
}
```

### 2. Create Tournaments

**Request 1: Create Summer Tournament**
```bash
POST http://localhost:3000/api/tournaments
Content-Type: application/json

{
  "startDate": "2024-06-15",
  "endDate": "2024-06-17",
  "location": "Pine Valley Golf Club",
  "entryFee": 150.00,
  "cashPrize": 5000.00
}
```

**Request 2: Create Fall Classic**
```bash
POST http://localhost:3000/api/tournaments
Content-Type: application/json

{
  "startDate": "2024-09-20",
  "endDate": "2024-09-22",
  "location": "Augusta National Golf Club",
  "entryFee": 300.00,
  "cashPrize": 10000.00
}
```

### 3. Add Members to Tournaments

**Add John to Summer Tournament**
```bash
POST http://localhost:3000/api/tournaments/1/members/1
```

**Add Jane to Summer Tournament**
```bash
POST http://localhost:3000/api/tournaments/1/members/2
```

**Add Bob to Summer Tournament**
```bash
POST http://localhost:3000/api/tournaments/1/members/3
```

**Add Jane to Fall Classic**
```bash
POST http://localhost:3000/api/tournaments/2/members/2
```

### 4. Test Retrieval Endpoints

**Get All Members**
```bash
GET http://localhost:3000/api/members
```

**Get All Tournaments**
```bash
GET http://localhost:3000/api/tournaments
```

**Get Members in Tournament 1**
```bash
GET http://localhost:3000/api/tournaments/1/members
```

### 5. Test Search Endpoints

**Search Members by Name**
```bash
GET http://localhost:3000/api/members/search/name/john
```

**Search Members by Phone**
```bash
GET http://localhost:3000/api/members/search/phone/555
```

**Search Members by Membership Duration**
```bash
GET http://localhost:3000/api/members/search/duration/12
```

**Search Tournaments by Location**
```bash
GET http://localhost:3000/api/tournaments/search/location/augusta
```

**Search Tournaments by Start Date**
```bash
GET http://localhost:3000/api/tournaments/search/start-date/2024-06-01
```

**Search Members by Tournament Start Date**
```bash
GET http://localhost:3000/api/members/search/tournament-date/2024-06-01
```

### 6. Test Update Operations

**Update Member Phone**
```bash
PUT http://localhost:3000/api/members/1
Content-Type: application/json

{
  "phone": "555-9999"
}
```

**Update Tournament Prize**
```bash
PUT http://localhost:3000/api/tournaments/1
Content-Type: application/json

{
  "cashPrize": 7500.00
}
```

## Expected Results Checklist

- [ ] Successfully created 3 members
- [ ] Successfully created 2 tournaments
- [ ] Successfully added members to tournaments
- [ ] All members returned from GET /api/members
- [ ] All tournaments returned with member associations
- [ ] Search by name returns matching members
- [ ] Search by phone returns matching members
- [ ] Search by location returns matching tournaments
- [ ] Search by date filters correctly
- [ ] Update operations modify records
- [ ] Tournament members endpoint returns correct participants

## Screenshots to Capture

1. **Create Member** - Show successful member creation with response
2. **Create Tournament** - Show successful tournament creation
3. **Add Member to Tournament** - Show tournament with updated members list
4. **Get All Members** - Show all members with tournament associations
5. **Get Tournament Members** - Show all participants in a tournament
6. **Search by Name** - Show search results
7. **Search by Location** - Show filtered tournaments
8. **Docker Running** - Show containers running in terminal/Docker Desktop

## Curl Examples (Alternative to Postman)

```bash
# Create member
curl -X POST http://localhost:3000/api/members \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","address":"123 Main St","email":"john@example.com","phone":"555-1234","membershipStartDate":"2024-01-01","membershipDuration":12}'

# Get all members
curl http://localhost:3000/api/members

# Search by name
curl http://localhost:3000/api/members/search/name/john

# Add member to tournament
curl -X POST http://localhost:3000/api/tournaments/1/members/1
```

## Docker Testing

```bash
# Start the application
docker-compose up --build

# View logs
docker-compose logs -f api

# Check container status
docker ps

# Access database directly
docker exec -it golf_club_db psql -U postgres -d golf_club_db

# Query members
SELECT * FROM members;

# Query tournaments with members
SELECT t.*, m.name FROM tournaments t
LEFT JOIN tournament_members tm ON t.id = tm."tournamentId"
LEFT JOIN members m ON m.id = tm."memberId";
```
