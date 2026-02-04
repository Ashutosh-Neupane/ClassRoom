// Debug RecurrenceEngine date issue
const { startOfDay } = require('date-fns');

const ruleStartDate = new Date('2025-12-31T18:15:00.000Z');
console.log('Original rule start date:', ruleStartDate.toISOString());

const startOfDayResult = startOfDay(ruleStartDate);
console.log('startOfDay result:', startOfDayResult.toISOString());

// Check what date this actually represents
console.log('Year:', startOfDayResult.getFullYear());
console.log('Month:', startOfDayResult.getMonth() + 1); // +1 because months are 0-indexed
console.log('Date:', startOfDayResult.getDate());

// Let's see what happens when we add days
const { addDays } = require('date-fns');
let currentDate = startOfDayResult;
for (let i = 0; i < 40; i++) {
  const dateStr = currentDate.toISOString().split('T')[0];
  if (dateStr === '2026-02-04') {
    console.log(`Found Feb 4th at iteration ${i}:`, currentDate.toISOString());
    break;
  }
  currentDate = addDays(currentDate, 1);
}