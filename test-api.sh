#!/bin/bash

# Test Script for Golf Club API
# This script demonstrates all the API endpoints

BASE_URL="http://localhost:3000"

echo "==========================================="
echo "Golf Club API Test Script"
echo "==========================================="
echo ""

# Check if API is running
echo "1. Checking API health..."
curl -s $BASE_URL | jq '.'
echo ""

# Create first member
echo "2. Creating first member (John Doe)..."
MEMBER1=$(curl -s -X POST $BASE_URL/api/members \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "address": "123 Main St, Augusta, GA",
    "email": "john.doe@example.com",
    "phone": "555-1234",
    "membershipStartDate": "2024-01-01",
    "membershipDuration": 12
  }')
echo $MEMBER1 | jq '.'
MEMBER1_ID=$(echo $MEMBER1 | jq -r '.id')
echo ""

# Create second member
echo "3. Creating second member (Jane Smith)..."
MEMBER2=$(curl -s -X POST $BASE_URL/api/members \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "address": "456 Oak Ave, Pebble Beach, CA",
    "email": "jane.smith@example.com",
    "phone": "555-5678",
    "membershipStartDate": "2024-02-15",
    "membershipDuration": 24
  }')
echo $MEMBER2 | jq '.'
MEMBER2_ID=$(echo $MEMBER2 | jq -r '.id')
echo ""

# Create first tournament
echo "4. Creating first tournament (Summer Classic)..."
TOURNAMENT1=$(curl -s -X POST $BASE_URL/api/tournaments \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2024-06-15",
    "endDate": "2024-06-17",
    "location": "Pine Valley Golf Club",
    "entryFee": 150.00,
    "cashPrize": 5000.00
  }')
echo $TOURNAMENT1 | jq '.'
TOURNAMENT1_ID=$(echo $TOURNAMENT1 | jq -r '.id')
echo ""

# Add member to tournament
echo "5. Adding John Doe to Summer Classic..."
curl -s -X POST $BASE_URL/api/tournaments/$TOURNAMENT1_ID/members/$MEMBER1_ID | jq '.'
echo ""

# Add second member to tournament
echo "6. Adding Jane Smith to Summer Classic..."
curl -s -X POST $BASE_URL/api/tournaments/$TOURNAMENT1_ID/members/$MEMBER2_ID | jq '.'
echo ""

# Get all members
echo "7. Getting all members..."
curl -s $BASE_URL/api/members | jq '.'
echo ""

# Get all tournaments
echo "8. Getting all tournaments..."
curl -s $BASE_URL/api/tournaments | jq '.'
echo ""

# Get members in tournament
echo "9. Getting all members in Summer Classic..."
curl -s $BASE_URL/api/tournaments/$TOURNAMENT1_ID/members | jq '.'
echo ""

# Search members by name
echo "10. Searching members by name 'john'..."
curl -s $BASE_URL/api/members/search/name/john | jq '.'
echo ""

# Search tournaments by location
echo "11. Searching tournaments by location 'valley'..."
curl -s $BASE_URL/api/tournaments/search/location/valley | jq '.'
echo ""

echo "==========================================="
echo "Test complete!"
echo "==========================================="
