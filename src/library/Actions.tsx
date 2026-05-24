import React, { useState, useRef, useEffect } from 'react';
import * as Icons from 'lucide-react';

/* ==========================================================================
   🎛️ 1. ACTIONS & TRIGGERS
   ========================================================================== */

// --- 1.1 STANDARD BUTTON ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  isLoading?: boolean;
  leftIcon?: keyof typeof Icons;
  rightIcon?: keyof typeof Icons;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const LeftIconComponent = leftIcon ? Icons[leftIcon] as React.ComponentType<any> : null;
  const RightIconComponent = rightIcon ? Icons[rightIcon] as React.ComponentType<any> : null;

  return (
    <button
      className={`btn ${variant} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Icons.Loader2 className="animate-spin" size={16} style={{ animation: 'spin 1s linear infinite' }} />}
      {!isLoading && LeftIconComponent && <LeftIconComponent size={16} />}
      <span>{children}</span>
      {!isLoading && RightIconComponent && <RightIconComponent size={16} />}
    </button>
  );
};

// --- 1.2 ICON-ONLY BUTTON (with Tooltip) ---
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: keyof typeof Icons;
  tooltipText: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  tooltipText,
  className = '',
  ...props
}) => {
  const IconComponent = Icons[icon] as React.ComponentType<any>;
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div 
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button className={`icon-btn ${className}`} {...props}>
        <IconComponent size={18} />
      </button>
      {showTooltip && (
        <div style={{
          position: 'absolute',
          bottom: '120%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#101114',
          color: '#ffffff',
          padding: '6px 10px',
          borderRadius: '6px',
          fontSize: '11px',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
          zIndex: 1000,
          pointerEvents: 'none'
        }}>
          {tooltipText}
        </div>
      )}
    </div>
  );
};

// --- 1.3 SPLIT DROPDOWN BUTTON ---
interface SplitButtonProps {
  label: string;
  onPrimaryClick: () => void;
  options: { label: string; onClick: () => void }[];
}

export const SplitButton: React.FC<SplitButtonProps> = ({ label, onPrimaryClick, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <div ref={dropdownRef} className="split-button" style={{ display: 'inline-flex', position: 'relative', overflow: 'visible' }}>
      <button 
        className="btn primary" 
        onClick={onPrimaryClick}
        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRight: '1px solid rgba(255,255,255,0.15)' }}
      >
        {label}
      </button>
      <button 
        className="btn primary" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, paddingLeft: '8px', paddingRight: '8px' }}
      >
        <Icons.ChevronDown size={16} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '105%',
          right: 0,
          background: 'var(--ui-panel-pure)',
          border: '1px solid var(--ui-line)',
          boxShadow: 'var(--ui-shadow-md)',
          borderRadius: '12px',
          width: '180px',
          zIndex: 1000,
          padding: '6px 0',
          overflow: 'hidden'
        }}>
          {options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => { opt.onClick(); setIsOpen(false); }}
              style={{
                width: '100%',
                background: 'transparent',
                border: 0,
                padding: '10px 16px',
                textAlign: 'left',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--ui-text)',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--ui-primary-soft)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// --- 1.4 SEGMENTED CONTROL (Button Group) ---
interface SegmentedControlProps {
  segments: string[];
  activeSegment: string;
  onChange: (segment: string) => void;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({ segments, activeSegment, onChange }) => {
  return (
    <div className="segmented-control">
      {segments.map((seg) => (
        <button
          key={seg}
          className={activeSegment === seg ? 'active' : ''}
          onClick={() => onChange(seg)}
        >
          {seg}
        </button>
      ))}
    </div>
  );
};

// --- 1.5 FLOATING ACTION BUTTON (FAB) ---
interface FABProps {
  icon: keyof typeof Icons;
  onClick: () => void;
  tooltipText: string;
}

export const FAB: React.FC<FABProps> = ({ icon, onClick, tooltipText }) => {
  const IconComponent = Icons[icon] as React.ComponentType<any>;
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div 
      style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 100 }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {showTooltip && (
        <div style={{
          position: 'absolute',
          bottom: '120%',
          right: '0',
          background: '#101114',
          color: '#ffffff',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
          pointerEvents: 'none'
        }}>
          {tooltipText}
        </div>
      )}
      <button className="fab" onClick={onClick}>
        <IconComponent size={24} />
      </button>
    </div>
  );
};

// --- 1.6 COPY-TO-CLIPBOARD MICRO-BUTTON ---
export const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button 
        className="icon-btn" 
        onClick={handleCopy}
        style={{ 
          borderColor: copied ? 'var(--ui-green)' : 'var(--ui-line)',
          backgroundColor: copied ? 'var(--ui-green-soft)' : 'var(--ui-panel)',
          color: copied ? 'var(--ui-green)' : 'var(--ui-text)'
        }}
      >
        {copied ? <Icons.Check size={18} /> : <Icons.Copy size={18} />}
      </button>
      {copied && (
        <div style={{
          position: 'absolute',
          bottom: '125%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--ui-green)',
          color: '#ffffff',
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '11px',
          fontWeight: 700,
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          pointerEvents: 'none'
        }}>
          Copied!
        </div>
      )}
    </div>
  );
};
