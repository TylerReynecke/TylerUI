import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Star, ChevronRight, ChevronLeft } from 'lucide-react';

/* ==========================================================================
   ☑️ 3. SELECTION & BOOLEAN LOGIC
   ========================================================================== */

// --- 3.1 CHECKBOX ---
interface CheckboxProps {
  label: string;
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  indeterminate = false,
  onChange,
  disabled = false
}) => {
  return (
    <label 
      className="checkbox-label" 
      onClick={() => { if (!disabled) onChange(!checked); }}
      style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      <div className={`checkbox-box ${checked ? 'checked' : ''} ${indeterminate ? 'indeterminate' : ''}`}>
        {checked && !indeterminate && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        )}
        {indeterminate && (
          <div style={{ width: '8px', height: '2px', backgroundColor: '#ffffff' }} />
        )}
      </div>
      <span>{label}</span>
    </label>
  );
};

// --- 3.2 RADIO BUTTON ---
interface RadioProps {
  label: string;
  value: string;
  selectedValue: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export const RadioButton: React.FC<RadioProps> = ({
  label,
  value,
  selectedValue,
  onChange,
  disabled = false
}) => {
  const isSelected = selectedValue === value;
  return (
    <label 
      className="checkbox-label" 
      onClick={() => { if (!disabled) onChange(value); }}
      style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      <div 
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '99px',
          border: isSelected ? '2px solid var(--ui-primary)' : '1px solid var(--ui-line)',
          background: 'var(--ui-panel-strong)',
          display: 'grid',
          placeItems: 'center',
          transition: 'all 0.2s'
        }}
      >
        {isSelected && (
          <div style={{ width: '10px', height: '10px', borderRadius: '99px', background: 'var(--ui-primary)' }} />
        )}
      </div>
      <span>{label}</span>
    </label>
  );
};

// --- 3.3 TOGGLE / SWITCH ---
interface ToggleProps {
  label?: string;
  active: boolean;
  onChange: (active: boolean) => void;
  sunMoonIcons?: boolean;
}

export const ToggleSwitch: React.FC<ToggleProps> = ({ label, active, onChange, sunMoonIcons = false }) => {
  return (
    <label className="switch-label">
      <div className={`switch-track ${active ? 'active' : ''}`} onClick={() => onChange(!active)}>
        <div className="switch-thumb" style={{ display: 'grid', placeItems: 'center', fontSize: '10px' }}>
          {sunMoonIcons && (active ? '🌙' : '☀️')}
        </div>
      </div>
      {label && <span style={{ fontSize: '14px', fontWeight: 600 }}>{label}</span>}
    </label>
  );
};

// --- 3.4 INTERACTIVE CARD SELECTOR ---
interface CardSelectorProps {
  title: string;
  description: string;
  icon?: string;
  active: boolean;
  onClick: () => void;
}

export const CardSelector: React.FC<CardSelectorProps> = ({ title, description, active, onClick }) => {
  return (
    <div className={`selector-card ${active ? 'active' : ''}`} onClick={onClick}>
      <h4 style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px', color: 'var(--ui-text)' }}>{title}</h4>
      <p style={{ fontSize: '12px', color: 'var(--ui-muted)', margin: 0 }}>{description}</p>
    </div>
  );
};

// --- 3.5 STANDARD DROPDOWN SELECT ---
interface SelectProps {
  label?: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
}

