import React, { useState, useRef, useEffect } from 'react';
import { 
  Eye, EyeOff, Search, X, Check, AlertCircle, Globe, CreditCard, 
  Calendar, Hash, Percent, MapPin, Clock, Lock, Sliders, Building2,
  Bold, Italic, Underline, Strikethrough, List, ListOrdered, AlignLeft, 
  AlignCenter, AlignRight, AlignJustify, Link, Image, Table, Code,
  ChevronDown, Palette
} from 'lucide-react';

/* ==========================================================================
   📝 2. FORM CONTROLS & HIGH-DENSITY INPUTS
   ========================================================================== */

// --- 2.1 TEXT INPUT ---
interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  prefixText?: string;
  suffixText?: string;
  error?: string;
  isValid?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  hint,
  prefixText,
  suffixText,
  error,
  isValid,
  className = '',
  onFocus,
  onBlur,
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="input-group">
      {label && (
        <label className="input-label">
          {label} {hint && <span className="hint">{hint}</span>}
        </label>
      )}
      <div className={`input-field-wrapper ${focused ? 'focused' : ''} ${error ? 'invalid' : ''} ${isValid ? 'valid' : ''} ${className}`}>
        {prefixText && <span className="input-prefix">{prefixText}</span>}
        <input
          className="input-field"
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          {...props}
        />
        {isValid && <span style={{ color: 'var(--ui-green)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><Check size={16} /></span>}
        {error && <span style={{ color: 'var(--ui-red)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><AlertCircle size={16} /></span>}
        {suffixText && <span className="input-suffix">{suffixText}</span>}
      </div>
      {error && <span className="input-helper error">{error}</span>}
    </div>
  );
};

// --- 2.2 TEXTAREA (with counter) ---
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  maxChars?: number;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  maxChars = 250,
  value = '',
  onChange,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const textVal = String(value);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxChars) {
      onChange?.(e);
    }
  };

  return (
    <div className="input-group">
      {label && (
        <label className="input-label">
          {label}
          <span className="hint">{textVal.length} / {maxChars}</span>
        </label>
      )}
      <div className={`input-field-wrapper ${focused ? 'focused' : ''}`}>
        <textarea
          className="input-field"
          value={value}
          onChange={handleTextChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ minHeight: '80px', resize: 'vertical' }}
          {...props}
        />
      </div>
    </div>
  );
};

