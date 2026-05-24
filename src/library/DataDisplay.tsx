import React, { useState, useEffect } from 'react';
import { X, ArrowUpRight, ArrowDownRight, ChevronDown } from 'lucide-react';

/* ==========================================================================
   📊 6. DATA DISPLAY: CARDS, PANELS & PILLS
   ========================================================================== */

// --- 6.1 BADGES / PILLS ---
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'red' | 'yellow' | 'blue' | 'grey';
  onDismiss?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'grey', onDismiss }) => {
  const bgClasses: Record<string, string> = {
    green: 'var(--ui-green-soft)',
    red: 'var(--ui-red-soft)',
    yellow: 'var(--ui-yellow-soft)',
    blue: 'var(--ui-primary-soft)',
    grey: 'var(--ui-line)'
  };
  const fgClasses: Record<string, string> = {
    green: 'var(--ui-green)',
    red: 'var(--ui-red)',
    yellow: 'var(--ui-yellow)',
    blue: 'var(--ui-primary-deep)',
    grey: 'var(--ui-muted)'
  };

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 10px',
      borderRadius: '99px',
      fontSize: '11px',
      fontWeight: 800,
      textTransform: 'uppercase',
      letterSpacing: '0.02em',
      backgroundColor: 'var(--ui-panel-pure)', // solid backing
      backgroundImage: `linear-gradient(${bgClasses[variant]}, ${bgClasses[variant]})`, // translucent color overlay
      color: fgClasses[variant]
    }}>
      <span>{children}</span>
      {onDismiss && (
        <button 
          onClick={onDismiss}
          style={{ background: 'transparent', border: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0, color: fgClasses[variant] }}
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
};

// --- 6.2 AVATARS & AVATAR GROUP ---
interface AvatarProps {
  name: string;
  src?: string;
  presence?: 'online' | 'offline' | 'away';
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ name, src, presence, size = 40 }) => {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('');
  
  const presenceColors = {
    online: 'var(--ui-green)',
    offline: 'var(--ui-muted)',
    away: 'var(--ui-yellow)'
  };

  return (
    <div style={{ position: 'relative', width: `${size}px`, height: `${size}px`, display: 'inline-block' }}>
      {src ? (
        <img 
          src={src} 
          alt={name} 
          style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }} 
        />
      ) : (
        <div style={{
          width: '100%',
          height: '100%',
          borderRadius: '12px',
          backgroundColor: 'var(--ui-panel-pure)', // solid backing
          backgroundImage: 'linear-gradient(var(--ui-primary-soft), var(--ui-primary-soft))', // translucent soft color overlay
          color: 'var(--ui-primary-deep)',
          fontWeight: 800,
          fontSize: `${size * 0.38}px`,
          display: 'grid',
          placeItems: 'center'
        }}>
          {initials}
        </div>
      )}
      {presence && (
        <div style={{
          position: 'absolute',
          bottom: '-2px',
          right: '-2px',
          width: '10px',
          height: '10px',
          borderRadius: '99px',
          background: presenceColors[presence],
          border: '2px solid var(--ui-panel-pure)'
        }} />
      )}
    </div>
  );
};

export const AvatarGroup: React.FC<{ users: { name: string; src?: string }[]; limit?: number }> = ({ users, limit = 3 }) => {
  const visible = users.slice(0, limit);
  const overflow = users.length - limit;

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {visible.map((u, idx) => (
        <div 
          key={idx} 
          style={{ 
            marginLeft: idx === 0 ? 0 : '-10px', 
            zIndex: 10 - idx,
            border: '2px solid var(--ui-panel-pure)',
            borderRadius: '14px',
            background: 'var(--ui-panel-pure)',
            display: 'flex'
          }}
        >
          <Avatar name={u.name} src={u.src} size={32} />
        </div>
      ))}
      {overflow > 0 && (
        <div style={{
          marginLeft: '-10px',
          width: '32px',
          height: '32px',
          borderRadius: '12px',
          background: 'var(--ui-bg-2)',
          border: '2px solid var(--ui-panel-pure)',
          color: 'var(--ui-muted)',
          fontSize: '11px',
          fontWeight: 800,
          display: 'grid',
          placeItems: 'center',
          zIndex: 0
        }}>
          +{overflow}
        </div>
      )}
    </div>
  );
};

