# Test Script for Golf Club API (PowerShell)
# This script demonstrates all the API endpoints

$BASE_URL = "http://localhost:3000"

Write-Host "==========================================="
Write-Host "Golf Club API Test Script"
Write-Host "==========================================="
Write-Host ""

# Check if API is running
Write-Host "1. Checking API health..."
try {
    $response = Invoke-RestMethod -Uri $BASE_URL -Method Get
    $response | ConvertTo-Json
} catch {
    Write-Host "Error: API is not running. Please start with 'docker-compose up'"
    exit 1
}
Write-Host ""

# Create first member
Write-Host "2. Creating first member (John Doe)..."
$member1Body = @{
    name = "John Doe"
    address = "123 Main St, Augusta, GA"
    email = "john.doe@example.com"
    phone = "555-1234"
    membershipStartDate = "2024-01-01"
    membershipDuration = 12
} | ConvertTo-Json

$member1 = Invoke-RestMethod -Uri "$BASE_URL/api/members" -Method Post -Body $member1Body -ContentType "application/json"
$member1 | ConvertTo-Json
$member1Id = $member1.id
Write-Host ""

# Create second member
Write-Host "3. Creating second member (Jane Smith)..."
$member2Body = @{
    name = "Jane Smith"
    address = "456 Oak Ave, Pebble Beach, CA"
    email = "jane.smith@example.com"
    phone = "555-5678"
    membershipStartDate = "2024-02-15"
    membershipDuration = 24
} | ConvertTo-Json

$member2 = Invoke-RestMethod -Uri "$BASE_URL/api/members" -Method Post -Body $member2Body -ContentType "application/json"
$member2 | ConvertTo-Json
$member2Id = $member2.id
Write-Host ""

# Create first tournament
Write-Host "4. Creating first tournament (Summer Classic)..."
$tournament1Body = @{
    startDate = "2024-06-15"
    endDate = "2024-06-17"
    location = "Pine Valley Golf Club"
    entryFee = 150.00
    cashPrize = 5000.00
} | ConvertTo-Json

$tournament1 = Invoke-RestMethod -Uri "$BASE_URL/api/tournaments" -Method Post -Body $tournament1Body -ContentType "application/json"
$tournament1 | ConvertTo-Json
$tournament1Id = $tournament1.id
Write-Host ""

# Add member to tournament
Write-Host "5. Adding John Doe to Summer Classic..."
$result = Invoke-RestMethod -Uri "$BASE_URL/api/tournaments/$tournament1Id/members/$member1Id" -Method Post
$result | ConvertTo-Json
Write-Host ""

# Add second member to tournament
Write-Host "6. Adding Jane Smith to Summer Classic..."
$result = Invoke-RestMethod -Uri "$BASE_URL/api/tournaments/$tournament1Id/members/$member2Id" -Method Post
$result | ConvertTo-Json
Write-Host ""

# Get all members
Write-Host "7. Getting all members..."
$members = Invoke-RestMethod -Uri "$BASE_URL/api/members" -Method Get
$members | ConvertTo-Json
Write-Host ""

# Get all tournaments
Write-Host "8. Getting all tournaments..."
$tournaments = Invoke-RestMethod -Uri "$BASE_URL/api/tournaments" -Method Get
$tournaments | ConvertTo-Json
Write-Host ""

# Get members in tournament
Write-Host "9. Getting all members in Summer Classic..."
$tournamentMembers = Invoke-RestMethod -Uri "$BASE_URL/api/tournaments/$tournament1Id/members" -Method Get
$tournamentMembers | ConvertTo-Json
Write-Host ""

# Search members by name
Write-Host "10. Searching members by name 'john'..."
$searchResults = Invoke-RestMethod -Uri "$BASE_URL/api/members/search/name/john" -Method Get
$searchResults | ConvertTo-Json
Write-Host ""

# Search tournaments by location
Write-Host "11. Searching tournaments by location 'valley'..."
$searchResults = Invoke-RestMethod -Uri "$BASE_URL/api/tournaments/search/location/valley" -Method Get
$searchResults | ConvertTo-Json
Write-Host ""

Write-Host "==========================================="
Write-Host "Test complete!"
Write-Host "==========================================="