// --- 2.3 PASSWORD INPUT (with CapsLock and Strength Meter) ---
export const PasswordInput: React.FC<TextInputProps> = ({ label, ...props }) => {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [strength, setStrength] = useState(0); // 0 to 4
  const [pwVal, setPwVal] = useState('');

  const checkStrength = (val: string) => {
    let score = 0;
    if (val.length >= 6) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    setStrength(score);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.getModifierState('CapsLock')) {
      setCapsLock(true);
    } else {
      setCapsLock(false);
    }
  };

  const strengthLabels = ['Weak', 'Fair', 'Medium', 'Strong'];
  const strengthColors = ['var(--ui-red)', 'var(--ui-yellow)', 'var(--ui-primary)', 'var(--ui-green)'];

  return (
    <div className="input-group" onKeyDown={handleKeyDown}>
      <label className="input-label">{label || 'Password'}</label>
      <div className={`input-field-wrapper ${focused ? 'focused' : ''}`}>
        <input
          type={show ? 'text' : 'password'}
          className="input-field"
          value={pwVal}
          onChange={(e) => {
            setPwVal(e.target.value);
            checkStrength(e.target.value);
            props.onChange?.(e);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          style={{ background: 'transparent', border: 0, paddingLeft: '8px', paddingRight: '12px', color: 'var(--ui-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      
      {/* Reserved space to completely prevent layout shifts */}
      <div style={{ height: '38px', marginTop: '6px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {/* Strength Meter Slot */}
        <div style={{ height: '22px' }}>
          {pwVal.length > 0 && (
            <div>
              <div style={{ display: 'flex', gap: '4px', height: '4px', borderRadius: '2px', overflow: 'hidden', background: 'var(--ui-line)' }}>
                {[...Array(4)].map((_, idx) => (
                  <div 
                    key={idx}
                    style={{ 
                      flex: 1, 
                      background: idx < strength ? strengthColors[strength - 1] : 'transparent',
                      transition: 'background 0.3s'
                    }} 
                  />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <span style={{ fontSize: '11px', color: strengthColors[strength - 1], fontWeight: 700 }}>
                  Password Strength: {strengthLabels[strength - 1]}
                </span>
              </div>
            </div>
          )}
        </div>
        
        {/* Caps Lock Alert Slot (strictly below the strength meter, with permanent height allocation) */}
        <div style={{ height: '16px', display: 'flex', alignItems: 'center' }}>
          {capsLock && (
            <span style={{ color: 'var(--ui-yellow)', fontSize: '11px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              ⚠️ CAPS LOCK ACTIVE
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// --- 2.4 SEARCH INPUT ---
interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ onClear, value, onChange, ...props }) => {
  const [focused, setFocused] = useState(false);
  const searchVal = String(value || '');

  return (
    <div className={`input-field-wrapper ${focused ? 'focused' : ''}`} style={{ borderRadius: 'var(--radius-md)' }}>
      <span style={{ paddingLeft: '14px', color: 'var(--ui-muted)', display: 'flex', alignItems: 'center' }}><Search size={18} /></span>
      <input
        className="input-field"
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {searchVal.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          style={{ background: 'transparent', border: 0, paddingRight: '14px', color: 'var(--ui-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

// --- 2.4B CELL NUMBER INPUT (with selectable searchable area code, spaces masking and zero required validation) ---
interface CellNumberInputProps extends Omit<TextInputProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
  defaultAreaCode?: string;
  areaCodes?: string[];
}

export const CellNumberInput: React.FC<CellNumberInputProps> = ({
  label = 'Cell Number',
  value,
  onChange,
  defaultAreaCode = '+27',
  areaCodes = ['+27', '+1', '+44', '+61', '+263', '+49', '+33', '+91', '+81'],
  ...props
}) => {
  const [areaCode, setAreaCode] = useState(defaultAreaCode);
  const [displayVal, setDisplayVal] = useState('');
  const [touched, setTouched] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatCellNumber = (val: string) => {
    const clean = val.replace(/\D/g, '').substring(0, 10);
    if (clean.length <= 3) return clean;
    if (clean.length <= 6) return `${clean.slice(0, 3)} ${clean.slice(3)}`;
    return `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6)}`;
  };

  useEffect(() => {
    if (value) {
      let matchedCode = '';
      for (const code of areaCodes) {
        if (value.startsWith(code)) {
          matchedCode = code;
          break;
        }
      }
      if (matchedCode) {
        setAreaCode(matchedCode);
        const localNum = value.slice(matchedCode.length);
        const zeroLed = localNum.startsWith('0') ? localNum : `0${localNum}`;
        setDisplayVal(formatCellNumber(zeroLed));
      } else {
        setAreaCode(defaultAreaCode);
        const zeroLed = value.startsWith('0') ? value : `0${value}`;
        setDisplayVal(formatCellNumber(zeroLed));
      }
    } else {
      setDisplayVal('');
    }
  }, [value, areaCodes, defaultAreaCode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '').substring(0, 10);
    const formatted = formatCellNumber(rawVal);
    setDisplayVal(formatted);

    const isValid = rawVal.startsWith('0') && rawVal.length === 10;
    
    // Strip leading zero for database output, and prefix with current area code
    const dbVal = rawVal.startsWith('0') 
      ? `${areaCode}${rawVal.slice(1)}` 
      : `${areaCode}${rawVal}`;
      
    onChange(dbVal, isValid);
  };

  const handleAreaCodeSelect = (nextAreaCode: string) => {
    setAreaCode(nextAreaCode);
    setShowSearch(false);
    
    const rawVal = displayVal.replace(/\D/g, '');
    const isValid = rawVal.startsWith('0') && rawVal.length === 10;
    const dbVal = rawVal.startsWith('0') 
      ? `${nextAreaCode}${rawVal.slice(1)}` 
      : `${nextAreaCode}${rawVal}`;
      
    onChange(dbVal, isValid);
  };

  const rawVal = displayVal.replace(/\D/g, '');
  const isValid = rawVal.startsWith('0') && rawVal.length === 10;
  
  let error = undefined;
  if (touched && displayVal.length > 0) {
    if (!rawVal.startsWith('0')) {
      error = 'Cell number must start with a leading 0';
    } else if (rawVal.length < 10) {
      error = 'Cell number must be exactly 10 digits';
    }
  }

  const filteredCodes = areaCodes.filter(c => c.includes(searchQuery));

  return (
    <div className="input-group" style={{ position: 'relative' }}>
      {label && <label className="input-label">{label}</label>}
      <div className={`input-field-wrapper ${touched ? 'focused' : ''} ${error ? 'invalid' : ''} ${isValid ? 'valid' : ''}`}>
        
        {/* Custom Searchable Dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setShowSearch(!showSearch)}
            style={{
              background: 'transparent',
              border: 0,
              color: 'var(--ui-text)',
              fontSize: '13px',
              fontWeight: 700,
              paddingLeft: '14px',
              paddingRight: '8px',
              cursor: 'pointer',
              outline: 0,
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              height: '100%'
            }}
          >
            <span>{areaCode}</span>
            <span style={{ fontSize: '10px', color: 'var(--ui-muted)' }}>▼</span>
          </button>

          {showSearch && (
            <div style={{
              position: 'absolute',
              top: '110%',
              left: '6px',
              background: 'var(--ui-panel-pure)',
              border: '1px solid var(--ui-line)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--ui-shadow-md)',
              zIndex: 1000,
              width: '120px',
              overflow: 'hidden',
              padding: '6px'
            }}>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--ui-bg)',
                  border: '1px solid var(--ui-line-2)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px 8px',
                  color: 'var(--ui-text)',
                  fontSize: '11px',
                  marginBottom: '6px',
                  outline: 0
                }}
              />
              <div style={{ maxHeight: '120px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {filteredCodes.map(code => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleAreaCodeSelect(code)}
                    style={{
                      textAlign: 'left',
                      background: code === areaCode ? 'var(--ui-primary-soft)' : 'transparent',
                      border: 0,
                      borderRadius: 'var(--radius-sm)',
                      padding: '6px 8px',
                      color: code === areaCode ? 'var(--ui-primary-deep)' : 'var(--ui-text)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      width: '100%'
                    }}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '20px', background: 'var(--ui-line)', margin: '0 4px' }} />

        <input
          className="input-field"
          type="tel"
          placeholder="082 123 4567"
          value={displayVal}
          onChange={handleChange}
          onFocus={() => setTouched(true)}
          onBlur={() => setTouched(true)}
          {...props}
        />
        {isValid && <span style={{ color: 'var(--ui-green)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><Check size={16} /></span>}
        {error && <span style={{ color: 'var(--ui-red)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><AlertCircle size={16} /></span>}
      </div>
      {error && <span className="input-helper error">{error}</span>}
    </div>
  );
};

// --- 2.4C EMAIL INPUT (lowercase forced, spacebar blocked, strict validator) ---
interface EmailInputProps extends Omit<TextInputProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
}

export const EmailInput: React.FC<EmailInputProps> = ({
  label = 'Email Address',
  value,
  onChange,
  ...props
}) => {
  const [touched, setTouched] = useState(false);

  const validateEmail = (val: string): boolean => {
    // Exactly one @
    const atParts = val.split('@');
    if (atParts.length !== 2) return false;
    const [localPart, domainPart] = atParts;

    // At least one character before @
    if (localPart.length === 0) return false;

    // Period after @
    const dotIdx = domainPart.indexOf('.');
    if (dotIdx === -1) return false;

    // Prevents consecutive periods
    if (val.includes('..')) return false;

    // At least two characters after final period
    const finalDotIdx = domainPart.lastIndexOf('.');
    const tld = domainPart.slice(finalDotIdx + 1);
    if (tld.length < 2) return false;

    return true;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ') {
      e.preventDefault();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value.toLowerCase();
    const valid = validateEmail(nextVal);
    onChange(nextVal, valid);
  };

  const isValid = value.length > 0 && validateEmail(value);
  const error = touched && value.length > 0 && !validateEmail(value)
    ? 'Email must contain one @, a dot subdomain (e.g. .co.za) with at least 2 ending characters, and no spaces.'
    : undefined;

  return (
    <TextInput
      label={label}
      type="email"
      placeholder="name@example.com"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={() => setTouched(true)}
      isValid={isValid}
      error={error}
      {...props}
    />
  );
};

// --- 2.4D SA NATIONAL ID INPUT (YYMMDD SSSS C A Z spacing, Luhn & date validations) ---
interface SANationalIDInputProps extends Omit<TextInputProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
}

export const SANationalIDInput: React.FC<SANationalIDInputProps> = ({
  label = 'South African ID Number',
  value,
  onChange,
  ...props
}) => {
  const [touched, setTouched] = useState(false);
  const [displayVal, setDisplayVal] = useState('');

  const formatSAID = (val: string) => {
    const clean = val.replace(/\D/g, '').substring(0, 13);
    if (clean.length <= 6) return clean;
    if (clean.length <= 10) return `${clean.slice(0, 6)} ${clean.slice(6)}`;
    if (clean.length <= 11) return `${clean.slice(0, 6)} ${clean.slice(6, 10)} ${clean.slice(10)}`;
    if (clean.length <= 12) return `${clean.slice(0, 6)} ${clean.slice(6, 10)} ${clean.slice(10, 11)} ${clean.slice(11)}`;
    return `${clean.slice(0, 6)} ${clean.slice(6, 10)} ${clean.slice(10, 11)} ${clean.slice(11, 12)} ${clean.slice(12)}`;
  };

  useEffect(() => {
    if (value) {
      setDisplayVal(formatSAID(value));
    } else {
      setDisplayVal('');
    }
  }, [value]);

  const luhnCheck = (id: string): boolean => {
    let sum = 0;
    for (let i = 0; i < id.length; i++) {
      let digit = parseInt(id[i]);
      if (i % 2 === 1) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    return sum % 10 === 0;
  };

  const validateSAID = (val: string): { valid: boolean; errorMsg?: string } => {
    if (val.length !== 13) {
      return { valid: false, errorMsg: 'SA ID must be exactly 13 digits long.' };
    }

    // Luhn validation
    if (!luhnCheck(val)) {
      return { valid: false, errorMsg: 'ID number fails the Luhn mathematical validity check.' };
    }

    // Gregorian Date Verification
    const yyStr = val.substring(0, 2);
    const mmStr = val.substring(2, 4);
    const ddStr = val.substring(4, 6);
    
    const year = parseInt(yyStr) > 26 ? 1900 + parseInt(yyStr) : 2000 + parseInt(yyStr);
    const month = parseInt(mmStr) - 1; // 0-indexed
    const day = parseInt(ddStr);

    const parsedDate = new Date(year, month, day);
    if (
      parsedDate.getFullYear() !== year ||
      parsedDate.getMonth() !== month ||
      parsedDate.getDate() !== day
    ) {
      return { valid: false, errorMsg: 'First 6 digits must represent a valid calendar date.' };
    }

    // Citizen vs Permanent Resident Check
    const citizenDigit = parseInt(val.charAt(10));
    if (citizenDigit !== 0 && citizenDigit !== 1) {
      return { valid: false, errorMsg: '11th digit must be 0 (Citizen) or 1 (Permanent Resident).' };
    }

    return { valid: true };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, 13);
    setDisplayVal(formatSAID(raw));
    const { valid } = validateSAID(raw);
    onChange(raw, valid);
  };

  const { valid: isValid, errorMsg } = validateSAID(value || '');
  const error = touched && value && !isValid ? errorMsg : undefined;

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className={`input-field-wrapper ${touched ? 'focused' : ''} ${error ? 'invalid' : ''} ${isValid ? 'valid' : ''}`}>
        <span style={{ paddingLeft: '12px', color: 'var(--ui-muted)', display: 'flex', alignItems: 'center' }}><Hash size={16} /></span>
        <input
          className="input-field"
          type="text"
          placeholder="YYMMDD SSSS C A Z"
          value={displayVal}
          onChange={handleChange}
          onFocus={() => setTouched(true)}
          onBlur={() => setTouched(true)}
          {...props}
        />
        {isValid && <span style={{ color: 'var(--ui-green)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><Check size={16} /></span>}
        {error && <span style={{ color: 'var(--ui-red)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><AlertCircle size={16} /></span>}
      </div>
      {error && <span className="input-helper error">{error}</span>}
    </div>
  );
};

// --- 2.4E PASSPORT NUMBER INPUT (alphanumeric, auto-caps) ---
interface PassportNumberInputProps extends Omit<TextInputProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
  country?: 'ZA' | 'US' | 'UK' | 'Global';
}

export const PassportNumberInput: React.FC<PassportNumberInputProps> = ({
  label = 'Passport Number',
  value,
  onChange,
  country = 'Global',
  ...props
}) => {
  const [touched, setTouched] = useState(false);

  const validatePassport = (val: string): boolean => {
    // Alphanumeric only, no special characters
    const clean = val.replace(/[^A-Za-z0-9]/g, '');
    if (clean.length !== val.length) return false;

    // Length limit checks based on country
    if (country === 'ZA') return val.length === 9; // SA standard is 9 alphanumeric characters
    return val.length >= 8 && val.length <= 11;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    const valid = validatePassport(nextVal);
    onChange(nextVal, valid);
  };

  const isValid = value.length > 0 && validatePassport(value);
  const error = touched && value.length > 0 && !validatePassport(value)
    ? country === 'ZA' ? 'South African passport numbers must be exactly 9 alphanumeric characters.' : 'Passport number must be 8 to 11 alphanumeric characters.'
    : undefined;

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className={`input-field-wrapper ${touched ? 'focused' : ''} ${error ? 'invalid' : ''} ${isValid ? 'valid' : ''}`}>
        <span style={{ paddingLeft: '12px', color: 'var(--ui-muted)', display: 'flex', alignItems: 'center' }}><Globe size={16} /></span>
        <input
          className="input-field"
          type="text"
          placeholder="e.g. M12345678"
          value={value}
          onChange={handleChange}
          onFocus={() => setTouched(true)}
          onBlur={() => setTouched(true)}
          {...props}
        />
        {isValid && <span style={{ color: 'var(--ui-green)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><Check size={16} /></span>}
        {error && <span style={{ color: 'var(--ui-red)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><AlertCircle size={16} /></span>}
      </div>
      {error && <span className="input-helper error">{error}</span>}
    </div>
  );
};

// --- 2.4F SA COMPANY REGISTRATION (CIPC) INPUT (YYYY / NNNNNN / NN) ---
interface SACompanyRegInputProps extends Omit<TextInputProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
}

export const SACompanyRegInput: React.FC<SACompanyRegInputProps> = ({
  label = 'Company Registration Number (CIPC)',
  value,
  onChange,
  ...props
}) => {
  const [touched, setTouched] = useState(false);
  const [displayVal, setDisplayVal] = useState('');

  const formatCompanyReg = (val: string) => {
    const clean = val.replace(/\D/g, '').substring(0, 12);
    if (clean.length <= 4) return clean;
    if (clean.length <= 10) return `${clean.slice(0, 4)} / ${clean.slice(4)}`;
    return `${clean.slice(0, 4)} / ${clean.slice(4, 10)} / ${clean.slice(10)}`;
  };

  useEffect(() => {
    if (value) {
      setDisplayVal(formatCompanyReg(value));
    } else {
      setDisplayVal('');
    }
  }, [value]);

  const validateReg = (val: string): boolean => {
    if (val.length !== 12) return false;
    const year = parseInt(val.substring(0, 4));
    const currentYear = new Date().getFullYear();
    return year >= 1800 && year <= currentYear;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, 12);
    setDisplayVal(formatCompanyReg(raw));
    const valid = validateReg(raw);
    onChange(raw, valid);
  };

  const isValid = value.length === 12 && validateReg(value);
  const error = touched && value && !isValid
    ? 'First 4 digits must represent a valid year (1800 - 2026), and registration length must be 12 digits.'
    : undefined;

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className={`input-field-wrapper ${touched ? 'focused' : ''} ${error ? 'invalid' : ''} ${isValid ? 'valid' : ''}`}>
        <span style={{ paddingLeft: '12px', color: 'var(--ui-muted)', display: 'flex', alignItems: 'center' }}><Building2 size={16} /></span>
        <input
          className="input-field"
          type="text"
          placeholder="YYYY / NNNNNN / NN"
          value={displayVal}
          onChange={handleChange}
          onFocus={() => setTouched(true)}
          onBlur={() => setTouched(true)}
          {...props}
        />
        {isValid && <span style={{ color: 'var(--ui-green)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><Check size={16} /></span>}
        {error && <span style={{ color: 'var(--ui-red)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><AlertCircle size={16} /></span>}
      </div>
      {error && <span className="input-helper error">{error}</span>}
    </div>
  );
};

// --- 2.4G SARS TAX/VAT NUMBER INPUT (strictly 10 numeric starting with 4) ---
interface SARSVATInputProps extends Omit<TextInputProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
}

export const SARSVATInput: React.FC<SARSVATInputProps> = ({
  label = 'SARS VAT / Tax Reference Number',
  value,
  onChange,
  ...props
}) => {
  const [touched, setTouched] = useState(false);

  const validateVAT = (val: string): boolean => {
    return /^\d{10}$/.test(val) && val.startsWith('4');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, 10);
    const valid = validateVAT(raw);
    onChange(raw, valid);
  };

  const isValid = validateVAT(value || '');
  const error = touched && value && !isValid
    ? 'VAT / Tax number must be strictly 10 digits and start with 4 (SA SARS standard).'
    : undefined;

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className={`input-field-wrapper ${touched ? 'focused' : ''} ${error ? 'invalid' : ''} ${isValid ? 'valid' : ''}`}>
        <span style={{ paddingLeft: '12px', color: 'var(--ui-muted)', display: 'flex', alignItems: 'center' }}><Hash size={16} /></span>
        <input
          className="input-field"
          type="text"
          placeholder="e.g. 4012345678"
          value={value}
          onChange={handleChange}
          onFocus={() => setTouched(true)}
          onBlur={() => setTouched(true)}
          {...props}
        />
        {isValid && <span style={{ color: 'var(--ui-green)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><Check size={16} /></span>}
        {error && <span style={{ color: 'var(--ui-red)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><AlertCircle size={16} /></span>}
      </div>
      {error && <span className="input-helper error">{error}</span>}
    </div>
  );
};

// --- 2.4H CURRENCY INPUT (currency symbols, comma thousands space-masking, forced 2 decimals on blur) ---
interface CurrencyInputProps extends Omit<TextInputProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
  currencyPrefix?: 'R' | '$' | '€';
  allowNegative?: boolean;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label = 'Amount / Cost',
  value,
  onChange,
  currencyPrefix = 'R',
  allowNegative = false,
  ...props
}) => {
  const [touched, setTouched] = useState(false);
  const [displayVal, setDisplayVal] = useState('');

  const formatCurrency = (val: string) => {
    // Remove non-digits except single decimal point and optional leading minus
    let clean = val.replace(/[^\d.-]/g, '');
    
    // Handle minus sign
    const isNeg = clean.startsWith('-') && allowNegative;
    clean = clean.replace(/-/g, '');
    if (isNeg) clean = `-${clean}`;

    const parts = clean.split('.');
    if (parts.length > 2) return displayVal; // reject multi-decimals

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  useEffect(() => {
    if (value) {
      setDisplayVal(formatCurrency(value));
    } else {
      setDisplayVal('');
    }
  }, [value]);

  const validateCurrency = (val: string): boolean => {
    if (!val) return false;
    const num = parseFloat(val);
    if (isNaN(num)) return false;
    if (num < 0 && !allowNegative) return false;
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value;
    const formatted = formatCurrency(rawInput);
    setDisplayVal(formatted);

    // Database output format: floating decimal string (e.g. 1500000.00)
    const dbVal = formatted.replace(/,/g, '');
    const valid = validateCurrency(dbVal);
    onChange(dbVal, valid);
  };

  const handleBlur = () => {
    setTouched(true);
    if (value) {
      // Force exactly 2 decimal places on blur
      const num = parseFloat(value);
      if (!isNaN(num)) {
        const rounded = num.toFixed(2);
        onChange(rounded, true);
        setDisplayVal(formatCurrency(rounded));
      }
    }
  };

  const isValid = validateCurrency(value);
  const error = touched && value && !isValid ? 'Please enter a valid numeric currency amount.' : undefined;

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className={`input-field-wrapper ${touched ? 'focused' : ''} ${error ? 'invalid' : ''} ${isValid ? 'valid' : ''}`}>
        <span style={{ paddingLeft: '14px', fontSize: '13px', fontWeight: 800, color: 'var(--ui-muted)', display: 'flex', alignItems: 'center' }}>
          {currencyPrefix}
        </span>
        <input
          className="input-field"
          type="text"
          placeholder="0.00"
          value={displayVal}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={() => setTouched(true)}
          {...props}
        />
        {isValid && <span style={{ color: 'var(--ui-green)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><Check size={16} /></span>}
        {error && <span style={{ color: 'var(--ui-red)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><AlertCircle size={16} /></span>}
      </div>
      {error && <span className="input-helper error">{error}</span>}
    </div>
  );
};

// --- 2.4I CREDIT CARD PAN INPUT (network icon, space masking, Luhn validation) ---
interface CreditCardInputProps extends Omit<TextInputProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
}

export const CreditCardInput: React.FC<CreditCardInputProps> = ({
  label = 'Card Number (PAN)',
  value,
  onChange,
  ...props
}) => {
  const [touched, setTouched] = useState(false);
  const [displayVal, setDisplayVal] = useState('');

  const getCardType = (val: string): 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown' => {
    const clean = val.replace(/\D/g, '');
    if (clean.startsWith('4')) return 'visa';
    if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[0-1]|2720)/.test(clean)) return 'mastercard';
    if (/^(34|37)/.test(clean)) return 'amex';
    if (/^(6011|65|64[4-9])/.test(clean)) return 'discover';
    return 'unknown';
  };

  const formatCard = (val: string) => {
    const clean = val.replace(/\D/g, '');
    const type = getCardType(clean);
    
    if (type === 'amex') {
      // Amex layout: 4-6-5 digits
      const cleanAmex = clean.substring(0, 15);
      if (cleanAmex.length <= 4) return cleanAmex;
      if (cleanAmex.length <= 10) return `${cleanAmex.slice(0, 4)} ${cleanAmex.slice(4)}`;
      return `${cleanAmex.slice(0, 4)} ${cleanAmex.slice(4, 10)} ${cleanAmex.slice(10)}`;
    } else {
      // Regular layouts: spaces every 4 digits, up to 19 digits
      const cleanPAN = clean.substring(0, 19);
      const parts = [];
      for (let i = 0; i < cleanPAN.length; i += 4) {
        parts.push(cleanPAN.slice(i, i + 4));
      }
      return parts.join(' ');
    }
  };

  useEffect(() => {
    if (value) {
      setDisplayVal(formatCard(value));
    } else {
      setDisplayVal('');
    }
  }, [value]);

  const luhnCheck = (pan: string): boolean => {
    let sum = 0;
    let alternate = false;
    for (let i = pan.length - 1; i >= 0; i--) {
      let n = parseInt(pan.charAt(i), 10);
      if (alternate) {
        n *= 2;
        if (n > 9) n = (n % 10) + 1;
      }
      sum += n;
      alternate = !alternate;
    }
    return sum % 10 === 0;
  };

  const validateCard = (val: string): boolean => {
    const clean = val.replace(/\D/g, '');
    const type = getCardType(clean);
    if (type === 'amex') {
      return clean.length === 15 && luhnCheck(clean);
    }
    return clean.length >= 13 && clean.length <= 19 && luhnCheck(clean);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    setDisplayVal(formatCard(raw));
    const valid = validateCard(raw);
    onChange(raw, valid);
  };

  const cardType = getCardType(value || '');
  const isValid = validateCard(value || '');
  const error = touched && value && !isValid ? 'Card number fails the Luhn validity verification.' : undefined;

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className={`input-field-wrapper ${touched ? 'focused' : ''} ${error ? 'invalid' : ''} ${isValid ? 'valid' : ''}`}>
        
        {/* Dynamic Card Icon */}
        <span style={{ paddingLeft: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <CreditCard size={18} style={{ color: isValid ? 'var(--ui-green)' : 'var(--ui-muted)' }} />
          {cardType !== 'unknown' && (
            <span style={{
              fontSize: '9px',
              fontWeight: 800,
              textTransform: 'uppercase',
              background: 'var(--ui-line)',
              padding: '2px 4px',
              borderRadius: '3px',
              color: 'var(--ui-text)'
            }}>
              {cardType}
            </span>
          )}
        </span>
        
        <input
          className="input-field"
          type="text"
          placeholder="XXXX XXXX XXXX XXXX"
          value={displayVal}
          onChange={handleChange}
          onFocus={() => setTouched(true)}
          onBlur={() => setTouched(true)}
          {...props}
        />
        {isValid && <span style={{ color: 'var(--ui-green)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><Check size={16} /></span>}
        {error && <span style={{ color: 'var(--ui-red)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><AlertCircle size={16} /></span>}
      </div>
      {error && <span className="input-helper error">{error}</span>}
    </div>
  );
};

// --- 2.4J CARD EXPIRY DATE (MM / YY visual mask, chronological checks) ---
interface CardExpiryInputProps extends Omit<TextInputProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
}

export const CardExpiryInput: React.FC<CardExpiryInputProps> = ({
  label = 'Expiration Date',
  value,
  onChange,
  ...props
}) => {
  const [touched, setTouched] = useState(false);
  const [displayVal, setDisplayVal] = useState('');

  const formatExpiry = (val: string) => {
    const clean = val.replace(/\D/g, '').substring(0, 4);
    if (clean.length <= 2) return clean;
    return `${clean.slice(0, 2)} / ${clean.slice(2)}`;
  };

  useEffect(() => {
    if (value) {
      setDisplayVal(formatExpiry(value));
    } else {
      setDisplayVal('');
    }
  }, [value]);

  const validateExpiry = (val: string): boolean => {
    if (val.length !== 4) return false;
    const month = parseInt(val.substring(0, 2));
    const year = parseInt(val.substring(2, 4)) + 2000;
    
    if (month < 1 || month > 12) return false;

    // Chronological verification (current date = 2026-05-23)
    const currentYear = 2026;
    const currentMonth = 5;
    
    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;

    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, 4);
    setDisplayVal(formatExpiry(raw));
    const valid = validateExpiry(raw);
    onChange(raw, valid);
  };

  const isValid = validateExpiry(value || '');
  const error = touched && value && !isValid ? 'Card is expired or month is invalid.' : undefined;

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className={`input-field-wrapper ${touched ? 'focused' : ''} ${error ? 'invalid' : ''} ${isValid ? 'valid' : ''}`}>
        <span style={{ paddingLeft: '12px', color: 'var(--ui-muted)', display: 'flex', alignItems: 'center' }}><Calendar size={16} /></span>
        <input
          className="input-field"
          type="text"
          placeholder="MM / YY"
          value={displayVal}
          onChange={handleChange}
          onFocus={() => setTouched(true)}
          onBlur={() => setTouched(true)}
          {...props}
        />
        {isValid && <span style={{ color: 'var(--ui-green)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><Check size={16} /></span>}
        {error && <span style={{ color: 'var(--ui-red)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><AlertCircle size={16} /></span>}
      </div>
      {error && <span className="input-helper error">{error}</span>}
    </div>
  );
};

// --- 2.4K CARD CVV / CVC INPUT (password dots obfuscation, length matches PAN) ---
interface CardCVVInputProps extends Omit<TextInputProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
  isAmex?: boolean;
}

export const CardCVVInput: React.FC<CardCVVInputProps> = ({
  label = 'CVV / CVC Code',
  value,
  onChange,
  isAmex = false,
  ...props
}) => {
  const [touched, setTouched] = useState(false);
  const [show, setShow] = useState(false);

  const limit = isAmex ? 4 : 3;

  const validateCVV = (val: string): boolean => {
    return new RegExp(`^\\d{${limit}}$`).test(val);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, limit);
    const valid = validateCVV(raw);
    onChange(raw, valid);
  };

  const isValid = validateCVV(value || '');
  const error = touched && value && !isValid ? `Security code must be exactly ${limit} numeric digits.` : undefined;

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className={`input-field-wrapper ${touched ? 'focused' : ''} ${error ? 'invalid' : ''} ${isValid ? 'valid' : ''}`}>
        <span style={{ paddingLeft: '12px', color: 'var(--ui-muted)', display: 'flex', alignItems: 'center' }}><Lock size={16} /></span>
        <input
          className="input-field"
          type={show ? 'text' : 'password'}
          placeholder={isAmex ? '••••' : '•••'}
          value={value}
          onChange={handleChange}
          onFocus={() => setTouched(true)}
          onBlur={() => setTouched(true)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          style={{ background: 'transparent', border: 0, paddingLeft: '8px', paddingRight: '12px', color: 'var(--ui-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <span className="input-helper error">{error}</span>}
    </div>
  );
};

// --- 2.4L BANK ACCOUNT NUMBER INPUT (strictly numeric, 7-11 digits) ---
interface BankAccountInputProps extends Omit<TextInputProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
}

export const BankAccountInput: React.FC<BankAccountInputProps> = ({
  label = 'Bank Account Number',
  value,
  onChange,
  ...props
}) => {
  const [touched, setTouched] = useState(false);

  const validateAcc = (val: string): boolean => {
    return /^\d{7,11}$/.test(val);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, 11);
    const valid = validateAcc(raw);
    onChange(raw, valid);
  };

  const isValid = validateAcc(value || '');
  const error = touched && value && !isValid ? 'Account number must be strictly numeric and between 7 and 11 digits.' : undefined;

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className={`input-field-wrapper ${touched ? 'focused' : ''} ${error ? 'invalid' : ''} ${isValid ? 'valid' : ''}`}>
        <span style={{ paddingLeft: '12px', color: 'var(--ui-muted)', display: 'flex', alignItems: 'center' }}><Hash size={16} /></span>
        <input
          className="input-field"
          type="text"
          placeholder="e.g. 123456789"
          value={value}
          onChange={handleChange}
          onFocus={() => setTouched(true)}
          onBlur={() => setTouched(true)}
          {...props}
        />
        {isValid && <span style={{ color: 'var(--ui-green)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><Check size={16} /></span>}
        {error && <span style={{ color: 'var(--ui-red)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><AlertCircle size={16} /></span>}
      </div>
      {error && <span className="input-helper error">{error}</span>}
    </div>
  );
};

// --- 2.4M BRANCH CODE INPUT (strictly 6 numeric digits) ---
interface BranchCodeInputProps extends Omit<TextInputProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
}

export const BranchCodeInput: React.FC<BranchCodeInputProps> = ({
  label = 'Bank Branch Code',
  value,
  onChange,
  ...props
}) => {
  const [touched, setTouched] = useState(false);

  const validateBranch = (val: string): boolean => {
    return /^\d{6}$/.test(val);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, 6);
    const valid = validateBranch(raw);
    onChange(raw, valid);
  };

  const isValid = validateBranch(value || '');
  const error = touched && value && !isValid ? 'Branch code must be exactly 6 numeric digits.' : undefined;

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className={`input-field-wrapper ${touched ? 'focused' : ''} ${error ? 'invalid' : ''} ${isValid ? 'valid' : ''}`}>
        <span style={{ paddingLeft: '12px', color: 'var(--ui-muted)', display: 'flex', alignItems: 'center' }}><Hash size={16} /></span>
        <input
          className="input-field"
          type="text"
          placeholder="e.g. 632005"
          value={value}
          onChange={handleChange}
          onFocus={() => setTouched(true)}
          onBlur={() => setTouched(true)}
          {...props}
        />
        {isValid && <span style={{ color: 'var(--ui-green)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><Check size={16} /></span>}
        {error && <span style={{ color: 'var(--ui-red)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><AlertCircle size={16} /></span>}
      </div>
      {error && <span className="input-helper error">{error}</span>}
    </div>
  );
};

// --- 2.4N URL / WEBSITE LINK INPUT (auto-prepends https:// on blur) ---
interface URLInputProps extends Omit<TextInputProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
}

export const URLInput: React.FC<URLInputProps> = ({
  label = 'Website Address',
  value,
  onChange,
  ...props
}) => {
  const [touched, setTouched] = useState(false);

  const validateURL = (val: string): boolean => {
    if (val.includes(' ')) return false;
    return val.includes('.') && val.indexOf('.') < val.length - 1;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ') e.preventDefault();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.trim().replace(/\s/g, '');
    const valid = validateURL(raw);
    onChange(raw, valid);
  };

  const handleBlur = () => {
    setTouched(true);
    if (value && !/^https?:\/\//i.test(value) && validateURL(value)) {
      // Auto prepend https://
      const prepended = `https://${value}`;
      onChange(prepended, true);
    }
  };

  const isValid = validateURL(value || '');
  const error = touched && value && !isValid ? 'Please enter a valid website domain. Rejects spaces.' : undefined;

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className={`input-field-wrapper ${touched ? 'focused' : ''} ${error ? 'invalid' : ''} ${isValid ? 'valid' : ''}`}>
        <span style={{ paddingLeft: '12px', color: 'var(--ui-muted)', display: 'flex', alignItems: 'center' }}><Globe size={16} /></span>
        <input
          className="input-field"
          type="text"
          placeholder="e.g. google.com"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => setTouched(true)}
          {...props}
        />
        {isValid && <span style={{ color: 'var(--ui-green)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><Check size={16} /></span>}
        {error && <span style={{ color: 'var(--ui-red)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><AlertCircle size={16} /></span>}
      </div>
      {error && <span className="input-helper error">{error}</span>}
    </div>
  );
};

// --- 2.4O IP ADDRESS INPUT (four independent segment boxes <= 255) ---
interface IPAddressInputProps extends Omit<TextInputProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
}

export const IPAddressInput: React.FC<IPAddressInputProps> = ({
  label = 'IPv4 Address',
  value,
  onChange
}) => {
  const [blocks, setBlocks] = useState<string[]>(['', '', '', '']);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (value) {
      const parts = value.split('.');
      if (parts.length === 4) {
        setBlocks(parts);
      }
    } else {
      setBlocks(['', '', '', '']);
    }
  }, [value]);

  const validateIP = (parts: string[]): boolean => {
    return parts.every(p => {
      const num = parseInt(p, 10);
      return !isNaN(num) && num >= 0 && num <= 255 && /^\d+$/.test(p);
    });
  };

  const handleBlockChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const raw = e.target.value.replace(/\D/g, '');
    const clean = raw.substring(0, 3);
    
    // Validate value <= 255
    if (clean !== '' && parseInt(clean, 10) > 255) return;

    const nextBlocks = [...blocks];
    nextBlocks[idx] = clean;
    setBlocks(nextBlocks);

    const joined = nextBlocks.join('.');
    const valid = nextBlocks.every(b => b !== '') && validateIP(nextBlocks);
    onChange(joined, valid);

    // Auto advance focus
    if (clean.length === 3 && idx < 3) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === '.' && blocks[idx] !== '' && idx < 3) {
      e.preventDefault();
      inputsRef.current[idx + 1]?.focus();
    } else if (e.key === 'Backspace' && blocks[idx] === '' && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const isValid = blocks.every(b => b !== '') && validateIP(blocks);
  const error = touched && blocks.some(b => b !== '') && !isValid ? 'Each block must sit strictly between 0 and 255.' : undefined;

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div 
        className={`input-field-wrapper ${touched ? 'focused' : ''} ${error ? 'invalid' : ''} ${isValid ? 'valid' : ''}`}
        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0 12px' }}
      >
        <span style={{ color: 'var(--ui-muted)' }}><Globe size={16} /></span>
        {blocks.map((block, idx) => (
          <React.Fragment key={idx}>
            <input
              ref={el => inputsRef.current[idx] = el}
              className="input-field"
              style={{ width: '42px', textAlign: 'center', padding: '10px 0' }}
              maxLength={3}
              placeholder="___"
              value={block}
              onChange={(e) => handleBlockChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onFocus={() => setTouched(true)}
              onBlur={() => setTouched(true)}
            />
            {idx < 3 && <span style={{ color: 'var(--ui-muted)', fontWeight: 800 }}>.</span>}
          </React.Fragment>
        ))}
        <div style={{ flex: 1 }} />
        {isValid && <span style={{ color: 'var(--ui-green)', display: 'flex', alignItems: 'center' }}><Check size={16} /></span>}
        {error && <span style={{ color: 'var(--ui-red)', display: 'flex', alignItems: 'center' }}><AlertCircle size={16} /></span>}
      </div>
      {error && <span className="input-helper error">{error}</span>}
    </div>
  );
};

// --- 2.4P MAC ADDRESS INPUT (XX:XX:XX:XX:XX:XX colon auto-inject, caps) ---
interface MACAddressInputProps extends Omit<TextInputProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
}

export const MACAddressInput: React.FC<MACAddressInputProps> = ({
  label = 'MAC Address',
  value,
  onChange,
  ...props
}) => {
  const [touched, setTouched] = useState(false);
  const [displayVal, setDisplayVal] = useState('');

  const formatMAC = (val: string) => {
    const clean = val.replace(/[^A-Fa-f0-9]/g, '').substring(0, 12).toUpperCase();
    const parts = [];
    for (let i = 0; i < clean.length; i += 2) {
      parts.push(clean.slice(i, i + 2));
    }
    return parts.join(':');
  };

  useEffect(() => {
    if (value) {
      setDisplayVal(formatMAC(value));
    } else {
      setDisplayVal('');
    }
  }, [value]);

  const validateMAC = (val: string): boolean => {
    return /^[A-Fa-f0-9]{12}$/.test(val);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^A-Fa-f0-9]/g, '');
    setDisplayVal(formatMAC(raw));
    const valid = validateMAC(raw);
    onChange(raw, valid);
  };

  const isValid = validateMAC(value || '');
  const error = touched && value && !isValid ? 'MAC Address must be exactly 12 Hexadecimal characters (colons injected).' : undefined;

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className={`input-field-wrapper ${touched ? 'focused' : ''} ${error ? 'invalid' : ''} ${isValid ? 'valid' : ''}`}>
        <span style={{ paddingLeft: '12px', color: 'var(--ui-muted)', display: 'flex', alignItems: 'center' }}><Hash size={16} /></span>
        <input
          className="input-field"
          type="text"
          placeholder="XX:XX:XX:XX:XX:XX"
          value={displayVal}
          onChange={handleChange}
          onFocus={() => setTouched(true)}
          onBlur={() => setTouched(true)}
          {...props}
        />
        {isValid && <span style={{ color: 'var(--ui-green)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><Check size={16} /></span>}
        {error && <span style={{ color: 'var(--ui-red)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><AlertCircle size={16} /></span>}
      </div>
      {error && <span className="input-helper error">{error}</span>}
    </div>
  );
};

// --- 2.4Q HEX COLOR CODE INPUT (auto-prepends #, live preview box on left) ---
interface HexColorInputProps extends Omit<TextInputProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
}

export const HexColorInput: React.FC<HexColorInputProps> = ({
  label = 'Hex Color Code',
  value,
  onChange,
  ...props
}) => {
  const [touched, setTouched] = useState(false);

  const validateHex = (val: string): boolean => {
    return /^[A-Fa-f0-9]{3}$|^[A-Fa-f0-9]{6}$/.test(val);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^A-Fa-f0-9]/g, '').substring(0, 6);
    const valid = validateHex(raw);
    onChange(raw, valid);
  };

  const isValid = validateHex(value || '');
  const colorStr = isValid ? `#${value}` : '#888888';
  const error = touched && value && !isValid ? 'Hex code must be strictly 3 or 6 Hexadecimal characters.' : undefined;

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className={`input-field-wrapper ${touched ? 'focused' : ''} ${error ? 'invalid' : ''} ${isValid ? 'valid' : ''}`}>
        
        {/* Dynamic Color Box */}
        <div style={{
          marginLeft: '12px',
          width: '18px',
          height: '18px',
          borderRadius: '4px',
          background: colorStr,
          border: '1px solid var(--ui-line)',
          transition: 'background 0.20s'
        }} />
        <span style={{ fontSize: '13px', fontWeight: 800, paddingLeft: '8px', color: 'var(--ui-muted)' }}>#</span>
        
        <input
          className="input-field"
          style={{ paddingLeft: '4px' }}
          type="text"
          placeholder="3b82f6"
          value={value}
          onChange={handleChange}
          onFocus={() => setTouched(true)}
          onBlur={() => setTouched(true)}
          {...props}
        />
        {isValid && <span style={{ color: 'var(--ui-green)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><Check size={16} /></span>}
        {error && <span style={{ color: 'var(--ui-red)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><AlertCircle size={16} /></span>}
      </div>
      {error && <span className="input-helper error">{error}</span>}
    </div>
  );
};

// --- 2.4R SOCIAL MEDIA HANDLE INPUT (auto @, forced lower, spaces to separators) ---
interface SocialHandleInputProps extends Omit<TextInputProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
}

export const SocialHandleInput: React.FC<SocialHandleInputProps> = ({
  label = 'Social Username Handle',
  value,
  onChange,
  ...props
}) => {
  const [touched, setTouched] = useState(false);

  const validateHandle = (val: string): boolean => {
    return val.length >= 2 && /^[a-z0-9_.-]+$/.test(val);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_.-]/g, '');
    const valid = validateHandle(raw);
    onChange(raw, valid);
  };

  const isValid = validateHandle(value || '');
  const error = touched && value && !isValid ? 'Handle must be at least 2 chars of lowercase, numbers, dots, or underscores.' : undefined;

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className={`input-field-wrapper ${touched ? 'focused' : ''} ${error ? 'invalid' : ''} ${isValid ? 'valid' : ''}`}>
        <span style={{ paddingLeft: '12px', fontSize: '13px', fontWeight: 800, color: 'var(--ui-muted)' }}>@</span>
        <input
          className="input-field"
          style={{ paddingLeft: '4px' }}
          type="text"
          placeholder="username"
          value={value}
          onChange={handleChange}
          onFocus={() => setTouched(true)}
          onBlur={() => setTouched(true)}
          {...props}
        />
        {isValid && <span style={{ color: 'var(--ui-green)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><Check size={16} /></span>}
        {error && <span style={{ color: 'var(--ui-red)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><AlertCircle size={16} /></span>}
      </div>
      {error && <span className="input-helper error">{error}</span>}
    </div>
  );
};

// --- 2.4S PERCENTAGE INPUT (right pinned %, bounds [0, 100]) ---
interface PercentageInputProps extends Omit<TextInputProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
  allowOver100?: boolean;
}

export const PercentageInput: React.FC<PercentageInputProps> = ({
  label = 'Ratio Percentage',
  value,
  onChange,
  allowOver100 = false,
  ...props
}) => {
  const [touched, setTouched] = useState(false);

  const validatePercent = (val: string): boolean => {
    const num = parseFloat(val);
    if (isNaN(num)) return false;
    if (num < 0) return false;
    if (num > 100 && !allowOver100) return false;
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d.]/g, '');
    const numVal = parseFloat(raw);
    
    let cleanVal = raw;
    if (!isNaN(numVal) && numVal > 100 && !allowOver100) {
      cleanVal = '100';
    }

    const valid = validatePercent(cleanVal);
    onChange(cleanVal, valid);
  };

  const isValid = validatePercent(value || '');
  const error = touched && value && !isValid ? 'Percentage must be between 0 and 100.' : undefined;

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className={`input-field-wrapper ${touched ? 'focused' : ''} ${error ? 'invalid' : ''} ${isValid ? 'valid' : ''}`}>
        <input
          className="input-field"
          type="text"
          placeholder="0"
          value={value}
          onChange={handleChange}
          onFocus={() => setTouched(true)}
          onBlur={() => setTouched(true)}
          {...props}
        />
        {isValid && <span style={{ color: 'var(--ui-green)', paddingRight: '6px', display: 'flex', alignItems: 'center' }}><Check size={16} /></span>}
        {error && <span style={{ color: 'var(--ui-red)', paddingRight: '6px', display: 'flex', alignItems: 'center' }}><AlertCircle size={16} /></span>}
        <span style={{ paddingRight: '12px', fontSize: '13px', fontWeight: 800, color: 'var(--ui-muted)', display: 'flex', alignItems: 'center' }}><Percent size={14} /></span>
      </div>
      {error && <span className="input-helper error">{error}</span>}
    </div>
  );
};

// --- 2.4T UNIT MEASUREMENT INPUT (split value & locked units dropdown) ---
interface UnitMeasurementInputProps extends Omit<TextInputProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
  unit: string;
  onUnitChange: (unit: string) => void;
  units?: string[];
}

export const UnitMeasurementInput: React.FC<UnitMeasurementInputProps> = ({
  label = 'Inventory Measurement',
  value,
  onChange,
  unit,
  onUnitChange,
  units = ['kg', 'liters', 'cm', 'm', 'tons', 'g'],
  ...props
}) => {
  const [touched, setTouched] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const validateMeasure = (val: string): boolean => {
    return val !== '' && !isNaN(parseFloat(val)) && /^\d*\.?\d*$/.test(val);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d.]/g, '');
    const valid = validateMeasure(raw);
    onChange(raw, valid);
  };

  const isValid = validateMeasure(value || '');
  const error = touched && value && !isValid ? 'Value must be strictly numeric.' : undefined;

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className={`input-field-wrapper ${touched ? 'focused' : ''} ${error ? 'invalid' : ''} ${isValid ? 'valid' : ''}`}>
        <span style={{ paddingLeft: '12px', color: 'var(--ui-muted)', display: 'flex', alignItems: 'center' }}><Sliders size={16} /></span>
        <input
          className="input-field"
          type="text"
          placeholder="0.0"
          value={value}
          onChange={handleChange}
          onFocus={() => setTouched(true)}
          onBlur={() => setTouched(true)}
          {...props}
        />
        {isValid && <span style={{ color: 'var(--ui-green)', paddingRight: '6px', display: 'flex', alignItems: 'center' }}><Check size={16} /></span>}
        {error && <span style={{ color: 'var(--ui-red)', paddingRight: '6px', display: 'flex', alignItems: 'center' }}><AlertCircle size={16} /></span>}
        
        {/* Custom Designed Dropdown segment */}
        <div style={{ width: '1px', height: '20px', background: 'var(--ui-line)', margin: '0 4px' }} />
        <div ref={dropdownRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: 'transparent',
              border: 0,
              color: 'var(--ui-text)',
              fontSize: '13px',
              fontWeight: 700,
              paddingRight: '14px',
              cursor: 'pointer',
              outline: 0,
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              height: '100%'
            }}
          >
            <span>{unit}</span>
            <span style={{ fontSize: '10px', color: 'var(--ui-muted)' }}>▼</span>
          </button>

          {isOpen && (
            <div style={{
              position: 'absolute',
              top: '110%',
              right: '6px',
              background: 'var(--ui-panel-pure)',
              border: '1px solid var(--ui-line)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--ui-shadow-md)',
              zIndex: 1000,
              width: '80px',
              overflow: 'hidden',
              padding: '4px'
            }}>
              <div style={{ maxHeight: '120px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {units.map(u => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => { onUnitChange(u); setIsOpen(false); }}
                    style={{
                      textAlign: 'left',
                      background: u === unit ? 'var(--ui-primary-soft)' : 'transparent',
                      border: 0,
                      borderRadius: 'var(--radius-sm)',
                      padding: '6px 8px',
                      color: u === unit ? 'var(--ui-primary-deep)' : 'var(--ui-text)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      width: '100%'
                    }}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {error && <span className="input-helper error">{error}</span>}
    </div>
  );
};

// --- 2.4U POSTAL CODE INPUT (strictly 4 digits for SA vs global alphanumeric) ---
interface PostalCodeInputProps extends Omit<TextInputProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
  isGlobal?: boolean;
}

export const PostalCodeInput: React.FC<PostalCodeInputProps> = ({
  label = 'Postal / ZIP Code',
  value,
  onChange,
  isGlobal = false,
  ...props
}) => {
  const [touched, setTouched] = useState(false);

  const validateZIP = (val: string): boolean => {
    if (isGlobal) {
      return val.length >= 3 && val.length <= 10 && /^[A-Za-z0-9\s-]+$/.test(val);
    }
    return /^\d{4}$/.test(val); // strictly 4 numeric digits for SA
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = isGlobal 
      ? e.target.value.toUpperCase().substring(0, 10)
      : e.target.value.replace(/\D/g, '').substring(0, 4);
    const valid = validateZIP(raw);
    onChange(raw, valid);
  };

  const isValid = validateZIP(value || '');
  const error = touched && value && !isValid 
    ? isGlobal ? 'Invalid global ZIP format.' : 'South African postal code must be exactly 4 numeric digits.'
    : undefined;

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className={`input-field-wrapper ${touched ? 'focused' : ''} ${error ? 'invalid' : ''} ${isValid ? 'valid' : ''}`}>
        <span style={{ paddingLeft: '12px', color: 'var(--ui-muted)', display: 'flex', alignItems: 'center' }}><MapPin size={16} /></span>
        <input
          className="input-field"
          type="text"
          placeholder={isGlobal ? 'SW1A 1AA' : '8001'}
          value={value}
          onChange={handleChange}
          onFocus={() => setTouched(true)}
          onBlur={() => setTouched(true)}
          {...props}
        />
        {isValid && <span style={{ color: 'var(--ui-green)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><Check size={16} /></span>}
        {error && <span style={{ color: 'var(--ui-red)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><AlertCircle size={16} /></span>}
      </div>
      {error && <span className="input-helper error">{error}</span>}
    </div>
  );
};

// --- 2.4V GPS COORDINATES INPUT (Lat [-90, 90] & Long [-180, 180] dual numeric check) ---
interface GPSCoordinatesInputProps {
  label?: string;
  latValue: string;
  longValue: string;
  onChange: (lat: string, long: string, isValid: boolean) => void;
}

export const GPSCoordinatesInput: React.FC<GPSCoordinatesInputProps> = ({
  label = 'GPS Coordinates (Latitude & Longitude)',
  latValue,
  longValue,
  onChange
}) => {
  const [touched, setTouched] = useState(false);

  const cleanNumeric = (val: string) => {
    let clean = val.replace(/[^\d.-]/g, '');
    const parts = clean.split('.');
    if (parts.length > 2) clean = `${parts[0]}.${parts.slice(1).join('')}`;
    // minus only at start
    const isNeg = clean.startsWith('-');
    clean = clean.replace(/-/g, '');
    if (isNeg) clean = `-${clean}`;
    return clean;
  };

  const validateLat = (lat: string): boolean => {
    const n = parseFloat(lat);
    return !isNaN(n) && n >= -90.0 && n <= 90.0 && /^-?\d*\.?\d*$/.test(lat);
  };

  const validateLong = (long: string): boolean => {
    const n = parseFloat(long);
    return !isNaN(n) && n >= -180.0 && n <= 180.0 && /^-?\d*\.?\d*$/.test(long);
  };

  const handleLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextLat = cleanNumeric(e.target.value);
    const valid = validateLat(nextLat) && validateLong(longValue);
    onChange(nextLat, longValue, valid);
  };

  const handleLongChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextLong = cleanNumeric(e.target.value);
    const valid = validateLat(latValue) && validateLong(nextLong);
    onChange(latValue, nextLong, valid);
  };

  const latValid = validateLat(latValue);
  const longValid = validateLong(longValue);

  let error = undefined;
  if (touched) {
    if (latValue && !latValid) {
      error = 'Latitude must sit strictly between -90.0 and 90.0.';
    } else if (longValue && !longValid) {
      error = 'Longitude must sit strictly between -180.0 and 180.0.';
    }
  }

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className={`input-field-wrapper ${touched ? 'focused' : ''} ${touched && latValue && !latValid ? 'invalid' : ''} ${latValid ? 'valid' : ''}`}>
          <span style={{ paddingLeft: '12px', fontSize: '11px', fontWeight: 800, color: 'var(--ui-muted)' }}>LAT</span>
          <input
            className="input-field"
            style={{ paddingLeft: '6px' }}
            placeholder="e.g. -33.9249"
            value={latValue}
            onChange={handleLatChange}
            onFocus={() => setTouched(true)}
            onBlur={() => setTouched(true)}
          />
        </div>
        <div className={`input-field-wrapper ${touched ? 'focused' : ''} ${touched && longValue && !longValid ? 'invalid' : ''} ${longValid ? 'valid' : ''}`}>
          <span style={{ paddingLeft: '12px', fontSize: '11px', fontWeight: 800, color: 'var(--ui-muted)' }}>LONG</span>
          <input
            className="input-field"
            style={{ paddingLeft: '6px' }}
            placeholder="e.g. 18.4241"
            value={longValue}
            onChange={handleLongChange}
            onFocus={() => setTouched(true)}
            onBlur={() => setTouched(true)}
          />
        </div>
      </div>
      {error && <span className="input-helper error">{error}</span>}
    </div>
  );
};

// --- 2.4W STRICT PASSWORD CREATOR (interactive real-time requirements checklist) ---
interface StrictPasswordCreatorProps extends Omit<TextInputProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
}

export const StrictPasswordCreator: React.FC<StrictPasswordCreatorProps> = ({
  label = 'Password',
  value,
  onChange,
  ...props
}) => {
  const [touched, setTouched] = useState(false);
  const [show, setShow] = useState(false);

  const checks = [
    { label: 'Minimum 8 characters', test: (v: string) => v.length >= 8 },
    { label: '1 Uppercase Letter', test: (v: string) => /[A-Z]/.test(v) },
    { label: '1 Lowercase Letter', test: (v: string) => /[a-z]/.test(v) },
    { label: '1 Number', test: (v: string) => /[0-9]/.test(v) },
    { label: '1 Special Character', test: (v: string) => /[^A-Za-z0-9]/.test(v) }
  ];

  const isValid = checks.every(c => c.test(value || ''));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const valid = checks.every(c => c.test(raw));
    onChange(raw, valid);
  };

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className={`input-field-wrapper ${touched ? 'focused' : ''} ${touched && !isValid ? 'invalid' : ''} ${isValid ? 'valid' : ''}`}>
        <span style={{ paddingLeft: '12px', color: 'var(--ui-muted)', display: 'flex', alignItems: 'center' }}><Lock size={16} /></span>
        <input
          className="input-field"
          type={show ? 'text' : 'password'}
          placeholder="Create strict password..."
          value={value}
          onChange={handleChange}
          onFocus={() => setTouched(true)}
          onBlur={() => setTouched(true)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          style={{ background: 'transparent', border: 0, paddingLeft: '8px', paddingRight: '12px', color: 'var(--ui-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      
      {/* Requirements checklist (allocated permanent 110px height to avoid layout shift) */}
      <div style={{
        marginTop: '10px',
        background: 'var(--ui-panel-strong)',
        border: '1px solid var(--ui-line)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        minHeight: '114px'
      }}>
        {checks.map((check, idx) => {
          const passed = check.test(value || '');
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 700, color: passed ? 'var(--ui-green)' : 'var(--ui-muted)' }}>
              {passed ? (
                <Check size={12} style={{ strokeWidth: 3 }} />
              ) : (
                <div style={{ width: '12px', height: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>✗</div>
              )}
              <span>{check.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- 2.4X ADVANCED OTP INPUT (4/6/8 length, backward-nav, smart paste parser) ---
interface AdvancedOTPInputProps {
  length?: 4 | 6 | 8;
  value: string;
  onChange: (code: string, isValid: boolean) => void;
}

export const AdvancedOTPInput: React.FC<AdvancedOTPInputProps> = ({
  length = 6,
  value,
  onChange
}) => {
  const [vals, setVals] = useState<string[]>(Array(length).fill(''));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (value) {
      const parts = value.substring(0, length).split('');
      const filled = parts.concat(Array(length - parts.length).fill(''));
      setVals(filled);
    } else {
      setVals(Array(length).fill(''));
    }
  }, [value, length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const v = e.target.value.replace(/\D/g, '');
    if (v.length > 0) {
      const char = v.slice(-1);
      const newVals = [...vals];
      newVals[idx] = char;
      setVals(newVals);
      
      const joined = newVals.join('');
      onChange(joined, joined.length === length);

      // Auto-advance focus
      if (idx < length - 1) {
        inputsRef.current[idx + 1]?.focus();
      }
    } else {
      const newVals = [...vals];
      newVals[idx] = '';
      setVals(newVals);
      const joined = newVals.join('');
      onChange(joined, false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace') {
      if (vals[idx] === '' && idx > 0) {
        inputsRef.current[idx - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const data = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    const newVals = data.split('').concat(Array(length - data.length).fill(''));
    setVals(newVals);
    
    const joined = newVals.join('');
    onChange(joined, joined.length === length);
    
    // Focus last filled box
    const focusIdx = Math.min(data.length, length - 1);
    inputsRef.current[focusIdx]?.focus();
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }} onPaste={handlePaste}>
      {vals.map((v, idx) => (
        <input
          key={idx}
          ref={el => inputsRef.current[idx] = el}
          className="otp-box"
          maxLength={1}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          style={{
            width: length === 8 ? '36px' : '44px',
            height: length === 8 ? '36px' : '44px',
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: 800,
            background: 'var(--ui-panel-strong)',
            border: '1.5px solid var(--ui-line)',
            borderRadius: '8px',
            color: 'var(--ui-text)',
            outline: 0
          }}
          value={v}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
        />
      ))}
    </div>
  );
};

// --- 2.4Y TIME DURATION INPUT (HH : MM visual mask, bounds verification) ---
interface TimeDurationInputProps extends Omit<TextInputProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
}

export const TimeDurationInput: React.FC<TimeDurationInputProps> = ({
  label = 'Time Duration (HH:MM)',
  value,
  onChange,
  ...props
}) => {
  const [touched, setTouched] = useState(false);
  const [displayVal, setDisplayVal] = useState('');

  const formatDuration = (val: string) => {
    const clean = val.replace(/\D/g, '').substring(0, 4);
    if (clean.length <= 2) return clean;
    return `${clean.slice(0, 2)} : ${clean.slice(2)}`;
  };

  useEffect(() => {
    if (value) {
      setDisplayVal(formatDuration(value));
    } else {
      setDisplayVal('');
    }
  }, [value]);

  const validateDuration = (val: string): boolean => {
    if (val.length !== 4) return false;
    const hh = parseInt(val.substring(0, 2));
    const mm = parseInt(val.substring(2, 4));
    return hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, 4);
    setDisplayVal(formatDuration(raw));
    const valid = validateDuration(raw);
    onChange(raw, valid);
  };

  const isValid = validateDuration(value || '');
  const error = touched && value && !isValid ? 'Duration HH must be 00-23, and MM must be 00-59.' : undefined;

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className={`input-field-wrapper ${touched ? 'focused' : ''} ${error ? 'invalid' : ''} ${isValid ? 'valid' : ''}`}>
        <span style={{ paddingLeft: '12px', color: 'var(--ui-muted)', display: 'flex', alignItems: 'center' }}><Clock size={16} /></span>
        <input
          className="input-field"
          type="text"
          placeholder="HH : MM"
          value={displayVal}
          onChange={handleChange}
          onFocus={() => setTouched(true)}
          onBlur={() => setTouched(true)}
          {...props}
        />
        {isValid && <span style={{ color: 'var(--ui-green)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><Check size={16} /></span>}
        {error && <span style={{ color: 'var(--ui-red)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><AlertCircle size={16} /></span>}
      </div>
      {error && <span className="input-helper error">{error}</span>}
    </div>
  );
};

// --- 2.4Z DATE OF BIRTH INPUT (future block, minAge math restriction) ---
interface DOBInputProps {
  label?: string;
  value: string; // YYYY-MM-DD
  onChange: (value: string, isValid: boolean) => void;
  minAge?: number;
}

export const DOBInput: React.FC<DOBInputProps> = ({
  label = 'Date of Birth (Age Restricted)',
  value,
  onChange,
  minAge = 0
}) => {
  const [touched, setTouched] = useState(false);

  const getMaxDateStr = (): string => {
    const today = new Date();
    if (minAge > 0) {
      today.setFullYear(today.getFullYear() - minAge);
    }
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const validateDOB = (val: string): boolean => {
    if (!val) return false;
    const selected = new Date(val);
    const today = new Date();
    
    // Future block
    if (selected > today) return false;

    // minAge restriction check
    if (minAge > 0) {
      const maxAllowed = new Date();
      maxAllowed.setFullYear(today.getFullYear() - minAge);
      return selected <= maxAllowed;
    }
    
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const valid = validateDOB(val);
    onChange(val, valid);
  };

  const isValid = validateDOB(value);
  const maxDate = getMaxDateStr();
  
  let error = undefined;
  if (touched && value && !isValid) {
    if (new Date(value) > new Date()) {
      error = 'Date of birth cannot be in the future.';
    } else {
      error = `You must be at least ${minAge} years old to proceed.`;
    }
  }

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className={`input-field-wrapper ${touched ? 'focused' : ''} ${error ? 'invalid' : ''} ${isValid ? 'valid' : ''}`}>
        <span style={{ paddingLeft: '12px', color: 'var(--ui-muted)', display: 'flex', alignItems: 'center' }}><Calendar size={16} /></span>
        <input
          className="input-field"
          type="date"
          max={maxDate}
          value={value}
          onChange={handleChange}
          onFocus={() => setTouched(true)}
          onBlur={() => setTouched(true)}
          style={{ cursor: 'pointer' }}
        />
        {isValid && <span style={{ color: 'var(--ui-green)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><Check size={16} /></span>}
        {error && <span style={{ color: 'var(--ui-red)', paddingRight: '12px', display: 'flex', alignItems: 'center' }}><AlertCircle size={16} /></span>}
      </div>
      {error && <span className="input-helper error">{error}</span>}
    </div>
  );
};


// --- 2.5 NUMBER STEPPER ---
interface NumberStepperProps {
  label?: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const NumberStepper: React.FC<NumberStepperProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1
}) => {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className="stepper-container">
        <button
          type="button"
          className="stepper-btn"
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - step))}
        >
          -
        </button>
        <span className="stepper-value">{value}</span>
        <button
          type="button"
          className="stepper-btn"
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + step))}
        >
          +
        </button>
      </div>
    </div>
  );
};

// --- 2.6 OTP / PIN INPUT ---
interface OTPInputProps {
  length?: number;
  onChange: (code: string) => void;
}

export const OTPInput: React.FC<OTPInputProps> = ({ length = 4, onChange }) => {
  const [vals, setVals] = useState<string[]>(Array(length).fill(''));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const v = e.target.value;
    if (/^[0-9]$/.test(v)) {
      const newVals = [...vals];
      newVals[idx] = v;
      setVals(newVals);
      onChange(newVals.join(''));
      
      // Auto-advance focus
      if (idx < length - 1) {
        inputsRef.current[idx + 1]?.focus();
      }
    } else if (v === '') {
      const newVals = [...vals];
      newVals[idx] = '';
      setVals(newVals);
      onChange(newVals.join(''));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace' && vals[idx] === '' && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const data = e.clipboardData.getData('text').slice(0, length);
    if (/^\d+$/.test(data)) {
      const newVals = data.split('').concat(Array(length - data.length).fill(''));
      setVals(newVals);
      onChange(newVals.join(''));
      inputsRef.current[Math.min(data.length, length - 1)]?.focus();
    }
  };

  return (
    <div className="otp-container" onPaste={handlePaste}>
      {vals.map((v, idx) => (
        <input
          key={idx}
          ref={el => inputsRef.current[idx] = el}
          className="otp-box"
          maxLength={1}
          value={v}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
        />
      ))}
    </div>
  );
};

// --- 2.7 TAG INPUT (Pill Combobox) ---
interface TagInputProps {
  label?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
}

export const TagInput: React.FC<TagInputProps> = ({ label, tags, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [focused, setFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        onChange([...tags, inputValue.trim()]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tagIdx: number) => {
    onChange(tags.filter((_, idx) => idx !== tagIdx));
  };

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div 
        className={`input-field-wrapper ${focused ? 'focused' : ''}`}
        style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '6px' }}
      >
        {tags.map((t, idx) => (
          <div 
            key={idx}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px', 
              background: 'var(--ui-primary-soft)', 
              color: 'var(--ui-primary-deep)',
              fontWeight: 700,
              fontSize: '12px',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <span>{t}</span>
            <button 
              type="button" 
              onClick={() => removeTag(idx)}
              style={{ background: 'transparent', border: 0, color: 'var(--ui-primary-deep)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <input
          className="input-field"
          style={{ width: 'auto', flex: 1, padding: '4px 8px' }}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={tags.length === 0 ? "Type and hit Enter..." : ""}
        />
      </div>
    </div>
  );
};

// --- 2.8 COLOR PICKER INPUT ---
interface ColorPickerProps {
  label?: string;
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ label, color, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const swatches = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];

  return (
    <div className="input-group" style={{ position: 'relative' }}>
      {label && <label className="input-label">{label}</label>}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--ui-line)',
            background: color,
            cursor: 'pointer',
            boxShadow: 'var(--ui-shadow-sm)'
          }}
        />
        <input 
          className="input-field" 
          value={color} 
          onChange={(e) => onChange(e.target.value)}
          style={{
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--ui-line)',
            background: 'var(--ui-panel-strong)',
            padding: '10px 14px',
            width: '120px'
          }}
        />
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '105%',
          left: 0,
          background: 'var(--ui-panel-pure)',
          border: '1px solid var(--ui-line)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
          boxShadow: 'var(--ui-shadow-md)',
          zIndex: 1000,
          width: '180px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {swatches.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => { onChange(s); setIsOpen(false); }}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  background: s,
                  border: color === s ? '2px solid var(--ui-text)' : '1px solid var(--ui-line)',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


// ==========================================================================
// 🛡️ 12. ADVANCED DUAL-MODE RICH TEXT & HTML EDITOR
// ==========================================================================

/**
 * Custom zero-trust offscreen DOMParser sanitizer.
 * Strips script tags, iframes, meta tags, applets, event handlers, and javascript: links.
 * Whitelists safe styling, formatting elements, links, images, blockquotes, and tables.
 */
export const sanitizeHTML = (html: string): string => {
  if (!html) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const body = doc.body;

  const allowedTags = new Set([
    'P', 'BR', 'DIV', 'SPAN', 'STRONG', 'B', 'EM', 'I', 'U', 'S', 'STRIKE',
    'UL', 'OL', 'LI', 'BLOCKQUOTE', 'A', 'IMG', 'TABLE', 'THEAD', 'TBODY',
    'TR', 'TH', 'TD', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'FONT'
  ]);

  const allowedAttrs = new Set([
    'href', 'src', 'alt', 'title', 'style', 'class', 'target', 'width', 'height', 'align', 'border', 'cellpadding', 'cellspacing'
  ]);

  const sanitizeNode = (node: Node): Node | null => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.cloneNode(true);
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return null;
    }

    const element = node as HTMLElement;
    const tagName = element.tagName.toUpperCase();

    // Strip highly dangerous subtrees completely
    const dangerousTags = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'META', 'LINK', 'APPLET', 'HEAD', 'HTML', 'TITLE']);
    if (dangerousTags.has(tagName)) {
      return null;
    }

    let newElement: HTMLElement | null = null;
    if (allowedTags.has(tagName)) {
      newElement = document.createElement(tagName.toLowerCase());

      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        const name = attr.name.toLowerCase();
        const value = attr.value;

        // Strip event handlers
        if (name.startsWith('on') || !allowedAttrs.has(name)) {
          continue;
        }

        // Strip javascript: / data: URI injections
        if (name === 'href' || name === 'src') {
          const cleanVal = value.trim().toLowerCase();
          if (cleanVal.startsWith('javascript:') || cleanVal.startsWith('data:') || cleanVal.startsWith('vbscript:')) {
            continue;
          }
        }

        newElement.setAttribute(name, value);
      }
    }

    const fragment = document.createDocumentFragment();
    element.childNodes.forEach((child) => {
      const sanitizedChild = sanitizeNode(child);
      if (sanitizedChild) {
        fragment.appendChild(sanitizedChild);
      }
    });

    if (newElement) {
      newElement.appendChild(fragment);
      return newElement;
    } else {
      return fragment;
    }
  };

  const finalFragment = document.createDocumentFragment();
  body.childNodes.forEach((child) => {
    const sanitizedChild = sanitizeNode(child);
    if (sanitizedChild) {
      finalFragment.appendChild(sanitizedChild);
    }
  });

  const tempDiv = document.createElement('div');
  tempDiv.appendChild(finalFragment);
  return tempDiv.innerHTML;
};

/**
 * Real-time care-matched syntax highlighter for HTML.
 * Color-codes HTML tags in teal, attribute names in green, strings in orange, and comments in italic grey.
 */
export const highlightHTML = (code: string): string => {
  if (!code) return '';

  let escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Style Comments
  escaped = escaped.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span style="color: var(--ui-muted-2); font-style: italic;">$1</span>');

  // Style Tags & Attributes
  escaped = escaped.replace(/(&lt;)(\/?[a-zA-Z1-6]+)([\s\S]*?)(&gt;)/g, (_match: string, lt: string, tagName: string, attrs: string, gt: string) => {
    const highlightedTag = `${lt}<span style="color: #2dd4bf; font-weight: 700;">${tagName}</span>`;
    
    const highlightedAttrs = attrs.replace(/([a-zA-Z0-9:-]+)\s*=\s*(['"])([\s\S]*?)\2/g, (_m: string, attrName: string, quote: string, attrVal: string) => {
      return `<span style="color: #4ade80;">${attrName}</span>=<span style="color: #fb923c;">${quote}${attrVal}${quote}</span>`;
    });

    return `${highlightedTag}${highlightedAttrs}${gt}`;
  });

  return escaped;
};

/**
 * Dynamically loads a Google Font stylesheet on-demand into both the parent head
 * and the sandboxed editor iframe head, preventing unnecessary heavy preloads.
 */
export const loadGoogleFont = (fontFamily: string, iframeDoc?: Document | null) => {
  const formattedFont = fontFamily.replace(/\s+/g, '+');
  const fontUrl = `https://fonts.googleapis.com/css2?family=${formattedFont}:wght@400;700&display=swap`;

  const appendLink = (doc: Document) => {
    const id = `gfont-${fontFamily.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    if (doc.getElementById(id)) return; // Already loaded

    const link = doc.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = fontUrl;
    doc.head.appendChild(link);
  };

  appendLink(document);
  if (iframeDoc) {
    appendLink(iframeDoc);
  }
};

export interface AdvancedRichEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
  onImageUpload?: (file: File) => Promise<string>;
}

export const AdvancedRichEditor: React.FC<AdvancedRichEditorProps> = ({
  label,
  value,
  onChange,
  placeholder,
  height = '350px',
  onImageUpload
}) => {
  const [viewMode, setViewMode] = useState<'visual' | 'html'>('visual');
  const [activeDropdown, setActiveDropdown] = useState<'format' | 'font' | 'color' | 'link' | 'image' | 'table' | null>(null);
  const [editorHeight, setEditorHeight] = useState(height);
  const [isResizing, setIsResizing] = useState(false);
  const [fontSearch, setFontSearch] = useState('');
  const loadedFontsRef = useRef<Set<string>>(new Set(['Inter']));
  
  // Custom dialog input states
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);

  // Image Upload states
  const [imageSourceMode, setImageSourceMode] = useState<'url' | 'upload'>('url');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    alignLeft: false,
    alignCenter: false,
    alignRight: false,
    alignJustify: false,
    heading1: false,
    heading2: false,
    blockquote: false
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef(false);
  const iframeInitializedRef = useRef(false);

  // Sync scroll between textarea, pre highlighter, and line numbers
  const handleScroll = () => {
    if (!textareaRef.current) return;
    const ta = textareaRef.current;
    if (preRef.current) {
      preRef.current.scrollTop = ta.scrollTop;
      preRef.current.scrollLeft = ta.scrollLeft;
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = ta.scrollTop;
    }
  };

  // Inspect iframe current formatting states to toggle toolbar button colors
  const updateActiveStyles = () => {
    if (viewMode !== 'visual' || !iframeRef.current) return;
    const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
    if (!iframeDoc) return;

    setActiveStyles({
      bold: iframeDoc.queryCommandState('bold'),
      italic: iframeDoc.queryCommandState('italic'),
      underline: iframeDoc.queryCommandState('underline'),
      strikethrough: iframeDoc.queryCommandState('strikeThrough'),
      alignLeft: iframeDoc.queryCommandState('justifyLeft'),
      alignCenter: iframeDoc.queryCommandState('justifyCenter'),
      alignRight: iframeDoc.queryCommandState('justifyRight'),
      alignJustify: iframeDoc.queryCommandState('justifyFull'),
      heading1: iframeDoc.queryCommandValue('formatBlock') === 'h1',
      heading2: iframeDoc.queryCommandValue('formatBlock') === 'h2',
      blockquote: iframeDoc.queryCommandValue('formatBlock') === 'blockquote'
    });
  };

  // Zero-trust HTML paste / edit sync inside same-origin iframe context
  const initIframe = () => {
    if (!iframeRef.current || iframeInitializedRef.current) return;
    const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
    if (!iframeDoc) return;

    iframeInitializedRef.current = true;

    const isDark = document.documentElement.classList.contains('theme-dark') || document.body.classList.contains('theme-dark');
    const textColor = isDark ? '#ffffff' : '#101114';
    const mutedColor = isDark ? '#a0aec0' : '#6b7280';
    const borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)';
    const blockquoteBg = isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.04)';
    const tableThBg = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(15, 23, 42, 0.03)';
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--ui-primary').trim() || '#3b82f6';

    const docHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: "Inter", system-ui, -apple-system, sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: ${textColor};
            background-color: transparent;
            margin: 0;
            padding: 16px;
            min-height: 100%;
            box-sizing: border-box;
            outline: none;
            word-wrap: break-word;
          }
          body[contenteditable="true"] {
            cursor: text;
          }
          body:empty::before {
            content: attr(placeholder);
            color: ${mutedColor};
            cursor: text;
            position: absolute;
          }
          h1, h2, h3, h4, h5, h6 {
            margin-top: 0.5em;
            margin-bottom: 0.5em;
            line-height: 1.25;
            font-weight: 700;
          }
          h1 { font-size: 1.8em; }
          h2 { font-size: 1.4em; }
          p { margin-top: 0; margin-bottom: 1em; }
          blockquote {
            margin: 1.5em 0;
            padding: 8px 16px;
            border-left: 4px solid ${primaryColor};
            background: ${blockquoteBg};
            font-style: italic;
            border-radius: 0 4px 4px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5em 0;
          }
          table th, table td {
            border: 1px solid ${borderColor};
            padding: 8px 12px;
            text-align: left;
          }
          table th {
            background: ${tableThBg};
            font-weight: 700;
          }
          img {
            max-width: 100%;
            height: auto;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          a {
            color: ${primaryColor};
            text-decoration: underline;
          }
          ul, ol {
            margin-top: 0;
            margin-bottom: 1em;
            padding-left: 20px;
          }
        </style>
      </head>
      <body contenteditable="true" placeholder="${placeholder || 'Start typing...'}">${value || ''}</body>
      </html>
    `;

    iframeDoc.open();
    iframeDoc.write(docHtml);
    iframeDoc.close();

    // Re-inject dynamically loaded Google Fonts
    loadedFontsRef.current.forEach(font => {
      loadGoogleFont(font, iframeDoc);
    });

    const body = iframeDoc.body;
    if (!body) return;

    const handleChange = () => {
      const nextVal = body.innerHTML;
      onChange(nextVal);
      updateActiveStyles();
    };

    body.addEventListener('input', handleChange);
    body.addEventListener('keyup', () => {
      handleChange();
      updateActiveStyles();
    });
    body.addEventListener('mouseup', () => {
      updateActiveStyles();
      if (resizeRef.current) {
        resizeRef.current = false;
        setIsResizing(false);
      }
    });
    body.addEventListener('blur', handleChange);

    body.addEventListener('paste', (e: ClipboardEvent) => {
      try {
        const clipboardData = e.clipboardData;
        if (!clipboardData) return;

        const htmlText = clipboardData.getData('text/html');
        const plainText = clipboardData.getData('text/plain');

        if (htmlText) {
          e.preventDefault();
          const clean = sanitizeHTML(htmlText);
          iframeDoc.execCommand('insertHTML', false, clean);
          handleChange();
        } else if (plainText) {
          e.preventDefault();
          iframeDoc.execCommand('insertText', false, plainText);
          handleChange();
        }
      } catch (err) {
        console.warn('Custom secure paste blocked by browser permissions, falling back to native browser paste.', err);
        // Do NOT call e.preventDefault(), letting native browser paste handle the Ctrl+V key combination
      }
    });
  };

  // Force content-sync when state changes from the outside
  useEffect(() => {
    if (viewMode !== 'visual' || !iframeRef.current) return;
    const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
    if (!iframeDoc || !iframeDoc.body) return;

    if (iframeDoc.body.innerHTML !== value) {
      iframeDoc.body.innerHTML = value || '';
    }
  }, [value, viewMode]);

  // Synchronize themes on class toggles dynamically without wiping the document content
  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      if (viewMode === 'visual' && iframeRef.current) {
        const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
        const body = iframeDoc?.body;
        if (body) {
          const isDark = document.documentElement.classList.contains('theme-dark') || document.body.classList.contains('theme-dark');
          body.style.color = isDark ? '#ffffff' : '#101114';
          const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--ui-primary').trim() || '#3b82f6';
          body.style.setProperty('--primary-color', primaryColor);
          
          const blockquotes = iframeDoc.getElementsByTagName('blockquote');
          for (let i = 0; i < blockquotes.length; i++) {
            blockquotes[i].style.borderLeftColor = primaryColor;
            blockquotes[i].style.background = isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.04)';
          }
          
          const tables = iframeDoc.getElementsByTagName('table');
          const borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)';
          for (let i = 0; i < tables.length; i++) {
            const cells = tables[i].querySelectorAll('td, th');
            cells.forEach(cell => {
              (cell as HTMLElement).style.borderColor = borderColor;
            });
          }
        }
      }
    });

    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, [viewMode]);

  // Race-condition settlement hook: guarantees the iframe is initialized on mount or view changes
  useEffect(() => {
    if (viewMode === 'visual') {
      const timer = setTimeout(() => {
        initIframe();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [viewMode]);

  // Command dispatcher: wraps text in HTML mode, uses execCommand in Visual mode
  const executeCmd = (cmd: string, val: string = '') => {
    if (viewMode === 'visual') {
      if (iframeRef.current) {
        const win = iframeRef.current.contentWindow;
        const doc = iframeRef.current.contentDocument || win?.document;
        if (doc && win) {
          win.focus();
          doc.execCommand(cmd, false, val);
          onChange(doc.body.innerHTML);
          updateActiveStyles();
        }
      }
    } else {
      // IDE Mode - tags wrapping at boundaries
      switch (cmd) {
        case 'bold':
          handleHtmlWrap('<strong>', '</strong>');
          break;
        case 'italic':
          handleHtmlWrap('<em>', '</em>');
          break;
        case 'underline':
          handleHtmlWrap('<u>', '</u>');
          break;
        case 'strikeThrough':
          handleHtmlWrap('<s>', '</s>');
          break;
        case 'justifyLeft':
          handleHtmlWrap('<div style="text-align: left;">', '</div>');
          break;
        case 'justifyCenter':
          handleHtmlWrap('<div style="text-align: center;">', '</div>');
          break;
        case 'justifyRight':
          handleHtmlWrap('<div style="text-align: right;">', '</div>');
          break;
        case 'justifyFull':
          handleHtmlWrap('<div style="text-align: justify;">', '</div>');
          break;
        case 'insertUnorderedList':
          handleHtmlWrap('<ul>\n  <li>', '</li>\n</ul>');
          break;
        case 'insertOrderedList':
          handleHtmlWrap('<ol>\n  <li>', '</li>\n</ol>');
          break;
        case 'foreColor':
          handleHtmlWrap(`<span style="color: ${val};">`, '</span>');
          break;
        case 'formatBlock':
          handleHtmlWrap(`<${val}>`, `</${val}>`);
          break;
        case 'fontName':
          handleHtmlWrap(`<span style="font-family: ${val};">`, '</span>');
          break;
        default:
          break;
      }
    }
  };

  const handleHtmlWrap = (open: string, close: string) => {
    if (!textareaRef.current) return;
    const ta = textareaRef.current;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const text = ta.value;
    const selected = text.substring(start, end);
    const newText = text.substring(0, start) + open + selected + close + text.substring(end);
    onChange(newText);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + open.length, start + open.length + selected.length);
    }, 0);
  };

  const handleFormat = (tag: string) => {
    executeCmd('formatBlock', tag);
    setActiveDropdown(null);
  };

  const handleFont = (font: string) => {
    const iframeDoc = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document;
    loadGoogleFont(font, iframeDoc);
    loadedFontsRef.current.add(font);
    executeCmd('fontName', font);
    setActiveDropdown(null);
    setFontSearch('');
  };

  const insertLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl) return;

    if (viewMode === 'visual') {
      if (iframeRef.current) {
        const win = iframeRef.current.contentWindow;
        const doc = iframeRef.current.contentDocument || win?.document;
        if (doc && win) {
          win.focus();
          
          // If text selection is empty, insert HTML link directly
          const sel = win.getSelection();
          if (sel && sel.isCollapsed) {
            const anchorHtml = `<a href="${linkUrl}" target="_blank">${linkText || linkUrl}</a>`;
            doc.execCommand('insertHTML', false, anchorHtml);
          } else {
            doc.execCommand('createLink', false, linkUrl);
          }
          onChange(doc.body.innerHTML);
        }
      }
    } else {
      const anchor = `<a href="${linkUrl}" target="_blank">${linkText || 'Link'}</a>`;
      handleHtmlWrap(anchor, '');
    }

    setLinkUrl('');
    setLinkText('');
    setActiveDropdown(null);
  };

  const insertImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return;

    if (viewMode === 'visual') {
      executeCmd('insertImage', imageUrl);
    } else {
      const imgTag = `<img src="${imageUrl}" alt="Image" style="max-width:100%; height:auto;" />`;
      handleHtmlWrap(imgTag, '');
    }

    setImageUrl('');
    setActiveDropdown(null);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      let finalUrl = '';
      if (onImageUpload) {
        finalUrl = await onImageUpload(file);
      } else {
        // Fallback to Data URL base64 representation
        finalUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      if (finalUrl) {
        if (viewMode === 'visual') {
          executeCmd('insertImage', finalUrl);
        } else {
          const imgTag = `<img src="${finalUrl}" alt="${file.name}" style="max-width:100%; height:auto;" />`;
          handleHtmlWrap(imgTag, '');
        }
      }
    } catch (err) {
      console.error('Image upload failed', err);
    } finally {
      setIsUploadingImage(false);
      setActiveDropdown(null);
    }
  };

  const insertTable = (r: number, c: number) => {
    let tbl = '<table style="width: 100%; border-collapse: collapse; margin: 1.5em 0;">\n';
    tbl += '  <thead>\n    <tr>\n';
    for (let j = 0; j < c; j++) {
      tbl += '      <th>Header</th>\n';
    }
    tbl += '    </tr>\n  </thead>\n  <tbody>\n';
    for (let i = 0; i < r; i++) {
      tbl += '    <tr>\n';
      for (let j = 0; j < c; j++) {
        tbl += '      <td>Data</td>\n';
      }
      tbl += '    </tr>\n';
    }
    tbl += '  </tbody>\n</table>';

    if (viewMode === 'visual') {
      if (iframeRef.current) {
        const win = iframeRef.current.contentWindow;
        const doc = iframeRef.current.contentDocument || win?.document;
        if (doc && win) {
          win.focus();
          doc.execCommand('insertHTML', false, tbl);
          onChange(doc.body.innerHTML);
        }
      }
    } else {
      handleHtmlWrap(tbl, '');
    }
    setActiveDropdown(null);
  };

  // Stable dynamic resizer attached on mount to eliminate pointer mismatch bugs
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newHeight = Math.max(200, e.clientY - rect.top - 50); // offset header height
      setEditorHeight(`${newHeight}px`);
    };

    const handleMouseUp = () => {
      resizeRef.current = false;
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    resizeRef.current = true;
    setIsResizing(true);
  };

  // Click outside to collapse tool dropdowns
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Sync scrollbar settings when modes shift
  useEffect(() => {
    if (viewMode === 'html') {
      setTimeout(handleScroll, 10);
    }
  }, [viewMode]);

  // Statistics counters
  const words = value ? value.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean) : [];
  const charCount = value ? value.replace(/<[^>]*>/g, '').length : 0;
  const wordCount = words.length;

  const lines = (value || '').split('\n');
  const lineCount = Math.max(lines.length, 1);

  const swatches = ['#f04438', '#3b82f6', '#12b76a', '#fdb022', '#8b5cf6', '#fb923c', '#ec4899', '#2dd4bf', '#101114', '#ffffff'];

  return (
    <div ref={containerRef} className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div 
        className="editor-box"
        style={{
          border: '1px solid var(--ui-line)',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--ui-panel-strong)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--ui-shadow-sm)',
          overflow: 'visible',
          position: 'relative'
        }}
      >
        {/* Editor Active Focus Glow Ring */}
        <div style={{
          position: 'absolute',
          top: -2, left: -2, right: -2, bottom: -2,
          borderRadius: 'calc(var(--radius-sm) + 2px)',
          border: '2px solid var(--ui-primary)',
          opacity: activeDropdown || viewMode === 'html' ? 0.35 : 0,
          pointerEvents: 'none',
          transition: 'opacity 0.2s'
        }} />

        {/* Toolbar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          padding: '8px',
          background: 'var(--ui-panel)',
          borderBottom: '1px solid var(--ui-line)',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTopLeftRadius: 'var(--radius-sm)',
          borderTopRightRadius: 'var(--radius-sm)',
          zIndex: 10
        }}>
          {/* Action buttons list */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
            
            {/* Group 1: Typography styles */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'format' ? null : 'format')}
                style={{
                  background: activeDropdown === 'format' ? 'var(--ui-primary-soft)' : 'transparent',
                  border: '1px solid var(--ui-line)',
                  borderRadius: '6px',
                  padding: '5px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'var(--ui-text)',
                  cursor: 'pointer'
                }}
              >
                <span>Format</span>
                <ChevronDown size={14} />
              </button>
              {activeDropdown === 'format' && (
                <div style={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  background: 'var(--ui-panel-pure)',
                  border: '1px solid var(--ui-line)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px',
                  boxShadow: 'var(--ui-shadow-md)',
                  zIndex: 2000,
                  minWidth: '125px'
                }}>
                  {['p', 'h1', 'h2', 'blockquote'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleFormat(tag)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        background: 'transparent',
                        border: 0,
                        padding: '6px 12px',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        color: 'var(--ui-text)',
                        cursor: 'pointer',
                        borderRadius: '4px'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--ui-primary-soft)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {tag === 'p' ? 'Paragraph' : tag === 'h1' ? 'Heading 1' : tag === 'h2' ? 'Heading 2' : 'Blockquote'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Font Family selector */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'font' ? null : 'font')}
                style={{
                  background: activeDropdown === 'font' ? 'var(--ui-primary-soft)' : 'transparent',
                  border: '1px solid var(--ui-line)',
                  borderRadius: '6px',
                  padding: '5px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'var(--ui-text)',
                  cursor: 'pointer'
                }}
              >
                <span>Font</span>
                <ChevronDown size={14} />
              </button>
              {activeDropdown === 'font' && (
                <div style={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  background: 'var(--ui-panel-pure)',
                  border: '1px solid var(--ui-line)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px',
                  boxShadow: 'var(--ui-shadow-md)',
                  zIndex: 2000,
                  minWidth: '200px'
                }}>
                  <input
                    type="text"
                    placeholder="Search Google Fonts..."
                    value={fontSearch}
                    onChange={e => setFontSearch(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--ui-bg)',
                      border: '1px solid var(--ui-line)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '6px 10px',
                      color: 'var(--ui-text)',
                      fontSize: '12px',
                      outline: 0,
                      marginBottom: '8px',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {(() => {
                      const popularFonts = [
                        'Inter', 'Roboto', 'Open Sans', 'Montserrat', 'Lato', 'Poppins', 'Oswald', 'Raleway',
                        'Nunito', 'Ubuntu', 'Playfair Display', 'Merriweather', 'Lora', 'PT Serif', 'Cinzel',
                        'Roboto Mono', 'Fira Code', 'Source Code Pro', 'Courier Prime', 'Pacifico', 'Caveat',
                        'Great Vibes', 'Cabin', 'Lobster', 'Comfortaa', 'Abril Fatface', 'Righteous',
                        'Dancing Script', 'Anton', 'Bebas Neue', 'Outfit', 'Sora', 'Kanit', 'Rubik'
                      ];
                      const filtered = popularFonts.filter(f => f.toLowerCase().includes(fontSearch.toLowerCase()));
                      
                      return (
                        <>
                          {filtered.map(font => (
                            <button
                              key={font}
                              type="button"
                              onClick={() => handleFont(font)}
                              style={{
                                width: '100%',
                                textAlign: 'left',
                                background: 'transparent',
                                border: 0,
                                padding: '6px 12px',
                                fontSize: '12.5px',
                                fontWeight: 600,
                                color: 'var(--ui-text)',
                                cursor: 'pointer',
                                borderRadius: '4px',
                                fontFamily: `'${font}', sans-serif`
                              }}
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--ui-primary-soft)'}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              {font}
                            </button>
                          ))}
                          {filtered.length === 0 && (
                            <div style={{ fontSize: '11.5px', color: 'var(--ui-muted)', padding: '8px 12px', textAlign: 'center' }}>
                              No fonts found
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{ width: '1px', height: '18px', background: 'var(--ui-line)', margin: '0 2px' }} />

            {/* Group 2: Inline Styles */}
            <button
              type="button"
              onClick={() => executeCmd('bold')}
              title="Bold"
              style={{
                background: activeStyles.bold ? 'var(--ui-primary-soft)' : 'transparent',
                color: activeStyles.bold ? 'var(--ui-primary-deep)' : 'var(--ui-text)',
                border: 0, borderRadius: '6px', width: '32px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              onMouseEnter={e => { if (!activeStyles.bold) e.currentTarget.style.backgroundColor = 'var(--ui-line-2)'; }}
              onMouseLeave={e => { if (!activeStyles.bold) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <Bold size={16} />
            </button>

            <button
              type="button"
              onClick={() => executeCmd('italic')}
              title="Italic"
              style={{
                background: activeStyles.italic ? 'var(--ui-primary-soft)' : 'transparent',
                color: activeStyles.italic ? 'var(--ui-primary-deep)' : 'var(--ui-text)',
                border: 0, borderRadius: '6px', width: '32px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              onMouseEnter={e => { if (!activeStyles.italic) e.currentTarget.style.backgroundColor = 'var(--ui-line-2)'; }}
              onMouseLeave={e => { if (!activeStyles.italic) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <Italic size={16} />
            </button>

            <button
              type="button"
              onClick={() => executeCmd('underline')}
              title="Underline"
              style={{
                background: activeStyles.underline ? 'var(--ui-primary-soft)' : 'transparent',
                color: activeStyles.underline ? 'var(--ui-primary-deep)' : 'var(--ui-text)',
                border: 0, borderRadius: '6px', width: '32px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              onMouseEnter={e => { if (!activeStyles.underline) e.currentTarget.style.backgroundColor = 'var(--ui-line-2)'; }}
              onMouseLeave={e => { if (!activeStyles.underline) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <Underline size={16} />
            </button>

            <button
              type="button"
              onClick={() => executeCmd('strikeThrough')}
              title="Strikethrough"
              style={{
                background: activeStyles.strikethrough ? 'var(--ui-primary-soft)' : 'transparent',
                color: activeStyles.strikethrough ? 'var(--ui-primary-deep)' : 'var(--ui-text)',
                border: 0, borderRadius: '6px', width: '32px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              onMouseEnter={e => { if (!activeStyles.strikethrough) e.currentTarget.style.backgroundColor = 'var(--ui-line-2)'; }}
              onMouseLeave={e => { if (!activeStyles.strikethrough) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <Strikethrough size={16} />
            </button>

            {/* Custom Palette Color picker */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'color' ? null : 'color')}
                title="Text Color"
                style={{
                  background: activeDropdown === 'color' ? 'var(--ui-primary-soft)' : 'transparent',
                  color: activeDropdown === 'color' ? 'var(--ui-primary-deep)' : 'var(--ui-text)',
                  border: 0, borderRadius: '6px', width: '32px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                onMouseEnter={e => { if (activeDropdown !== 'color') e.currentTarget.style.backgroundColor = 'var(--ui-line-2)'; }}
                onMouseLeave={e => { if (activeDropdown !== 'color') e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <Palette size={16} />
              </button>
              {activeDropdown === 'color' && (
                <div style={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  background: 'var(--ui-panel-pure)',
                  border: '1px solid var(--ui-line)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px',
                  boxShadow: 'var(--ui-shadow-md)',
                  zIndex: 2000,
                  width: '160px'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                    {swatches.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => { executeCmd('foreColor', c); setActiveDropdown(null); }}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '4px',
                          background: c,
                          border: '1px solid var(--ui-line)',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{ width: '1px', height: '18px', background: 'var(--ui-line)', margin: '0 2px' }} />

            {/* Group 3: Layout align and lists */}
            <button
              type="button"
              onClick={() => executeCmd('insertUnorderedList')}
              title="Bullet List"
              style={{
                border: 0, borderRadius: '6px', width: '32px', height: '30px', background: 'transparent', color: 'var(--ui-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--ui-line-2)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <List size={16} />
            </button>

            <button
              type="button"
              onClick={() => executeCmd('insertOrderedList')}
              title="Numbered List"
              style={{
                border: 0, borderRadius: '6px', width: '32px', height: '30px', background: 'transparent', color: 'var(--ui-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--ui-line-2)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <ListOrdered size={16} />
            </button>

            <button
              type="button"
              onClick={() => executeCmd('justifyLeft')}
              title="Align Left"
              style={{
                background: activeStyles.alignLeft ? 'var(--ui-primary-soft)' : 'transparent',
                color: activeStyles.alignLeft ? 'var(--ui-primary-deep)' : 'var(--ui-text)',
                border: 0, borderRadius: '6px', width: '32px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              onMouseEnter={e => { if (!activeStyles.alignLeft) e.currentTarget.style.backgroundColor = 'var(--ui-line-2)'; }}
              onMouseLeave={e => { if (!activeStyles.alignLeft) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <AlignLeft size={16} />
            </button>

            <button
              type="button"
              onClick={() => executeCmd('justifyCenter')}
              title="Align Center"
              style={{
                background: activeStyles.alignCenter ? 'var(--ui-primary-soft)' : 'transparent',
                color: activeStyles.alignCenter ? 'var(--ui-primary-deep)' : 'var(--ui-text)',
                border: 0, borderRadius: '6px', width: '32px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              onMouseEnter={e => { if (!activeStyles.alignCenter) e.currentTarget.style.backgroundColor = 'var(--ui-line-2)'; }}
              onMouseLeave={e => { if (!activeStyles.alignCenter) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <AlignCenter size={16} />
            </button>

            <button
              type="button"
              onClick={() => executeCmd('justifyRight')}
              title="Align Right"
              style={{
                background: activeStyles.alignRight ? 'var(--ui-primary-soft)' : 'transparent',
                color: activeStyles.alignRight ? 'var(--ui-primary-deep)' : 'var(--ui-text)',
                border: 0, borderRadius: '6px', width: '32px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              onMouseEnter={e => { if (!activeStyles.alignRight) e.currentTarget.style.backgroundColor = 'var(--ui-line-2)'; }}
              onMouseLeave={e => { if (!activeStyles.alignRight) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <AlignRight size={16} />
            </button>

            <button
              type="button"
              onClick={() => executeCmd('justifyFull')}
              title="Justify"
              style={{
                background: activeStyles.alignJustify ? 'var(--ui-primary-soft)' : 'transparent',
                color: activeStyles.alignJustify ? 'var(--ui-primary-deep)' : 'var(--ui-text)',
                border: 0, borderRadius: '6px', width: '32px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              onMouseEnter={e => { if (!activeStyles.alignJustify) e.currentTarget.style.backgroundColor = 'var(--ui-line-2)'; }}
              onMouseLeave={e => { if (!activeStyles.alignJustify) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <AlignJustify size={16} />
            </button>

            {/* Divider */}
            <div style={{ width: '1px', height: '18px', background: 'var(--ui-line)', margin: '0 2px' }} />

            {/* Group 4: Insertions */}
            {/* Insert Link Popover */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'link' ? null : 'link')}
                title="Insert Link"
                style={{
                  background: activeDropdown === 'link' ? 'var(--ui-primary-soft)' : 'transparent',
                  color: activeDropdown === 'link' ? 'var(--ui-primary-deep)' : 'var(--ui-text)',
                  border: 0, borderRadius: '6px', width: '32px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                onMouseEnter={e => { if (activeDropdown !== 'link') e.currentTarget.style.backgroundColor = 'var(--ui-line-2)'; }}
                onMouseLeave={e => { if (activeDropdown !== 'link') e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <Link size={16} />
              </button>
              {activeDropdown === 'link' && (
                <form 
                  onSubmit={insertLink}
                  style={{
                    position: 'absolute',
                    top: '110%',
                    left: 0,
                    background: 'var(--ui-panel-pure)',
                    border: '1px solid var(--ui-line)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px',
                    boxShadow: 'var(--ui-shadow-md)',
                    zIndex: 2000,
                    width: '220px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 800 }}>Insert Hyperlink</div>
                  <input
                    type="text"
                    placeholder="URL (e.g., https://...)"
                    value={linkUrl}
                    onChange={e => setLinkUrl(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--ui-bg)',
                      border: '1px solid var(--ui-line)',
                      color: 'var(--ui-text)',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      outline: 0
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Link Text (optional)"
                    value={linkText}
                    onChange={e => setLinkText(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--ui-bg)',
                      border: '1px solid var(--ui-line)',
                      color: 'var(--ui-text)',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      outline: 0
                    }}
                  />
                  <button 
                    type="submit" 
                    className="btn primary" 
                    style={{ padding: '6px', fontSize: '11px', borderRadius: '4px', width: '100%' }}
                  >
                    Apply Link
                  </button>
                </form>
              )}
            </div>

            {/* Insert Image Popover */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'image' ? null : 'image')}
                title="Insert Image"
                style={{
                  background: activeDropdown === 'image' ? 'var(--ui-primary-soft)' : 'transparent',
                  color: activeDropdown === 'image' ? 'var(--ui-primary-deep)' : 'var(--ui-text)',
                  border: 0, borderRadius: '6px', width: '32px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                onMouseEnter={e => { if (activeDropdown !== 'image') e.currentTarget.style.backgroundColor = 'var(--ui-line-2)'; }}
                onMouseLeave={e => { if (activeDropdown !== 'image') e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <Image size={16} />
              </button>
              {activeDropdown === 'image' && (
                <div style={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  background: 'var(--ui-panel-pure)',
                  border: '1px solid var(--ui-line)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px',
                  boxShadow: 'var(--ui-shadow-md)',
                  zIndex: 2000,
                  width: '240px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 800 }}>Insert Image</div>
                  
                  {/* URL / Upload Tabs */}
                  <div style={{ display: 'flex', background: 'var(--ui-bg)', padding: '2px', borderRadius: '4px', gap: '2px' }}>
                    <button
                      type="button"
                      onClick={() => setImageSourceMode('url')}
                      style={{
                        flex: 1,
                        border: 0,
                        background: imageSourceMode === 'url' ? 'var(--ui-panel-pure)' : 'transparent',
                        color: imageSourceMode === 'url' ? 'var(--ui-primary-deep)' : 'var(--ui-muted)',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '4px',
                        cursor: 'pointer',
                        borderRadius: '3px'
                      }}
                    >
                      Image URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageSourceMode('upload')}
                      style={{
                        flex: 1,
                        border: 0,
                        background: imageSourceMode === 'upload' ? 'var(--ui-panel-pure)' : 'transparent',
                        color: imageSourceMode === 'upload' ? 'var(--ui-primary-deep)' : 'var(--ui-muted)',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '4px',
                        cursor: 'pointer',
                        borderRadius: '3px'
                      }}
                    >
                      Upload File
                    </button>
                  </div>

                  {imageSourceMode === 'url' ? (
                    <form onSubmit={insertImage} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="Image URL (https://...)"
                        value={imageUrl}
                        onChange={e => setImageUrl(e.target.value)}
                        style={{
                          width: '100%',
                          background: 'var(--ui-bg)',
                          border: '1px solid var(--ui-line)',
                          color: 'var(--ui-text)',
                          borderRadius: '4px',
                          padding: '6px 8px',
                          fontSize: '11px',
                          outline: 0,
                          boxSizing: 'border-box'
                        }}
                      />
                      <button 
                        type="submit" 
                        className="btn primary" 
                        style={{ padding: '6px', fontSize: '11px', borderRadius: '4px', width: '100%' }}
                      >
                        Insert URL
                      </button>
                    </form>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label 
                        style={{
                          border: '1px dashed var(--ui-line)',
                          borderRadius: '6px',
                          padding: '16px 8px',
                          textAlign: 'center',
                          cursor: isUploadingImage ? 'not-allowed' : 'pointer',
                          background: 'var(--ui-bg)',
                          color: 'var(--ui-muted)',
                          fontSize: '11px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {isUploadingImage ? (
                          <span>Uploading...</span>
                        ) : (
                          <>
                            <span style={{ fontWeight: 700 }}>Click to browse</span>
                            <span style={{ fontSize: '9px', color: 'var(--ui-muted-2)' }}>PNG, JPG, SVG</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploadingImage}
                          onChange={handleImageFileChange}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Insert Table Grid builder */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'table' ? null : 'table')}
                title="Insert Table"
                style={{
                  background: activeDropdown === 'table' ? 'var(--ui-primary-soft)' : 'transparent',
                  color: activeDropdown === 'table' ? 'var(--ui-primary-deep)' : 'var(--ui-text)',
                  border: 0, borderRadius: '6px', width: '32px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                onMouseEnter={e => { if (activeDropdown !== 'table') e.currentTarget.style.backgroundColor = 'var(--ui-line-2)'; }}
                onMouseLeave={e => { if (activeDropdown !== 'table') e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <Table size={16} />
              </button>
              {activeDropdown === 'table' && (
                <div style={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  background: 'var(--ui-panel-pure)',
                  border: '1px solid var(--ui-line)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px',
                  boxShadow: 'var(--ui-shadow-md)',
                  zIndex: 2000,
                  width: '150px'
                }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, marginBottom: '8px', textAlign: 'center' }}>
                    {hoveredCell ? `Table: ${hoveredCell.r}x${hoveredCell.c}` : 'Select Grid Size'}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {Array.from({ length: 5 }).map((_, rIdx) => (
                      <div key={rIdx} style={{ display: 'flex', gap: '3px', justifyContent: 'center' }}>
                        {Array.from({ length: 5 }).map((_, cIdx) => {
                          const r = rIdx + 1;
                          const c = cIdx + 1;
                          const isHighlighted = hoveredCell && r <= hoveredCell.r && c <= hoveredCell.c;
                          return (
                            <button
                              key={cIdx}
                              type="button"
                              onMouseEnter={() => setHoveredCell({ r, c })}
                              onMouseLeave={() => setHoveredCell(null)}
                              onClick={() => insertTable(r, c)}
                              style={{
                                width: '18px',
                                height: '18px',
                                background: isHighlighted ? 'var(--ui-primary)' : 'var(--ui-bg-2)',
                                border: '1px solid var(--ui-line)',
                                borderRadius: '3px',
                                cursor: 'pointer',
                                transition: 'background-color 0.1s'
                              }}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Group 5: View switch control */}
          <div className="segmented-control" style={{ padding: '2px', height: '32px' }}>
            <button
              type="button"
              className={viewMode === 'visual' ? 'active' : ''}
              onClick={() => setViewMode('visual')}
              style={{
                fontSize: '11px',
                padding: '4px 10px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>👁️</span>
              <span>Visual</span>
            </button>
            <button
              type="button"
              className={viewMode === 'html' ? 'active' : ''}
              onClick={() => setViewMode('html')}
              style={{
                fontSize: '11px',
                padding: '4px 10px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Code size={12} />
              <span>HTML</span>
            </button>
          </div>

        </div>

        {/* Editor Content Area */}
        <div style={{ height: editorHeight, position: 'relative', overflow: 'hidden' }}>
          
          {/* Transparent Resizing Shield Mask to capture mouse events during drag/resize over iframe */}
          {isResizing && (
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'transparent',
                zIndex: 9999,
                cursor: 'ns-resize'
              }}
            />
          )}

          {/* Quarantined Sandboxed Visual Mode */}
          <iframe
            ref={iframeRef}
            onLoad={initIframe}
            sandbox="allow-same-origin"
            style={{
              display: viewMode === 'visual' ? 'block' : 'none',
              width: '100%',
              height: '100%',
              border: 0,
              background: 'transparent'
            }}
          />

          {/* Code Mode with Custom Syntax Highlighter IDE Overlay */}
          {viewMode === 'html' && (
            <div style={{
              display: 'flex',
              width: '100%',
              height: '100%',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Scrolling Line Numbers Gutter */}
              <div 
                ref={gutterRef}
                style={{
                  width: '40px',
                  height: '100%',
                  background: 'var(--ui-bg-2)',
                  borderRight: '1px solid var(--ui-line)',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '16px 0',
                  alignItems: 'flex-end',
                  overflowY: 'hidden',
                  userSelect: 'none',
                  boxSizing: 'border-box'
                }}
              >
                {Array.from({ length: lineCount }).map((_, i) => (
                  <div 
                    key={i} 
                    style={{
                      fontFamily: "'Courier New', Courier, monospace",
                      fontSize: '13.5px',
                      lineHeight: '1.6',
                      color: 'var(--ui-muted-2)',
                      height: '21.6px', // matches 13.5px * 1.6
                      paddingRight: '8px',
                      boxSizing: 'border-box'
                    }}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Stack container for Highlighter pre and Input textarea */}
              <div style={{
                flex: 1,
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <pre 
                  ref={preRef}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    margin: 0,
                    padding: '16px',
                    fontFamily: "'Courier New', Courier, monospace",
                    fontSize: '13.5px',
                    lineHeight: '1.6',
                    whiteSpace: 'pre',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                    background: 'transparent',
                    pointerEvents: 'none'
                  }}
                  dangerouslySetInnerHTML={{ __html: highlightHTML(value || '') }}
                />
                <textarea
                  ref={textareaRef}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  onScroll={handleScroll}
                  placeholder="<!-- Write secure HTML code here -->"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    margin: 0,
                    padding: '16px',
                    fontFamily: "'Courier New', Courier, monospace",
                    fontSize: '13.5px',
                    lineHeight: '1.6',
                    whiteSpace: 'pre',
                    overflow: 'auto',
                    boxSizing: 'border-box',
                    background: 'transparent',
                    color: 'transparent',
                    caretColor: 'var(--ui-text)',
                    border: 0,
                    outline: 0,
                    resize: 'none'
                  }}
                />
              </div>
            </div>
          )}

        </div>

        {/* Footer info and Resize handle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          borderTop: '1px solid var(--ui-line)',
          fontSize: '11px',
          color: 'var(--ui-muted)',
          background: 'var(--ui-panel)',
          borderBottomLeftRadius: 'var(--radius-sm)',
          borderBottomRightRadius: 'var(--radius-sm)',
          userSelect: 'none'
        }}>
          <div>
            {wordCount} words | {charCount} characters
          </div>
          <div 
            onMouseDown={startResize}
            style={{ 
              cursor: 'ns-resize', 
              display: 'flex', 
              gap: '2px', 
              padding: '6px 4px',
              alignItems: 'center'
            }}
          >
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--ui-muted-2)' }} />
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--ui-muted-2)' }} />
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--ui-muted-2)' }} />
          </div>
        </div>

      </div>
    </div>
  );
};
