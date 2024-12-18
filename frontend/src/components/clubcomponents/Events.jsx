import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Card, Typography, Box, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';

const EventCalendar = ({EmailList, clubUniqueName}) => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([
    { date: '2024-12-16', title: 'Christmas Party', description: 'Celebrate with us', clubUniqueName: 'ClubA' },
    { date: '2024-12-25', title: 'Christmas Day', description: 'Merry Christmas!', clubUniqueName: 'ClubB' },
    { date: '2024-12-31', title: 'New Year\'s Eve', description: 'New Year Countdown!', clubUniqueName: 'ClubC' },
  ]);

  // Modal state
  const [open, setOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '' });
  const handleSendEmail = async () => {
    try {
      const response = await axios.post('http://localhost:http://localhost:3000/api/mail/sendMail', {
        emails: EmailList,      
        subject: subject,     
        message: message,    
        clubUnique: clubUniqueName 
      });
      console.log("Mail send to the server");
    } catch (error) {
      console.error("Error sending email:");
    }
  };
  // Handle date change
  const onDateChange = (newDate) => {
    setDate(newDate);
  };

  // Get events for the selected date
  const getEventsForDate = (selectedDate) => {
    const formattedDate = selectedDate.toISOString().split('T')[0];
    return events.filter(event => event.date === formattedDate && event.clubUniqueName === clubUniqueName);
  };

  // Render events for the selected date
  const renderEvents = (selectedDate) => {
    const eventsForSelectedDate = getEventsForDate(selectedDate);

    if (eventsForSelectedDate.length > 0) {
      return (
        <Box sx={{ mt: 2 }}>
          {eventsForSelectedDate.map((event, index) => (
            <Card key={index} sx={{ mb: 2, p: 2 }}>
              <Typography variant="h6">{event.title}</Typography>
              <Typography>{event.description}</Typography>
            </Card>
          ))}
        </Box>
      );
    } else {
      return <Typography>No events for this day</Typography>;
    }
  };

  // Handle modal open/close
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  // Add new event
  const handleAddEvent = () => {
    const formattedDate = date.toISOString().split('T')[0];
    const updatedEvents = [
      ...events,
      {
        date: formattedDate,
        title: newEvent.title,
        description: newEvent.description,
        clubUniqueName,
      }
    ];
    setEvents(updatedEvents);
    handleSendEmail();
    handleClose(); // Close modal after adding event
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Card sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          Event Calendar for {clubUniqueName}
        </Typography>

        {/* Calendar */}
        <Calendar onChange={onDateChange} value={date} />

        {/* Display events for the selected date */}
        {renderEvents(date)}

        {/* Button to open modal */}
        <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mt: 2 }}>
          Add Event
        </Button>

        {/* Modal for adding event */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Event Title"
              type="text"
              fullWidth
              value={newEvent.title}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="description"
              label="Event Description"
              type="text"
              fullWidth
              value={newEvent.description}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleAddEvent}>Add Event</Button>
          </DialogActions>
        </Dialog>
      </Card>
    </div>
  );
};

export default EventCalendar;
