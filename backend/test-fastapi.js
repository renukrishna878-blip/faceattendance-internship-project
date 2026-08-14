const axios = require('axios');

async function testFastAPI() {
  try {
    const res = await axios.get('http://localhost:8000/health');
    console.log('FastAPI Health:', res.data);
  } catch (err) {
    console.error('Error connecting to FastAPI:', err.message);
  }
}

testFastAPI();
