// Debug script to test RecurrenceEngine
const { RecurrenceEngine } = require('./backend/dist/modules/schedule/recurrence.engine.js');
const { startOfDay } = require('date-fns');

const rule = {
  pattern: 'daily',
  startDate: new Date('2025-12-31T18:15:00.000Z'),
  endDate: new Date('2026-12-30T18:15:00.000Z'),
  interval: 1,
  timeSlots: [{ hour: 12, minute: 0 }]
};

console.log('Testing RecurrenceEngine with rule:', rule);

try {
  const occurrences = RecurrenceEngine.generateOccurrences(rule);
  console.log('Total occurrences generated:', occurrences.length);
  
  // Check if Feb 4, 2026 is included
  const targetDate = startOfDay(new Date('2026-02-04'));
  const feb4Occurrences = occurrences.filter(occ => 
    startOfDay(occ.date).getTime() === targetDate.getTime()
  );
  
  console.log('Feb 4, 2026 occurrences:', feb4Occurrences.length);
  if (feb4Occurrences.length > 0) {
    console.log('Feb 4 occurrence:', feb4Occurrences[0]);
  }
  
  // Show first few occurrences
  console.log('First 5 occurrences:');
  occurrences.slice(0, 5).forEach((occ, i) => {
    console.log(`${i + 1}:`, occ.date.toISOString().split('T')[0], occ.timeSlots);
  });
  
} catch (error) {
  console.error('Error:', error.message);
}