// --- 6.3 STANDARD FROSTED GLASS CARD ---
interface CardProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const StandardCard: React.FC<CardProps> = ({ title, subtitle, action, children, footer }) => {
  return (
    <div className="panel-container">
      {/* Header */}
      {(title || subtitle || action) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px', borderBottom: '1px solid var(--ui-line-2)', paddingBottom: '12px' }}>
          <div>
            {title && <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--ui-text)' }}>{title}</h3>}
            {subtitle && <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--ui-muted)' }}>{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}

      {/* Body */}
      <div style={{ color: 'var(--ui-text)' }}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--ui-line)', display: 'flex', justifyContent: 'flex-end' }}>
          {footer}
        </div>
      )}
    </div>
  );
};

// --- 6.4 ACCORDION / COLLAPSIBLE SECTION ---
interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ border: '1px solid var(--ui-line)', borderRadius: 'var(--radius-sm)', background: 'var(--ui-panel)', overflow: 'hidden', marginBottom: '12px' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          background: 'transparent',
          border: 0,
          cursor: 'pointer',
          textAlign: 'left',
          fontWeight: 700,
          color: 'var(--ui-text)',
          fontSize: '14px'
        }}
      >
        <span>{title}</span>
        <ChevronDown size={18} style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)', color: 'var(--ui-muted)' }} />
      </button>

      {expanded && (
        <div style={{ padding: '16px 20px 20px 20px', borderTop: '1px solid var(--ui-line-2)', fontSize: '13.5px', color: 'var(--ui-muted)', lineHeight: 1.6 }}>
          {children}
        </div>
      )}
    </div>
  );
};

// --- 6.5 METRIC / KPI CARD (with Sparkline SVG Background) ---
interface MetricProps {
  title: string;
  value: string;
  trend: string;
  trendDirection: 'up' | 'down';
  sparklineData: number[]; // 5-7 numbers
}

