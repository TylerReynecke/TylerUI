import React, { useState } from 'react';
import { Search, Download, ChevronDown, Trash, GripVertical } from 'lucide-react';

/* ==========================================================================
   📑 7. THE ENTERPRISE DATA GRID (Tables)
   ========================================================================== */

interface ColumnDef<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (row: T) => React.ReactNode;
  visible?: boolean;
}

interface DataGridProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  onDeleteSelected?: (selectedRows: T[]) => void;
  showToolbar?: boolean;
  borderless?: boolean;
  onColumnsChange?: (columns: ColumnDef<T>[]) => void;
  enableDoubleClickEdit?: boolean;
  height?: string;
  
  // Pagination Props
  page?: number;
  limit?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  showPagination?: boolean;
}

export const AdvancedDataGrid = <T extends { id: string | number }>({
  columns,
  data,
  onDeleteSelected,
  showToolbar = true,
  borderless = false,
  onColumnsChange,
  enableDoubleClickEdit = true,
  height = '500px',
  page: propPage,
  limit: propLimit,
  totalCount: propTotalCount,
  onPageChange,
  onLimitChange,
  showPagination = true
}: DataGridProps<T>) => {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.filter(c => c.visible !== false).map(c => String(c.header))
  );
  const [showColMenu, setShowColMenu] = useState(false);
  const [density, setDensity] = useState<'compact' | 'relaxed'>('relaxed');

  // Pagination State
  const [internalPage, setInternalPage] = useState(1);
  const [internalLimit, setInternalLimit] = useState(10);
  
  const activePage = propPage !== undefined ? propPage : internalPage;
  const activeLimit = propLimit !== undefined ? propLimit : internalLimit;
  
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const element = scrollContainerRef.current;
    if (!element) return;

    let targetScrollTop = element.scrollTop;
    let currentScrollTop = element.scrollTop;
    let animationFrameId: number | null = null;
    let lastTime = performance.now();

    const baseLerpFactor = 0.08; // smooth, premium kinetic deceleration cushion

    const updateScroll = (time: number) => {
      const deltaTime = Math.min(time - lastTime, 50); // limit dt to prevent huge jumps if tab is hidden
      lastTime = time;

      const diff = targetScrollTop - currentScrollTop;
      if (Math.abs(diff) > 0.5) {
        // Frame-rate independent lerp formula:
        const alpha = 1 - Math.pow(1 - baseLerpFactor, deltaTime / 16.666);
        currentScrollTop += diff * alpha;
        element.scrollTop = Math.round(currentScrollTop);
        animationFrameId = requestAnimationFrame(updateScroll);
      } else {
        element.scrollTop = targetScrollTop;
        currentScrollTop = targetScrollTop;
        animationFrameId = null;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      // Sync target and current scrollTop if they were changed outside wheel listener (e.g. scrollbar drag)
      if (Math.abs(element.scrollTop - currentScrollTop) > 1) {
        targetScrollTop = element.scrollTop;
        currentScrollTop = element.scrollTop;
      }

      e.preventDefault();
      const maxScroll = element.scrollHeight - element.clientHeight;
      targetScrollTop = Math.max(0, Math.min(maxScroll, targetScrollTop + e.deltaY));

      if (animationFrameId === null) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(updateScroll);
      }
    };

    element.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      element.removeEventListener('wheel', handleWheel);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [data, search, activePage, activeLimit]);

  // Reset page on search
  React.useEffect(() => {
    setInternalPage(1);
  }, [search]);

  // Double-Click Inline Edit State Mock
  const [editingCell, setEditingCell] = useState<{ rowId: string | number; colKey: string } | null>(null);
  const [gridData, setGridData] = useState<T[]>(data);

  const [gridColumns, setGridColumns] = useState<ColumnDef<T>[]>(columns);
  const [draggedColId, setDraggedColId] = useState<string | null>(null);
  const [dragOverColId, setDragOverColId] = useState<string | null>(null);

  // Sync columns updates from parent
  React.useEffect(() => {
    setGridColumns(columns);
    setVisibleColumns(columns.filter(c => c.visible !== false).map(c => String(c.header)));
  }, [columns]);

  // Sync data updates from parent
  React.useEffect(() => {
    setGridData(data);
  }, [data]);

  const handleDragStart = (e: React.DragEvent, headerName: string) => {
    setDraggedColId(headerName);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, headerName: string) => {
    e.preventDefault();
    if (dragOverColId !== headerName) {
      setDragOverColId(headerName);
    }
  };

  const handleDragLeave = () => {
    setDragOverColId(null);
  };

  const handleDragEnd = () => {
    setDraggedColId(null);
    setDragOverColId(null);
  };

  const handleDrop = (_e: React.DragEvent, targetHeaderName: string) => {
    if (!draggedColId || draggedColId === targetHeaderName) return;

    const draggedIdx = gridColumns.findIndex(c => String(c.header) === draggedColId);
    const targetIdx = gridColumns.findIndex(c => String(c.header) === targetHeaderName);

    if (draggedIdx !== -1 && targetIdx !== -1) {
      const reordered = [...gridColumns];
      const [draggedCol] = reordered.splice(draggedIdx, 1);
      reordered.splice(targetIdx, 0, draggedCol);
      setGridColumns(reordered);
      
      if (onColumnsChange) {
        onColumnsChange(reordered);
      }
    }
    setDraggedColId(null);
    setDragOverColId(null);
  };

  const filtered = gridData.filter(row => 
    Object.values(row).some(val => 
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  const activeTotalCount = propTotalCount !== undefined ? propTotalCount : filtered.length;
  const displayedRows = propPage !== undefined ? filtered : filtered.slice((activePage - 1) * activeLimit, activePage * activeLimit);

  const toggleSelectRow = (id: string | number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(x => x.id));
    }
  };

  const handleCellBlur = (rowId: string | number, accessorKey: keyof T, val: string) => {
    setGridData(prev => prev.map(row => {
      if (row.id === rowId) {
        return { ...row, [accessorKey]: val };
      }
      return row;
    }));
    setEditingCell(null);
  };

  const handleBulkDelete = () => {
    if (onDeleteSelected) {
      const selected = gridData.filter(r => selectedIds.includes(r.id));
      onDeleteSelected(selected);
      setSelectedIds([]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', height, minHeight: 0 }}>
      
      {/* 1. TABLE TOOLBAR */}
      {showToolbar && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', flexShrink: 0 }}>
          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--ui-panel-strong)', border: '1px solid var(--ui-line)', borderRadius: '14px', padding: '0 12px', width: '320px', height: '42px' }}>
            <Search size={16} style={{ color: 'var(--ui-muted)', marginRight: '8px' }} />
            <input
              style={{ border: 0, outline: 0, background: 'transparent', width: '100%', fontSize: '13px', color: 'var(--ui-text)' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search records in real-time..."
            />
          </div>

          {/* Filters and Visibility Controls */}
          <div style={{ display: 'flex', gap: '8px', position: 'relative' }}>
            <button 
              className="btn outline"
              onClick={() => setDensity(d => d === 'relaxed' ? 'compact' : 'relaxed')}
              style={{ padding: '8px 12px', fontSize: '12px', height: '42px' }}
            >
              Density: {density === 'relaxed' ? 'Relaxed' : 'Compact'}
            </button>
            
            <button 
              className="btn outline"
              onClick={() => setShowColMenu(!showColMenu)}
              style={{ padding: '8px 12px', fontSize: '12px', height: '42px', display: 'flex', gap: '6px' }}
            >
              Columns <ChevronDown size={14} />
            </button>

            {showColMenu && (
              <div style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                background: 'var(--ui-panel-pure)',
                border: '1px solid var(--ui-line)',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: 'var(--ui-shadow-md)',
                zIndex: 100,
                width: '180px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {columns.map(c => {
                  const headerName = String(c.header);
                  const active = visibleColumns.includes(headerName);
                  return (
                    <label key={headerName} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        checked={active}
                      onChange={() => {
                        const newVisible = active 
                          ? visibleColumns.filter(x => x !== headerName) 
                          : [...visibleColumns, headerName];
                        setVisibleColumns(newVisible);
                        if (onColumnsChange) {
                          const updated = gridColumns.map(col => ({
                            ...col,
                            visible: newVisible.includes(String(col.header))
                          }));
                          onColumnsChange(updated);
                        }
                      }}
                        style={{ accentColor: 'var(--ui-primary)' }}
                      />
                      <span>{headerName}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
      {/* 2. ADVANCED DATA TABLE & FOOTER CONTAINER */}
      <div style={{ 
        border: borderless ? 'none' : '1px solid var(--ui-line)', 
        borderRadius: borderless ? '0' : 'var(--radius-lg)', 
        background: borderless ? 'transparent' : 'var(--ui-panel-strong)', 
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden', 
        flex: 1,
        boxShadow: borderless ? 'none' : 'var(--ui-shadow-sm)' 
      }}>
        
        {/* Table Header Wrapper (Non-scrollable) */}
        <div style={{ 
          background: 'var(--ui-bg-2)', 
          borderBottom: '2px solid var(--ui-line)',
          scrollbarGutter: 'stable',
          overflowY: 'hidden',
          flexShrink: 0
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '48px' }} />
              {gridColumns.filter(c => visibleColumns.includes(String(c.header))).map((_, idx) => (
                <col key={idx} />
              ))}
            </colgroup>
            
            {/* Table Header */}
            <thead>
              <tr>
                <th style={{ padding: '16px', width: '48px' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    style={{ accentColor: 'var(--ui-primary)', cursor: 'pointer' }}
                  />
                </th>
                {gridColumns.filter(c => visibleColumns.includes(String(c.header))).map((col, idx) => {
                  const headerName = String(col.header);
                  return (
                    <th 
                      key={idx} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, headerName)}
                      onDragOver={(e) => handleDragOver(e, headerName)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, headerName)}
                      onDragEnd={handleDragEnd}
                      style={{ 
                        padding: density === 'relaxed' ? '16px' : '10px 16px', 
                        fontWeight: 700, 
                        color: 'var(--ui-muted)',
                        textTransform: 'uppercase',
                        fontSize: '11px',
                        letterSpacing: '0.04em',
                        cursor: 'grab',
                        backgroundColor: draggedColId === headerName
                          ? 'var(--ui-bg-3)'
                          : dragOverColId === headerName
                            ? 'var(--ui-primary-soft)'
                            : 'transparent',
                        transition: 'all 0.15s ease',
                        borderLeft: dragOverColId === headerName && draggedColId !== headerName
                          ? '2px solid var(--ui-primary)'
                          : 'none',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <GripVertical size={12} style={{ color: 'var(--ui-muted)', opacity: 0.6, cursor: 'grab' }} />
                        <span>{col.header}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
          </table>
        </div>

        {/* Table Body Scroll Container */}
        <div 
          ref={scrollContainerRef}
          style={{ 
            overflowY: 'auto', 
            flex: 1,
            scrollbarGutter: 'stable'
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '48px' }} />
              {gridColumns.filter(c => visibleColumns.includes(String(c.header))).map((_, idx) => (
                <col key={idx} />
              ))}
            </colgroup>
            
            {/* Table Body */}
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length + 1} style={{ padding: '48px', textAlign: 'center', color: 'var(--ui-muted)' }}>
                    No records match your query.
                  </td>
                </tr>
              ) : (
                displayedRows.map((row, rowIdx) => {
                  const isSelected = selectedIds.includes(row.id);
                  return (
                    <tr
                      key={row.id}
                      style={{
                        background: isSelected ? 'var(--ui-primary-soft)' : rowIdx % 2 === 0 ? 'transparent' : 'var(--ui-table-zebra)',
                        borderBottom: '1px solid var(--ui-line-2)',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={(e) => !isSelected && (e.currentTarget.style.backgroundColor = 'var(--ui-table-hover)')}
                      onMouseLeave={(e) => !isSelected && (e.currentTarget.style.backgroundColor = rowIdx % 2 === 0 ? 'transparent' : 'var(--ui-table-zebra)')}
                    >
                      {/* Checkbox Selection cell */}
                      <td style={{ padding: '16px' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(row.id)}
                          style={{ accentColor: 'var(--ui-primary)', cursor: 'pointer' }}
                        />
                      </td>

                      {/* Columns mapping cells */}
                      {gridColumns.filter(c => visibleColumns.includes(String(c.header))).map((col, colIdx) => {
                        const colKey = String(col.accessorKey);
                        const isEditing = editingCell?.rowId === row.id && editingCell?.colKey === colKey;

                        return (
                          <td
                            key={colIdx}
                            style={{ 
                              padding: density === 'relaxed' ? '16px' : '10px 16px',
                              fontWeight: colIdx === 0 ? 700 : 500,
                              color: isSelected ? 'var(--ui-primary-deep)' : 'var(--ui-text)'
                            }}
                            onDoubleClick={() => {
                              if (enableDoubleClickEdit) {
                                setEditingCell({ rowId: row.id, colKey });
                              }
                            }}
                          >
                            {isEditing ? (
                              <input
                                defaultValue={String(row[col.accessorKey])}
                                autoFocus
                                onBlur={(e) => handleCellBlur(row.id, col.accessorKey, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleCellBlur(row.id, col.accessorKey, e.currentTarget.value);
                                }}
                                style={{
                                  width: '100%',
                                  padding: '4px 8px',
                                  border: '1px solid var(--ui-primary)',
                                  background: 'var(--ui-bg)',
                                  borderRadius: '4px',
                                  color: 'var(--ui-text)',
                                  fontSize: '13px'
                                }}
                              />
                            ) : col.cell ? (
                              col.cell(row)
                            ) : (
                              String(row[col.accessorKey])
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      {/* 4. PAGINATION FOOTER */}
      {showPagination && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 24px',
          borderTop: '1px solid var(--ui-line)',
          background: 'var(--ui-bg-2)',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '13px', color: 'var(--ui-muted)', fontWeight: 500 }}>
              Showing <span style={{ fontWeight: 700, color: 'var(--ui-text)' }}>{Math.min((activePage - 1) * activeLimit + 1, activeTotalCount)}</span> to{' '}
              <span style={{ fontWeight: 700, color: 'var(--ui-text)' }}>{Math.min(activePage * activeLimit, activeTotalCount)}</span> of{' '}
              <span style={{ fontWeight: 700, color: 'var(--ui-text)' }}>{activeTotalCount}</span> entries
            </div>
            
            {/* Rows Per Page Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--ui-muted)' }}>
              <span>Show</span>
              <select
                value={activeLimit}
                onChange={(e) => {
                  const newLimit = Number(e.target.value);
                  if (onLimitChange) {
                    onLimitChange(newLimit);
                  } else {
                    setInternalLimit(newLimit);
                  }
                  if (onPageChange) onPageChange(1);
                  else setInternalPage(1);
                }}
                style={{
                  background: 'var(--ui-panel-pure)',
                  border: '1px solid var(--ui-line)',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  color: 'var(--ui-text)',
                  fontSize: '12px',
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn secondary"
              onClick={() => {
                const newPage = Math.max(activePage - 1, 1);
                if (onPageChange) onPageChange(newPage);
                else setInternalPage(newPage);
              }}
              disabled={activePage === 1}
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              Previous
            </button>
            <button
              className="btn secondary"
              onClick={() => {
                const newPage = Math.min(activePage + 1, Math.ceil(activeTotalCount / activeLimit));
                if (onPageChange) onPageChange(newPage);
                else setInternalPage(newPage);
              }}
              disabled={activePage >= Math.ceil(activeTotalCount / activeLimit)}
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>

      {/* 3. FLOATING BULK ACTIONS BANNER */}
      {selectedIds.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--ui-panel-pure)',
          border: '1px solid var(--ui-primary)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--ui-shadow-lg)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          zIndex: 1000,
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}>
          <span style={{ fontSize: '14px', fontWeight: 800 }}>
            {selectedIds.length} items selected
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn secondary" style={{ padding: '8px 14px', fontSize: '12px', display: 'flex', gap: '4px' }}><Download size={14} /> Export</button>
            <button 
              className="btn danger" 
              onClick={handleBulkDelete}
              style={{ padding: '8px 14px', fontSize: '12px', display: 'flex', gap: '4px' }}
            >
              <Trash size={14} /> Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Embedded slideUp keyframes in Javascript */}
      <style>{`
        @keyframes slideUp {
          from { transform: translate(-50%, 40px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>

    </div>
  );
};
