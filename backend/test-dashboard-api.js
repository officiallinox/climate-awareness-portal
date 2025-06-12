const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Create a JWT token for testing
const createToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Test user with admin role
const adminUser = {
  id: '123456789012345678901234', // Fake MongoDB ID
  email: 'admin@portal.com',
  role: 'admin'
};

// Create token
const token = createToken(adminUser);

// Test the dashboard stats API
async function testDashboardAPI() {
  try {
    console.log('Testing dashboard stats API...');
    console.log('Using token:', token);
    
    const response = await axios.get('http://localhost:3000/api/admin/dashboard-stats', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('API Response Status:', response.status);
    console.log('API Response Data:', JSON.stringify(response.data, null, 2));
    
    // Check if we have real data
    if (response.data && response.data.stats) {
      console.log('\nStats Summary:');
      console.log('- Total Users:', response.data.stats.totalUsers);
      console.log('- Total Initiatives:', response.data.stats.totalInitiatives);
      console.log('- Total Articles:', response.data.stats.totalArticles);
      console.log('- Total Activities:', response.data.stats.totalActivities);
      console.log('- Total Comments:', response.data.stats.totalComments);
      console.log('- Total Article Reads:', response.data.stats.totalReads || 0);
      console.log('- CO₂ Saved (kg):', response.data.climateImpact.carbonSaved || 0);
    }
    
  } catch (error) {
    console.error('Error testing API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testDashboardAPI();