export const MetricCard: React.FC<MetricProps> = ({
  title,
  value,
  trend,
  trendDirection,
  sparklineData
}) => {
  const isUp = trendDirection === 'up';
  
  // Format SVG Sparkline coordinates
  const width = 140;
  const height = 48;
  const max = Math.max(...sparklineData);
  const min = Math.min(...sparklineData);
  const range = max - min || 1;
  const points = sparklineData.map((val, idx) => {
    const x = (idx / (sparklineData.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 8) - 4;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="metric-card">
      {/* Background Sparkline */}
      <div style={{ position: 'absolute', right: '12px', bottom: '16px', opacity: 0.28, pointerEvents: 'none' }}>
        <svg width={width} height={height}>
          <polyline
            fill="none"
            stroke={isUp ? 'var(--ui-green)' : 'var(--ui-red)'}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>

      <div className="metric-title">{title}</div>
      <div className="metric-value">{value}</div>
      
      <div className={`metric-trend ${isUp ? 'up' : 'down'}`}>
        {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        <span>{trend}</span>
      </div>
    </div>
  );
};

// --- 6.6 AUDIT LOG / TIMELINE ---
interface TimelineEvent {
  title: string;
  description: string;
  time: string;
  color?: string;
}

export const Timeline: React.FC<{ events: TimelineEvent[] }> = ({ events }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', paddingLeft: '24px' }}>
      <div style={{
        position: 'absolute',
        top: '6px',
        bottom: '6px',
        left: '6px',
        width: '2px',
        background: 'var(--ui-line)'
      }} />
      {events.map((e, idx) => (
        <div key={idx} style={{ position: 'relative' }}>
          {/* Dot */}
          <div style={{
            position: 'absolute',
            left: '-24px',
            top: '4px',
            width: '14px',
            height: '14px',
            borderRadius: '99px',
            background: 'var(--ui-panel-pure)',
            border: `3px solid ${e.color || 'var(--ui-primary)'}`,
            zIndex: 1
          }} />

          {/* Info */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h5 style={{ margin: 0, fontWeight: 700, fontSize: '13.5px', color: 'var(--ui-text)' }}>{e.title}</h5>
              <span style={{ fontSize: '11px', color: 'var(--ui-muted)' }}>{e.time}</span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: 'var(--ui-muted)', lineHeight: 1.5 }}>
              {e.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- 6.7 WHITE-LABEL BRAND LOGO ---
interface LogoProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  coreColor?: string;
  hideShadow?: boolean;
  lightModeSrc?: string;
  darkModeSrc?: string;
  currentTheme?: 'light' | 'dark';
  text1?: string;
  text2?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 32, 
  className, 
  style, 
  coreColor = 'var(--ui-text)', 
  hideShadow = false,
  lightModeSrc,
  darkModeSrc,
  currentTheme,
  text1 = 'TYLER',
  text2 = 'UI'
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    if (currentTheme) {
      setTheme(currentTheme);
      return;
    }
    
    // Auto-detect theme from DOM
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('theme-dark') || 
                     document.body.classList.contains('theme-dark') ||
                     document.documentElement.getAttribute('data-theme') === 'dark';
      setTheme(isDark ? 'dark' : 'light');
    };

    checkTheme();
    
    // Listen for class changes on documentElement
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [currentTheme]);

  // Image is rendered ONLY if BOTH light and dark mode file sources are provided
  const hasImages = !!lightModeSrc && !!darkModeSrc;
  
  if (hasImages) {
    const imgSrc = theme === 'dark' ? darkModeSrc : lightModeSrc;
    return (
      <div className={`logo-container ${className || ''}`} style={{ display: 'flex', alignItems: 'center', ...style }}>
        <img 
          src={imgSrc} 
          alt="Logo" 
          style={{ height: `${size}px`, width: 'auto', objectFit: 'contain' }} 
        />
      </div>
    );
  }

  // Text-based fallback logo
  return (
    <div 
      className={`logo-container ${className || ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        fontFamily: '"42dot Sans", sans-serif',
        fontWeight: 900,
        fontSize: `${size}px`,
        letterSpacing: '-0.02em',
        lineHeight: 1,
        ...style
      }}
    >
      <span style={{ color: 'var(--ui-primary)', fontSize: 'inherit', textShadow: hideShadow ? 'none' : '0 2px 10px rgba(0,0,0,0.3)' }}>{text1}</span>
      <span style={{ color: coreColor, fontSize: 'inherit', textShadow: hideShadow ? 'none' : '0 2px 10px rgba(0,0,0,0.3)' }}>{text2}</span>
    </div>
  );
};

// --- 6.8 LIGHTWEIGHT MINI STAT CARD ---
interface MiniStatProps {
  label: string;
  value: string;
  subtext: string;
  className?: string;
  style?: React.CSSProperties;
}

export const MiniStat: React.FC<MiniStatProps> = ({ label, value, subtext, className = '', style }) => {
  return (
    <div 
      className={`mini-stat ${className}`} 
      style={{
        padding: '16px',
        borderRadius: '22px',
        background: 'var(--ui-panel)',
        border: '1px solid var(--ui-border-glass)',
        boxShadow: 'var(--ui-shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        ...style
      }}
    >
      <span style={{ color: 'var(--ui-muted)', fontSize: '12px', fontWeight: 600 }}>{label}</span>
      <strong style={{ fontSize: '22px', fontWeight: 800, color: 'var(--ui-text)', letterSpacing: '-0.04em' }}>{value}</strong>
      <small style={{ fontSize: '11px', color: 'var(--ui-muted-2)' }}>{subtext}</small>
    </div>
  );
};

// --- 6.9 STATUS CHIP / BADGE TAG ---
interface StatusChipProps {
  color: 'green' | 'red' | 'yellow' | 'blue' | 'grey';
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const StatusChip: React.FC<StatusChipProps> = ({ color, children, className = '', style }) => {
  const colors = {
    green: { bg: 'rgba(18, 183, 106, 0.15)', border: 'rgba(18, 183, 106, 0.25)', text: 'var(--ui-green)' },
    red: { bg: 'rgba(240, 68, 56, 0.15)', border: 'rgba(240, 68, 56, 0.25)', text: 'var(--ui-red)' },
    yellow: { bg: 'rgba(253, 176, 34, 0.15)', border: 'rgba(253, 176, 34, 0.25)', text: 'var(--ui-yellow)' },
    blue: { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.25)', text: 'var(--ui-primary)' },
    grey: { bg: 'var(--ui-line-2)', border: 'var(--ui-line)', text: 'var(--ui-muted)' }
  };

  const choice = colors[color] || colors.grey;

  return (
    <div 
      className={`status-chip ${className}`} 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        borderRadius: '8px',
        fontSize: '11px',
        fontWeight: 700,
        backgroundColor: choice.bg,
        border: `1px solid ${choice.border}`,
        color: choice.text,
        width: 'max-content',
        ...style
      }}
    >
      {children}
    </div>
  );
};
