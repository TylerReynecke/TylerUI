# Tyler UI Component Library: Master Reference & Import Documentation

Welcome to the **Tyler UI Component Library**, a premium, high-density React design system engineered with sophisticated glassmorphism aesthetics, responsive micro-animations, customizable light/dark styling tokens, and strict front-end validation logic. 

This document serves as the master API reference guide for developers looking to integrate, audit, and deploy these components inside enterprise dashboards.

---

## 🚀 Getting Started & Installation

To import and use this library in your React workspace, follow these configuration steps:

### 1. Style & Theme Architecture
Our design tokens rely on a shared white-label variable setup. Ensure you link the global stylesheet `src/index.css` inside your main React entry file (e.g. `main.tsx` or `index.html`):

```typescript
import './index.css'; // Core variable bindings, styling resets, and animation curves
```

### 2. Styling Tokens (CSS Custom Properties)
All components inherit styles from standard root design tokens. Override these custom variables inline or in your theme files to customize visual properties:

| Variable | Light Theme Default | Dark Theme Default | Purpose |
| :--- | :--- | :--- | :--- |
| `--ui-primary` | `#3b82f6` (Vibrant Blue) | `#3b82f6` (Vibrant Blue) | Core brand accent |
| `--ui-bg` | `#f5f5f3` (Warm Grey) | `#090a0f` (Rich Black) | Canvas background |
| `--ui-panel` | `rgba(255,255,255,0.72)` | `rgba(26,29,41,0.65)` | Glass background |
| `--ui-line` | `rgba(15,23,42,0.08)` | `rgba(255,255,255,0.08)` | Borders & thin divider lines |
| `--ui-text` | `#101114` (Slate Black) | `#ffffff` (True White) | Primary text content |
| `--ui-muted` | `#6b7280` | `#a0aec0` | Subtitles and disabled states |

---

## 🎛️ Category 1: Actions & Triggers (`Actions.tsx`)

Core interaction elements featuring rich active states, keyboard triggers, and responsive hover scales.

### 1. Button
An interactive element supporting standard button behaviors, state loaders, and dynamic icons.
*   **Import Syntax**: `import { Button } from './library';`
*   **Properties**:
    ```typescript
    interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
      variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
      isLoading?: boolean;
      leftIcon?: keyof typeof Icons;
      rightIcon?: keyof typeof Icons;
    }
    ```
*   **Usage**:
    ```typescript
    <Button variant="primary" isLoading={false} leftIcon="Check" onClick={() => alert('Confirmed!')}>
      Submit Transaction
    </Button>
    ```

### 2. IconButton
An icon-only action trigger styled with an elegant, responsive tooltip.
*   **Import Syntax**: `import { IconButton } from './library';`
*   **Properties**:
    ```typescript
    interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
      icon: keyof typeof Icons;
      tooltipText: string;
    }
    ```
*   **Usage**:
    ```typescript
    <IconButton icon="Settings" tooltipText="Configure dashboard preferences" onClick={openSettings} />
    ```

### 3. SplitButton
A segmented dropdown control supporting a primary trigger and a toggleable panel of side-actions.
*   **Import Syntax**: `import { SplitButton } from './library';`
*   **Properties**:
    ```typescript
    interface SplitButtonProps {
      label: string;
      onPrimaryClick: () => void;
      options: { label: string; onClick: () => void }[];
    }
    ```
*   **Usage**:
    ```typescript
    <SplitButton
      label="Save Changes"
      onPrimaryClick={saveData}
      options={[
        { label: "Save & Publish", onClick: publishData },
        { label: "Export as JSON", onClick: exportData }
      ]}
    />
    ```

### 4. SegmentedControl
A horizontal pill navigation switcher implementing micro-animated selection backgrounds.
*   **Import Syntax**: `import { SegmentedControl } from './library';`
*   **Properties**:
    ```typescript
    interface SegmentedControlProps {
      options: { value: string; label: string }[];
      value: string;
      onChange: (val: string) => void;
    }
    ```
*   **Usage**:
    ```typescript
    <SegmentedControl
      options={[{ value: 'day', label: 'Daily' }, { value: 'month', label: 'Monthly' }]}
      value={viewType}
      onChange={setViewType}
    />
    ```

### 5. FAB (Floating Action Button)
A fixed, circular, high-impact trigger positioned at the bottom right corner of screens.
*   **Import Syntax**: `import { FAB } from './library';`
*   **Properties**:
    ```typescript
    interface FABProps {
      icon: keyof typeof Icons;
      onClick: () => void;
      tooltip?: string;
    }
    ```
*   **Usage**:
    ```typescript
    <FAB icon="Plus" tooltip="Add New Asset" onClick={addNewItem} />
    ```

### 6. CopyButton
A micro-action helper featuring localized "Copied!" feedback hooks and clipboard mapping.
*   **Import Syntax**: `import { CopyButton } from './library';`
*   **Properties**:
    ```typescript
    interface CopyButtonProps {
      text: string;
      label?: string;
    }
    ```
