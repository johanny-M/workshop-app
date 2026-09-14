import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, placeholder = "Select date", className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Parse initial date or use today
  const initialDate = value ? new Date(value) : new Date();
  const [currentMonth, setCurrentMonth] = useState(initialDate);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  // Adjust for Monday start (0 = Monday, 6 = Sunday for our grid)
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const today = new Date();
  today.setHours(0,0,0,0);
  
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCurrentMonth) {
      setCurrentMonth(new Date(year, month - 1, 1));
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleSelectDate = (day: number) => {
    // Format to YYYY-MM-DD
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(dateStr);
    setIsOpen(false);
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr || dateStr === 'TBD') return placeholder || 'Select date...';
    const [y, m, d] = dateStr.split('-');
    const dateObj = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
    return dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Input Field */}
      <button 
        type="button" 
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={className}
        style={className ? { display: 'flex', alignItems: 'center', justifyItems: 'space-between' } : {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          background: 'var(--bg-main)',
          color: value && value !== 'TBD' ? 'var(--text-main)' : 'var(--text-muted)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '0.5rem 0.75rem',
          width: '100%'
        }}
      >
        <span style={{ color: value ? 'inherit' : 'var(--text-muted)' }}>
          {formatDisplayDate(value)}
        </span>
        <Calendar size={18} style={{ color: 'var(--text-muted)' }} />
      </button>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div 
          style={{
            position: 'absolute',
            bottom: '100%',
            left: 0,
            marginBottom: '0.5rem',
            width: className ? '400px' : '280px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-lg)',
            padding: '1.25rem',
            zIndex: 1000,
            animation: 'fadeIn 0.15s ease-out'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={handlePrevMonth} 
              className={`p-1 rounded-md transition-colors ${isCurrentMonth ? 'opacity-30 cursor-not-allowed text-muted' : 'hover-bg-surface-hover text-muted'}`}
              disabled={isCurrentMonth}
            >
              <ChevronLeft size={className ? 24 : 16}/>
            </button>
            <h3 className="font-bold text-main" style={{ fontSize: className ? '1.25rem' : '0.875rem' }}>{monthNames[month]} {year}</h3>
            <button onClick={handleNextMonth} className="p-1 rounded-md hover-bg-surface-hover text-muted transition-colors">
              <ChevronRight size={className ? 24 : 16}/>
            </button>
          </div>
          
          {/* Days of Week */}
          <div className="grid gap-1 text-center font-semibold text-muted mb-2" style={{ gridTemplateColumns: 'repeat(7, 1fr)', fontSize: className ? '0.875rem' : '0.75rem' }}>
            <div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div><div>Su</div>
          </div>
          
          {/* Dates Grid */}
          <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`empty-${i}`} style={{ width: className ? '3rem' : '2rem', height: className ? '3rem' : '2rem' }} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const cellDate = new Date(year, month, day);
              const isPastDate = cellDate < today;
              
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isSelected = value === dateStr;
              
              let classes = `flex items-center justify-center mx-auto rounded-full transition-colors font-semibold `;
              if (isPastDate) {
                 classes += "opacity-30 cursor-not-allowed text-muted";
              } else if (isSelected) {
                 classes += "bg-success text-white shadow-sm cursor-pointer";
              } else {
                 classes += "hover-bg-surface-hover text-main cursor-pointer";
              }
              
              return (
                <div 
                  key={day} 
                  onMouseDown={(e) => { 
                    e.preventDefault();
                    e.stopPropagation();
                    if (!isPastDate) handleSelectDate(day); 
                  }}
                  className={classes}
                  style={{
                    width: className ? '3rem' : '2rem',
                    height: className ? '3rem' : '2rem',
                    fontSize: className ? '1.125rem' : '0.75rem'
                  }}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
