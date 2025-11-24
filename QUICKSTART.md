# Quick Start Guide

Get the Golf Club API running in under 5 minutes!

## Prerequisites
- Docker Desktop installed and running
- Git installed

## Steps

### 1. Clone the Repository
```bash
git clone https://github.com/alexnotb/QAP-4---SDAT-DEV-OPS-COMBINED.git
cd QAP-4---SDAT-DEV-OPS-COMBINED
```

### 2. Start the Application
```bash
docker-compose up --build
```

Wait for the following messages:
```
postgres     | database system is ready to accept connections
api          | Database connection established successfully.
api          | Database synchronized.
api          | Server is running on port 3000
```

### 3. Test the API

**Option A: Use Browser**
- Open http://localhost:3000
- You should see the API welcome message

**Option B: Use curl**
```bash
# Create a member
curl -X POST http://localhost:3000/api/members \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "address": "123 Main St",
    "email": "john@example.com",
    "phone": "555-1234",
    "membershipStartDate": "2024-01-01",
    "membershipDuration": 12
  }'

# Get all members
curl http://localhost:3000/api/members
```

**Option C: Use Postman**
- Import `postman_collection.json`
- Set environment variable `base_url` to `http://localhost:3000`
- Run the requests in the collection

### 4. Access the Database
```bash
docker exec -it golf_club_db psql -U postgres -d golf_club_db
```

Once inside PostgreSQL:
```sql
-- View all members
SELECT * FROM members;

-- View all tournaments
SELECT * FROM tournaments;

-- Exit
\q
```

## Common Commands

```bash
# View logs
docker-compose logs -f

# Stop the application
docker-compose down

# Stop and remove all data
docker-compose down -v

# Rebuild and restart
docker-compose up --build

# Run in background
docker-compose up -d
```

## What's Next?

1. Follow `TESTING_GUIDE.md` for comprehensive testing
2. Read `README.md` for full API documentation
3. Check `AWS_RDS_SETUP.md` for cloud deployment

## Troubleshooting

**Port 3000 already in use?**
```bash
# Change port in docker-compose.yml
ports:
  - "3001:3000"  # Use 3001 instead
```

**Database connection error?**
```bash
# Make sure PostgreSQL container is healthy
docker ps
# Restart containers
docker-compose restart
```

**Can't access API?**
```bash
# Check if containers are running
docker ps
# Check logs
docker-compose logs api
```

Need help? Check the full README.md or TESTING_GUIDE.md!
