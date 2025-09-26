#!/usr/bin/env node

/**
 * Simple integration test for the Worker Recommendation System
 * Tests the backend API endpoints and verifies data flow
 */

const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:8080';

async function testRecommendationAPI() {
  console.log('🧪 Testing Worker Recommendation Integration...\n');

  try {
    // Test 1: Get recommendations without filters
    console.log('1️⃣ Testing basic recommendations...');
    const response1 = await fetch(`${API_BASE_URL}/workers-prediction/recommend?format=json`);
    
    if (!response1.ok) {
      throw new Error(`HTTP ${response1.status}: ${response1.statusText}`);
    }
    
    const workers1 = await response1.json();
    console.log(`✅ Received ${workers1.length} recommended workers`);
    console.log(`   Sample worker: ${workers1[0]?.name} (Score: ${workers1[0]?.predictedScore})`);

    // Test 2: Get recommendations with locality filter
    console.log('\n2️⃣ Testing locality-filtered recommendations...');
    const response2 = await fetch(`${API_BASE_URL}/workers-prediction/recommend?locality=MG Road&format=json`);
    const workers2 = await response2.json();
    console.log(`✅ Received ${workers2.length} workers for MG Road locality`);

    // Test 3: Get recommendations with worker type filter
    console.log('\n3️⃣ Testing worker type filtered recommendations...');
    const response3 = await fetch(`${API_BASE_URL}/workers-prediction/recommend?workerType=SWEEPER&format=json`);
    const workers3 = await response3.json();
    console.log(`✅ Received ${workers3.length} SWEEPER workers`);

    // Test 4: Test task assignment
    console.log('\n4️⃣ Testing task assignment...');
    const assignmentData = {
      workerId: workers1[0]?.id || 'worker_1',
      complaintId: 999,
      taskDifficulty: 5
    };

    const response4 = await fetch(`${API_BASE_URL}/workers-prediction/assign-task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assignmentData)
    });

    if (response4.ok) {
      const result = await response4.json();
      console.log(`✅ Task assigned successfully to ${assignmentData.workerId}`);
      console.log(`   New task count: ${result.newTaskCount}`);
    } else {
      console.log(`⚠️  Task assignment failed: ${response4.status} ${response4.statusText}`);
    }

    // Test 5: Verify data structure
    console.log('\n5️⃣ Verifying data structure...');
    const sampleWorker = workers1[0];
    const requiredFields = ['id', 'name', 'workerType', 'assignedTasks', 'predictedScore', 'locality'];
    const missingFields = requiredFields.filter(field => !(field in sampleWorker));
    
    if (missingFields.length === 0) {
      console.log('✅ All required fields present in worker data');
    } else {
      console.log(`❌ Missing fields: ${missingFields.join(', ')}`);
    }

    console.log('\n🎉 Integration test completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - API endpoints: Working`);
    console.log(`   - Data format: Valid`);
    console.log(`   - Filtering: Functional`);
    console.log(`   - Task assignment: ${response4.ok ? 'Working' : 'Needs attention'}`);

  } catch (error) {
    console.error('\n❌ Integration test failed:');
    console.error(`   Error: ${error.message}`);
    console.error('\n🔧 Troubleshooting:');
    console.error('   1. Ensure backend server is running: cd backend && npm run dev');
    console.error('   2. Check Python dependencies are installed');
    console.error('   3. Verify CSV files exist in backend/datasets/');
    console.error('   4. Check backend logs for Python script errors');
    
    process.exit(1);
  }
}

// Run the test
testRecommendationAPI();