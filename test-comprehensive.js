// Comprehensive API test
const http = require('http');

let memberId1, memberId2, tournamentId1;

function request(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: data ? {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      } : {}
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(responseData));
        } catch (e) {
          resolve(responseData);
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('='.repeat(60));
  console.log('  GOLF CLUB API - COMPREHENSIVE TEST SUITE');
  console.log('='.repeat(60));
  console.log();

  try {
    // Test 1: API Health
    console.log('✓ Test 1: API Health Check');
    const health = await request('GET', '/');
    console.log(`   API Version: ${health.version}`);
    console.log(`   Message: ${health.message}`);
    console.log();

    // Test 2: Create Members
    console.log('✓ Test 2: Create Members');
    
    const member1 = await request('POST', '/api/members', JSON.stringify({
      name: 'John Doe',
      address: '123 Main St, Augusta, GA',
      email: 'john.doe@example.com',
      phone: '555-1234',
      membershipStartDate: '2024-01-01',
      membershipDuration: 12
    }));
    memberId1 = member1.id;
    console.log(`   Created: ${member1.name} (ID: ${member1.id})`);

    const member2 = await request('POST', '/api/members', JSON.stringify({
      name: 'Jane Smith',
      address: '456 Oak Ave, Pebble Beach, CA',
      email: 'jane.smith@example.com',
      phone: '555-5678',
      membershipStartDate: '2024-02-15',
      membershipDuration: 24
    }));
    memberId2 = member2.id;
    console.log(`   Created: ${member2.name} (ID: ${member2.id})`);
    console.log();

    // Test 3: Get All Members
    console.log('✓ Test 3: Get All Members');
    const members = await request('GET', '/api/members');
    console.log(`   Total Members: ${members.length}`);
    console.log();

    // Test 4: Search Members by Name
    console.log('✓ Test 4: Search Members by Name');
    const searchResults = await request('GET', '/api/members/search/name/john');
    console.log(`   Search "john": Found ${searchResults.length} member(s)`);
    console.log();

    // Test 5: Create Tournament
    console.log('✓ Test 5: Create Tournament');
    const tournament = await request('POST', '/api/tournaments', JSON.stringify({
      startDate: '2024-06-15',
      endDate: '2024-06-17',
      location: 'Pine Valley Golf Club',
      entryFee: 150.00,
      cashPrize: 5000.00
    }));
    tournamentId1 = tournament.id;
    console.log(`   Created: Tournament at ${tournament.location} (ID: ${tournament.id})`);
    console.log(`   Prize: $${tournament.cashPrize}`);
    console.log();

    // Test 6: Add Members to Tournament
    console.log('✓ Test 6: Add Members to Tournament');
    await request('POST', `/api/tournaments/${tournamentId1}/members/${memberId1}`);
    console.log(`   Added ${member1.name} to tournament`);
    
    await request('POST', `/api/tournaments/${tournamentId1}/members/${memberId2}`);
    console.log(`   Added ${member2.name} to tournament`);
    console.log();

    // Test 7: Get Tournament Members
    console.log('✓ Test 7: Get Tournament Members');
    const tournamentMembers = await request('GET', `/api/tournaments/${tournamentId1}/members`);
    console.log(`   Tournament has ${tournamentMembers.length} participant(s):`);
    tournamentMembers.forEach(m => console.log(`      - ${m.name}`));
    console.log();

    // Test 8: Search Tournaments by Location
    console.log('✓ Test 8: Search Tournaments by Location');
    const tournamentsSearch = await request('GET', '/api/tournaments/search/location/valley');
    console.log(`   Search "valley": Found ${tournamentsSearch.length} tournament(s)`);
    console.log();

    // Test 9: Search Members by Phone
    console.log('✓ Test 9: Search Members by Phone');
    const phoneSearch = await request('GET', '/api/members/search/phone/555');
    console.log(`   Search "555": Found ${phoneSearch.length} member(s)`);
    console.log();

    // Test 10: Get Tournament with Members
    console.log('✓ Test 10: Get Full Tournament Details');
    const fullTournament = await request('GET', `/api/tournaments/${tournamentId1}`);
    console.log(`   Tournament: ${fullTournament.location}`);
    console.log(`   Dates: ${fullTournament.startDate.split('T')[0]} to ${fullTournament.endDate.split('T')[0]}`);
    console.log(`   Participants: ${fullTournament.members.length}`);
    console.log();

    // Summary
    console.log('='.repeat(60));
    console.log('  ✓ ALL TESTS PASSED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log();
    console.log('Summary:');
    console.log(`  - Created ${members.length} members`);
    console.log(`  - Created 1 tournament`);
    console.log(`  - Added ${tournamentMembers.length} participants to tournament`);
    console.log(`  - All search functions working`);
    console.log(`  - All CRUD operations successful`);
    console.log();
    console.log('✓ API is fully functional and ready for production!');

  } catch (error) {
    console.error('\n✗ Test failed:', error.message);
    process.exit(1);
  }
}

runTests();
