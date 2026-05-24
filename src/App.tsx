import React, { useState } from 'react';
import * as Lib from './library';
import { useUITheme } from './theme/ThemeProvider';


const locationOptions = [
  { value: 'cape-town-central', label: 'Cape Town Central' },
  { value: 'cape-town-north', label: 'Cape Town Northern Suburbs' },
  { value: 'cape-town-south', label: 'Cape Town Southern Suburbs' },
  { value: 'sea-point', label: 'Sea Point & Green Point' },
  { value: 'camps-bay', label: 'Camps Bay & Clifton' },
  { value: 'constantia', label: 'Constantia Valley' },
  { value: 'stellenbosch', label: 'Stellenbosch Winelands' },
  { value: 'somerset-west', label: 'Somerset West' },
  { value: 'paarl', label: 'Paarl & Wellington' },
  { value: 'durban-north', label: 'Durban North' },
  { value: 'durban-south', label: 'Durban South' },
  { value: 'umhlanga', label: 'Umhlanga Rocks' },
  { value: 'berea', label: 'Berea & Morningside' },
  { value: 'ballito', label: 'Ballito & North Coast' },
  { value: 'joburg-central', label: 'Johannesburg Central' },
  { value: 'sandton', label: 'Sandton & Bryanston' },
  { value: 'randburg', label: 'Randburg & Rosebank' },
  { value: 'midrand', label: 'Midrand & Halfway House' },
  { value: 'pretoria-east', label: 'Pretoria East' },
  { value: 'pretoria-north', label: 'Pretoria North' },
  { value: 'pretoria-west', label: 'Pretoria West' },
  { value: 'pretoria-cbd', label: 'Pretoria CBD' },
  { value: 'centurion', label: 'Centurion' },
  { value: 'roodepoort', label: 'Roodepoort' },
  { value: 'soweto', label: 'Soweto' },
  { value: 'east-rand', label: 'East Rand (Boksburg)' },
  { value: 'west-rand', label: 'West Rand (Krugersdorp)' },
  { value: 'port-elizabeth', label: 'Port Elizabeth (Gqeberha)' },
  { value: 'east-london', label: 'East London' },
  { value: 'bloemfontein', label: 'Bloemfontein' },
  { value: 'george', label: 'George & Garden Route' },
  { value: 'knysna', label: 'Knysna & Plettenberg Bay' },
  { value: 'mossel-bay', label: 'Mossel Bay' },
  { value: 'nelspruit', label: 'Nelspruit (Mbombela)' },
  { value: 'polokwane', label: 'Polokwane' },
  { value: 'rustenburg', label: 'Rustenburg' },
  { value: 'kimberley', label: 'Kimberley' },
  { value: 'pietermaritzburg', label: 'Pietermaritzburg' },
  { value: 'newcastle', label: 'Newcastle' },
  { value: 'richards-bay', label: 'Richards Bay' },
  { value: 'margate', label: 'Margate & South Coast' },
  { value: 'hermanus', label: 'Hermanus & Overstrand' },
  { value: 'saldanha', label: 'Saldanha & West Coast' },
  { value: 'langebaan', label: 'Langebaan' },
  { value: 'oudtshoorn', label: 'Oudtshoorn' },
  { value: 'worcester', label: 'Worcester' },
  { value: 'welkom', label: 'Welkom' },
  { value: 'klerksdorp', label: 'Klerksdorp' },
  { value: 'potchefstroom', label: 'Potchefstroom' },
  { value: 'vanderbijlpark', label: 'Vanderbijlpark & Vaal' }
];

