import React, { createContext, useContext, useState } from 'react';
import { AlertCircle, CheckCircle, Info, X, HelpCircle } from 'lucide-react';

/* ==========================================================================
   🔔 9. SYSTEM FEEDBACK & NOTIFICATIONS
   ========================================================================== */

// --- 9.1 TOAST SYSTEM PROVIDER ---
export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastMessage {
  id: string;
  title: string;
  type: ToastType;
  isExiting?: boolean;
}

interface ToastContextType {
  addToast: (title: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToasts = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToasts must be used inside a ToastProvider');
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const startDismissal = (id: string) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, isExiting: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 250);
  };

  const addToast = (title: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, type }]);
    
    // Auto-dismiss starting the fade out at 3.75s, removing at 4.0s
    setTimeout(() => {
      startDismissal(id);
    }, 3750);
  };

  const removeToast = (id: string) => {
    startDismissal(id);
  };

  const iconMap = {
    success: <CheckCircle size={18} style={{ color: 'var(--ui-green)' }} />,
    error: <AlertCircle size={18} style={{ color: 'var(--ui-red)' }} />,
    warning: <AlertCircle size={18} style={{ color: 'var(--ui-yellow)' }} />,
    info: <Info size={18} style={{ color: 'var(--ui-primary-deep)' }} />
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-box ${t.type} ${t.isExiting ? 'exiting' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {iconMap[t.type]}
              <span style={{ fontSize: '13.5px', fontWeight: 600 }}>{t.title}</span>
            </div>
            <button 
              onClick={() => removeToast(t.id)}
              style={{ background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--ui-muted)', display: 'flex', alignItems: 'center' }}
            >
              <X size={16} />
            </button>
            <div className="toast-progress" />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// --- 9.2 INLINE ALERT BANNER ---
interface AlertProps {
  title: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  children?: React.ReactNode;
}

export const InlineAlert: React.FC<AlertProps> = ({ title, type = 'info', children }) => {
  const iconMap = {
    success: <CheckCircle size={18} style={{ color: 'var(--ui-green)' }} />,
    error: <AlertCircle size={18} style={{ color: 'var(--ui-red)' }} />,
    warning: <AlertCircle size={18} style={{ color: 'var(--ui-yellow)' }} />,
    info: <Info size={18} style={{ color: 'var(--ui-primary-deep)' }} />
  };

  const borderColors = {
    success: 'var(--ui-green)',
    error: 'var(--ui-red)',
    warning: 'var(--ui-yellow)',
    info: 'var(--ui-primary)'
  };

  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      padding: '16px',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--ui-panel)',
      borderLeft: `4px solid ${borderColors[type]}`,
      borderTop: '1px solid var(--ui-line)',
      borderBottom: '1px solid var(--ui-line)',
      borderRight: '1px solid var(--ui-line)',
      marginBottom: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', paddingTop: '2px' }}>
        {iconMap[type]}
      </div>
      <div>
        <h5 style={{ margin: 0, fontWeight: 700, fontSize: '13.5px', color: 'var(--ui-text)' }}>{title}</h5>
        {children && (
          <div style={{ marginTop: '4px', fontSize: '12.5px', color: 'var(--ui-muted)', lineHeight: 1.5 }}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

// --- 9.3 SKELETON WIREFRAME LOADERS ---
export const Skeleton: React.FC<{ variant?: 'text' | 'circle' | 'rect'; width?: string; height?: string }> = ({
  variant = 'text',
  width = '100%',
  height = '14px'
}) => {
  const getStyle = (): React.CSSProperties => {
    if (variant === 'circle') {
      return { width: '40px', height: '40px', borderRadius: '99px' };
    }
    if (variant === 'rect') {
      return { width, height: height || '80px', borderRadius: '12px' };
    }
    return { width, height, borderRadius: '4px' };
  };

  return (
    <div 
      className="shimmer-element"
      style={{
        ...getStyle(),
        display: 'inline-block',
        verticalAlign: 'middle',
        marginBottom: '6px'
      }}
    />
  );
};

// --- 9.4 EMPTY STATES ---
interface EmptyProps {
  title: string;
  description: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

export const EmptyState: React.FC<EmptyProps> = ({ title, description, ctaText, onCtaClick }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
      background: 'var(--ui-panel)',
      border: '2px dashed var(--ui-line)',
      borderRadius: 'var(--radius-lg)',
      width: '100%'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '99px',
        background: 'var(--ui-bg-2)',
        display: 'grid',
        placeItems: 'center',
        color: 'var(--ui-muted)',
        marginBottom: '16px'
      }}>
        <HelpCircle size={28} />
      </div>
      <h4 style={{ margin: '0 0 6px 0', fontWeight: 800, fontSize: '16px', color: 'var(--ui-text)' }}>{title}</h4>
      <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: 'var(--ui-muted)', maxWidth: '320px', lineHeight: 1.6 }}>{description}</p>
      {ctaText && onCtaClick && (
        <button className="btn primary" onClick={onCtaClick}>
          {ctaText}
        </button>
      )}
    </div>
  );
};

// --- 9.5 GLOBAL SCREEN TRANSITION LOADER ---
export const ScreenLoader: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      minHeight: '400px',
      background: 'transparent'
    }}>
      <style>
        {`
          @keyframes spinLoader {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes showLoader {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          .simple-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--ui-line);
            border-top-color: var(--ui-primary);
            border-radius: 50%;
            animation: spinLoader 0.8s linear infinite;
            opacity: 0;
            animation: 
              spinLoader 0.8s linear infinite,
              showLoader 0.2s ease forwards 0.2s;
          }
        `}
      </style>
      <div className="simple-spinner"></div>
    </div>
  );
};