export const DropdownSelect: React.FC<SelectProps> = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedLabel = options.find(o => o.value === value)?.label || 'Select option';

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="input-group" ref={dropdownRef} style={{ position: 'relative' }}>
      {label && <label className="input-label">{label}</label>}
      <div 
        className={`input-field-wrapper ${isOpen ? 'focused' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', paddingRight: '12px' }}
      >
        <span className="input-field" style={{ display: 'flex', alignItems: 'center' }}>
          {selectedLabel}
        </span>
        <ChevronDown size={16} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: 'var(--ui-muted)' }} />
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '105%',
          left: 0,
          right: 0,
          background: 'var(--ui-panel-pure)',
          border: '1px solid var(--ui-line)',
          boxShadow: 'var(--ui-shadow-md)',
          borderRadius: 'var(--radius-sm)',
          zIndex: 1000,
          maxHeight: '200px',
          overflowY: 'auto',
          padding: '4px 0'
        }}>
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              style={{
                padding: '10px 14px',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--ui-text)',
                cursor: 'pointer',
                background: value === opt.value ? 'var(--ui-primary-soft)' : 'transparent'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--ui-bg-2)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = value === opt.value ? 'var(--ui-primary-soft)' : 'transparent'}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- 3.6 SEARCHABLE SELECT ---
export const SearchableSelect: React.FC<SelectProps> = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find(o => o.value === value)?.label || 'Select option';
  const filtered = options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="input-group" ref={dropdownRef} style={{ position: 'relative' }}>
      {label && <label className="input-label">{label}</label>}
      <div 
        className={`input-field-wrapper ${isOpen ? 'focused' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', paddingRight: '12px' }}
      >
        <span className="input-field" style={{ display: 'flex', alignItems: 'center' }}>{selectedLabel}</span>
        <ChevronDown size={16} style={{ color: 'var(--ui-muted)' }} />
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '105%',
          left: 0,
          right: 0,
          background: 'var(--ui-panel-pure)',
          border: '1px solid var(--ui-line)',
          boxShadow: 'var(--ui-shadow-md)',
          borderRadius: 'var(--radius-sm)',
          zIndex: 1000,
          padding: '8px',
          width: '100%'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--ui-line)', borderRadius: '8px', padding: '4px 8px', marginBottom: '8px', background: 'var(--ui-bg)' }}>
            <Search size={14} style={{ color: 'var(--ui-muted)', marginRight: '6px' }} />
            <input
              style={{ border: 0, outline: 0, background: 'transparent', width: '100%', fontSize: '12px', color: 'var(--ui-text)' }}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search..."
              onClick={e => e.stopPropagation()}
            />
          </div>
          <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '8px', color: 'var(--ui-muted)', fontSize: '12px', textAlign: 'center' }}>No results found</div>
            ) : (
              filtered.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setIsOpen(false); setQuery(''); }}
                  style={{
                    padding: '8px 10px',
                    fontSize: '13px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    background: value === opt.value ? 'var(--ui-primary-soft)' : 'transparent',
                    color: 'var(--ui-text)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--ui-bg-2)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = value === opt.value ? 'var(--ui-primary-soft)' : 'transparent'}
                >
                  {opt.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// --- 3.7 TRANSFER LIST (Shuttle Box) ---
interface ShuttleProps {
  available: string[];
  selected: string[];
  onChange: (avail: string[], sel: string[]) => void;
}

export const ShuttleBox: React.FC<ShuttleProps> = ({ available, selected, onChange }) => {
  const [activeAvail, setActiveAvail] = useState<string[]>([]);
  const [activeSel, setActiveSel] = useState<string[]>([]);

  const transferToSelected = () => {
    if (activeAvail.length === 0) return;
    const newSel = [...selected, ...activeAvail];
    const newAvail = available.filter(a => !activeAvail.includes(a));
    onChange(newAvail, newSel);
    setActiveAvail([]);
  };

  const transferToAvailable = () => {
    if (activeSel.length === 0) return;
    const newAvail = [...available, ...activeSel];
    const newSel = selected.filter(s => !activeSel.includes(s));
    onChange(newAvail, newSel);
    setActiveSel([]);
  };

  const toggleItem = (item: string, listType: 'avail' | 'sel') => {
    if (listType === 'avail') {
      setActiveAvail(prev => prev.includes(item) ? prev.filter(p => p !== item) : [...prev, item]);
    } else {
      setActiveSel(prev => prev.includes(item) ? prev.filter(p => p !== item) : [...prev, item]);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 1fr', gap: '12px', alignItems: 'center' }}>
      {/* Available Column */}
      <div style={{ border: '1px solid var(--ui-line)', borderRadius: 'var(--radius-sm)', padding: '12px', background: 'var(--ui-panel)', height: '180px', overflowY: 'auto' }}>
        <h5 style={{ fontSize: '12px', color: 'var(--ui-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Available</h5>
        {available.map(item => (
          <div 
            key={item} 
            onClick={() => toggleItem(item, 'avail')}
            style={{ 
              padding: '6px 10px', 
              fontSize: '13px', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontWeight: 600,
              backgroundColor: activeAvail.includes(item) ? 'var(--ui-primary-soft)' : 'transparent',
              color: activeAvail.includes(item) ? 'var(--ui-primary-deep)' : 'var(--ui-text)'
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
        <button 
          onClick={transferToSelected}
          style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--ui-line)', background: 'var(--ui-panel-pure)', color: 'var(--ui-text)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
        >
          <ChevronRight size={16} />
        </button>
        <button 
          onClick={transferToAvailable}
          style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--ui-line)', background: 'var(--ui-panel-pure)', color: 'var(--ui-text)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Selected Column */}
      <div style={{ border: '1px solid var(--ui-line)', borderRadius: 'var(--radius-sm)', padding: '12px', background: 'var(--ui-panel)', height: '180px', overflowY: 'auto' }}>
        <h5 style={{ fontSize: '12px', color: 'var(--ui-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Selected</h5>
        {selected.map(item => (
          <div 
            key={item} 
            onClick={() => toggleItem(item, 'sel')}
            style={{ 
              padding: '6px 10px', 
              fontSize: '13px', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontWeight: 600,
              backgroundColor: activeSel.includes(item) ? 'var(--ui-primary-soft)' : 'transparent',
              color: activeSel.includes(item) ? 'var(--ui-primary-deep)' : 'var(--ui-text)'
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 3.8 RANGE SLIDER ---
interface RangeProps {
  label?: string;
  min: number;
  max: number;
  val: number;
  onChange: (val: number) => void;
}

export const RangeSlider: React.FC<RangeProps> = ({ label, min, max, val, onChange }) => {
  return (
    <div className="input-group">
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
        <span>{label}</span>
        <span style={{ color: 'var(--ui-primary-deep)' }}>{val}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={val}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: '100%',
          accentColor: 'var(--ui-primary)',
          height: '6px',
          borderRadius: '4px',
          background: 'var(--ui-line)',
          cursor: 'pointer',
          marginTop: '6px'
        }}
      />
    </div>
  );
};

// --- 3.9 RATING / STARS ---
interface RatingProps {
  rating: number;
  onChange: (val: number) => void;
}

export const RatingStars: React.FC<RatingProps> = ({ rating, onChange }) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[...Array(5)].map((_, idx) => {
        const starVal = idx + 1;
        const active = hoverRating !== null ? starVal <= hoverRating : starVal <= rating;
        return (
          <button
            key={idx}
            type="button"
            onClick={() => onChange(starVal)}
            onMouseEnter={() => setHoverRating(starVal)}
            onMouseLeave={() => setHoverRating(null)}
            style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: 0 }}
          >
            <Star 
              size={24} 
              fill={active ? 'var(--ui-primary)' : 'transparent'} 
              stroke={active ? 'var(--ui-primary)' : 'var(--ui-muted)'} 
              style={{ transition: 'transform 0.15s' }}
            />
          </button>
        );
      })}
    </div>
  );
};
