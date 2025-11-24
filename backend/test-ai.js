import { LocalAI } from './src/controllers/aiChatController.js';

console.log('🤖 Direct LocalAI Engine Test (no HTTP/auth)\n');

const ai = new LocalAI();

function runTest(label, question) {
  console.log(`Test: ${label}`);
  console.log('─'.repeat(60));
  try {
    const category = ai.categorizeQuestion(question);
    const answer = ai.generateResponse(question, category);
    console.log(answer.substring(0, 600));
    console.log('\n✅ Passed\n');
  } catch (e) {
    console.error('❌ Failed:', e.message);
  }
}

runTest('Quicksort (Python)', 'Show me quicksort in Python');
runTest('Binary Search Tree', 'Explain binary search tree operations');
runTest('Load Balancer Design', 'Design a scalable load balancer for millions of requests');
runTest('Security Authentication', 'Explain JWT authentication security best practices');

console.log('🎉 LocalAI tests finished');
