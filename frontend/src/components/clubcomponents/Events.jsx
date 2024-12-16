import React, { useState } from 'react';
import Calendar from 'react-calendar';  // Import react-calendar
import 'react-calendar/dist/Calendar.css'; // Styles for the calendar
import { Card, Typography, Box } from '@mui/material';  // Import MUI components for styling

const EventCalendar = () => {
  // Initial state for selected date and events
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([
    { date: '2024-12-16', title: 'Christmas Party' },
    { date: '2024-12-25', title: 'Christmas Day' },
    { date: '2024-12-31', title: 'New Year\'s Eve' },
  ]);

  // Handle date change
  const onDateChange = (newDate) => {
    setDate(newDate);
  };

  // Get events for the selected date
  const getEventsForDate = (selectedDate) => {
    const formattedDate = selectedDate.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
    return events.filter(event => event.date === formattedDate);
  };

  // Render events for selected date
  const renderEvents = (selectedDate) => {
    const eventsForSelectedDate = getEventsForDate(selectedDate);

    if (eventsForSelectedDate.length > 0) {
      return (
        <Box sx={{ mt: 2 }}>
          {eventsForSelectedDate.map((event, index) => (
            <Card key={index} sx={{ mb: 2, p: 2 }}>
              <Typography variant="h6">{event.title}</Typography>
            </Card>
          ))}
        </Box>
      );
    } else {
      return <Typography>No events for this day</Typography>;
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Card sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          Event Calendar
        </Typography>
        
        {/* Calendar */}
        <Calendar
          onChange={onDateChange}
          value={date}
        />
        
        {/* Display events for the selected date */}
        {renderEvents(date)}
      </Card>
    </div>
  );
};

export default EventCalendar;
