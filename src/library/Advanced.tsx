import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Check } from 'lucide-react';

/* ==========================================================================
   📁 10. MEDIA, UPLOADS & ADVANCED DOMAIN WIDGETS
   ========================================================================== */

// --- 10.1 FILE DROPZONE ---
interface DropzoneProps {
  onFilesAdded: (files: File[]) => void;
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  description?: string;
}

export const FileDropzone: React.FC<DropzoneProps> = ({ 
  onFilesAdded,
  accept = 'image/*,application/pdf',
  maxSize = 10 * 1024 * 1024, // 10MB in bytes
  maxFiles = 5,
  description = 'Supports PDF, JPG, PNG up to 10MB'
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string }[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        processFiles(files);
      }
    }
  };

  const processFiles = (files: File[]) => {
    setErrorMsg(null);
    let validFiles: File[] = [];
    let err: string | null = null;

    if (uploadedFiles.length + files.length > maxFiles) {
      err = `Maximum file limit exceeded. You can upload up to ${maxFiles} files.`;
      setErrorMsg(err);
      return;
    }

    for (let file of files) {
      if (file.size > maxSize) {
        err = `File "${file.name}" is too large. Max size is ${(maxSize / (1024 * 1024)).toFixed(0)}MB.`;
        break;
      }

      if (accept && accept !== '*') {
        const fileType = file.type;
        const fileName = file.name;
        const acceptedTypes = accept.split(',').map(t => t.trim());
        
        const isAccepted = acceptedTypes.some(type => {
          if (type.endsWith('/*')) {
            const baseType = type.replace('/*', '');
            return fileType.startsWith(baseType);
          }
          if (type.startsWith('.')) {
            return fileName.toLowerCase().endsWith(type.toLowerCase());
          }
          return fileType === type;
        });

        if (!isAccepted) {
          err = `File "${file.name}" has an unsupported format.`;
          break;
        }
      }

      validFiles.push(file);
    }

    if (err) {
      setErrorMsg(err);
    }

    if (validFiles.length > 0) {
      setUploadedFiles(prev => [
        ...prev, 
        ...validFiles.map(f => ({ name: f.name, size: `${(f.size / 1024).toFixed(1)} KB` }))
      ]);
      onFilesAdded(validFiles);
    }
  };

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (idx: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
    setErrorMsg(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
      <input 
        type="file" 
        multiple 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        accept={accept}
        style={{ display: 'none' }} 
      />
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFilePicker}
        style={{
          border: isDragOver ? '2px solid var(--ui-primary)' : '2px dashed var(--ui-line)',
          borderRadius: 'var(--radius-md)',
          padding: '32px 16px',
          textAlign: 'center',
          background: isDragOver ? 'var(--ui-primary-soft)' : 'var(--ui-panel)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <Upload size={32} style={{ color: isDragOver ? 'var(--ui-primary)' : 'var(--ui-muted)' }} />
        <h5 style={{ margin: 0, fontWeight: 700, fontSize: '14px' }}>Drag & Drop Files Here</h5>
        <p style={{ fontSize: '11px', color: 'var(--ui-muted)', margin: 0 }}>Or click to browse from device</p>
        <p style={{ fontSize: '10px', color: 'var(--ui-muted-2)', margin: 0 }}>{description}</p>
      </div>

      {errorMsg && (
        <div style={{ color: 'var(--ui-red)', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--ui-red-soft)', padding: '8px 12px', borderRadius: '8px' }}>
          <span>⚠️ {errorMsg}</span>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {uploadedFiles.map((file, idx) => (
            <div 
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'var(--ui-bg-2)',
                border: '1px solid var(--ui-line)',
                fontSize: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={14} style={{ color: 'var(--ui-green)' }} />
                <span style={{ fontWeight: 700 }}>{file.name}</span>
                <span style={{ color: 'var(--ui-muted)' }}>({file.size})</span>
              </div>
              <button 
                onClick={() => removeFile(idx)}
                style={{ background: 'transparent', border: 0, color: 'var(--ui-red)', cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- 10.2 KANBAN BOARD DRAG-MOCK ---
interface KanbanTask {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  column: 'todo' | 'progress' | 'done';
}

export const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<KanbanTask[]>([
    { id: '1', title: 'Fix landlord profile edit bug', priority: 'High', column: 'todo' },
    { id: '2', title: 'Verify custom fields hydration', priority: 'Medium', column: 'todo' },
    { id: '3', title: 'Refactor image compression canvas', priority: 'High', column: 'progress' },
    { id: '4', title: 'Setup theme engine context wrapper', priority: 'Low', column: 'done' }
  ]);

  const columns = [
    { id: 'todo', label: 'To Do' },
    { id: 'progress', label: 'In Progress' },
    { id: 'done', label: 'Completed' }
  ];

  const moveTask = (taskId: string, targetCol: 'todo' | 'progress' | 'done') => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, column: targetCol } : t));
  };

  const priorityColors = {
    High: 'var(--ui-red-soft)',
    Medium: 'var(--ui-yellow-soft)',
    Low: 'var(--ui-primary-soft)'
  };
  
  const priorityText = {
    High: 'var(--ui-red)',
    Medium: 'var(--ui-yellow)',
    Low: 'var(--ui-primary-deep)'
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', width: '100%' }}>
      {columns.map(col => {
        const colTasks = tasks.filter(t => t.column === col.id);
        return (
          <div 
            key={col.id} 
            style={{ 
              background: 'var(--ui-bg-2)', 
              borderRadius: 'var(--radius-md)', 
              padding: '12px',
              border: '1px solid var(--ui-line)',
              minHeight: '260px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 4px' }}>
              <h5 style={{ fontWeight: 800, fontSize: '13px', margin: 0 }}>{col.label}</h5>
              <span style={{ fontSize: '11px', background: 'var(--ui-panel-pure)', padding: '2px 8px', borderRadius: '99px', fontWeight: 700 }}>
                {colTasks.length}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {colTasks.map(t => (
                <div
                  key={t.id}
                  style={{
                    background: 'var(--ui-panel-pure)',
                    borderRadius: '12px',
                    padding: '12px',
                    boxShadow: 'var(--ui-shadow-sm)',
                    border: '1px solid var(--ui-line)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '99px',
                    width: 'max-content',
                    backgroundColor: priorityColors[t.priority],
                    color: priorityText[t.priority]
                  }}>
                    {t.priority}
                  </span>
                  <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--ui-text)' }}>{t.title}</div>
                  
                  {/* Mock Move Trigger Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px', borderTop: '1px solid var(--ui-line-2)', paddingTop: '6px' }}>
                    {col.id !== 'todo' && (
                      <button 
                        onClick={() => moveTask(t.id, col.id === 'progress' ? 'todo' : 'progress')}
                        style={{ fontSize: '9px', fontWeight: 700, padding: '2px 6px', background: 'var(--ui-bg-2)', color: 'var(--ui-text)', border: 0, borderRadius: '4px', cursor: 'pointer' }}
                      >
                        ◀
                      </button>
                    )}
                    {col.id !== 'done' && (
                      <button 
                        onClick={() => moveTask(t.id, col.id === 'todo' ? 'progress' : 'done')}
                        style={{ fontSize: '9px', fontWeight: 700, padding: '2px 6px', background: 'var(--ui-bg-2)', color: 'var(--ui-text)', border: 0, borderRadius: '4px', cursor: 'pointer' }}
                      >
                        ▶
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// --- 10.3 SVG DATA CHART PRIMITIVE ---
export const ChartPrimitive: React.FC = () => {
  return (
    <div style={{
      width: '100%',
      height: '180px',
      background: 'var(--ui-panel)',
      border: '1px solid var(--ui-line)',
      borderRadius: 'var(--radius-md)',
      padding: '16px',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h5 style={{ margin: 0, fontWeight: 700, fontSize: '13px' }}>Weekly Active Leads</h5>
        <span style={{ fontSize: '11px', color: 'var(--ui-green)', fontWeight: 700 }}>+12.4% vs last week</span>
      </div>

      {/* Embedded Chart Graphic */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '20px', padding: '12px 10px 0 10px' }}>
        {[45, 80, 55, 95, 75, 110, 85].map((val, idx) => (
          <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '100%',
              height: `${val}%`,
              background: 'linear-gradient(180deg, var(--ui-primary), var(--ui-primary-soft))',
              borderRadius: '6px 6px 0 0',
              position: 'relative',
              minHeight: '10px'
            }} />
            <span style={{ fontSize: '10px', color: 'var(--ui-muted)', fontWeight: 700 }}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'][idx]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 10.4 PROGRESSIVE MEDIA IMAGE LOADER ---
interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  blurPlaceholder: string;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({ src, blurPlaceholder, alt, style, className, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setIsLoaded(true);
    };
  }, [src]);

  return (
    <div style={{ position: 'relative', overflow: 'hidden', ...style }} className={className}>
      {/* Blurred Placeholder */}
      <img
        src={blurPlaceholder}
        alt={alt}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'blur(20px)',
          transform: 'scale(1.1)',
          opacity: isLoaded ? 0 : 1,
          transition: 'opacity 0.5s ease-in-out',
          zIndex: 1
        }}
        {...props}
      />
      
      {/* High-Res Image */}
      <img
        src={src}
        alt={alt}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
          zIndex: 2
        }}
        {...props}
      />
    </div>
  );
};
