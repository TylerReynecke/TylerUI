import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

/* ==========================================================================
   🪟 8. OVERLAYS, MODALS & POPOVERS
   ========================================================================== */

// --- 8.1 STANDARD MODAL ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(9, 10, 15, 0.45)',
      backdropFilter: 'blur(10px)',
      display: 'grid',
      placeItems: 'center',
      zIndex: 2000,
      animation: 'fadeIn 0.2s ease-out'
    }} onClick={onClose}>
      <div 
        className="panel-container"
        style={{
          width: '500px',
          maxWidth: '90vw',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'modalScale 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          background: 'var(--ui-panel-pure)',
          padding: '24px'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid var(--ui-line-2)', paddingBottom: '12px' }}>
          <h3 style={{ margin: 0, fontWeight: 800, fontSize: '18px', color: 'var(--ui-text)' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--ui-muted)' }}><X size={20} /></button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', fontSize: '14px', color: 'var(--ui-text)', lineHeight: 1.6 }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--ui-line)', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            {footer}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalScale { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
};

// --- 8.2 SLIDE-OVER / SIDE DRAWER ---
interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const SlideOver: React.FC<SlideOverProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(9, 10, 15, 0.40)',
      backdropFilter: 'blur(8px)',
      zIndex: 2000,
      display: 'flex',
      justifyContent: 'flex-end',
      animation: 'fadeIn 0.2s ease-out'
    }} onClick={onClose}>
      <div
        style={{
          width: '420px',
          maxWidth: '100vw',
          height: '100vh',
          background: 'var(--ui-panel-pure)',
          borderLeft: '1px solid var(--ui-line)',
          boxShadow: 'var(--ui-shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          padding: '28px',
          animation: 'slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--ui-line-2)', paddingBottom: '12px' }}>
          <h3 style={{ margin: 0, fontWeight: 800, fontSize: '18px', color: 'var(--ui-text)' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--ui-muted)' }}><X size={20} /></button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', fontSize: '14px', lineHeight: 1.6 }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--ui-line)', display: 'flex', gap: '8px' }}>
            {footer}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
};

// --- 8.3 POPOVER (Anchored floating card) ---
interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

export const Popover: React.FC<PopoverProps> = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <div onClick={() => setIsOpen(!isOpen)} style={{ display: 'inline-block', cursor: 'pointer' }}>
        {trigger}
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '110%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--ui-panel-pure)',
          border: '1px solid var(--ui-line)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          boxShadow: 'var(--ui-shadow-md)',
          zIndex: 1000,
          width: '240px',
          animation: 'fadeIn 0.25s ease'
        }}>
          {/* Arrow */}
          <div style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderBottom: '8px solid var(--ui-line)'
          }} />
          {children}
        </div>
      )}
    </div>
  );
};

// --- 8.4 CONTEXT MENU (Right-Click) ---
interface ContextMenuProps {
  children: React.ReactNode;
  options: { label: string; onClick: () => void }[];
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ children, options }) => {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Calculate safe screen coordinates to avoid off-screen overflow
    let x = e.clientX;
    let y = e.clientY;
    
    const menuWidth = 160;
    const menuHeight = options.length * 36 + 10;
    
    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 8;
    }
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 8;
    }
    
    setPos({ x, y });
  };

  useEffect(() => {
    const closeMenu = () => setPos(null);
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, []);

  return (
    <div onContextMenu={handleContextMenu} style={{ display: 'inline-block', width: '100%' }}>
      {children}

      {pos && createPortal(
        <div 
          ref={menuRef}
          style={{
            position: 'fixed',
            top: `${pos.y}px`,
            left: `${pos.x}px`,
            background: 'var(--ui-panel-pure)',
            border: '1px solid var(--ui-line)',
            borderRadius: '10px',
            boxShadow: 'var(--ui-shadow-md)',
            padding: '4px 0',
            zIndex: 3000,
            width: '160px'
          }}
        >
          {options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => { opt.onClick(); setPos(null); }}
              style={{
                width: '100%',
                background: 'transparent',
                border: 0,
                padding: '8px 12px',
                textAlign: 'left',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--ui-text)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--ui-primary-soft)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {opt.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

// --- 8.5 ACCESSIBLE TOOLTIP ---
export const Tooltip: React.FC<{ trigger: React.ReactNode; text: string }> = ({ trigger, text }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div 
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {trigger}
      {visible && (
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
          fontWeight: 700,
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
          zIndex: 2500,
          pointerEvents: 'none',
          animation: 'fadeIn 0.2s ease'
        }}>
          {text}
        </div>
      )}
    </div>
  );
};