*   **Usage**:
    ```typescript
    <CopyButton text="https://portal.company.com" label="Copy Link" />
    ```

---

## 📝 Category 2: Form Controls & Smart Inputs (`Inputs.tsx`)

Our input suite features strict inline validators, mathematical checksums, sandboxed WYSIWYG widgets, and dynamic styling locks.

### 1. CellNumberInput (International / South Africa)
A strict, zero-flag telephone formatter with spaces-masking, numeric locks, and clean unmasked data outputs.
*   **Import Syntax**: `import { CellNumberInput } from './library';`
*   **Properties**:
    ```typescript
    interface CellNumberProps {
      label?: string;
      value: string; // formats automatically on paste / type
      onChange: (unmaskedValue: string) => void; // returns digits-only e.g. "0823334444"
      error?: string;
    }
    ```
*   **Design Intent & Considerations**: Replaces letters instantly. Masks digits with spaced intervals `0XX XXX XXXX` to comply with local readability standards while keeping raw data pure.

### 2. EmailInput
A specialized email validator blockading whitespace inputs and lowercase-forcing values.
*   **Import Syntax**: `import { EmailInput } from './library';`
*   **Properties**:
    ```typescript
    interface EmailInputProps {
      label?: string;
      value: string;
      onChange: (value: string) => void;
      error?: string;
    }
    ```
*   **Considerations**: Intercepts `keydown` to block the Spacebar entirely. Autoconverts entries to lowercase. Validates syntax using the standard regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.

### 3. SANationalIDInput
A powerful administrative field validating South African IDs against age, citizen type, and Luhn algorithms.
*   **Import Syntax**: `import { SANationalIDInput } from './library';`
*   **Properties**:
    ```typescript
    interface SANationalIDProps {
      label?: string;
      value: string;
      onChange: (value: string) => void;
    }
    ```
*   **Considerations**:
    1.  **Date Parsing**: Validates the first 6 digits (`YYMMDD`) against valid Gregorian calendars (e.g. skips leap years correctly).
    2.  **Luhn Checksum Validation**: Computes `(Sum of odd digits) + (Sum of digits of 2 * even digits)` to confirm algorithmic validity.
    3.  **Citizen Detector**: Confirms residency mapping via digit indices.

### 4. StrictPasswordCreator
A high-security, interactive creator detailing character validation metrics in real time.
*   **Import Syntax**: `import { StrictPasswordCreator } from './library';`
*   **Properties**:
    ```typescript
    interface PasswordCreatorProps {
      label?: string;
      value: string;
      onChange: (value: string) => void;
    }
    ```
*   **Usage**: Shows dynamic checkmarks highlighting length (8+), capitals (A-Z), numeric codes (0-9), and special characters (`@#$`).

### 5. AdvancedOTPInput
A split-segmented code input implementing focus-forwarding, keydown navigation, and clipboard splitting.
*   **Import Syntax**: `import { AdvancedOTPInput } from './library';`
*   **Properties**:
    ```typescript
    interface OTPInputProps {
      length?: number; // 4, 6, or 8 digits
      value: string;
      onChange: (value: string) => void;
    }
    ```
*   **Considerations**: Automatically forwards focus to the next blank block. Intercepts standard Paste events to parse digits and scatter values across active fields.

### 6. AdvancedRichEditor (Zero-Trust Visual Editor)
An premium visual WYSIWYG and HTML source-code IDE featuring sandbox isolation and drag-shield protection.
*   **Import Syntax**: `import { AdvancedRichEditor } from './library';`
*   **Properties**:
    ```typescript
    interface AdvancedRichEditorProps {
      label?: string;
      value: string;
      onChange: (value: string) => void;
      placeholder?: string;
      height?: string;
      onImageUpload?: (file: File) => Promise<string>;
    }
    ```
*   **Architecture & Security Auditing**:
    *   ** visual Sandbox Quarantine**: Renders visual content inside an `<iframe>` where `allow-scripts` is **omitted**. This prevents any runtime script injection at browser execution level.
    *   **Recursive DOMParser Sanitizer (`sanitizeHTML`)**: Prior to rendering, runs recursive DOM scrubbing to delete dangerous tags (`<script>`, `<object>`, `<embed>`, `<link>`, `<iframe>`), Event Hooks (`onclick`), and protocol bypasses (`javascript:`).
    *   **Transparent Drag Shield**: Renders a temporary transparent mask over the visual editor pane during resizing. This prevents the iframe from swallowing mouse coordinate movements, eliminating drag lockups.

---

## ☑️ Category 3: Selection & Boolean Controls (`Selection.tsx`)

Interactive switches, searchable selects, and multi-value controls.

### 1. SearchableSelect
A filterable dropdown matching searchable input keys with localized selection indices.
*   **Import Syntax**: `import { SearchableSelect } from './library';`
*   **Properties**:
    ```typescript
    interface SearchableSelectProps {
      label?: string;
      options: { value: string; label: string }[];
      value: string;
      onChange: (value: string) => void;
      placeholder?: string;
    }
    ```
