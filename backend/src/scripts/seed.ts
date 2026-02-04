import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ScheduleRule } from '../modules/schedule/schedule.model';
import { Instructor } from '../modules/instructor/instructor.model';
import { Room } from '../modules/room/room.model';

dotenv.config();

// Helper function to get random element from array
const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Helper function to get random elements from array
const getRandomElements = <T>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

async function seedData() {
  try {
    // Connect to MongoDB
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB Atlas');
    }

    // Clear existing data
    await ScheduleRule.deleteMany({});
    await Instructor.deleteMany({});
    await Room.deleteMany({});

    // Create 50 instructors with diverse names and specializations
    const instructorNames = [
      'John Smith', 'Sarah Johnson', 'Mike Davis', 'Emily Brown', 'David Wilson',
      'Jessica Garcia', 'Chris Martinez', 'Amanda Rodriguez', 'Ryan Anderson', 'Lisa Taylor',
      'Kevin Thomas', 'Michelle Jackson', 'Brian White', 'Ashley Harris', 'Jason Martin',
      'Nicole Thompson', 'Daniel Garcia', 'Stephanie Lewis', 'Matthew Lee', 'Jennifer Walker',
      'Andrew Hall', 'Rachel Allen', 'Joshua Young', 'Megan King', 'Nicholas Wright',
      'Samantha Lopez', 'Tyler Hill', 'Kimberly Scott', 'Brandon Green', 'Brittany Adams',
      'Jonathan Baker', 'Danielle Gonzalez', 'Austin Nelson', 'Kayla Carter', 'Sean Mitchell',
      'Alexis Perez', 'Zachary Roberts', 'Morgan Turner', 'Cody Phillips', 'Jasmine Campbell',
      'Trevor Parker', 'Courtney Evans', 'Garrett Edwards', 'Vanessa Collins', 'Dustin Stewart',
      'Haley Sanchez', 'Caleb Morris', 'Paige Rogers', 'Ian Reed', 'Jenna Cook'
    ];

    const specializations = [
      ['Crossfit', 'Strength Training'], ['Yoga', 'Pilates'], ['Olympic Lifting', 'Powerlifting'],
      ['Cardio', 'HIIT'], ['Boxing', 'Kickboxing'], ['Dance', 'Zumba'], ['Spinning', 'Cycling'],
      ['Swimming', 'Aqua Fitness'], ['Martial Arts', 'Self Defense'], ['Functional Training', 'TRX'],
      ['Bodybuilding', 'Physique'], ['Rehabilitation', 'Physical Therapy'], ['Nutrition', 'Wellness'],
      ['Flexibility', 'Stretching'], ['Core Training', 'Abs'], ['Endurance', 'Marathon Training']
    ];

    const instructors = [];
    for (let i = 0; i < 50; i++) {
      instructors.push({
        name: instructorNames[i],
        email: `${instructorNames[i].toLowerCase().replace(' ', '.')}@fitnesscenter.com`,
        specialization: getRandomElements(specializations.flat(), Math.floor(Math.random() * 3) + 1)
      });
    }

    const createdInstructors = await Instructor.insertMany(instructors);

    // Create 25 diverse rooms
    const roomData = [
      { name: 'Main Studio', capacity: 30, equipment: ['Barbells', 'Dumbbells', 'Kettlebells', 'Pull-up Bars'] },
      { name: 'Yoga Studio', capacity: 20, equipment: ['Yoga Mats', 'Blocks', 'Straps', 'Bolsters'] },
      { name: 'Cardio Room', capacity: 25, equipment: ['Treadmills', 'Bikes', 'Rowers', 'Ellipticals'] },
      { name: 'Boxing Gym', capacity: 15, equipment: ['Heavy Bags', 'Speed Bags', 'Boxing Gloves', 'Pads'] },
      { name: 'Dance Studio', capacity: 35, equipment: ['Mirrors', 'Sound System', 'Ballet Barres'] },
      { name: 'Spinning Room', capacity: 20, equipment: ['Spin Bikes', 'Heart Rate Monitors', 'Towels'] },
      { name: 'Pool Area', capacity: 40, equipment: ['Pool Noodles', 'Kickboards', 'Water Weights'] },
      { name: 'Functional Training', capacity: 18, equipment: ['TRX', 'Battle Ropes', 'Medicine Balls'] },
      { name: 'Strength Zone', capacity: 22, equipment: ['Power Racks', 'Bench Press', 'Cable Machines'] },
      { name: 'Flexibility Room', capacity: 16, equipment: ['Foam Rollers', 'Stretching Mats', 'Resistance Bands'] },
      { name: 'HIIT Arena', capacity: 28, equipment: ['Plyometric Boxes', 'Agility Ladders', 'Cones'] },
      { name: 'Pilates Studio', capacity: 14, equipment: ['Reformers', 'Pilates Balls', 'Magic Circles'] },
      { name: 'Martial Arts Dojo', capacity: 24, equipment: ['Mats', 'Punching Mitts', 'Protective Gear'] },
      { name: 'Rehabilitation Center', capacity: 12, equipment: ['Therapy Tables', 'Resistance Equipment'] },
      { name: 'Mind-Body Studio', capacity: 18, equipment: ['Meditation Cushions', 'Aromatherapy'] },
      { name: 'CrossFit Box', capacity: 26, equipment: ['Olympic Bars', 'Bumper Plates', 'Rings'] },
      { name: 'Outdoor Terrace', capacity: 30, equipment: ['Portable Equipment', 'Weather Protection'] },
      { name: 'Recovery Lounge', capacity: 10, equipment: ['Massage Chairs', 'Compression Boots'] },
      { name: 'Nutrition Lab', capacity: 15, equipment: ['Scales', 'Body Composition Analyzer'] },
      { name: 'Virtual Reality Gym', capacity: 8, equipment: ['VR Headsets', 'Motion Sensors'] },
      { name: 'Senior Fitness Room', capacity: 20, equipment: ['Chair Exercise Equipment', 'Low Impact Tools'] },
      { name: 'Kids Activity Zone', capacity: 25, equipment: ['Colorful Equipment', 'Safety Mats'] },
      { name: 'Bootcamp Field', capacity: 35, equipment: ['Obstacle Course', 'Military Style Equipment'] },
      { name: 'Wellness Sanctuary', capacity: 12, equipment: ['Himalayan Salt Lamps', 'Essential Oils'] },
      { name: 'Performance Lab', capacity: 16, equipment: ['Performance Testing Equipment', 'Analytics Tools'] }
    ];

    const createdRooms = await Room.insertMany(roomData);

    // Create 150-200 diverse schedule rules
    const classTypes = [
      'Morning Crossfit', 'Evening Crossfit', 'Beginner Crossfit', 'Advanced Crossfit',
      'Hatha Yoga', 'Vinyasa Yoga', 'Hot Yoga', 'Yin Yoga', 'Power Yoga',
      'Olympic Lifting', 'Powerlifting', 'Strength Training', 'Bodybuilding',
      'HIIT Cardio', 'Low Impact Cardio', 'Interval Training', 'Endurance Training',
      'Boxing Fundamentals', 'Kickboxing', 'Boxing Conditioning', 'Self Defense',
      'Zumba', 'Hip Hop Dance', 'Ballet Fitness', 'Contemporary Dance',
      'Spinning', 'Indoor Cycling', 'Bike Bootcamp', 'Endurance Cycling',
      'Aqua Aerobics', 'Swimming Lessons', 'Water Jogging', 'Aqua Zumba',
      'Pilates Mat', 'Pilates Reformer', 'Pilates Fusion', 'Core Pilates',
      'Martial Arts', 'Karate', 'Taekwondo', 'Jiu Jitsu', 'Mixed Martial Arts',
      'Functional Training', 'TRX Suspension', 'Kettlebell Training', 'Battle Ropes',
      'Flexibility & Mobility', 'Stretching', 'Foam Rolling', 'Recovery Session',
      'Bootcamp', 'Military Fitness', 'Obstacle Training', 'Team Challenges',
      'Senior Fitness', 'Chair Exercises', 'Low Impact Fitness', 'Balance Training',
      'Kids Fitness', 'Teen Training', 'Family Fitness', 'Youth Sports',
      'Meditation', 'Mindfulness', 'Breathwork', 'Stress Relief',
      'Nutrition Workshop', 'Wellness Seminar', 'Health Coaching', 'Lifestyle Training'
    ];

    const timeSlots = [
      '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
      '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
      '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
    ];

    const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    const recurrenceTypes = ['WEEKLY', 'DAILY', 'MONTHLY'];
    const durations = [30, 45, 60, 75, 90, 120]; // minutes

    const scheduleRules = [];
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const endOfYear = new Date(today.getFullYear(), 11, 31);

    for (let i = 0; i < 180; i++) {
      const recurrenceType = getRandomElement(recurrenceTypes);
      let weeklyDays, monthlyDates;

      if (recurrenceType === 'WEEKLY') {
        // Random 1-3 days per week
        weeklyDays = getRandomElements(weekDays, Math.floor(Math.random() * 3) + 1);
      } else if (recurrenceType === 'MONTHLY') {
        // Random 1-4 dates per month
        monthlyDates = Array.from({length: Math.floor(Math.random() * 4) + 1}, 
          () => Math.floor(Math.random() * 28) + 1);
      }

      scheduleRules.push({
        classType: getRandomElement(classTypes),
        instructor: getRandomElement(createdInstructors)._id,
        room: getRandomElement(createdRooms)._id,
        duration: getRandomElement(durations),
        startDate: startOfYear,
        endDate: endOfYear,
        recurrenceType,
        weeklyDays,
        monthlyDates,
        timeSlots: [getRandomElement(timeSlots)],
        interval: Math.floor(Math.random() * 2) + 1, // 1 or 2 weeks/months interval
      });
    }

    await ScheduleRule.insertMany(scheduleRules);

    console.log('🎉 Comprehensive seed data created successfully!');
    console.log(`✅ Created ${createdInstructors.length} instructors`);
    console.log(`✅ Created ${createdRooms.length} rooms`);
    console.log(`✅ Created ${scheduleRules.length} schedule rules`);
    console.log(`📅 Date range: ${startOfYear.toDateString()} to ${endOfYear.toDateString()}`);
    console.log('🏋️ Ready for testing with diverse fitness classes!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedData();