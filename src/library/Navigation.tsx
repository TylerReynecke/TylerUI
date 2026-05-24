import React, { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';

/* ==========================================================================
   🧭 5. NAVIGATION & APP STRUCTURE
   ========================================================================== */

// --- 5.1 TOP APP BAR ---
interface TopBarProps {
  logo?: React.ReactNode;
  user: { name: string; email: string; avatar?: string };
  notificationsCount?: number;
  onSearch?: (q: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ logo, user, notificationsCount = 0 }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div style={{
      height: '80px',
      borderRadius: 'var(--radius-xl)',
      background: 'linear-gradient(180deg, var(--ui-panel), var(--ui-panel-strong))',
      border: '1px solid var(--ui-border-glass)',
      boxShadow: 'var(--ui-shadow-md)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'relative',
      zIndex: 100
    }}>
      {/* Left logo / switch */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {logo || <div style={{ fontWeight: 900, fontSize: '18px' }}>TYLER <span style={{ color: 'var(--ui-primary)' }}>UI</span></div>}
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Search placeholder */}
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--ui-bg)', borderRadius: '12px', border: '1px solid var(--ui-line)', padding: '6px 12px', width: '240px' }}>
          <Icons.Search size={16} style={{ color: 'var(--ui-muted)', marginRight: '8px' }} />
          <input style={{ background: 'transparent', border: 0, outline: 0, width: '100%', fontSize: '12px', color: 'var(--ui-text)' }} placeholder="Press Cmd+K to search..." readOnly />
        </div>

        {/* Notification Bell */}
        <button style={{ position: 'relative', background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--ui-text)' }}>
          <Icons.Bell size={20} />
          {notificationsCount > 0 && (
            <div style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '10px',
              height: '10px',
              borderRadius: '99px',
              background: 'var(--ui-yellow)',
              boxShadow: '0 0 0 3px var(--ui-primary-soft)'
            }} />
          )}
        </button>

        {/* Profile */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left' }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--ui-primary)', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 800 }}>
              {user.name.charAt(0)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ui-text)' }}>{user.name}</span>
              <span style={{ fontSize: '11px', color: 'var(--ui-muted)' }}>{user.email}</span>
            </div>
          </button>

          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '110%',
              right: 0,
              background: 'var(--ui-panel-pure)',
              border: '1px solid var(--ui-line)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--ui-shadow-md)',
              width: '180px',
              padding: '6px 0',
              zIndex: 1000
            }}>
              {['Profile Details', 'Billing Settings', 'Log Out'].map((item, idx) => (
                <button
                  key={idx}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 0,
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: item === 'Log Out' ? 'var(--ui-red)' : 'var(--ui-text)',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--ui-bg-2)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- 5.2 SIDEBAR NAVIGATION ---
interface SidebarProps {
  items: { label: string; icon: keyof typeof Icons; id: string }[];
  activeId: string;
  onSelect: (id: string) => void;
  isCollapsed?: boolean;
  logo?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ items, activeId, onSelect, isCollapsed = false, logo }) => {
  return (
    <div className="sidebar-panel" style={{ width: isCollapsed ? '80px' : '260px', display: 'flex', flexDirection: 'column', transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', marginBottom: '24px' }}>
        {logo ? (
          logo
        ) : (
          <>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--ui-primary), var(--ui-primary-deep))',
              display: 'grid',
              placeItems: 'center',
              color: 'white',
              fontWeight: 900
            }}>
              T
            </div>
            {!isCollapsed && (
              <div>
                <h2 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>TylerUI</h2>
                <p style={{ fontSize: '11px', color: 'var(--ui-muted)', margin: 0 }}>Enterprise Portal</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Nav List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {items.map(item => {
          const IconComponent = Icons[item.icon] as React.ComponentType<any>;
          const active = activeId === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '12px',
                background: active ? 'var(--ui-primary-soft)' : 'transparent',
                border: '1px solid transparent',
                color: 'var(--ui-text)',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: 600,
                fontSize: '13px',
                boxShadow: active ? 'inset 2px 0 0 var(--ui-primary)' : 'none'
              }}
              onMouseEnter={(e) => !active && (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.4)')}
              onMouseLeave={(e) => !active && (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <IconComponent size={18} />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// --- 5.3 COMMAND PALETTE ---
interface PaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<PaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(9, 10, 15, 0.40)',
      backdropFilter: 'blur(8px)',
      display: 'grid',
      placeItems: 'center',
      zIndex: 2000
    }} onClick={onClose}>
      <div 
        style={{
          width: '540px',
          background: 'var(--ui-panel-pure)',
          border: '1px solid var(--ui-line)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--ui-shadow-lg)',
          overflow: 'hidden'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--ui-line)', padding: '16px' }}>
          <Icons.Search size={20} style={{ color: 'var(--ui-muted)', marginRight: '12px' }} />
          <input
            style={{ width: '100%', border: 0, outline: 0, background: 'transparent', fontSize: '15px', color: 'var(--ui-text)' }}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search pages, commands, or settings..."
            autoFocus
          />
        </div>

        {/* Results Mock */}
        <div style={{ padding: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ui-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', paddingLeft: '8px' }}>
            Suggested Commands
          </div>
          {['Go to Organizations', 'View Billing Details', 'Toggle Dark Mode', 'Add New Asset'].map((cmd, idx) => (
            <button
              key={idx}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '8px',
                border: 0,
                background: 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                color: 'var(--ui-text)',
                fontWeight: 600,
                fontSize: '13px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--ui-primary-soft)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Icons.Terminal size={14} style={{ color: 'var(--ui-muted)' }} />
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- 5.4 TABS ---
interface TabsProps {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
  variant?: 'underline' | 'pill';
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, variant = 'underline' }) => {
  return (
    <div style={{ 
      display: 'flex', 
      gap: '8px', 
      borderBottom: variant === 'underline' ? '1px solid var(--ui-line)' : 'none',
      paddingBottom: variant === 'underline' ? '0' : '8px'
    }}>
      {tabs.map(tab => {
        const active = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            style={{
              background: active && variant === 'pill' ? 'var(--ui-primary)' : 'transparent',
              border: 'none',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              borderRadius: variant === 'pill' ? 'var(--radius-sm)' : '0',
              color: active ? (variant === 'pill' ? 'white' : 'var(--ui-text)') : 'var(--ui-muted)',
              borderBottom: active && variant === 'underline' ? '2px solid var(--ui-primary)' : '2px solid transparent',
              transition: 'all 0.2s',
              marginBottom: variant === 'underline' ? '-1px' : '0'
            }}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};

// --- 5.5 BREADCRUMBS ---
export const Breadcrumbs: React.FC<{ paths: string[] }> = ({ paths }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--ui-muted)' }}>
      {paths.map((p, idx) => {
        const isLast = idx === paths.length - 1;
        return (
          <React.Fragment key={idx}>
            <span style={{ fontWeight: isLast ? 700 : 500, color: isLast ? 'var(--ui-text)' : 'var(--ui-muted)' }}>
              {p}
            </span>
            {!isLast && <Icons.ChevronRight size={14} />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// --- 5.6 STEPPER ---
export const Stepper: React.FC<{ steps: string[]; currentStep: number }> = ({ steps, currentStep }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
      {steps.map((s, idx) => {
        const completed = idx < currentStep;
        const active = idx === currentStep;

        return (
          <React.Fragment key={idx}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '99px',
                background: completed ? 'var(--ui-green-soft)' : active ? 'var(--ui-primary)' : 'var(--ui-line)',
                color: completed ? 'var(--ui-green)' : active ? 'white' : 'var(--ui-muted)',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 700,
                fontSize: '13px'
              }}>
                {completed ? <Icons.Check size={16} /> : idx + 1}
              </div>
              <span style={{ fontWeight: active ? 700 : 500, fontSize: '13px', color: active ? 'var(--ui-text)' : 'var(--ui-muted)' }}>{s}</span>
            </div>
            {idx < steps.length - 1 && (
              <div style={{ flex: 1, height: '2px', background: completed ? 'var(--ui-green)' : 'var(--ui-line)', margin: '0 16px' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
