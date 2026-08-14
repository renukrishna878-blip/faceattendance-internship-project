const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

async function runE2ETest() {
  try {
    console.log('--- E2E TEST: Node.js -> Python AI ---');
    
    // 1. Create a dummy image file for testing
    const testImagePath = path.join(__dirname, 'test_classroom.jpg');
    fs.writeFileSync(testImagePath, 'dummy image content');

    // 2. We need a token to access the Node.js API (Mock Login)
    // First, let's login as the seeded teacher
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'smith@university.edu',
      password: 'password123'
    });
    
    const token = loginRes.data.token;
    console.log('1. Logged in successfully. Token acquired.');

    // 3. Hit the Node.js /api/attendance/process endpoint
    const form = new FormData();
    form.append('class_id', 1); // Assuming class_id 1 exists from seed or we can just mock
    form.append('subject_id', 1);
    form.append('classroom_image', fs.createReadStream(testImagePath));

    console.log('2. Uploading image to Node.js backend...');
    
    const processRes = await axios.post('http://localhost:5000/api/attendance/process', form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('3. Success! End-to-end response received:');
    console.log(JSON.stringify(processRes.data, null, 2));

    // Cleanup
    fs.unlinkSync(testImagePath);
    console.log('Test completed successfully.');

  } catch (error) {
    console.error('Test Failed:', error.response ? error.response.data : error.message);
  }
}

runE2ETest();
