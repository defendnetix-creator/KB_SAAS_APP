async function checkHealth() {
  try {
    const response = await fetch('http://localhost:3000/api/health');
    const data = await response.json();
    console.log('Health Check Result:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Health Check Failed:', error.message);
  }
}
checkHealth();
