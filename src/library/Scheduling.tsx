import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

// Custom hook to position React Portals relative to their trigger elements
const useFloatingPosition = (triggerRef: React.RefObject<HTMLElement>, isOpen: boolean) => {
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    const updatePosition = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setCoords({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width
        });
      }
    };

    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, triggerRef]);

  return coords;
};

/* ==========================================================================
   📅 4. TIME, DATE & SCHEDULING
   ========================================================================== */

// --- 4.1 DATE PICKER ---
interface DatePickerProps {
  label?: string;
  selectedDate: Date | null;
  onChange: (d: Date) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ label, selectedDate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  const coords = useFloatingPosition(dropdownRef, isOpen);
  const leftPos = coords.left + 280 > window.innerWidth
    ? Math.max(10, coords.left + coords.width - 280)
    : coords.left;

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedTrigger = dropdownRef.current?.contains(target);
      const clickedPortal = portalRef.current?.contains(target);
      
      if (!clickedTrigger && !clickedPortal) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    return { firstDay, totalDays };
  };

  const { firstDay, totalDays } = getDaysInMonth(currentMonth);
  const days = Array(totalDays).fill(0).map((_, i) => i + 1);
  const padding = Array(firstDay).fill(null);

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const formattedDate = selectedDate ? selectedDate.toLocaleDateString() : 'Select date';

  return (
    <div className="input-group" ref={dropdownRef} style={{ position: 'relative' }}>
      {label && <label className="input-label">{label}</label>}
      <div 
        className="input-field-wrapper"
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer', paddingRight: '12px', display: 'flex', justifyContent: 'space-between' }}
      >
        <span className="input-field" style={{ display: 'flex', alignItems: 'center' }}>
          {formattedDate}
        </span>
        <CalendarIcon size={16} style={{ color: 'var(--ui-muted)' }} />
      </div>

      {isOpen && createPortal(
        <div 
          ref={portalRef}
          style={{
            position: 'absolute',
            top: `${coords.top + 6}px`,
            left: `${leftPos}px`,
            background: 'var(--ui-panel-pure)',
            border: '1px solid var(--ui-line)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            boxShadow: 'var(--ui-shadow-md)',
            zIndex: 9999,
            width: '280px'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <button type="button" onClick={prevMonth} style={{ background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--ui-text)' }}><ChevronLeft size={16} /></button>
            <span style={{ fontWeight: 700, fontSize: '14px' }}>
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button type="button" onClick={nextMonth} style={{ background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--ui-text)' }}><ChevronRight size={16} /></button>
          </div>

          {/* Week Labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--ui-muted)', marginBottom: '4px' }}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(w => <span key={w}>{w}</span>)}
          </div>

          {/* Calendar Grid */}
          <div className="calendar-grid">
            {padding.map((_, idx) => <div key={`pad-${idx}`} />)}
            {days.map(day => {
              const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
              const isSelected = selectedDate ? selectedDate.toDateString() === dateObj.toDateString() : false;
              const isToday = new Date().toDateString() === dateObj.toDateString();

              return (
                <div
                  key={day}
                  className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                  onClick={() => {
                    onChange(dateObj);
                    setIsOpen(false);
                  }}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

// --- 4.2 TIME PICKER ---
interface TimePickerProps {
  label?: string;
  value: string;
  onChange: (time: string) => void;
}

// Helper to check if a query string matches a suggestion in 12h or 24h format
const matchTime = (suggestion: string, query: string): boolean => {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  
  if (suggestion.toLowerCase().includes(q)) return true;
  
  // Try 24h matching (e.g. suggestion "01:30 PM" matches query "13" or "13:30")
  const parts = suggestion.match(/^(\d{2}):(\d{2})\s*(AM|PM)$/i);
  if (parts) {
    let hr = parseInt(parts[1], 10);
    const min = parts[2];
    const ampm = parts[3].toUpperCase();
    if (ampm === 'PM' && hr < 12) hr += 12;
    if (ampm === 'AM' && hr === 12) hr = 0;
    
    const time24h = `${hr.toString().padStart(2, '0')}:${min}`;
    const time24hShort = `${hr}:${min}`;
    const hrStr = hr.toString();
    
    if (time24h.includes(q) || time24hShort.includes(q) || hrStr === q) return true;
  }
  return false;
};

// Helper to parse arbitrary user-typed string into standard "HH:MM AM/PM" format
const parseCustomTime = (input: string): string | null => {
  const str = input.trim().toLowerCase();
  if (!str) return null;
  
  // Case 1: Match standard "HH:MM am/pm"
  const standardMatch = str.match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/i);
  if (standardMatch) {
    let hr = parseInt(standardMatch[1], 10);
    const min = parseInt(standardMatch[2], 10);
    const ampmInput = standardMatch[3];
    
    if (min < 0 || min > 59) return null;
    if (hr < 0 || hr > 23) return null;
    
    let ampm = 'AM';
    if (ampmInput) {
      ampm = ampmInput.toUpperCase();
    } else {
      if (hr >= 12) {
        ampm = 'PM';
        if (hr > 12) hr -= 12;
      } else if (hr === 0) {
        hr = 12;
        ampm = 'AM';
      }
    }
    return `${hr.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')} ${ampm}`;
  }
  
  // Case 2: Match raw numbers like "13" (meaning 13:00)
  const hourOnlyMatch = str.match(/^(\d{1,2})\s*(am|pm)?$/i);
  if (hourOnlyMatch) {
    let hr = parseInt(hourOnlyMatch[1], 10);
    const ampmInput = hourOnlyMatch[2];
    
    if (hr < 0 || hr > 23) return null;
    
    let ampm = 'AM';
    if (ampmInput) {
      ampm = ampmInput.toUpperCase();
    } else {
      if (hr >= 12) {
        ampm = 'PM';
        if (hr > 12) hr -= 12;
      } else if (hr === 0) {
        hr = 12;
        ampm = 'AM';
      }
    }
    return `${hr.toString().padStart(2, '0')}:00 ${ampm}`;
  }
  
  // Case 3: Match raw 3 or 4 digits like "1330" (meaning 13:30)
  const digitsMatch = str.match(/^(\d{3,4})$/);
  if (digitsMatch) {
    const digits = digitsMatch[1];
    const hrPart = digits.length === 3 ? digits.slice(0, 1) : digits.slice(0, 2);
    const minPart = digits.length === 3 ? digits.slice(1) : digits.slice(2);
    
    let hr = parseInt(hrPart, 10);
    const min = parseInt(minPart, 10);
    
    if (min < 0 || min > 59) return null;
    if (hr < 0 || hr > 23) return null;
    
    let ampm = 'AM';
    if (hr >= 12) {
      ampm = 'PM';
      if (hr > 12) hr -= 12;
    } else if (hr === 0) {
      hr = 12;
      ampm = 'AM';
    }
    return `${hr.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')} ${ampm}`;
  }
  return null;
};

// Helper to generate dynamic AM/PM options when a user types a custom "HH:MM" time
const getCustomSuggestions = (query: string): string[] => {
  const str = query.trim().toLowerCase();
  if (!str) return [];

  // Match:
  // - "H:MM" or "HH:MM" (exact minutes) -> e.g. "9:15"
  // - "H:M" or "HH:M" (partial minutes) -> e.g. "9:1" or "09:1"
  // - "H:" or "HH:" (empty minutes) -> e.g. "9:" or "09:"
  const timeMatch = str.match(/^(\d{1,2}):(\d{0,2})\s*(a|p|am|pm)?$/i);
  if (timeMatch) {
    const hr = parseInt(timeMatch[1], 10);
    const minPart = timeMatch[2];
    const ampmInput = timeMatch[3];
    
    if (hr < 0 || hr > 23) return [];
    
    // Check if the user specified AM or PM
    let forceAM = false;
    let forcePM = false;
    if (ampmInput) {
      if (ampmInput.startsWith('a')) forceAM = true;
      if (ampmInput.startsWith('p')) forcePM = true;
    }
    
    // Generate minutes to suggest
    let minutes: number[] = [];
    if (minPart.length === 2) {
      const m = parseInt(minPart, 10);
      if (m >= 0 && m <= 59) {
        minutes = [m];
      }
    } else if (minPart.length === 1) {
      const firstDigit = parseInt(minPart, 10);
      if (firstDigit >= 0 && firstDigit <= 5) {
        for (let i = 0; i <= 9; i++) {
          minutes.push(firstDigit * 10 + i);
        }
      }
    } else {
      minutes = [0, 30];
    }
    
    const suggestions: string[] = [];
    
    minutes.forEach(m => {
      const minStr = m.toString().padStart(2, '0');
      
      if (hr === 0) {
        if (!forcePM) suggestions.push(`12:${minStr} AM`);
        if (!forceAM) suggestions.push(`12:${minStr} PM`);
      } else if (hr < 12) {
        const hrStr = hr.toString().padStart(2, '0');
        if (forceAM) {
          suggestions.push(`${hrStr}:${minStr} AM`);
        } else if (forcePM) {
          suggestions.push(`${hrStr}:${minStr} PM`);
        } else {
          suggestions.push(`${hrStr}:${minStr} AM`);
          suggestions.push(`${hrStr}:${minStr} PM`);
        }
      } else {
        const displayHr = hr === 12 ? 12 : hr - 12;
        const hrStr = displayHr.toString().padStart(2, '0');
        if (!forceAM) {
          suggestions.push(`${hrStr}:${minStr} PM`);
        }
      }
    });
    
    return suggestions;
  }
  
  // Also match raw digits like "131" (meaning 13:10-19) or "1315"
  const digitsMatch = str.match(/^(\d{3,4})\s*(a|p|am|pm)?$/i);
  if (digitsMatch) {
    const digits = digitsMatch[1];
    const ampmInput = digitsMatch[2];
    
    let forceAM = false;
    let forcePM = false;
    if (ampmInput) {
      if (ampmInput.startsWith('a')) forceAM = true;
      if (ampmInput.startsWith('p')) forcePM = true;
    }
    
    const hrPart = digits.length === 3 ? digits.slice(0, 1) : digits.slice(0, 2);
    const minPart = digits.length === 3 ? digits.slice(1) : digits.slice(2);
    
    const hr = parseInt(hrPart, 10);
    if (hr < 0 || hr > 23) return [];
    
    let minutes: number[] = [];
    if (minPart.length === 2) {
      const m = parseInt(minPart, 10);
      if (m >= 0 && m <= 59) {
        minutes = [m];
      }
    } else if (minPart.length === 1) {
      const firstDigit = parseInt(minPart, 10);
      if (firstDigit >= 0 && firstDigit <= 5) {
        for (let i = 0; i <= 9; i++) {
          minutes.push(firstDigit * 10 + i);
        }
      }
    }
    
    const suggestions: string[] = [];
    
    minutes.forEach(m => {
      const minStr = m.toString().padStart(2, '0');
      
      if (hr === 0) {
        if (!forcePM) suggestions.push(`12:${minStr} AM`);
        if (!forceAM) suggestions.push(`12:${minStr} PM`);
      } else if (hr < 12) {
        const hrStr = hr.toString().padStart(2, '0');
        if (forceAM) {
          suggestions.push(`${hrStr}:${minStr} AM`);
        } else if (forcePM) {
          suggestions.push(`${hrStr}:${minStr} PM`);
        } else {
          suggestions.push(`${hrStr}:${minStr} AM`);
          suggestions.push(`${hrStr}:${minStr} PM`);
        }
      } else {
        const displayHr = hr === 12 ? 12 : hr - 12;
        const hrStr = displayHr.toString().padStart(2, '0');
        if (!forceAM) {
          suggestions.push(`${hrStr}:${minStr} PM`);
        }
      }
    });
    
    return suggestions;
  }
  
  return [];
};

export const TimePicker: React.FC<TimePickerProps> = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  const coords = useFloatingPosition(dropdownRef, isOpen);
  
  const intervals = Array(24).fill(0).flatMap((_, hr) => {
    const formattedHr = hr === 0 ? 12 : hr > 12 ? hr - 12 : hr;
    const ampm = hr >= 12 ? 'PM' : 'AM';
    return [
      `${formattedHr.toString().padStart(2, '0')}:00 ${ampm}`,
      `${formattedHr.toString().padStart(2, '0')}:30 ${ampm}`
    ];
  });

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedTrigger = dropdownRef.current?.contains(target);
      const clickedPortal = portalRef.current?.contains(target);
      
      if (!clickedTrigger && !clickedPortal) {
        setIsOpen(false);
        commitInput();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [inputValue, value]);

  const commitInput = () => {
    if (!inputValue) {
      onChange('');
      return;
    }
    const parsed = parseCustomTime(inputValue);
    if (parsed) {
      onChange(parsed);
      setInputValue(parsed);
    } else {
      setInputValue(value);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      commitInput();
      setIsOpen(false);
    } else if (e.key === 'Escape') {
      setInputValue(value);
      setIsOpen(false);
    }
  };

  const isEditing = inputValue !== value && inputValue !== '';
  let filtered = intervals;
  if (isEditing) {
    filtered = intervals.filter(t => matchTime(t, inputValue));
    const customSugs = getCustomSuggestions(inputValue);
    if (customSugs.length > 0) {
      filtered = [...new Set([...customSugs, ...filtered])];
    }
  } else {
    if (value && !intervals.includes(value)) {
      filtered = [value, ...intervals];
    }
  }

  return (
    <div className="input-group" ref={dropdownRef} style={{ position: 'relative' }}>
      {label && <label className="input-label">{label}</label>}
      <div 
        className="input-field-wrapper"
        style={{ paddingRight: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <input 
          type="text"
          className="input-field" 
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. 13:30 or 1pm"
          style={{ width: '100%', border: 0, outline: 0, background: 'transparent' }}
        />
        <Clock size={16} style={{ color: 'var(--ui-muted)', cursor: 'pointer' }} onClick={() => setIsOpen(!isOpen)} />
      </div>

      {isOpen && createPortal(
        <div 
          ref={portalRef}
          style={{
            position: 'absolute',
            top: `${coords.top + 6}px`,
            left: `${coords.left}px`,
            width: `${coords.width}px`,
            background: 'var(--ui-panel-pure)',
            border: '1px solid var(--ui-line)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--ui-shadow-md)',
            zIndex: 9999,
            maxHeight: '180px',
            overflowY: 'auto',
            padding: '4px 0'
          }}
        >
          {filtered.length === 0 ? (
            <div style={{ padding: '10px 14px', fontSize: '13px', color: 'var(--ui-muted)', textAlign: 'center' }}>
              No matching suggestions
            </div>
          ) : (
            filtered.map((t) => (
              <div
                key={t}
                onClick={() => { onChange(t); setInputValue(t); setIsOpen(false); }}
                style={{
                  padding: '10px 14px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--ui-text)',
                  cursor: 'pointer',
                  background: value === t ? 'var(--ui-primary-soft)' : 'transparent'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--ui-bg-2)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = value === t ? 'var(--ui-primary-soft)' : 'transparent'}
              >
                {t}
              </div>
            ))
          )}
        </div>,
        document.body
      )}
    </div>
  );
};

// --- 4.3 GOOGLE-STYLE TWIN CALENDAR DATE RANGE PICKER ---
interface TwinCalendarProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date | null, end: Date | null) => void;
}

export const GoogleTwinCalendar: React.FC<TwinCalendarProps> = ({ startDate, endDate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [leftMonth, setLeftMonth] = useState(new Date());
  const [rightMonth, setRightMonth] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d;
  });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  const coords = useFloatingPosition(dropdownRef, isOpen);
  const leftPos = coords.left + 740 > window.innerWidth
    ? Math.max(10, coords.left + coords.width - 740)
    : coords.left;

  useEffect(() => {
    if (isOpen) {
      if (startDate) {
        setLeftMonth(new Date(startDate.getFullYear(), startDate.getMonth(), 1));
      } else {
        setLeftMonth(new Date());
      }
      
      if (endDate) {
        setRightMonth(new Date(endDate.getFullYear(), endDate.getMonth(), 1));
      } else if (startDate) {
        setRightMonth(new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1));
      } else {
        const d = new Date();
        d.setMonth(d.getMonth() + 1);
        setRightMonth(d);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedTrigger = dropdownRef.current?.contains(target);
      const clickedPortal = portalRef.current?.contains(target);
      
      if (!clickedTrigger && !clickedPortal) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    return { firstDay, totalDays };
  };

  const handleDayClick = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      onChange(date, null);
    } else if (startDate && !endDate) {
      if (date < startDate) {
        onChange(date, null);
      } else {
        onChange(startDate, date);
      }
    }
  };

  const getRangeState = (dayDate: Date) => {
    if (!startDate) return '';
    if (dayDate.toDateString() === startDate.toDateString()) {
      return endDate ? 'range-start' : 'selected';
    }
    if (endDate && dayDate.toDateString() === endDate.toDateString()) {
      return 'range-end';
    }
    if (endDate && dayDate > startDate && dayDate < endDate) {
      return 'in-range';
    }
    if (!endDate && hoverDate && dayDate > startDate && dayDate <= hoverDate) {
      return 'in-range';
    }
    return '';
  };

  const renderMonth = (monthDate: Date, onPrev: () => void, onNext: () => void) => {
    const { firstDay, totalDays } = getDaysInMonth(monthDate);
    const padding = Array(firstDay).fill(null);
    const days = Array(totalDays).fill(0).map((_, i) => i + 1);

    return (
      <div style={{ flex: 1, padding: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <button 
            type="button" 
            onClick={onPrev} 
            style={{ background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--ui-text)', display: 'flex', alignItems: 'center', padding: '4px' }}
          >
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontWeight: 700, fontSize: '14px' }}>
            {monthDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button 
            type="button" 
            onClick={onNext} 
            style={{ background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--ui-text)', display: 'flex', alignItems: 'center', padding: '4px' }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--ui-muted)', marginBottom: '8px' }}>
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(w => <span key={w}>{w}</span>)}
        </div>
        <div className="calendar-grid">
          {padding.map((_, idx) => <div key={`pad-${idx}`} />)}
          {days.map(day => {
            const dayDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
            const rangeClass = getRangeState(dayDate);
            const isToday = new Date().toDateString() === dayDate.toDateString();

            return (
              <div
                key={day}
                className={`calendar-day ${rangeClass} ${isToday ? 'today' : ''}`}
                onClick={() => handleDayClick(dayDate)}
                onMouseEnter={() => !endDate && setHoverDate(dayDate)}
                onMouseLeave={() => setHoverDate(null)}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const formattedLabel = startDate 
    ? `${startDate.toLocaleDateString()} - ${endDate ? endDate.toLocaleDateString() : 'Choosing...'}` 
    : 'Select date range';

  const quickRanges = [
    { label: 'Today', days: 0 },
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 30 Days', days: 30 },
    { label: 'This Year (YTD)', days: 'ytd' }
  ];

  const applyQuickRange = (range: any) => {
    const today = new Date();
    if (range.days === 0) {
      onChange(today, today);
    } else if (range.days === 'ytd') {
      onChange(new Date(today.getFullYear(), 0, 1), today);
    } else {
      const past = new Date();
      past.setDate(today.getDate() - range.days);
      onChange(past, today);
    }
    setIsOpen(false);
  };

  return (
    <div className="input-group" ref={dropdownRef} style={{ position: 'relative' }}>
      <label className="input-label">Date Range</label>
      <div 
        className="input-field-wrapper"
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer', paddingRight: '12px', display: 'flex', justifyContent: 'space-between' }}
      >
        <span className="input-field" style={{ display: 'flex', alignItems: 'center' }}>
          {formattedLabel}
        </span>
        <CalendarIcon size={16} style={{ color: 'var(--ui-muted)' }} />
      </div>

      {isOpen && createPortal(
        <div 
          ref={portalRef}
          style={{
            position: 'absolute',
            top: `${coords.top + 6}px`,
            left: `${leftPos}px`,
            background: 'var(--ui-panel-pure)',
            border: '1px solid var(--ui-line)',
            borderRadius: 'var(--radius-xl)',
            padding: '16px',
            boxShadow: 'var(--ui-shadow-lg)',
            zIndex: 9999,
            display: 'flex',
            width: '740px'
          }}
        >
          {/* Quick links sidebar */}
          <div style={{ width: '160px', borderRight: '1px solid var(--ui-line)', paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h5 style={{ fontSize: '11px', color: 'var(--ui-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Quick Select</h5>
            {quickRanges.map((r, idx) => (
              <button
                key={idx}
                onClick={() => applyQuickRange(r)}
                style={{
                  background: 'transparent',
                  border: 0,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--ui-text)',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--ui-primary-soft)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Calenders Container */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingLeft: '16px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              {renderMonth(
                leftMonth,
                () => setLeftMonth(new Date(leftMonth.getFullYear(), leftMonth.getMonth() - 1, 1)),
                () => setLeftMonth(new Date(leftMonth.getFullYear(), leftMonth.getMonth() + 1, 1))
              )}
              {renderMonth(
                rightMonth,
                () => setRightMonth(new Date(rightMonth.getFullYear(), rightMonth.getMonth() - 1, 1)),
                () => setRightMonth(new Date(rightMonth.getFullYear(), rightMonth.getMonth() + 1, 1))
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px', borderTop: '1px solid var(--ui-line)', paddingTop: '16px' }}>
              <button className="btn outline" onClick={() => { onChange(null, null); setIsOpen(false); }}>Clear</button>
              <button className="btn primary" onClick={() => setIsOpen(false)}>Apply</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

// --- 4.4 DUAL DATETIME PICKER (Combo Suite) ---
interface DateTimePickerProps {
  label?: string;
  value: Date | null;
  onChange: (d: Date | null) => void;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [timeQuery, setTimeQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  const coords = useFloatingPosition(dropdownRef, isOpen);
  const leftPos = coords.left + 520 > window.innerWidth
    ? Math.max(10, coords.left + coords.width - 520)
    : coords.left;

  const getActiveTimeStr = (d: Date | null): string => {
    if (!d) return '';
    let hr = d.getHours();
    const min = d.getMinutes();
    const ampm = hr >= 12 ? 'PM' : 'AM';
    if (hr > 12) hr -= 12;
    if (hr === 0) hr = 12;
    return `${hr.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')} ${ampm}`;
  };

  useEffect(() => {
    if (value) {
      setCurrentMonth(new Date(value.getFullYear(), value.getMonth(), 1));
      setTimeQuery(getActiveTimeStr(value));
    }
  }, [value]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedTrigger = dropdownRef.current?.contains(target);
      const clickedPortal = portalRef.current?.contains(target);
      
      if (!clickedTrigger && !clickedPortal) {
        setIsOpen(false);
        commitTimeInput();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [timeQuery, value]);

  useEffect(() => {
    if (!isOpen && timeQuery) {
      const parsed = parseCustomTime(timeQuery);
      if (parsed) {
        handleTimeSelect(parsed);
      } else {
        setTimeQuery(getActiveTimeStr(value));
      }
    }
  }, [isOpen]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    return { firstDay, totalDays };
  };

  const { firstDay, totalDays } = getDaysInMonth(currentMonth);
  const days = Array(totalDays).fill(0).map((_, i) => i + 1);
  const padding = Array(firstDay).fill(null);

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const timeOptions = Array(24).fill(0).flatMap((_, hr) => {
    const formattedHr = hr === 0 ? 12 : hr > 12 ? hr - 12 : hr;
    const ampm = hr >= 12 ? 'PM' : 'AM';
    return [
      `${formattedHr.toString().padStart(2, '0')}:00 ${ampm}`,
      `${formattedHr.toString().padStart(2, '0')}:30 ${ampm}`
    ];
  });

  const getHoursAndMinutesFromQuery = (query: string, fallbackDate: Date): { hrs: number, mins: number } => {
    const parsed = parseCustomTime(query);
    if (parsed) {
      const parts = parsed.match(/^(\d{2}):(\d{2})\s*(AM|PM)$/i);
      if (parts) {
        let hr = parseInt(parts[1], 10);
        const min = parseInt(parts[2], 10);
        const ampm = parts[3].toUpperCase();
        if (ampm === 'PM' && hr < 12) hr += 12;
        if (ampm === 'AM' && hr === 12) hr = 0;
        return { hrs: hr, mins: min };
      }
    }
    return { hrs: fallbackDate.getHours(), mins: fallbackDate.getMinutes() };
  };

  const handleDateSelect = (dayDate: Date) => {
    const currentVal = value ? new Date(value) : new Date();
    const { hrs, mins } = getHoursAndMinutesFromQuery(timeQuery, currentVal);
    const newDate = new Date(
      dayDate.getFullYear(),
      dayDate.getMonth(),
      dayDate.getDate(),
      hrs,
      mins,
      0
    );
    onChange(newDate);
  };

  const handleTimeSelect = (timeStr: string) => {
    const currentVal = value ? new Date(value) : new Date();
    const parts = timeStr.match(/^(\d{2}):(\d{2})\s*(AM|PM)$/i);
    if (parts) {
      let hr = parseInt(parts[1], 10);
      const min = parseInt(parts[2], 10);
      const ampm = parts[3].toUpperCase();
      if (ampm === 'PM' && hr < 12) hr += 12;
      if (ampm === 'AM' && hr === 12) hr = 0;
      
      const newDate = new Date(
        currentVal.getFullYear(),
        currentVal.getMonth(),
        currentVal.getDate(),
        hr,
        min,
        0
      );
      onChange(newDate);
      setTimeQuery(timeStr);
    }
  };

  const commitTimeInput = () => {
    if (!timeQuery) {
      setTimeQuery(getActiveTimeStr(value));
      return;
    }
    const parsed = parseCustomTime(timeQuery);
    if (parsed) {
      handleTimeSelect(parsed);
      setTimeQuery(parsed);
    } else {
      setTimeQuery(getActiveTimeStr(value));
    }
  };

  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeQuery(e.target.value);
  };

  const handleTimeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      commitTimeInput();
      setIsOpen(false);
    } else if (e.key === 'Escape') {
      setTimeQuery(getActiveTimeStr(value));
      setIsOpen(false);
    }
  };

  const activeTime = getActiveTimeStr(value);

  const isEditing = timeQuery !== activeTime && timeQuery !== '';
  let filteredTimes = timeOptions;
  if (isEditing) {
    filteredTimes = timeOptions.filter(t => matchTime(t, timeQuery));
    const customSugs = getCustomSuggestions(timeQuery);
    if (customSugs.length > 0) {
      filteredTimes = [...new Set([...customSugs, ...filteredTimes])];
    }
  } else {
    if (activeTime && !timeOptions.includes(activeTime)) {
      filteredTimes = [activeTime, ...timeOptions];
    }
  }

  const formattedDateTime = value 
    ? `${value.toLocaleDateString()} ${value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
    : 'Select date & time';

  return (
    <div className="input-group" ref={dropdownRef} style={{ position: 'relative' }}>
      {label && <label className="input-label">{label}</label>}
      <div 
        className="input-field-wrapper"
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer', paddingRight: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <span className="input-field" style={{ display: 'flex', alignItems: 'center' }}>
          {formattedDateTime}
        </span>
        <Clock size={16} style={{ color: 'var(--ui-muted)' }} />
      </div>

      {isOpen && createPortal(
        <div 
          ref={portalRef}
          style={{
            position: 'absolute',
            top: `${coords.top + 6}px`,
            left: `${leftPos}px`,
            background: 'var(--ui-panel-pure)',
            border: '1px solid var(--ui-line)',
            borderRadius: 'var(--radius-xl)',
            padding: '20px',
            boxShadow: 'var(--ui-shadow-lg)',
            zIndex: 9999,
            display: 'flex',
            gap: '20px',
            width: '520px'
          }}
        >
          {/* 📅 LEFT: Date Calendar Picker */}
          <div style={{ flex: 1, borderRight: '1px solid var(--ui-line)', paddingRight: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <button type="button" onClick={prevMonth} style={{ background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--ui-text)' }}><ChevronLeft size={16} /></button>
              <span style={{ fontWeight: 700, fontSize: '13px' }}>
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <button type="button" onClick={nextMonth} style={{ background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--ui-text)' }}><ChevronRight size={16} /></button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '10px', fontWeight: 700, color: 'var(--ui-muted)', marginBottom: '6px' }}>
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(w => <span key={w}>{w}</span>)}
            </div>

            <div className="calendar-grid">
              {padding.map((_, idx) => <div key={`pad-${idx}`} />)}
              {days.map(day => {
                const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                const isSelected = value ? value.toDateString() === dateObj.toDateString() : false;
                const isToday = new Date().toDateString() === dateObj.toDateString();

                return (
                  <div
                    key={day}
                    className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                    onClick={() => handleDateSelect(dateObj)}
                    style={{ width: '30px', height: '30px', fontSize: '12px' }}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 🕒 RIGHT: Time Picker list (Typeable & Autocomplete Search) */}
          <div style={{ width: '180px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h5 style={{ fontSize: '11px', color: 'var(--ui-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, textAlign: 'center' }}>Select Time</h5>
            
            <div style={{ border: '1px solid var(--ui-line)', borderRadius: '8px', padding: '4px 8px', background: 'var(--ui-bg)' }}>
              <input
                type="text"
                value={timeQuery}
                onChange={handleTimeInputChange}
                onKeyDown={handleTimeKeyDown}
                placeholder="e.g. 13:30 or 1pm"
                style={{ width: '100%', border: 0, outline: 0, background: 'transparent', fontSize: '12px', color: 'var(--ui-text)' }}
              />
            </div>

            <div style={{ flex: 1, maxHeight: '160px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px', paddingRight: '4px' }}>
              {filteredTimes.length === 0 ? (
                <div style={{ padding: '10px 14px', fontSize: '11px', color: 'var(--ui-muted)', textAlign: 'center' }}>
                  No matches
                </div>
              ) : (
                filteredTimes.map((t) => {
                  const isSelected = activeTime === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleTimeSelect(t)}
                      style={{
                        width: '100%',
                        background: isSelected ? 'var(--ui-primary-soft)' : 'transparent',
                        color: isSelected ? 'var(--ui-primary-deep)' : 'var(--ui-text)',
                        border: 0,
                        padding: '8px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => !isSelected && (e.currentTarget.style.backgroundColor = 'var(--ui-bg-2)')}
                      onMouseLeave={(e) => !isSelected && (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {t}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
