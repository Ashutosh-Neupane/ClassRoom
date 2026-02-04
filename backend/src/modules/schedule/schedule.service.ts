import { ScheduleRule } from "./schedule.model";
import { checkScheduleConflicts } from "./conflict.engine";
import { RecurrenceEngine } from "./recurrence.engine";
import dayjs from "dayjs";

export const getAllSchedulesService = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  
  const [schedules, total] = await Promise.all([
    ScheduleRule.find()
      .populate("instructor")
      .populate("room")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    ScheduleRule.countDocuments()
  ]);

  return { schedules, total };
};

export const createScheduleService = async (payload: any) => {
  // Convert frontend format to backend format
  const scheduleData = {
    ...payload,
    // Map recurrenceRule to backend fields if recurring
    ...(payload.isRecurring && payload.recurrenceRule ? {
      recurrenceType: payload.recurrenceRule.pattern.toUpperCase(),
      startDate: payload.recurrenceRule.startDate,
      endDate: payload.recurrenceRule.endDate,
      timeSlots: payload.recurrenceRule.timeSlots?.map((slot: any) => 
        `${slot.hour.toString().padStart(2, '0')}:${slot.minute.toString().padStart(2, '0')}`
      ) || [],
      weeklyDays: payload.recurrenceRule.weeklySchedule ? 
        Object.keys(payload.recurrenceRule.weeklySchedule) : [],
      monthlyDates: payload.recurrenceRule.monthlySchedule ? 
        Object.keys(payload.recurrenceRule.monthlySchedule).map(Number) : [],
      interval: payload.recurrenceRule.interval || 1
    } : {
      recurrenceType: 'NONE',
      startDate: payload.date,
      endDate: payload.date,
      timeSlots: [payload.startTime]
    })
  };

  const schedule = new ScheduleRule(scheduleData);

  // Conflict check before save
  await checkScheduleConflicts(schedule);

  await schedule.save();
  return schedule;
};

export const updateScheduleService = async (
  id: string,
  payload: any
) => {
  const existing = await ScheduleRule.findById(id);

  if (!existing) {
    throw new Error("Schedule not found");
  }

  // Convert frontend format to backend format
  const updateData = {
    ...payload,
    ...(payload.isRecurring && payload.recurrenceRule ? {
      recurrenceType: payload.recurrenceRule.pattern.toUpperCase(),
      startDate: payload.recurrenceRule.startDate,
      endDate: payload.recurrenceRule.endDate,
      timeSlots: payload.recurrenceRule.timeSlots?.map((slot: any) => 
        `${slot.hour.toString().padStart(2, '0')}:${slot.minute.toString().padStart(2, '0')}`
      ) || [],
      weeklyDays: payload.recurrenceRule.weeklySchedule ? 
        Object.keys(payload.recurrenceRule.weeklySchedule) : [],
      monthlyDates: payload.recurrenceRule.monthlySchedule ? 
        Object.keys(payload.recurrenceRule.monthlySchedule).map(Number) : []
    } : {})
  };

  const updatedRule = Object.assign(existing, updateData);
  await checkScheduleConflicts(updatedRule);
  await updatedRule.save();

  return updatedRule;
};

export const deleteScheduleService = async (id: string) => {
  const existing = await ScheduleRule.findById(id);

  if (!existing) {
    throw new Error("Schedule not found");
  }

  await existing.deleteOne();
};

export const getCalendarSchedulesService = async (
  from: Date,
  to: Date
) => {
  const rules = await ScheduleRule.find({
    startDate: { $lte: to },
    endDate: { $gte: from },
  })
    .populate("instructor")
    .populate("room");

  const events: any[] = [];

  for (const rule of rules) {
    if (rule.recurrenceType === 'NONE') {
      // Single event
      const eventDate = new Date(rule.startDate);
      if (eventDate >= from && eventDate <= to) {
        rule.timeSlots.forEach(timeSlot => {
          const [hour, minute] = timeSlot.split(':').map(Number);
          const startTime = new Date(eventDate);
          startTime.setHours(hour, minute, 0, 0);
          const endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + rule.duration);

          events.push({
            _id: `${rule._id}-${eventDate.toISOString().split('T')[0]}-${timeSlot}`,
            title: rule.title || rule.classType,
            classType: rule.classType,
            date: eventDate,
            startTime: timeSlot,
            endTime: `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`,
            duration: rule.duration,
            instructor: (rule.instructor as any)?.name || "Unknown Instructor",
            room: (rule.room as any)?.name || "Unknown Room",
            capacity: (rule.room as any)?.capacity || 20,
            booked: Math.floor(Math.random() * ((rule.room as any)?.capacity || 20)),
            status: 'scheduled',
            ruleId: rule._id.toString(),
            isRecurring: false
          });
        });
      }
    } else {
      // Recurring event - generate occurrences
      try {
        const recurrenceRule = {
          pattern: rule.recurrenceType.toLowerCase() as 'daily' | 'weekly' | 'monthly',
          startDate: new Date(rule.startDate),
          endDate: new Date(rule.endDate),
          interval: rule.interval || 1,
          timeSlots: rule.timeSlots.map(slot => {
            const [hour, minute] = slot.split(':').map(Number);
            return { hour, minute };
          }),
          ...(rule.recurrenceType === 'WEEKLY' && {
            weeklySchedule: rule.weeklyDays?.reduce((acc, day) => {
              acc[day.toLowerCase()] = rule.timeSlots.map(slot => {
                const [hour, minute] = slot.split(':').map(Number);
                return { hour, minute };
              });
              return acc;
            }, {} as any)
          })
        };

        const occurrences = RecurrenceEngine.generateOccurrences(recurrenceRule);
        
        occurrences.forEach(occ => {
          if (occ.date >= from && occ.date <= to) {
            occ.timeSlots.forEach(timeSlot => {
              const startTime = new Date(occ.date);
              startTime.setHours(timeSlot.hour, timeSlot.minute, 0, 0);
              const endTime = new Date(startTime);
              endTime.setMinutes(endTime.getMinutes() + rule.duration);

              const timeStr = `${timeSlot.hour.toString().padStart(2, '0')}:${timeSlot.minute.toString().padStart(2, '0')}`;
              const endTimeStr = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;

              events.push({
                _id: `${rule._id}-${occ.date.toISOString().split('T')[0]}-${timeStr}`,
                title: rule.title || rule.classType,
                classType: rule.classType,
                date: occ.date,
                startTime: timeStr,
                endTime: endTimeStr,
                duration: rule.duration,
                instructor: (rule.instructor as any)?.name || "Unknown Instructor",
                room: (rule.room as any)?.name || "Unknown Room",
                capacity: (rule.room as any)?.capacity || 20,
                booked: Math.floor(Math.random() * ((rule.room as any)?.capacity || 20)),
                status: 'scheduled',
                ruleId: rule._id.toString(),
                isRecurring: true
              });
            });
          }
        });
      } catch (error) {
        console.error('Error generating occurrences for rule:', rule._id, error);
      }
    }
  }

  return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};