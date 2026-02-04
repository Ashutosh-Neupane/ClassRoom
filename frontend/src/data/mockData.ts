import { ClassEvent, ClassType, Instructor, Room } from '../types/schedule';
import { addDays, setHours, setMinutes } from 'date-fns';

const today = new Date();
const startOfWeek = addDays(today, -today.getDay());

export const mockInstructors: Instructor[] = [
  { id: '1', name: 'John Smith' },
  { id: '2', name: 'Sarah Johnson' },
  { id: '3', name: 'Mike Davis' },
  { id: '4', name: 'Emily Brown' },
];

export const mockRooms: Room[] = [
  { id: '1', name: 'Main Studio' },
  { id: '2', name: 'Yoga Studio' },
  { id: '3', name: 'Training Room' },
];

export const mockClassTypes: ClassType[] = [
  { id: '1', name: 'Morning Crossfit', description: 'High-intensity crossfit training', defaultDuration: 60, defaultCapacity: 20, color: 'crossfit' },
  { id: '2', name: 'Yoga Flow', description: 'Relaxing yoga session', defaultDuration: 60, defaultCapacity: 15, color: 'yoga' },
  { id: '3', name: 'Saturday Workshop: Olympic Lifting', description: 'Advanced Olympic lifting techniques', defaultDuration: 120, defaultCapacity: 12, color: 'workshop' },
];

export const mockEvents: ClassEvent[] = [
  {
    id: '1',
    title: 'Morning Crossfit',
    instructor: 'John Smith',
    room: 'Main Studio',
    date: setMinutes(setHours(startOfWeek, 13), 0),
    time: '13:00',
    duration: 60,
    capacity: 20,
    booked: 15,
    status: 'scheduled',
    type: 'crossfit',
  },
  {
    id: '2',
    title: 'Yoga Flow',
    instructor: 'Sarah Johnson',
    room: 'Yoga Studio',
    date: setMinutes(setHours(addDays(startOfWeek, 1), 13), 0),
    time: '13:00',
    duration: 60,
    capacity: 15,
    booked: 12,
    status: 'scheduled',
    type: 'yoga',
  },
  {
    id: '3',
    title: 'Saturday Workshop: Olympic Lifting',
    instructor: 'Mike Davis',
    room: 'Main Studio',
    date: setMinutes(setHours(addDays(startOfWeek, 2), 13), 0),
    time: '13:00',
    duration: 120,
    capacity: 12,
    booked: 8,
    status: 'scheduled',
    type: 'workshop',
  },
  {
    id: '4',
    title: 'Morning Crossfit',
    instructor: 'John Smith',
    room: 'Main Studio',
    date: setMinutes(setHours(startOfWeek, 17), 0),
    time: '17:00',
    duration: 60,
    capacity: 20,
    booked: 15,
    status: 'scheduled',
    type: 'crossfit',
  },
  {
    id: '5',
    title: 'Yoga Flow',
    instructor: 'Sarah Johnson',
    room: 'Yoga Studio',
    date: setMinutes(setHours(addDays(startOfWeek, 1), 17), 0),
    time: '17:00',
    duration: 60,
    capacity: 15,
    booked: 12,
    status: 'scheduled',
    type: 'yoga',
  },
  {
    id: '6',
    title: 'Saturday Workshop: Olympic Lifting',
    instructor: 'Mike Davis',
    room: 'Main Studio',
    date: setMinutes(setHours(addDays(startOfWeek, 2), 17), 0),
    time: '17:00',
    duration: 120,
    capacity: 12,
    booked: 8,
    status: 'scheduled',
    type: 'workshop',
  },
];

export const locations = [
  { id: '1', name: 'Branch/Location 1' },
  { id: '2', name: 'Branch/Location 2' },
  { id: '3', name: 'Branch/Location 3' },
];
