import React, { useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { FiCalendar, FiPlus } from 'react-icons/fi';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import CropCalendarModal from './CropCalendarModal';

const CropCalendar = () => {
  const { crops, addNotification } = useContext(AppContext);
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Convert crops to calendar events
  useEffect(() => {
    const cropEvents = crops.map(crop => ({
      id: crop.id,
      title: `${crop.name} (${crop.season})`,
      start: new Date(),
      end: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      color: getEventColor(crop.season),
      extendedProps: {
        fertilizer: crop.fertilizer,
        yield: crop.yield,
        area: crop.area
      }
    }));
    setEvents(cropEvents);
  }, [crops]);

  const getEventColor = (season) => {
    switch (season.toLowerCase()) {
      case 'kharif': return '#3b82f6'; // blue
      case 'rabi': return '#10b981'; // green
      case 'zaid': return '#f59e0b'; // amber
      default: return '#8b5cf6'; // purple
    }
  };

  const handleDateClick = (arg) => {
    setSelectedDate(arg.date);
    setIsModalOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    alert(`Crop Details:\n\nFertilizer: ${clickInfo.event.extendedProps.fertilizer}\nYield: ${clickInfo.event.extendedProps.yield} tons\nArea: ${clickInfo.event.extendedProps.area} acres`);
  };

  const handleAddEvent = (eventData) => {
    const newEvent = {
      id: Date.now(),
      title: eventData.title,
      start: selectedDate,
      end: new Date(new Date(selectedDate).setDate(selectedDate.getDate() + parseInt(eventData.duration))),
      color: getEventColor(eventData.season),
      extendedProps: {
        fertilizer: eventData.fertilizer,
        yield: eventData.yield,
        area: eventData.area
      }
    };
    setEvents([...events, newEvent]);
    addNotification('Calendar event added successfully', 'success');
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
          <FiCalendar className="mr-2" /> Crop Calendar
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          <FiPlus className="mr-2" /> Add Event
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          height="70vh"
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          editable={true}
          selectable={true}
          eventDisplay="block"
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false
          }}
        />
      </div>

      <CropCalendarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddEvent}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default CropCalendar;