const App: React.FC = () => {
  const { theme, setTheme, primaryColor, setPrimaryColor } = useUITheme();
  const { addToast } = Lib.useToasts();

  // Navigation / Scrollspy Section Selection
  const [activeNav, setActiveNav] = useState('actions');

  // Interactive component states
  const [btnLoading, setBtnLoading] = useState(false);
  const [stepperVal, setStepperVal] = useState(3);
  const [activeSegment, setActiveSegment] = useState('Weekly');
  const [tagList, setTagList] = useState<string[]>(['Enterprise', 'Cape Town', 'Elite']);
  const [colorVal, setColorVal] = useState('#3b82f6');
  
  // Selection states
  const [checkVal, setCheckVal] = useState(true);
  const [childrenStates, setChildrenStates] = useState([true, false, false]);

  const allChecked = childrenStates.every(Boolean);
  const noneChecked = childrenStates.every(v => !v);
  const isIndeterminate = !allChecked && !noneChecked;
  const isParentChecked = allChecked;

  const handleParentChange = (checked: boolean) => {
    setChildrenStates(childrenStates.map(() => checked));
  };

  const handleChildChange = (index: number, checked: boolean) => {
    setChildrenStates(prev => {
      const next = [...prev];
      next[index] = checked;
      return next;
    });
  };
  const [radioVal, setRadioVal] = useState('agent');
  const [toggleVal, setToggleVal] = useState(true);
  const [selectedCardIdx, setSelectedCardIdx] = useState(0);
  const [dropdownVal, setDropdownVal] = useState('active');
  const [searchSelectVal, setSearchSelectVal] = useState('cape-town-central');
  const [shuttleAvail, setShuttleAvail] = useState(['Organization Head', 'General Admin', 'Member']);
  const [shuttleSel, setShuttleSel] = useState(['Finance auditor']);
  const [sliderVal, setSliderVal] = useState(72);
  const [starVal, setStarVal] = useState(4);

  // Validation input states
  const [cellVal, setCellVal] = useState('+27825551234');
  const [emailVal, setEmailVal] = useState('agent@company.co.za');

  // Playground Active Tab Selection
  const [inputsTab, setInputsTab] = useState('Contact');
  const [editorHTML, setEditorHTML] = useState(`
<h1>Welcome to Tyler UI WYSIWYG IDE!</h1>
<p>This editor features strict <strong>zero-trust browser script isolation</strong>. Switch to the <strong>HTML</strong> tab on the right to edit raw source code with live syntax highlighting!</p>
<blockquote>Safe rendering whitelists text styling, custom tables, hyper-links, and images. Paste scripting payloads below to try:</blockquote>
<table style="width: 100%; border-collapse: collapse; margin: 1.5em 0;">
  <thead>
    <tr>
      <th>Component</th>
      <th>Security Vector</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Iframe Isolation</td>
      <td>Physical omission of allow-scripts</td>
    </tr>
    <tr>
      <td>DOMParser Sanitizer</td>
      <td>Strict recursive tag/attribute white-listing</td>
    </tr>
  </tbody>
</table>
`);

  // 11.2 Identity states
  const [saIdVal, setSaIdVal] = useState('9610245000082');
  const [passportVal, setPassportVal] = useState('M12345678');
  const [companyRegVal, setCompanyRegVal] = useState('202100000007');
  const [vatVal, setVatVal] = useState('4012345678');

  // 11.3 Financial states
  const [currencyVal, setCurrencyVal] = useState('1500000.00');
  const [cardPANVal, setCardPANVal] = useState('4000123456789010');
  const [cardExpiryVal, setCardExpiryVal] = useState('1229');
  const [cardCVVVal, setCardCVVVal] = useState('123');
  const [bankAccVal, setBankAccVal] = useState('123456789');
  const [branchVal, setBranchVal] = useState('632005');

  // 11.4 Tech states
  const [urlVal, setUrlVal] = useState('google.com');
  const [ipVal, setIpVal] = useState('192.168.1.100');
  const [macVal, setMacVal] = useState('001A2B3C4D5E');
  const [hexColorVal, setHexColorVal] = useState('3b82f6');
  const [socialVal, setSocialVal] = useState('tyler_durden');

  // 11.5 Spatial & Measurements states
  const [percentVal, setPercentVal] = useState('75');
  const [measureVal, setMeasureVal] = useState('15.5');
  const [measureUnit, setMeasureUnit] = useState('kg');
  const [postalVal, setPostalVal] = useState('8001');
  const [latVal, setLatVal] = useState('-33.9249');
  const [longVal, setLongVal] = useState('18.4241');

  // 11.6 Security & Time states
  const [strictPasswordVal, setStrictPasswordVal] = useState('Admin@12345');
  const [advancedOTPVal, setAdvancedOTPVal] = useState('123456');
  const [durationVal, setDurationVal] = useState('0230');
  const [dobVal, setDobVal] = useState('1996-10-24');

  // Dates states
  const [singleDate, setSingleDate] = useState<Date | null>(new Date());
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d;
  });
  const [timeVal, setTimeVal] = useState('09:30 AM');
  const [dateTimeVal, setDateTimeVal] = useState<Date | null>(new Date());

  // Overlays states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // Tab selections
  const [activeTab, setActiveTab] = useState('Landlord Profile');

  // Brand Presets for White-Label demonstration
  const presets = [
    { label: 'Warm Gold', hex: '#f2c300' },
    { label: 'Core Blue', hex: '#3b82f6' },
    { label: 'Destructive Red', hex: '#f04438' },
    { label: 'Forest Green', hex: '#12b76a' },
    { label: 'Royal Purple', hex: '#8b5cf6' }
  ];

  // Grid Data Mock
  const [gridData, setGridData] = useState([
    { id: '1', name: 'John Doe', email: 'john@company.com', properties: 14, status: 'Active' },
    { id: '2', name: 'Sarah Connor', email: 'sarah@company.com', properties: 6, status: 'Inactive' },
    { id: '3', name: 'Tyler Durden', email: 'tyler@company.com', properties: 22, status: 'Active' },
    { id: '4', name: 'Bruce Wayne', email: 'bruce@company.com', properties: 45, status: 'Active' }
  ]);

  const gridColumns = [
    { header: 'Full Name', accessorKey: 'name' as const },
    { header: 'Email Address', accessorKey: 'email' as const },
    { header: 'Properties Owned', accessorKey: 'properties' as const },
    { 
      header: 'Status', 
      accessorKey: 'status' as const,
      cell: (row: any) => (
        <Lib.Badge variant={row.status === 'Active' ? 'green' : 'red'}>
          {row.status}
        </Lib.Badge>
      )
    }
  ];

  const handleGridDelete = (selected: any[]) => {
    const idsToDelete = selected.map(s => s.id);
    setGridData(prev => prev.filter(row => !idsToDelete.includes(row.id)));
    addToast(`Deleted ${selected.length} items successfully!`, 'success');
  };

  const mockImageUpload = async (file: File): Promise<string> => {
    // Simulate network delay for uploaded file
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Read the file as a data URI and persist in local storage
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Url = reader.result as string;
        try {
          const key = `tyler-ui-upload-${Date.now()}`;
          localStorage.setItem(key, base64Url);
        } catch (e) {
          console.warn('LocalStorage quota reached, skipping persistence', e);
        }
        resolve(base64Url);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const navItems = [
    { label: 'Actions & Triggers', icon: 'Pointer' as const, id: 'actions' },
    { label: 'Form Controls', icon: 'TextCursor' as const, id: 'inputs' },
    { label: 'Selection Controls', icon: 'CheckSquare' as const, id: 'selection' },
    { label: 'Date & Calendar', icon: 'Calendar' as const, id: 'dates' },
    { label: 'Navigation & Layout', icon: 'Compass' as const, id: 'navigation' },
    { label: 'Data Display', icon: 'LayoutGrid' as const, id: 'display' },
    { header: 'Advanced Widgets', isHeader: true },
    { label: 'Enterprise Data Grid', icon: 'Table' as const, id: 'grid' },
    { label: 'Overlays & Portals', icon: 'Layers' as const, id: 'overlays' },
    { label: 'System Feedback', icon: 'BellRing' as const, id: 'feedback' },
    { label: 'Upload & Media', icon: 'UploadCloud' as const, id: 'uploads' }
  ];

  const codeSnippet = (importName: string, usage: string) => (
    <pre style={{
      background: 'var(--ui-bg)',
      padding: '12px',
      borderRadius: '8px',
      fontSize: '11px',
      fontWeight: 600,
      color: 'var(--ui-muted)',
      overflowX: 'auto',
      marginTop: '10px',
      border: '1px solid var(--ui-line-2)'
    }}>
      <code>{`import { ${importName} } from './library';\n\n${usage}`}</code>
    </pre>
  );

  return (
    <div className="app" style={{ minHeight: '100vh', display: 'flex', gap: '40px', padding: '40px', position: 'relative' }}>
      
      {/* 🧭 LEFT SIDEBAR */}
      <div style={{ width: '280px', flexShrink: 0, position: 'sticky', top: '40px', height: 'calc(100vh - 80px)' }}>
        <Lib.Sidebar 
          items={navItems.filter(n => !n.isHeader) as any} 
          activeId={activeNav}
          onSelect={(id) => {
            setActiveNav(id);
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </div>

      {/* 💻 MAIN SHOWCASE CANVAS */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '48px', minWidth: 0 }}>
        
        {/* 🎨 MASTER THEME CONTROL PANEL (White-Label Sandbox) */}
        <div className="panel-container" style={{
          background: 'linear-gradient(135deg, var(--ui-panel-strong), var(--ui-panel))',
          border: '1px solid var(--ui-border-glass-strong)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.04em', margin: 0 }}>
                Tyler UI <span style={{ color: 'var(--ui-primary-deep)' }}>Component Library</span>
              </h1>
              <p style={{ fontSize: '13px', color: 'var(--ui-muted)', margin: '4px 0 0' }}>
                Sandbox and reference playground for white-labeling, light & dark alternating theme components.
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
              {/* Presets */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {presets.map(p => (
                  <button
                    key={p.hex}
                    onClick={() => {
                      setPrimaryColor(p.hex);
                      addToast(`Brand color switched to ${p.label}!`, 'success');
                    }}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '99px',
                      background: p.hex,
                      border: primaryColor === p.hex ? '3px solid var(--ui-text)' : '1px solid transparent',
                      cursor: 'pointer',
                      boxShadow: 'var(--ui-shadow-sm)',
                      position: 'relative'
                    }}
                    title={p.label}
                  />
                ))}
              </div>

              {/* Dynamic Hex input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="color" 
                  value={primaryColor} 
                  onChange={e => setPrimaryColor(e.target.value)} 
                  style={{ width: '32px', height: '32px', border: 0, padding: 0, borderRadius: '6px', cursor: 'pointer', background: 'transparent' }} 
                />
                <input 
                  value={primaryColor} 
                  onChange={e => setPrimaryColor(e.target.value)}
                  style={{
                    width: '90px',
                    padding: '6px 8px',
                    borderRadius: '8px',
                    border: '1px solid var(--ui-line)',
                    background: 'var(--ui-bg)',
                    color: 'var(--ui-text)',
                    fontSize: '12px',
                    fontWeight: 700
                  }}
                />
              </div>

              <div style={{ width: '1px', height: '32px', background: 'var(--ui-line)' }} />

              {/* Mode Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ui-muted)' }}>Theme:</span>
                <Lib.SegmentedControl 
                  segments={['System', 'Light', 'Dark']} 
                  activeSegment={theme === 'system' ? 'System' : theme === 'light' ? 'Light' : 'Dark'} 
                  onChange={(seg) => {
                    const mode = seg.toLowerCase() as 'system' | 'light' | 'dark';
                    setTheme(mode);
                    addToast(`Theme set to ${seg}!`, 'success');
                  }} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* 📚 COMPONENT SECTIONS */}
        
        {/* 1. ACTIONS & TRIGGERS */}
        <section id="actions" className="panel-container">
          <h2 style={{ fontSize: '18px', fontWeight: 800, borderBottom: '1px solid var(--ui-line)', paddingBottom: '10px', marginBottom: '20px' }}>
            1. Actions & Triggers (Buttons & Clicking Primitives)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '12px', color: 'var(--ui-muted)' }}>Button Hierarchy & States</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <Lib.Button variant="primary">Primary Callout</Lib.Button>
                <Lib.Button variant="secondary">Secondary Option</Lib.Button>
                <Lib.Button variant="outline">Thin Outline</Lib.Button>
                <Lib.Button variant="ghost">Ghost Label</Lib.Button>
                <Lib.Button variant="danger">Destructive Action</Lib.Button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                <Lib.Button variant="primary" disabled>Disabled Solid</Lib.Button>
                <Lib.Button variant="outline" leftIcon="User">Prefix Profile</Lib.Button>
                <Lib.Button variant="primary" isLoading={btnLoading} onClick={() => {
                  setBtnLoading(true);
                  setTimeout(() => setBtnLoading(false), 2000);
                }}>
                  Click to Load 2s
                </Lib.Button>
              </div>
              {codeSnippet('Button', '<Button variant="primary">Submit</Button>')}
            </div>

            <div>
              <h4 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '12px', color: 'var(--ui-muted)' }}>Specialized Triggers</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <Lib.IconButton icon="Trash" tooltipText="Permanently delete record" />
                <Lib.IconButton icon="Settings" tooltipText="Configure settings" />
                <Lib.CopyButton text="https://enterprise-portal.web.app" />
                <Lib.SegmentedControl segments={['Daily', 'Weekly', 'Monthly']} activeSegment={activeSegment} onChange={(s) => { setActiveSegment(s); addToast(`Selected segment: ${s}`); }} />
                <Lib.SplitButton label="Create Organization" onPrimaryClick={() => addToast('Primary created!')} options={[
                  { label: 'Create Member', onClick: () => addToast('Member selected!') },
                  { label: 'Create Vendor', onClick: () => addToast('Vendor selected!') }
                ]} />
              </div>
              {codeSnippet('IconButton', '<IconButton icon="Trash" tooltipText="Delete Item" />')}
            </div>
          </div>
        </section>

        {/* 2. FORM CONTROLS */}
        <section id="inputs" className="panel-container">
          <h2 style={{ fontSize: '18px', fontWeight: 800, borderBottom: '1px solid var(--ui-line)', paddingBottom: '10px', marginBottom: '20px' }}>
            2. Form Controls & Smart Sandbox Playground
          </h2>
          
          {/* Smart Playground Tab Bar */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {['Contact', 'Identity', 'Financial', 'Tech', 'Spatial', 'Security', 'Editor'].map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setInputsTab(tab)}
                style={{
                  background: inputsTab === tab ? 'var(--ui-primary-soft)' : 'var(--ui-panel-strong)',
                  color: inputsTab === tab ? 'var(--ui-primary-deep)' : 'var(--ui-muted)',
                  border: '1px solid var(--ui-line)',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px 16px',
                  fontWeight: 800,
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.20s'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ minHeight: '340px' }}>
            {inputsTab === 'Contact' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <Lib.CellNumberInput label="South African Cell Phone" value={cellVal} onChange={(val) => setCellVal(val)} />
                  <div style={{ fontSize: '11px', color: 'var(--ui-primary)', fontWeight: 800, marginTop: '-10px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🗄️ Database Output:</span>
                    <code style={{ background: 'var(--ui-bg)', padding: '2px 6px', borderRadius: '4px', color: 'var(--ui-text)', fontFamily: 'monospace' }}>{cellVal}</code>
                  </div>
                  
                  <Lib.EmailInput label="Operator Email Address" value={emailVal} onChange={(val) => setEmailVal(val)} />
                  <div style={{ fontSize: '11px', color: 'var(--ui-primary)', fontWeight: 800, marginTop: '-10px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🗄️ Database Output:</span>
                    <code style={{ background: 'var(--ui-bg)', padding: '2px 6px', borderRadius: '4px', color: 'var(--ui-text)', fontFamily: 'monospace' }}>{emailVal}</code>
                  </div>
                </div>
                <div>
                  <Lib.TextInput label="Organization Name" placeholder="Enterprise Cape Town Office" suffixText=".com" />
                  <Lib.Textarea label="Internal Memo & Notes" placeholder="Write logs here..." />
                </div>
              </div>
            )}

            {inputsTab === 'Identity' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <Lib.SANationalIDInput label="South African National ID" value={saIdVal} onChange={(val) => setSaIdVal(val)} />
                  <div style={{ fontSize: '11px', color: 'var(--ui-primary)', fontWeight: 800, marginTop: '-10px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🗄️ Database Output:</span>
                    <code style={{ background: 'var(--ui-bg)', padding: '2px 6px', borderRadius: '4px', color: 'var(--ui-text)', fontFamily: 'monospace' }}>{saIdVal}</code>
                  </div>
                  
                  <Lib.PassportNumberInput label="Global Passport Number" value={passportVal} onChange={(val) => setPassportVal(val)} country="ZA" />
                  <div style={{ fontSize: '11px', color: 'var(--ui-primary)', fontWeight: 800, marginTop: '-10px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🗄️ Database Output:</span>
                    <code style={{ background: 'var(--ui-bg)', padding: '2px 6px', borderRadius: '4px', color: 'var(--ui-text)', fontFamily: 'monospace' }}>{passportVal}</code>
                  </div>
                </div>
                <div>
                  <Lib.SACompanyRegInput label="CIPC Company Registration" value={companyRegVal} onChange={(val) => setCompanyRegVal(val)} />
                  <div style={{ fontSize: '11px', color: 'var(--ui-primary)', fontWeight: 800, marginTop: '-10px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🗄️ Database Output:</span>
                    <code style={{ background: 'var(--ui-bg)', padding: '2px 6px', borderRadius: '4px', color: 'var(--ui-text)', fontFamily: 'monospace' }}>{companyRegVal}</code>
                  </div>

                  <Lib.SARSVATInput label="SARS VAT Number" value={vatVal} onChange={(val) => setVatVal(val)} />
                  <div style={{ fontSize: '11px', color: 'var(--ui-primary)', fontWeight: 800, marginTop: '-10px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🗄️ Database Output:</span>
                    <code style={{ background: 'var(--ui-bg)', padding: '2px 6px', borderRadius: '4px', color: 'var(--ui-text)', fontFamily: 'monospace' }}>{vatVal}</code>
                  </div>
                </div>
              </div>
            )}

            {inputsTab === 'Financial' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <Lib.CurrencyInput label="ZAR Money Cost" value={currencyVal} onChange={(val) => setCurrencyVal(val)} currencyPrefix="R" />
                  <div style={{ fontSize: '11px', color: 'var(--ui-primary)', fontWeight: 800, marginTop: '-10px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🗄️ Database Output:</span>
                    <code style={{ background: 'var(--ui-bg)', padding: '2px 6px', borderRadius: '4px', color: 'var(--ui-text)', fontFamily: 'monospace' }}>{currencyVal}</code>
                  </div>

                  <Lib.CreditCardInput label="Credit/Debit Card Number (PAN)" value={cardPANVal} onChange={(val) => setCardPANVal(val)} />
                  <div style={{ fontSize: '11px', color: 'var(--ui-primary)', fontWeight: 800, marginTop: '-10px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🗄️ Database Output:</span>
                    <code style={{ background: 'var(--ui-bg)', padding: '2px 6px', borderRadius: '4px', color: 'var(--ui-text)', fontFamily: 'monospace' }}>{cardPANVal}</code>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <Lib.CardExpiryInput label="Card Expiry" value={cardExpiryVal} onChange={(val) => setCardExpiryVal(val)} />
                      <div style={{ fontSize: '11px', color: 'var(--ui-primary)', fontWeight: 800, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>Exp:</span>
                        <code style={{ background: 'var(--ui-bg)', padding: '2px 6px', borderRadius: '4px', color: 'var(--ui-text)', fontFamily: 'monospace' }}>{cardExpiryVal}</code>
                      </div>
                    </div>
                    <div>
                      <Lib.CardCVVInput label="Card CVV" value={cardCVVVal} onChange={(val) => setCardCVVVal(val)} isAmex={cardPANVal.startsWith('34') || cardPANVal.startsWith('37')} />
                      <div style={{ fontSize: '11px', color: 'var(--ui-primary)', fontWeight: 800, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>CVV:</span>
                        <code style={{ background: 'var(--ui-bg)', padding: '2px 6px', borderRadius: '4px', color: 'var(--ui-text)', fontFamily: 'monospace' }}>{cardCVVVal}</code>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <Lib.BankAccountInput label="Bank Account Number" value={bankAccVal} onChange={(val) => setBankAccVal(val)} />
                  <div style={{ fontSize: '11px', color: 'var(--ui-primary)', fontWeight: 800, marginTop: '-10px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🗄️ Database Output:</span>
                    <code style={{ background: 'var(--ui-bg)', padding: '2px 6px', borderRadius: '4px', color: 'var(--ui-text)', fontFamily: 'monospace' }}>{bankAccVal}</code>
                  </div>

                  <Lib.BranchCodeInput label="Branch Code" value={branchVal} onChange={(val) => setBranchVal(val)} />
                  <div style={{ fontSize: '11px', color: 'var(--ui-primary)', fontWeight: 800, marginTop: '-10px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🗄️ Database Output:</span>
                    <code style={{ background: 'var(--ui-bg)', padding: '2px 6px', borderRadius: '4px', color: 'var(--ui-text)', fontFamily: 'monospace' }}>{branchVal}</code>
                  </div>
                </div>
              </div>
            )}

            {inputsTab === 'Tech' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <Lib.URLInput label="Website Domain URL" value={urlVal} onChange={(val) => setUrlVal(val)} />
                  <div style={{ fontSize: '11px', color: 'var(--ui-primary)', fontWeight: 800, marginTop: '-10px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🗄️ Database Output:</span>
                    <code style={{ background: 'var(--ui-bg)', padding: '2px 6px', borderRadius: '4px', color: 'var(--ui-text)', fontFamily: 'monospace' }}>{urlVal}</code>
                  </div>

                  <Lib.IPAddressInput label="IPv4 Network Address" value={ipVal} onChange={(val) => setIpVal(val)} />
                  <div style={{ fontSize: '11px', color: 'var(--ui-primary)', fontWeight: 800, marginTop: '-10px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🗄️ Database Output:</span>
                    <code style={{ background: 'var(--ui-bg)', padding: '2px 6px', borderRadius: '4px', color: 'var(--ui-text)', fontFamily: 'monospace' }}>{ipVal}</code>
                  </div>
                </div>
                <div>
                  <Lib.MACAddressInput label="MAC Address" value={macVal} onChange={(val) => setMacVal(val)} />
                  <div style={{ fontSize: '11px', color: 'var(--ui-primary)', fontWeight: 800, marginTop: '-10px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🗄️ Database Output:</span>
                    <code style={{ background: 'var(--ui-bg)', padding: '2px 6px', borderRadius: '4px', color: 'var(--ui-text)', fontFamily: 'monospace' }}>{macVal}</code>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <Lib.HexColorInput label="Hex Color Code" value={hexColorVal} onChange={(val) => setHexColorVal(val)} />
                      <div style={{ fontSize: '11px', color: 'var(--ui-primary)', fontWeight: 800, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>Color:</span>
                        <code style={{ background: 'var(--ui-bg)', padding: '2px 6px', borderRadius: '4px', color: 'var(--ui-text)', fontFamily: 'monospace' }}>#{hexColorVal}</code>
                      </div>
                    </div>
                    <div>
                      <Lib.SocialHandleInput label="Social Username" value={socialVal} onChange={(val) => setSocialVal(val)} />
                      <div style={{ fontSize: '11px', color: 'var(--ui-primary)', fontWeight: 800, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>Slug:</span>
                        <code style={{ background: 'var(--ui-bg)', padding: '2px 6px', borderRadius: '4px', color: 'var(--ui-text)', fontFamily: 'monospace' }}>@{socialVal}</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {inputsTab === 'Spatial' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <Lib.PercentageInput label="Commission Percentage (%)" value={percentVal} onChange={(val) => setPercentVal(val)} />
                  <div style={{ fontSize: '11px', color: 'var(--ui-primary)', fontWeight: 800, marginTop: '-10px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🗄️ Database Output:</span>
                    <code style={{ background: 'var(--ui-bg)', padding: '2px 6px', borderRadius: '4px', color: 'var(--ui-text)', fontFamily: 'monospace' }}>{percentVal}%</code>
                  </div>

                  <Lib.UnitMeasurementInput 
                    label="Compound Units Selector" 
                    value={measureVal} 
                    onChange={(val) => setMeasureVal(val)} 
                    unit={measureUnit} 
                    onUnitChange={setMeasureUnit} 
                  />
                  <div style={{ fontSize: '11px', color: 'var(--ui-primary)', fontWeight: 800, marginTop: '-10px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🗄️ Database Output:</span>
                    <code style={{ background: 'var(--ui-bg)', padding: '2px 6px', borderRadius: '4px', color: 'var(--ui-text)', fontFamily: 'monospace' }}>{measureVal} {measureUnit}</code>
                  </div>
                </div>
                <div>
                  <Lib.PostalCodeInput label="Postal / ZIP Code" value={postalVal} onChange={(val) => setPostalVal(val)} />
                  <div style={{ fontSize: '11px', color: 'var(--ui-primary)', fontWeight: 800, marginTop: '-10px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🗄️ Database Output:</span>
                    <code style={{ background: 'var(--ui-bg)', padding: '2px 6px', borderRadius: '4px', color: 'var(--ui-text)', fontFamily: 'monospace' }}>{postalVal}</code>
                  </div>

                  <Lib.GPSCoordinatesInput 
                    latValue={latVal} 
                    longValue={longVal} 
                    onChange={(lat, lng) => { setLatVal(lat); setLongVal(lng); }} 
                  />
                  <div style={{ fontSize: '11px', color: 'var(--ui-primary)', fontWeight: 800, marginTop: '-10px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🗄️ Database Output:</span>
                    <code style={{ background: 'var(--ui-bg)', padding: '2px 6px', borderRadius: '4px', color: 'var(--ui-text)', fontFamily: 'monospace' }}>{latVal}, {longVal}</code>
                  </div>
                </div>
              </div>
            )}

            {inputsTab === 'Security' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <Lib.StrictPasswordCreator label="Strict Password Creator" value={strictPasswordVal} onChange={(val) => setStrictPasswordVal(val)} />
                  <div style={{ fontSize: '11px', color: 'var(--ui-primary)', fontWeight: 800, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🗄️ Password Strength Checked</span>
                  </div>
                </div>
                <div>
                  <div style={{ marginBottom: '20px' }}>
                    <label className="input-label" style={{ marginBottom: '6px' }}>Advanced OTP / 2FA Token (Paste to distribute)</label>
                    <Lib.AdvancedOTPInput length={6} value={advancedOTPVal} onChange={(code) => setAdvancedOTPVal(code)} />
                    <div style={{ fontSize: '11px', color: 'var(--ui-primary)', fontWeight: 800, marginTop: '6px' }}>
                      <span>🗄️ Distr Code: </span>
                      <code style={{ background: 'var(--ui-bg)', padding: '2px 6px', borderRadius: '4px', color: 'var(--ui-text)', fontFamily: 'monospace' }}>{advancedOTPVal}</code>
                    </div>
                  </div>

                  <Lib.TimeDurationInput label="Duration HH:MM Limit" value={durationVal} onChange={(val) => setDurationVal(val)} />
                  <div style={{ fontSize: '11px', color: 'var(--ui-primary)', fontWeight: 800, marginTop: '-10px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🗄️ Database Output:</span>
                    <code style={{ background: 'var(--ui-bg)', padding: '2px 6px', borderRadius: '4px', color: 'var(--ui-text)', fontFamily: 'monospace' }}>{durationVal}</code>
                  </div>

                  <Lib.DOBInput label="Restricted DOB (Age 18+ Block)" value={dobVal} onChange={(val) => setDobVal(val)} minAge={18} />
                  <div style={{ fontSize: '11px', color: 'var(--ui-primary)', fontWeight: 800, marginTop: '-10px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🗄️ Database Output:</span>
                    <code style={{ background: 'var(--ui-bg)', padding: '2px 6px', borderRadius: '4px', color: 'var(--ui-text)', fontFamily: 'monospace' }}>{dobVal}</code>
                  </div>
                </div>
              </div>
            )}

            {inputsTab === 'Editor' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
                  <div>
                    <Lib.AdvancedRichEditor 
                      label="Advanced Dual-Mode Rich Text Editor" 
                      value={editorHTML} 
                      onChange={setEditorHTML} 
                      placeholder="Start writing awesome HTML here..." 
                      onImageUpload={mockImageUpload}
                    />
                  </div>
                  <div>
                    <label className="input-label" style={{ marginBottom: '6px' }}>🛡️ API Clean Sanitize Output</label>
                    <div style={{
                      background: 'var(--ui-panel-strong)',
                      border: '1px solid var(--ui-line)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '16px',
                      height: '425px',
                      overflowY: 'auto',
                      boxShadow: 'var(--ui-shadow-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--ui-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>✓ Zero-Trust Scrubbed Output Payload</span>
                      </div>
                      <pre style={{
                        margin: 0,
                        fontFamily: "'Courier New', Courier, monospace",
                        fontSize: '12px',
                        lineHeight: '1.5',
                        color: 'var(--ui-text)',
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        background: 'var(--ui-bg)',
                        padding: '12px',
                        borderRadius: '6px',
                        flex: 1,
                        overflowY: 'auto',
                        border: '1px solid var(--ui-line-2)'
                      }}>
                        <code>{Lib.sanitizeHTML(editorHTML)}</code>
                      </pre>
                      <div style={{
                        fontSize: '11px',
                        color: 'var(--ui-muted)',
                        lineHeight: 1.4,
                        borderTop: '1px solid var(--ui-line)',
                        paddingTop: '10px'
                      }}>
                        Pasted scripting nodes (e.g. <code>&lt;script&gt;</code>, <code>onclick</code> event attachments, and <code>javascript:</code> paths) are actively purged before delivery.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Base inputs extra controls inside footer of playground */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', borderTop: '1px solid var(--ui-line-2)', paddingTop: '20px', marginTop: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Lib.NumberStepper label="Contract Duration (Years)" value={stepperVal} onChange={setStepperVal} min={1} max={5} />
              <Lib.ColorPicker label="Accompanying Brand Hex" color={colorVal} onChange={setColorVal} />
            </div>
            <div>
              <Lib.TagInput label="Geographic Tags (Pill ComboBox)" tags={tagList} onChange={setTagList} />
            </div>
          </div>
        </section>

        {/* 3. SELECTION CONTROLS */}
        <section id="selection" className="panel-container">
          <h2 style={{ fontSize: '18px', fontWeight: 800, borderBottom: '1px solid var(--ui-line)', paddingBottom: '10px', marginBottom: '20px' }}>
            3. Selection & Boolean Choice Logic
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '12px', color: 'var(--ui-muted)' }}>Toggles & Selectors</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <Lib.Checkbox label="Subscribe to newsletter" checked={checkVal} onChange={setCheckVal} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Lib.Checkbox 
                    label="Operational Region Access" 
                    checked={isParentChecked} 
                    indeterminate={isIndeterminate} 
                    onChange={handleParentChange} 
                  />
                  <div style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Lib.Checkbox 
                      label="Cape Town Central Hub" 
                      checked={childrenStates[0]} 
                      onChange={(checked) => handleChildChange(0, checked)} 
                    />
                    <Lib.Checkbox 
                      label="Johannesburg North Hub" 
                      checked={childrenStates[1]} 
                      onChange={(checked) => handleChildChange(1, checked)} 
                    />
                    <Lib.Checkbox 
                      label="Durban South Hub" 
                      checked={childrenStates[2]} 
                      onChange={(checked) => handleChildChange(2, checked)} 
                    />
                  </div>
                </div>
                <Lib.RadioButton label="Field Agent Role" value="agent" selectedValue={radioVal} onChange={setRadioVal} />
                <Lib.RadioButton label="Franchise Admin Role" value="admin" selectedValue={radioVal} onChange={setRadioVal} />
                <Lib.ToggleSwitch label="SMS Alert Alerts" active={toggleVal} onChange={setToggleVal} />
              </div>
            </div>

            <div>
              <h4 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '12px', color: 'var(--ui-muted)' }}>Lists & Selects</h4>
              <Lib.DropdownSelect label="Operational Status" value={dropdownVal} onChange={setDropdownVal} options={[
                { value: 'active', label: 'Active Service' },
                { value: 'pending', label: 'Pending Review' },
                { value: 'suspended', label: 'Suspended Service' }
              ]} />
              <Lib.SearchableSelect label="Location Region Hub" value={searchSelectVal} onChange={setSearchSelectVal} options={locationOptions} />
            </div>

            <div>
              <h4 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '12px', color: 'var(--ui-muted)' }}>Sliders & Scales</h4>
              <Lib.RangeSlider label="System Priority Threshold" min={0} max={100} val={sliderVal} onChange={setSliderVal} />
              <div style={{ marginTop: '18px' }}>
                <label className="input-label" style={{ marginBottom: '6px' }}>Service Feedback Rating</label>
                <Lib.RatingStars rating={starVal} onChange={setStarVal} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '24px', borderTop: '1px solid var(--ui-line-2)', paddingTop: '20px' }}>
            <h4 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '12px', color: 'var(--ui-muted)' }}>Transfer List (Shuttle Box)</h4>
            <Lib.ShuttleBox available={shuttleAvail} selected={shuttleSel} onChange={(avail, sel) => { setShuttleAvail(avail); setShuttleSel(sel); }} />
          </div>

          <div style={{ marginTop: '24px', borderTop: '1px solid var(--ui-line-2)', paddingTop: '20px' }}>
            <h4 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '12px', color: 'var(--ui-muted)' }}>Interactive Selection Card Grid</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <Lib.CardSelector title="Basic Tier Account" description="$19 / month per organization. Core metrics only." active={selectedCardIdx === 0} onClick={() => setSelectedCardIdx(0)} />
              <Lib.CardSelector title="Professional Tier Account" description="$49 / month per organization. Custom fields builder." active={selectedCardIdx === 1} onClick={() => setSelectedCardIdx(1)} />
              <Lib.CardSelector title="Ultimate Enterprise Tier" description="$99 / month per organization. Unlimited roles." active={selectedCardIdx === 2} onClick={() => setSelectedCardIdx(2)} />
            </div>
          </div>
        </section>

        {/* 4. DATE & CALENDAR */}
        <section id="dates" className="panel-container">
          <h2 style={{ fontSize: '18px', fontWeight: 800, borderBottom: '1px solid var(--ui-line)', paddingBottom: '10px', marginBottom: '20px' }}>
            4. Time, Date & Scheduling (Google-Style Suite)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Lib.DatePicker label="Target Operational Date" selectedDate={singleDate} onChange={setSingleDate} />
              <Lib.TimePicker label="Event Trigger Time" value={timeVal} onChange={setTimeVal} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Lib.DateTimePicker label="Unified Date & Time Target" value={dateTimeVal} onChange={setDateTimeVal} />
              <Lib.GoogleTwinCalendar startDate={startDate} endDate={endDate} onChange={(s, e) => { setStartDate(s); setEndDate(e); }} />
            </div>
          </div>
        </section>

        {/* 5. NAVIGATION & APP STRUCTURE */}
        <section id="navigation" className="panel-container">
          <h2 style={{ fontSize: '18px', fontWeight: 800, borderBottom: '1px solid var(--ui-line)', paddingBottom: '10px', marginBottom: '20px' }}>
            5. Navigation, Structure & Wayfinding
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Topbar example */}
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '10px', color: 'var(--ui-muted)' }}>Top Application bar</h4>
              <Lib.TopBar 
                user={{ name: 'Tyler Durden', email: 'tyler@company.com' }} 
                notificationsCount={2} 
              />
            </div>

            {/* Breadcrumbs and tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '10px', color: 'var(--ui-muted)' }}>Breadcrumbs & Steppers</h4>
                <Lib.Breadcrumbs paths={['Home', 'Organizations', 'Detail View']} />
                <div style={{ marginTop: '20px' }}>
                  <Lib.Stepper steps={['Details', 'Security', 'Finish']} currentStep={1} />
                </div>
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '10px', color: 'var(--ui-muted)' }}>Interactive Tabs Bar</h4>
                <Lib.Tabs tabs={['Landlord Profile', 'Properties List', 'Tenant Agreements']} activeTab={activeTab} onChange={setActiveTab} />
                <div style={{ marginTop: '16px', background: 'var(--ui-bg)', padding: '16px', borderRadius: '12px', fontSize: '13px', color: 'var(--ui-text)' }}>
                  Active Section view: <strong>{activeTab}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. DATA DISPLAY */}
        <section id="display" className="panel-container">
          <h2 style={{ fontSize: '18px', fontWeight: 800, borderBottom: '1px solid var(--ui-line)', paddingBottom: '10px', marginBottom: '20px' }}>
            6. Data Display (Cards, KPI Widgets & Indicators)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Lib.MetricCard title="System Monthly Revenue" value="$42,850" trend="+14.2% vs last month" trendDirection="up" sparklineData={[40, 48, 45, 52, 60, 58, 70]} />
                <Lib.MetricCard title="Pending Leads Claims" value="184 Leads" trend="-5.4% vs last week" trendDirection="down" sparklineData={[80, 75, 90, 85, 72, 68, 62]} />
              </div>
              <Lib.Accordion title="Terms and Security Conditions Agreement">
                These conditions govern the white-label components parameters mapping variables. When developers override primary accent values, the context dynamically propagates variables in real-time.
              </Lib.Accordion>

              {/* White-Label Adaptive Logo Demonstration */}
              <div style={{ borderTop: '1px solid var(--ui-line-2)', paddingTop: '16px' }}>
                <h4 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '12px', color: 'var(--ui-muted)' }}>White-Label Adaptive Logo (&lt;Logo&gt;)</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', borderRadius: '12px', background: 'var(--ui-bg)', border: '1px solid var(--ui-line-2)' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--ui-muted)', display: 'block', marginBottom: '6px' }}>1. Fallback Text-based Brand Logo (No files provided)</span>
                    <Lib.Logo size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--ui-muted)', display: 'block', marginBottom: '6px' }}>2. Single-Theme File Provided (Invalid state, falls back to Text)</span>
                    <Lib.Logo size={24} lightModeSrc="/logo_light.png" />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--ui-muted)', display: 'block', marginBottom: '6px' }}>3. "Lorem Ipsum" Custom Brand Logo (Theme-swapped Generated Assets)</span>
                    <div style={{ background: 'var(--ui-panel-pure)', padding: '12px 18px', borderRadius: '12px', display: 'inline-block', border: '1px solid var(--ui-line-2)' }}>
                      <Lib.Logo 
                        size={36} 
                        lightModeSrc="/logo_light.png" 
                        darkModeSrc="/logo_dark.png" 
                      />
                    </div>
                  </div>
                </div>
                {codeSnippet('Logo', '<Logo size={36} lightModeSrc="/logo_light.png" darkModeSrc="/logo_dark.png" />')}
              </div>

              {/* Lightweight Mini Stat card Demonstration */}
              <div style={{ borderTop: '1px solid var(--ui-line-2)', paddingTop: '16px' }}>
                <h4 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '12px', color: 'var(--ui-muted)' }}>Lightweight Mini Stat Panel (&lt;MiniStat&gt;)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <Lib.MiniStat label="ACTIVE LEASES" value="48 Leases" subtext="8 expiring within 30 days" />
                  <Lib.MiniStat label="PENDING WORK ORDERS" value="12 Tickets" subtext="4 marked high priority" />
                </div>
                {codeSnippet('MiniStat', '<MiniStat label="ACTIVE LEASES" value="48 Leases" subtext="..." />')}
              </div>
            </div>

            <div>
              <h4 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '12px', color: 'var(--ui-muted)' }}>Avatars & Badges</h4>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                <Lib.Avatar name="Bruce Wayne" presence="online" size={48} />
                <Lib.Avatar name="Selina Kyle" presence="away" size={48} />
                <Lib.AvatarGroup users={[
                  { name: 'John Doe' },
                  { name: 'Bruce Wayne' },
                  { name: 'Tyler Durden' },
                  { name: 'Sarah Connor' }
                ]} />
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Lib.Badge variant="green">Active</Lib.Badge>
                <Lib.Badge variant="red">Suspended</Lib.Badge>
                <Lib.Badge variant="yellow">Pending</Lib.Badge>
                <Lib.Badge variant="blue">New</Lib.Badge>
                <Lib.Badge variant="grey" onDismiss={() => addToast('Dismissed!')}>Filter Tag</Lib.Badge>
              </div>

              {/* Status Chips Badge Tag Demonstration */}
              <div style={{ marginTop: '20px', borderTop: '1px solid var(--ui-line-2)', paddingTop: '16px' }}>
                <h4 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '10px', color: 'var(--ui-muted)' }}>Status Chips (&lt;StatusChip&gt;)</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <Lib.StatusChip color="green">Operational</Lib.StatusChip>
                  <Lib.StatusChip color="red">Critical Fail</Lib.StatusChip>
                  <Lib.StatusChip color="yellow">Syncing...</Lib.StatusChip>
                  <Lib.StatusChip color="blue">Info Banner</Lib.StatusChip>
                  <Lib.StatusChip color="grey">Legacy System</Lib.StatusChip>
                </div>
                {codeSnippet('StatusChip', '<StatusChip color="green">Operational</StatusChip>')}
              </div>

              <div style={{ marginTop: '24px' }}>
                <h4 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '10px', color: 'var(--ui-muted)' }}>Chronological Audit Log</h4>
                <Lib.Timeline events={[
                  { title: 'Organization Approved', description: 'Enterprise Cape Town portal validated by office admin.', time: '2 hours ago', color: 'var(--ui-green)' },
                  { title: 'Custom Fields Altered', description: 'Bruce Wayne added contract parameters field.', time: '5 hours ago', color: 'var(--ui-primary)' },
                  { title: 'Security audit warning', description: 'Failed password attempt from IP 192.168.1.1.', time: 'Yesterday', color: 'var(--ui-red)' }
                ]} />
              </div>
            </div>
          </div>
        </section>

        {/* 7. ENTERPRISE DATA GRID */}
        <section id="grid" className="panel-container">
          <h2 style={{ fontSize: '18px', fontWeight: 800, borderBottom: '1px solid var(--ui-line)', paddingBottom: '10px', marginBottom: '20px' }}>
            7. The Enterprise Data Grid (Interactive Table)
          </h2>
          <Lib.InlineAlert title="Double-Click Cell Editing Activated" type="info">
            Double-click on any grid text cell (e.g. Names or Property Counts) to activate the <strong>double-click cell edit</strong> feature in real-time!
          </Lib.InlineAlert>
          <Lib.AdvancedDataGrid 
            columns={gridColumns} 
            data={gridData} 
            onDeleteSelected={handleGridDelete}
          />
        </section>

        {/* 8. OVERLAYS & PORTALS */}
        <section id="overlays" className="panel-container">
          <h2 style={{ fontSize: '18px', fontWeight: 800, borderBottom: '1px solid var(--ui-line)', paddingBottom: '10px', marginBottom: '20px' }}>
            8. Overlays, Portals & Context Menus
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '12px', color: 'var(--ui-muted)' }}>Toggles Modals & Drawers</h4>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Lib.Button variant="primary" onClick={() => setIsModalOpen(true)}>Open Modal Dialog</Lib.Button>
                <Lib.Button variant="secondary" onClick={() => setIsDrawerOpen(true)}>Open Slide Drawer</Lib.Button>
                <Lib.Button variant="outline" onClick={() => setIsPaletteOpen(true)}>Launch Spotlight (Cmd+K)</Lib.Button>
              </div>

              {/* Popovers & Tooltips */}
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginTop: '24px' }}>
                <Lib.Popover trigger={<Lib.Button variant="outline">Open Popover card</Lib.Button>}>
                  <h4 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '6px' }}>Interactive Popover</h4>
                  <p style={{ fontSize: '12px', color: 'var(--ui-muted)', marginBottom: '10px' }}>Contains complex sub-actions inside floating scopes.</p>
                  <Lib.Button variant="primary" style={{ padding: '6px 12px', fontSize: '12px', width: '100%' }}>Action Link</Lib.Button>
                </Lib.Popover>

                <Lib.Tooltip trigger={<span style={{ borderBottom: '1px dashed var(--ui-muted)', cursor: 'help', fontWeight: 600 }}>Hover here for details</span>} text="This is an accessible floating Tooltip description!" />
              </div>
            </div>

            <div>
              <h4 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '12px', color: 'var(--ui-muted)' }}>Context Menu trigger</h4>
              <Lib.ContextMenu options={[
                { label: 'Edit details', onClick: () => addToast('Clicked edit context menu!') },
                { label: 'Export PDF Report', onClick: () => addToast('Exporting context menu!') },
                { label: 'Deactivate service', onClick: () => addToast('Deactivating context menu!', 'warning') }
              ]}>
                <div style={{
                  padding: '48px 24px',
                  borderRadius: '12px',
                  background: 'var(--ui-bg)',
                  border: '2px dashed var(--ui-line)',
                  textAlign: 'center',
                  fontWeight: 700,
                  color: 'var(--ui-muted)',
                  cursor: 'context-menu'
                }}>
                  Right-Click inside this boundary to trigger custom Context Menu.
                </div>
              </Lib.ContextMenu>
            </div>
          </div>

          {/* Render Modal */}
          <Lib.Modal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            title="Operational System Modal"
            footer={
              <>
                <Lib.Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Lib.Button>
                <Lib.Button variant="primary" onClick={() => { setIsModalOpen(false); addToast('Saved details!', 'success'); }}>Confirm Save</Lib.Button>
              </>
            }
          >
            This portal-based standard dialog overlay traps keyboard navigation focus in compliance with enterprise security requirements. Perfect for configuration wizards or user creations.
          </Lib.Modal>

          {/* Render Drawer */}
          <Lib.SlideOver
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            title="Edit Landlord Profile"
            footer={
              <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                <Lib.Button variant="primary" style={{ flex: 1 }} onClick={() => { setIsDrawerOpen(false); addToast('Updated details!', 'success'); }}>Save Profile</Lib.Button>
                <Lib.Button variant="outline" style={{ flex: 1 }} onClick={() => setIsDrawerOpen(false)}>Cancel</Lib.Button>
              </div>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
              <Lib.TextInput label="Contact Phone Number" value="+1 555 0123" readOnly />
              <Lib.TextInput label="Organization ID Attached" value="Enterprise Regional Branch" readOnly />
              <Lib.DropdownSelect label="Validation Level" value="Level 2 Verified" onChange={() => {}} options={[
                { value: 'lv2', label: 'Level 2 Verified' }
              ]} />
            </div>
          </Lib.SlideOver>

          {/* Render Palette */}
          <Lib.CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
        </section>

        {/* 9. SYSTEM FEEDBACK */}
        <section id="feedback" className="panel-container">
          <h2 style={{ fontSize: '18px', fontWeight: 800, borderBottom: '1px solid var(--ui-line)', paddingBottom: '10px', marginBottom: '20px' }}>
            9. System Feedback & Alerts Banners
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
            <div>
              <Lib.InlineAlert title="Security Protocol Updated" type="warning">
                System parameters detected access from new IP address blocks. Confirm credentials to secure organization records.
              </Lib.InlineAlert>
              <Lib.InlineAlert title="Organization operational data synchronized" type="success" />

              <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
                <Lib.Button variant="primary" onClick={() => addToast('Action successful!', 'success')}>Toast Success</Lib.Button>
                <Lib.Button variant="danger" onClick={() => addToast('Network validation failed.', 'error')}>Toast Error</Lib.Button>
                <Lib.Button variant="secondary" onClick={() => addToast('Checking server synchronization...', 'info')}>Toast Info</Lib.Button>
              </div>
            </div>

            <div>
              <h4 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '10px', color: 'var(--ui-muted)' }}>Skeleton placeholders & Loaders</h4>
              <div style={{ background: 'var(--ui-bg)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Lib.Skeleton variant="circle" />
                  <div style={{ flex: 1 }}>
                    <Lib.Skeleton variant="text" width="60%" />
                    <Lib.Skeleton variant="text" width="40%" />
                  </div>
                </div>
                <Lib.Skeleton variant="rect" height="40px" />
              </div>

              {/* Global ScreenLoader Demonstration */}
              <div style={{ marginTop: '24px' }}>
                <h4 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '10px', color: 'var(--ui-muted)' }}>Screen Loader spinner (&lt;ScreenLoader&gt;)</h4>
                <div style={{ background: 'var(--ui-bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--ui-line-2)', position: 'relative' }}>
                  <Lib.ScreenLoader />
                </div>
                {codeSnippet('ScreenLoader', '<ScreenLoader />')}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '24px', borderTop: '1px solid var(--ui-line-2)', paddingTop: '20px' }}>
            <h4 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '12px', color: 'var(--ui-muted)' }}>Empty state representation</h4>
            <Lib.EmptyState title="No contractor accounts attached yet" description="Contractors manage facility repairs and structural maintenance. Create your first profile to synchronize workflows." ctaText="Add Contractor Profile" onCtaClick={() => addToast('Forwarded to creation wizard!')} />
          </div>
        </section>

        {/* 10. MEDIA & DOMAIN WIDGETS */}
        <section id="uploads" className="panel-container" style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, borderBottom: '1px solid var(--ui-line)', paddingBottom: '10px', marginBottom: '20px' }}>
            10. Advanced Domain Widgets & Media Uploads
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '10px', color: 'var(--ui-muted)' }}>File Uploader Dropzone</h4>
                <Lib.FileDropzone onFilesAdded={(files) => addToast(`Imported ${files.length} document attachments.`)} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '10px', color: 'var(--ui-muted)' }}>Interactive SVG Metrics chart</h4>
                <Lib.ChartPrimitive />
              </div>
            </div>

            {/* ProgressiveImage Demonstration */}
            <div style={{ borderTop: '1px solid var(--ui-line-2)', paddingTop: '20px' }}>
              <h4 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '10px', color: 'var(--ui-muted)' }}>Progressive Image Loader (&lt;ProgressiveImage&gt;)</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Lib.ProgressiveImage 
                    src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80" 
                    blurPlaceholder="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=20&q=10" 
                    alt="Sample progressive image"
                    style={{ width: '100%', height: '220px', borderRadius: '14px' }}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--ui-muted)', textAlign: 'center' }}>Scales and transitions smoothly from low-res blur to high-res</span>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: 'var(--ui-text)', lineHeight: 1.6, margin: 0 }}>
                    The <code>&lt;ProgressiveImage&gt;</code> component pre-renders a tiny blur placeholder first, scaling and blurring it to hide pixelation. As the full-resolution asset completes loading, opacity dynamically and smoothly transitions to 100%.
                  </p>
                  {codeSnippet('ProgressiveImage', '<ProgressiveImage\n  src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"\n  blurPlaceholder="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=20&q=10"\n  style={{ width: "100%", height: "220px", borderRadius: "14px" }}\n/>')}
                </div>
              </div>
            </div>
            
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '10px', color: 'var(--ui-muted)' }}>Kanban Workflow Board</h4>
              <Lib.KanbanBoard />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default App;
