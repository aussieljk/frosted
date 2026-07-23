import React from 'react';
import { Calendar } from '@aussieljk/frosted';
import { parseDate } from '@internationalized/date';

export default function CalendarDemo() {
  return <Calendar aria-label="Appointment date" defaultValue={parseDate('2020-02-03')} />;
}
