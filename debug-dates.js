// Detailed debug script
const from = new Date('2026-02-04');
const to = new Date('2026-02-04');

console.log('=== INPUT DATES ===');
console.log('from:', from.toISOString());
console.log('to:', to.toISOString());

// Simulate the service logic
const fromDate = new Date(from.getFullYear(), from.getMonth(), from.getDate());
const toDate = new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59, 999);

console.log('=== NORMALIZED DATES ===');
console.log('fromDate:', fromDate.toISOString());
console.log('toDate:', toDate.toISOString());

// Simulate a DAILY rule
const ruleStartDate = new Date('2025-12-31T18:15:00.000Z');
const ruleEndDate = new Date('2026-12-30T18:15:00.000Z');

console.log('=== RULE DATES ===');
console.log('ruleStartDate:', ruleStartDate.toISOString());
console.log('ruleEndDate:', ruleEndDate.toISOString());

// MongoDB query check
const mongoMatch = (ruleStartDate <= to) && (ruleEndDate >= from);
console.log('=== MONGODB QUERY ===');
console.log('MongoDB match:', mongoMatch);

// Simulate RecurrenceEngine result
const occurrenceDate = new Date('2026-02-03T18:15:00.000Z'); // This is what we got from debug
const occDateOnly = new Date(occurrenceDate.getFullYear(), occurrenceDate.getMonth(), occurrenceDate.getDate());

console.log('=== OCCURRENCE PROCESSING ===');
console.log('occurrenceDate:', occurrenceDate.toISOString());
console.log('occDateOnly:', occDateOnly.toISOString());
console.log('occDateOnly >= fromDate:', occDateOnly >= fromDate);
console.log('occDateOnly <= toDate:', occDateOnly <= toDate);
console.log('Should include:', (occDateOnly >= fromDate) && (occDateOnly <= toDate));

// Check the actual date values
console.log('=== DATE COMPARISON VALUES ===');
console.log('occDateOnly.getTime():', occDateOnly.getTime());
console.log('fromDate.getTime():', fromDate.getTime());
console.log('toDate.getTime():', toDate.getTime());
console.log('Date difference (days):', (occDateOnly.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));