*   **Usage**: Filters a large collection of values dynamically inside custom glass containers. Includes full click-outside closing bindings.

### 2. ShuttleBox
A dual-panel selector supporting list transfers and item prioritizing.
*   **Import Syntax**: `import { ShuttleBox } from './library';`
*   **Properties**:
    ```typescript
    interface ShuttleBoxProps {
      label?: string;
      availableItems: { value: string; label: string }[];
      selectedItems: string[];
      onChange: (selected: string[]) => void;
    }
    ```
*   **Usage**: Allows users to select single/multiple records and move them to an active workspace using Transfer icons.

---

## 📅 Category 4: Scheduling & Calendars (`Scheduling.tsx`)

Curated calendar views, duration pickers, and synchronized range calendars.

### 1. GoogleTwinCalendar
A beautiful, synchronized dual-pane range selector highlighting start and end parameters in a linear flow.
*   **Import Syntax**: `import { GoogleTwinCalendar } from './library';`
*   **Properties**:
    ```typescript
    interface TwinCalendarProps {
      startDate: Date | null;
      endDate: Date | null;
      onChange: (start: Date | null, end: Date | null) => void;
    }
    ```
*   **Visual State**: Highlights dynamic hover paths spanning dates between the first clicked day and the active cursor coordinate.

---

## 🧭 Category 5: Navigation & Steppers (`Navigation.tsx`)

Structural components to direct layouts and split multiphase workflows.

### 1. CommandPalette
A modal searching hub matching key inputs with custom functions and commands.
*   **Import Syntax**: `import { CommandPalette } from './library';`
*   **Properties**:
    ```typescript
    interface CommandProps {
      isOpen: boolean;
      onClose: () => void;
      commands: { label: string; action: () => void; icon?: keyof typeof Icons }[];
    }
    ```
*   **Considerations**: Triggers easily on standard keyboard commands (e.g. `Ctrl + K` or `Cmd + K`).

---

## 📊 Category 6: Data Display & Cards (`DataDisplay.tsx`)

Highly interactive cards, responsive timelines, and expandable accordion decks.

### 1. AdvancedDataGrid (`DataGrid.tsx`)
An enterprise-grade grid featuring pagination, columns sorting, row selectors, and real-time custom filtering.
*   **Import Syntax**: `import { AdvancedDataGrid } from './library';`
*   **Properties**:
    ```typescript
    interface Column {
      key: string;
      label: string;
      sortable?: boolean;
      render?: (val: any, row: any) => React.ReactNode;
    }
    interface GridProps {
      columns: Column[];
      data: any[];
      searchPlaceholder?: string;
      selectable?: boolean;
      onSelectionChange?: (selectedRows: any[]) => void;
    }
    ```

---

## 🚨 Category 7: Feedback, Overlays & Dialogs (`Feedback.tsx`, `Overlays.tsx`)

Provides real-time notifications, slide-over sheets, context menus, and micro-toasts.

### 1. SlideOver (Drawer Panel)
A right-aligned glass pane sliding onto the canvas for high-density editing workflows.
*   **Import Syntax**: `import { SlideOver } from './library';`
*   **Properties**:
    ```typescript
    interface SlideProps {
      isOpen: boolean;
      onClose: () => void;
      title: string;
      children: React.ReactNode;
    }
    ```

### 2. ToastProvider & `useToasts`
A lightweight, hook-based visual feedback engine queueing temporary popups.
*   **Import Syntax**:
    ```typescript
    import { ToastProvider, useToasts } from './library';
    ```
*   **Usage**:
    ```typescript
    const { addToast } = useToasts();
    addToast("Asset catalog updated successfully!", "success");
    ```

---

## ⚡ Category 8: Advanced Interactive Panels (`Advanced.tsx`)

Sophisticated panels featuring file dragging, chart configurations, and boards.

### 1. KanbanBoard
An interactive tracking board implementing dynamic cards, customizable columns, and status mappings.
*   **Import Syntax**: `import { KanbanBoard } from './library';`
*   **Properties**:
    ```typescript
    interface KanbanItem {
      id: string;
      title: string;
      description?: string;
      tags?: string[];
    }
    interface KanbanColumn {
      id: string;
      title: string;
      items: KanbanItem[];
    }
    ```

---

## 🛡️ Centralized Verification Checklist
Before shipping updates, ensure that:
1.  **Sanitization Checks**: All custom markup inputs pass through `sanitizeHTML`.
2.  **Theme Uniformity**: Test elements inside `.theme-light` and `.theme-dark` to check for light/dark color variables cohesion.
3.  **Borders & Outlines**: Active inputs display the standard `2px solid var(--ui-primary)` outline.
4.  **Mathematical Formats**: South African ID checksums, Credit Card Luhn indexes, and telephone string prefixes evaluate properly.
