import React from 'react';
import { Calendar as ReactCalendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export function Calendar() {
  const [date, setDate] = React.useState(new Date());

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
    // Logic to fetch tasks for the selected date can be added here
  };

  return (
    <div className="calendar">
      <h1 className="text-2xl font-bold">Calendar</h1>
      <ReactCalendar onChange={handleDateChange} value={date} />
      <p>This is the calendar page where you can manage your tasks by date.</p>
      {/* Additional functionality for managing tasks can be added here */}
    </div>
  );
}
