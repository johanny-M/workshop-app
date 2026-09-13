import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import './CalendarWidget.css';

interface CalendarEvent {
  date: string; // YYYY-MM-DD format
  color: string;
}

interface CalendarWidgetProps {
  currentDate: Date;
  onMonthChange: (newDate: Date) => void;
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({ currentDate, onMonthChange }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([
    { date: '2026-04-15', color: '#10b981' },
    { date: '2026-04-20', color: '#f59e0b' },
    { date: '2026-04-25', color: '#3b82f6' },
  ]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Helper date logic
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    onMonthChange(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(new Date(year, month + 1, 1));
  };

  const activeDateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

  const handleDayClick = (dayParam: number) => {
    const clickedDate = new Date(year, month, dayParam);
    onMonthChange(clickedDate);
    // Simple prompt to add an event
    const addE = window.confirm(`Add an event on ${clickedDate.toDateString()}?`);
    if (addE) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayParam).padStart(2, '0')}`;
      setEvents(prev => [...prev, { date: dateStr, color: 'var(--success)' }]);
    }
  };

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // Generate grid numbers
  const calendarGrid = [];
  
  // Previous month padding
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarGrid.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
  }
  
  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarGrid.push({ day: i, isCurrentMonth: true });
  }

  // Next month padding (to fill rows)
  const remainingSlots = 42 - calendarGrid.length; // 6 rows of 7 days
  for (let i = 1; i <= remainingSlots; i++) {
    calendarGrid.push({ day: i, isCurrentMonth: false });
  }

  return (
    <div className="calendar-widget dashboard-card">
      <div className="calendar-header">
        <h2 className="calendar-title">{monthNames[month]} {year}</h2>
        <div className="calendar-nav">
          <button className="cal-nav-btn" onClick={handlePrevMonth}><ChevronLeft size={18} /></button>
          <button className="cal-nav-btn" onClick={handleNextMonth}><ChevronRight size={18} /></button>
        </div>
      </div>
      
      <div className="calendar-grid">
        {weekDays.map(day => (
          <div key={day} className="calendar-weekday">{day}</div>
        ))}
        
        {calendarGrid.map((slot, index) => {
          let dateStr = '';
          if (slot.isCurrentMonth) {
            dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(slot.day).padStart(2, '0')}`;
          }
          
          const isSelected = slot.isCurrentMonth && slot.day === currentDate.getDate();
          const dayEvents = events.filter(e => e.date === dateStr);

          // We only render click handler for current month
          return (
            <div 
              key={index} 
              className={`calendar-day ${slot.isCurrentMonth ? 'current-month' : 'other-month'} ${isSelected ? 'selected' : ''}`}
              onClick={() => slot.isCurrentMonth && handleDayClick(slot.day)}
            >
              <div className="day-number">{String(slot.day).padStart(2, '0')}</div>
              <div className="day-events">
                {dayEvents.length > 0 && (
                  <span className="event-count-badge bg-success text-white px-1.5 py-0.5 rounded-full text-[9px] font-bold">
                    {dayEvents.length}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarWidget;
