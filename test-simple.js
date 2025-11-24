// Simple test to verify the server is working
const http = require('http');

function testAPI() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('✓ API is running!');
      console.log('Response:', JSON.parse(data));
      testCreateMember();
    });
  });

  req.on('error', (error) => {
    console.error('✗ API is not responding:', error.message);
    console.log('\nPlease make sure the server is running with: node src/index.js');
  });

  req.end();
}

function testCreateMember() {
  const memberData = JSON.stringify({
    name: 'John Doe',
    address: '123 Main St, Augusta, GA',
    email: 'john.doe@example.com',
    phone: '555-1234',
    membershipStartDate: '2024-01-01',
    membershipDuration: 12
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/members',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(memberData)
    }
  };

  console.log('\n--- Creating Member ---');
  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('✓ Member created successfully!');
      console.log('Response:', JSON.parse(data));
      testGetMembers();
    });
  });

  req.on('error', (error) => {
    console.error('✗ Error creating member:', error.message);
  });

  req.write(memberData);
  req.end();
}

function testGetMembers() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/members',
    method: 'GET'
  };

  console.log('\n--- Getting All Members ---');
  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('✓ Members retrieved successfully!');
      const members = JSON.parse(data);
      console.log(`Found ${members.length} member(s)`);
      console.log('Members:', JSON.stringify(members, null, 2));
      console.log('\n✓ All tests passed!');
      process.exit(0);
    });
  });

  req.on('error', (error) => {
    console.error('✗ Error getting members:', error.message);
  });

  req.end();
}

// Start the test
console.log('=========================================');
console.log('Golf Club API Test');
console.log('=========================================\n');
console.log('--- Testing API Connection ---');
testAPI();
