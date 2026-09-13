import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useStore, ProjectColumn, Project, Subtask } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DatePicker } from '../components/ui/DatePicker';
import { Plus, MoreHorizontal, Paperclip, MessageSquare, Calendar, LayoutGrid, List as ListIcon, Search, Filter, ChevronLeft, ChevronRight, Check, Bookmark, Pause, Pencil, Trash2, ChevronDown, ChevronUp, Play, Lock, X } from 'lucide-react';
import './Projects.css';
import './Production.css';

const Projects: React.FC = () => {
  const { projectColumns, projects, updateProjectColumn, addProjectColumn, addProject, updateProject, softDeleteProject, addSubtask, toggleSubtask, deleteSubtask } = useStore();

  // Filter out deleted projects
  const activeProjects = projects.filter(p => !p.deletedAt);

  const [view, setView] = useState<'kanban' | 'calendar' | 'list'>('kanban');
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [targetColumnId, setTargetColumnId] = useState('');
  const [newTaskData, setNewTaskData] = useState<{
    title: string; description: string; priority: 'High' | 'Medium' | 'Low'; dueDate: string; clientName: string; price: string; materialSpec: string;
  }>({ title: '', description: '', priority: 'Medium', dueDate: '', clientName: '', price: '', materialSpec: '' });

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [expandedColumns, setExpandedColumns] = useState<string[]>([]);
  const [expandedTasks, setExpandedTasks] = useState<string[]>([]);
  const [addingSubtaskFor, setAddingSubtaskFor] = useState<string | null>(null);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [selectedListTask, setSelectedListTask] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    useStore.getState().moveProject(draggableId, source.droppableId, destination.droppableId, source.index, destination.index);
  };

  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      addProjectColumn({
        id: `c-${Date.now()}`,
        title: newColumnName.trim()
      });
      setNewColumnName('');
      setIsColumnModalOpen(false);
    }
  };

  const handleSaveTask = () => {
    if (newTaskData.title.trim()) {
      if (editingProjectId) {
        // Edit flow
        const existingProject = projects.find(p => p.id === editingProjectId);
        if (existingProject) {
          updateProject({
            ...existingProject,
            title: newTaskData.title.trim(),
            description: newTaskData.description.trim(),
            priority: newTaskData.priority,
            dueDate: newTaskData.dueDate || 'TBD',
            clientName: newTaskData.clientName.trim(),
            price: Number(newTaskData.price) || undefined,
            materialSpec: newTaskData.materialSpec.trim()
          });
        }
      } else {
        // Add flow
        addProject({
          id: `p-${Date.now()}`,
          title: newTaskData.title.trim(),
          description: newTaskData.description.trim(),
          priority: newTaskData.priority,
          dueDate: newTaskData.dueDate || 'TBD',
          columnId: targetColumnId,
          assignees: ['https://i.pravatar.cc/150?u=a042581f4e29026701d'],
          attachmentsCount: 0,
          commentsCount: 0,
          clientName: newTaskData.clientName.trim(),
          price: Number(newTaskData.price) || undefined,
          materialSpec: newTaskData.materialSpec.trim()
        });
      }
      setIsTaskModalOpen(false);
      setEditingProjectId(null);
      setNewTaskData({ title: '', description: '', priority: 'Medium', dueDate: '', clientName: '', price: '', materialSpec: '' });
    }
  };

  const handleEditClick = (project: Project) => {
    setEditingProjectId(project.id);
    setNewTaskData({
      title: project.title,
      description: project.description,
      priority: project.priority,
      dueDate: project.dueDate !== 'TBD' ? project.dueDate : '',
      clientName: project.clientName || '',
      price: project.price ? String(project.price) : '',
      materialSpec: project.materialSpec || ''
    });
    setIsTaskModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDeleteClick = (projectId: string) => {
    softDeleteProject(projectId);
    setActiveMenuId(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'pink';
      case 'Medium': return 'purple';
      default: return 'grey';
    }
  };

  const getColumnColor = (index: number) => {
    const colors = ['var(--text-muted)', 'var(--border-color)', 'var(--primary-transparent)', 'var(--primary)'];
    return colors[index % colors.length];
  };

  const renderKanbanView = () => (
    <div className="prod-kanban-board custom-scrollbar h-full">
      <DragDropContext onDragEnd={onDragEnd}>
        {projectColumns.map((column, index) => {
          const columnProjects = activeProjects.filter(p => p.columnId === column.id);
          const canAddTask = ['Interested', 'Pending', 'In Progress'].includes(column.title);

          return (
            <div key={column.id} className="prod-kanban-column">
              <div className="prod-kanban-header">
                <div className="flex items-center gap-2">
                  <span className="prod-kanban-dot" style={{ backgroundColor: getColumnColor(index) }}></span>
                  <span className="prod-kanban-title">{column.title}</span>
                  <span className="prod-kanban-count">{columnProjects.length}</span>
                </div>
                {canAddTask && (
                  <button
                    className="prod-icon-btn outline"
                    onClick={() => {
                      setTargetColumnId(column.id);
                      setIsTaskModalOpen(true);
                    }}
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    className={`prod-kanban-droppable custom-scrollbar ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {columnProjects.map((project, idx) => (
                      <Draggable key={project.id} draggableId={project.id} index={idx}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              marginBottom: '1.5rem',
                              // add a tiny bit of z-index during drag so the outer container overlaps
                              ...(snapshot.isDragging ? { zIndex: 100 } : {})
                            }}
                          >
                            <div className={`prod-card ${snapshot.isDragging ? 'dragging' : ''}`} style={{ marginBottom: 0, height: '100%' }}>
                              {!['Completed', 'Delivered'].includes(column.title) && (
                                <div className="prod-card-action">
                                  <MoreHorizontal
                                    size={18}
                                    className="cursor-pointer text-muted hover-text-main transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveMenuId(activeMenuId === project.id ? null : project.id);
                                    }}
                                  />
                                  {activeMenuId === project.id && (
                                    <div
                                      style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: 0,
                                        backgroundColor: 'var(--bg-surface)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '9999px',
                                        boxShadow: 'var(--shadow-md)',
                                        zIndex: 100,
                                        padding: '0.25rem 0.5rem',
                                        display: 'flex',
                                        gap: '0.5rem',
                                        animation: 'fadeIn 0.15s ease-out'
                                      }}
                                    >
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleEditClick(project); }}
                                        style={{ border: 'none', background: 'transparent', padding: '0.25rem', display: 'flex' }}
                                        className="cursor-pointer text-muted hover-text-main transition-colors"
                                        title="Edit"
                                      >
                                        <Pencil size={16} />
                                      </button>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(project.id); }}
                                        style={{ border: 'none', background: 'transparent', padding: '0.25rem', display: 'flex' }}
                                        className="cursor-pointer text-muted hover-text-danger transition-colors"
                                        title="Delete"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}

                              <div className="mb-3">
                                <span className={`priority-badge priority-${project.priority.toLowerCase()}`}>
                                  {project.priority}
                                </span>
                              </div>

                              <h4 className="prod-card-title">{project.title}</h4>

                              {/* Additional Metadata: Down Payment / Material */}
                              {(project.price || project.materialSpec) && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '12px 0 16px', padding: '10px 12px', background: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color-light)' }}>
                                  {project.price && (
                                    <div style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <span style={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.65rem' }}>Down Payment</span>
                                      <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>${project.price}</span>
                                    </div>
                                  )}
                                  {project.materialSpec && (
                                    <div style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <span style={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.65rem' }}>Material</span>
                                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{project.materialSpec}</span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {(() => {
                                const st = project.subtasks || [];
                                const done = st.filter(s => s.completed).length;
                                const isDoneCol = ['Completed', 'Delivered'].includes(column.title);
                                const isProgCol = column.title === 'In Progress';
                                
                                // Show progress bar if it's In Progress or Completed/Delivered, OR if it has subtasks.
                                if (!isDoneCol && !isProgCol && st.length === 0) return null;
                                
                                let pct = 0;
                                if (isDoneCol) {
                                  pct = 100;
                                } else if (st.length > 0) {
                                  pct = Math.round((done / st.length) * 100);
                                } else if (isProgCol) {
                                  // fallback if in progress but absolutely no subtasks 
                                  pct = 10;
                                }

                                if (pct === 0 && !isProgCol && !isDoneCol) return null; // hide if 0 and not active

                                return (
                                  <div className="mb-4">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                                      <span>Progress</span>
                                      <span>{pct}%</span>
                                    </div>
                                    <div style={{
                                      width: '100%',
                                      height: '8px',
                                      backgroundColor: 'var(--bg-main)',
                                      borderRadius: '9999px',
                                      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
                                      position: 'relative',
                                      border: '1px solid var(--border-color-light)'
                                    }}>
                                      <div style={{
                                        height: '100%',
                                        width: `${pct}%`,
                                        background: pct === 100 ? 'var(--success)' : 'linear-gradient(90deg, var(--primary-hover), #34d399)',
                                        borderRadius: '9999px',
                                        boxShadow: pct === 100 ? '0 1px 2px rgba(16, 185, 129, 0.4), inset 0 1px 1px rgba(255,255,255,0.4)' : '0 1px 2px rgba(16, 185, 129, 0.4), inset 0 1px 1px rgba(255,255,255,0.4)',
                                        transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                                      }}></div>
                                    </div>
                                  </div>
                                );
                              })()}

                              <div className="prod-avatar-row mt-6 flex justify-between items-center w-full">
                                <div className="flex items-center gap-3">
                                  {project.assignees.length > 0 && (
                                    <img src={project.assignees[0]} className="prod-avatar" alt="Assignee" />
                                  )}
                                  <div className="prod-user-info">
                                    <span className="prod-user-name">{project.clientName || 'Internal Project'}</span>
                                    <span className="prod-user-date">Due: {project.dueDate}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );

  const toggleTask = (projectId: string) => {
    setExpandedTasks(prev =>
      prev.includes(projectId) ? prev.filter(id => id !== projectId) : [...prev, projectId]
    );
  };

  const handleAddSubtask = (projectId: string) => {
    if (newSubtaskTitle.trim()) {
      addSubtask(projectId, newSubtaskTitle.trim());
      setNewSubtaskTitle('');
      setAddingSubtaskFor(null);
    }
  };

  const toggleColumn = (columnId: string) => {
    setExpandedColumns(prev =>
      prev.includes(columnId) ? prev.filter(id => id !== columnId) : [...prev, columnId]
    );
  };

  useEffect(() => {
    if (projectColumns.length > 0 && expandedColumns.length === 0) {
      setExpandedColumns(projectColumns.map(c => c.id));
    }
  }, [projectColumns]);

  const activeColumns = projectColumns.filter(c =>
    !['completed', 'delivered'].some(k => c.title.toLowerCase().includes(k))
  );

  const renderListView = () => (
    <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden', padding: '1.75rem 2rem 4rem' }} className="custom-scrollbar">
      {activeColumns.map((col, colIdx) => {
        const columnProjects = activeProjects.filter(p => p.columnId === col.id);
        const dotColor = getColumnColor(colIdx);

        return (
          <div key={col.id} style={{ marginBottom: '2.5rem' }}>

            {/* Section header — dashboard style */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '2px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
                <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>{col.title}</span>
                <span className="team-badge">{columnProjects.length}</span>
              </div>
              <button
                className="prod-icon-btn outline"
                onClick={() => { setTargetColumnId(col.id); setIsTaskModalOpen(true); }}
                style={{ fontSize: '0.8rem', fontWeight: 700, padding: '5px 14px', borderRadius: '8px', width: 'auto', height: 'auto' }}
              >
                + New
              </button>
            </div>

            {/* Task rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {columnProjects.length === 0 ? (
                <div className="dashboard-card" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', fontStyle: 'italic', boxShadow: 'none', border: '1px dashed var(--border-color)' }}>
                  No tasks in this stage.
                </div>
              ) : columnProjects.map(project => {
                const isOpen = selectedListTask === project.id;
                const subtasks = project.subtasks || [];
                const doneCount = subtasks.filter(s => s.completed).length;
                const pct = subtasks.length > 0 ? Math.round((doneCount / subtasks.length) * 100) : null;

                return (
                  <div
                    key={project.id}
                    className="dashboard-card"
                    style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', transition: 'transform 150ms ease-out, box-shadow 150ms ease-out, border-color 150ms', ...(isOpen ? { borderColor: 'var(--primary-transparent)', boxShadow: 'var(--shadow-lg)', transform: 'translateY(-2px)' } : {}) }}
                    onClick={() => setSelectedListTask(isOpen ? null : project.id)}
                    onMouseEnter={e => { if (!isOpen) { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg)'; } }}
                    onMouseLeave={e => { if (!isOpen) { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; } }}
                  >
                    {/* Accent top strip */}
                    <div style={{ height: '3px', background: isOpen ? 'var(--primary)' : 'transparent', transition: 'background 0.2s' }} />

                    {/* Card body */}
                    <div style={{ padding: '1.1rem 1.5rem 0.9rem', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      {/* Left: title + meta */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.97rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '5px', letterSpacing: '-0.015em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {project.title}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span className={`priority-badge priority-${project.priority.toLowerCase()}`} style={{ fontSize: '0.68rem' }}>{project.priority}</span>
                          {project.dueDate && <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>Due {project.dueDate}</span>}
                          {project.clientName && <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>· {project.clientName}</span>}
                          {pct !== null && (
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: pct === 100 ? 'var(--success)' : 'var(--text-muted)', marginLeft: '2px' }}>
                              · {doneCount}/{subtasks.length} done
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: avatars + progress + chevron */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
                        {/* Neumorphic Progress bar */}
                        {pct !== null && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              width: '60px',
                              height: '8px',
                              backgroundColor: 'var(--bg-surface)',
                              borderRadius: '9999px',
                              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1), inset 0 2px 4px rgba(0,0,0,0.05)',
                              position: 'relative',
                              border: '1px solid var(--border-color-light)'
                            }}>
                              <div style={{
                                height: '100%',
                                width: `${pct}%`,
                                background: 'linear-gradient(90deg, var(--primary-hover), #34d399)',
                                borderRadius: '9999px',
                                boxShadow: pct > 0 ? '0 1px 2px rgba(16, 185, 129, 0.4), inset 0 1px 1px rgba(255,255,255,0.4)' : 'none',
                                transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                              }}></div>
                            </div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', minWidth: '26px' }}>{pct}%</span>
                          </div>
                        )}

                        {/* Avatars */}
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {project.assignees.slice(0, 3).map((av, i) => (
                            <img key={i} src={av} alt="" className="prod-avatar" style={{ marginLeft: i === 0 ? 0 : '-8px', zIndex: 3 - i, width: '28px', height: '28px' }} />
                          ))}
                        </div>

                        {/* Chevron */}
                        <div style={{ color: isOpen ? 'var(--primary)' : 'var(--text-muted)', transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1), color 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
                          <ChevronDown size={17} strokeWidth={2.5} />
                        </div>
                      </div>
                    </div>

                    {/* Expanded detail panel */}
                    {isOpen && (
                      <div style={{ borderTop: '1px solid var(--border-color)' }} onClick={e => e.stopPropagation()}>

                        {/* Metadata row */}
                        {(project.clientName || project.dueDate || project.price || project.materialSpec) && (
                          <div style={{ padding: '1rem 1.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', background: 'var(--bg-surface-hover)', borderBottom: '1px solid var(--border-color)' }}>
                            {project.clientName && (
                              <div>
                                <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3px' }}>Client</div>
                                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>{project.clientName}</div>
                              </div>
                            )}
                            {project.dueDate && (
                              <div>
                                <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3px' }}>Due Date</div>
                                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>{project.dueDate}</div>
                              </div>
                            )}
                            {project.price && (
                              <div>
                                <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3px' }}>Price</div>
                                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>${project.price}</div>
                              </div>
                            )}
                            {project.materialSpec && (
                              <div>
                                <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3px' }}>Material</div>
                                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>{project.materialSpec}</div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Description */}
                        {project.description && (
                          <div style={{ padding: '0.85rem 1.5rem', background: 'var(--bg-surface-hover)', borderBottom: '1px solid var(--border-color)' }}>
                            <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '5px' }}>Notes</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.65 }}>{project.description}</div>
                          </div>
                        )}

                        {/* Subtasks */}
                        <div style={{ background: 'var(--bg-surface)' }}>
                          {subtasks.length > 0 && (
                            <div>
                              <div style={{ padding: '0.6rem 1.5rem', fontSize: '0.62rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid var(--border-color)' }}>
                                Subtasks — {doneCount}/{subtasks.length}
                              </div>
                              {subtasks.map((subtask, si) => (
                                <div key={subtask.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '9px 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                                  <div
                                    onClick={() => toggleSubtask(project.id, subtask.id)}
                                    style={{ width: '17px', height: '17px', borderRadius: '50%', border: `2px solid ${subtask.completed ? 'var(--success)' : 'var(--border-color)'}`, background: subtask.completed ? 'var(--success)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.18s' }}
                                  >
                                    {subtask.completed && <Check size={9} strokeWidth={3} color="white" />}
                                  </div>
                                  <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500, color: subtask.completed ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: subtask.completed ? 'line-through' : 'none', opacity: subtask.completed ? 0.5 : 1, transition: 'all 0.18s' }}>
                                    {subtask.title}
                                  </span>
                                  <div
                                    onClick={() => deleteSubtask(project.id, subtask.id)}
                                    style={{ cursor: 'pointer', color: 'var(--text-muted)', opacity: 0, padding: '3px', borderRadius: '4px', transition: 'opacity 0.15s' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.color = 'var(--danger)'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
                                  >
                                    <X size={13} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Add subtask */}
                          {addingSubtaskFor === project.id ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                              <div style={{ width: '17px', height: '17px', borderRadius: '50%', border: '2px dashed var(--primary-transparent)', flexShrink: 0 }} />
                              <input
                                autoFocus
                                value={newSubtaskTitle}
                                onChange={e => setNewSubtaskTitle(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') handleAddSubtask(project.id);
                                  if (e.key === 'Escape') { setAddingSubtaskFor(null); setNewSubtaskTitle(''); }
                                }}
                                placeholder="Subtask name — press Enter to save"
                                style={{ flex: 1, fontSize: '0.875rem', background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', fontWeight: 500 }}
                              />
                              <button onClick={() => handleAddSubtask(project.id)} style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', padding: '3px 8px' }}>Save</button>
                              <X size={13} style={{ cursor: 'pointer', color: 'var(--text-muted)', opacity: 0.4, flexShrink: 0 }} onClick={() => { setAddingSubtaskFor(null); setNewSubtaskTitle(''); }} />
                            </div>
                          ) : (
                            <div
                              onClick={() => { setAddingSubtaskFor(project.id); setNewSubtaskTitle(''); }}
                              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 1.5rem', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', transition: 'color 0.15s' }}
                              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--primary)'}
                              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
                            >
                              <Plus size={13} />
                              <span>Add subtask</span>
                            </div>
                          )}

                          {/* Footer */}
                          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 1.5rem' }}>
                            <button
                              onClick={e => { e.stopPropagation(); handleEditClick(project); setSelectedListTask(null); }}
                              style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '3px 0', letterSpacing: '0.01em', transition: 'color 0.15s' }}
                              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--primary)'}
                              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
                            >
                              Edit task →
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );


  const renderCalendarView = () => {
    const weekDays = [
      { date: '03', day: 'Mon' },
      { date: '04', day: 'Tue' },
      { date: '05', day: 'Wed', active: true },
      { date: '06', day: 'Thu' },
      { date: '07', day: 'Fri' },
      { date: '08', day: 'Sat' },
    ];

    return (
      <div className="cal-module fade-in">
        {/* LEFT SIDEBAR */}
        <div className="cal-sidebar custom-scrollbar">
          {/* Mini Calendar */}
          <div className="calendar-mini-card bg-surface rounded-2xl p-6 border border-color shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-main">January 2024</h3>
              <div className="flex gap-1">
                <button className="p-1 rounded-md hover-bg-surface-hover text-muted"><ChevronLeft size={16} /></button>
                <button className="p-1 rounded-md hover-bg-surface-hover text-muted"><ChevronRight size={16} /></button>
              </div>
            </div>
            <div className="cal-month-grid text-xs font-semibold text-muted mb-2">
              <div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div><div>Su</div>
            </div>
            <div className="cal-month-grid text-sm">
              {Array.from({ length: 31 }).map((_, i) => (
                <div key={i} className={`p-1.5 rounded-full cursor-pointer flex items-center justify-center w-8 h-8 mx-auto ${i === 4 ? 'bg-success text-white font-bold shadow-sm' : 'hover-bg-surface-hover text-main'}`}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* My Calendar Checklist */}
          <div className="calendar-checklist-card bg-surface rounded-2xl p-6 border border-color shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-main">My Calendar</h3>
              <span className="text-xs font-semibold text-success bg-success-transparent px-2 py-1 rounded-full border border-success">Checklist</span>
            </div>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm font-medium text-main">
                <div className="w-5 h-5 rounded-full border-2 border-success cursor-pointer hover-bg-success-transparent transition-colors"></div>
                <span>Client Meeting: Pharmik</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted line-through font-medium opacity-70">
                <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center text-white"><Check size={12} strokeWidth={3} /></div>
                <span>Design Review</span>
              </li>
            </ul>
          </div>

          {/* Other Calendar Checklist */}
          <div className="calendar-checklist-card bg-surface rounded-2xl p-6 border border-color shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-main">Other Calendar</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-muted line-through font-medium opacity-70">
                <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center text-white"><Check size={12} strokeWidth={3} /></div>
                <span>Material Delivery</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted line-through font-medium opacity-70">
                <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center text-white"><Check size={12} strokeWidth={3} /></div>
                <span>QA Testing Phase</span>
              </li>
            </ul>
          </div>
        </div>

        {/* RIGHT MAIN CALENDAR AREA */}
        <div className="cal-main-area">
          {/* Top Header */}
          <div className="p-6 border-b border-color flex justify-between items-center bg-surface">
            <h2 className="font-bold text-lg text-main">January 05 - 2024</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-main cursor-pointer hover:text-success transition-colors">Today</span>
              <div className="flex gap-2">
                <button className="p-1.5 rounded-full bg-surface-hover text-muted hover-text-main"><ChevronLeft size={16} /></button>
                <button className="p-1.5 rounded-full bg-surface-hover text-muted hover-text-main"><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>

          {/* Grid Body */}
          <div className="cal-timeline-body custom-scrollbar">
            {/* Time column */}
            <div className="cal-time-col">
              <div className="h-16 flex items-center justify-center text-xs text-muted font-bold tracking-wider border-b border-color" style={{ height: '64px' }}>GMT+8</div>
              <div className="cal-time-cell text-xs text-muted font-semibold tracking-wide">10 Am</div>
              <div className="cal-time-cell text-xs text-muted font-semibold tracking-wide">11 Am</div>
              <div className="cal-time-cell text-xs text-muted font-semibold tracking-wide">12 Pm</div>
              <div className="cal-time-cell text-xs text-muted font-semibold tracking-wide">01 Pm</div>
            </div>

            {/* Days content */}
            <div className="cal-days-col">
              {/* Day Headers */}
              <div className="cal-days-header">
                {weekDays.map(d => (
                  <div key={d.day} className={`cal-day-cell ${d.active ? 'text-success' : 'text-main'}`}>
                    <span className="text-xl font-extrabold">{d.date}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">{d.day}</span>
                  </div>
                ))}
              </div>

              {/* Horizontal Grid lines */}
              <div className="cal-h-line" style={{ top: '64px' }}></div>
              <div className="cal-h-line" style={{ top: '184px' }}></div>
              <div className="cal-h-line" style={{ top: '304px' }}></div>
              <div className="cal-h-line" style={{ top: '424px' }}></div>

              {/* Vertical grid lines */}
              <div className="cal-grid-bg">
                {weekDays.map((_, i) => <div key={i} className="cal-grid-col"></div>)}
              </div>

              {/* Real Events Layer */}
              <div className="cal-events-layer p-2">
                {activeProjects.slice(0, 4).map((project, idx) => {
                  // Generate mock positions just for visual layout in calendar
                  const positions = [
                    { top: '15px', left: '1%', width: '15%', height: '90px' },
                    { top: '120px', left: '34%', width: '15%', height: '100px' },
                    { top: '10px', left: '67.6%', width: '15%', height: '70px' },
                    { top: '230px', left: '84.3%', width: '15%', height: '110px' }
                  ];
                  const pos = positions[idx % positions.length];
                  const colorClass = project.priority === 'High' ? 'bg-danger-transparent border-danger text-danger' :
                    project.priority === 'Medium' ? 'bg-primary-transparent border-primary text-primary' :
                      'bg-surface-hover border-color text-main';

                  return (
                    <div key={project.id} className={`cal-event-block ${colorClass.split(' ')[0]} ${colorClass.split(' ')[1]}`} style={{ ...pos }}>
                      <div className={`font-bold text-sm mb-1 ${colorClass.split(' ')[2]}`}>{project.title}</div>
                      <div className="text-[10px] font-semibold opacity-90 mb-2">{project.clientName || 'Internal Project'}</div>
                      <div className="avatar-stack scale-75 origin-left">
                        {project.assignees.slice(0, 2).map((av, i) => (
                          <img key={i} src={av} className="avatar-sm" />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="page-container fade-in flex-col h-full overflow-hidden">
      <div className="page-header">
        <div>
          <h1 className="text-3xl font-extrabold text-main flex items-center gap-2 mb-2">
            Project Pipeline
          </h1>
          <p className="text-muted" style={{ fontSize: '1.1rem' }}>Here's a look at your team's ongoing workflows and upcoming deadlines.</p>
        </div>

        <div className="page-view-toggles">
          <button
            className={`page-view-toggle ${view === 'kanban' ? 'active' : ''}`}
            onClick={() => setView('kanban')}
          >
            Kanban
          </button>
          <button
            className={`page-view-toggle ${view === 'list' ? 'active' : ''}`}
            onClick={() => setView('list')}
          >
            List
          </button>
        </div>
      </div>

      <div className="projects-content flex-1 overflow-hidden mt-6 relative">
        {view === 'kanban' && renderKanbanView()}
        {view === 'list' && renderListView()}
        {view === 'calendar' && renderCalendarView()}
      </div>

      {isColumnModalOpen && (
        <div className="modal-overlay" onClick={() => setIsColumnModalOpen(false)}>
          <Card className="modal-content max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Add New Column</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Column Name</label>
              <input
                type="text"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                className="w-full p-2 border rounded-md bg-surface text-main border-color"
                placeholder="e.g. In Review"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="secondary" onClick={() => setIsColumnModalOpen(false)}>Cancel</Button>
              <Button onClick={handleAddColumn} disabled={!newColumnName.trim()}>Add Column</Button>
            </div>
          </Card>
        </div>
      )}

      {isTaskModalOpen && (
        <div className="modal-overlay" onClick={() => setIsTaskModalOpen(false)}>
          <Card className="modal-content max-w-2xl p-6" style={{ maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-main)' }}>Create New Task</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div style={{ gridColumn: 'span 2' }}>
                <label className="text-sm font-semibold mb-2" style={{ display: 'block' }}>Task Title <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input
                  type="text"
                  value={newTaskData.title}
                  onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                  className="w-full"
                  placeholder="e.g. Design Landing Page"
                  autoFocus
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label className="text-sm font-semibold mb-2" style={{ display: 'block' }}>Description</label>
                <textarea
                  value={newTaskData.description}
                  onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
                  className="w-full custom-scrollbar"
                  placeholder="Brief description of the task..."
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2" style={{ display: 'block' }}>Priority</label>
                <select
                  value={newTaskData.priority}
                  onChange={(e) => setNewTaskData({ ...newTaskData, priority: e.target.value as any })}
                  className="w-full"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-2" style={{ display: 'block' }}>Due Date</label>
                <DatePicker
                  value={newTaskData.dueDate}
                  onChange={(dateStr) => setNewTaskData({ ...newTaskData, dueDate: dateStr })}
                />
              </div>

              <div style={{ position: 'relative', margin: '1.5rem 0', gridColumn: 'span 2', borderTop: '1px solid var(--border-color)' }}>
                <span className="text-xs font-bold uppercase" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '0 0.75rem', backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)' }}>Project Details</span>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label className="text-sm font-semibold mb-2" style={{ display: 'block' }}>Client Name</label>
                <input
                  type="text"
                  value={newTaskData.clientName}
                  onChange={(e) => setNewTaskData({ ...newTaskData, clientName: e.target.value })}
                  className="w-full"
                  placeholder="e.g. Acme Corp"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2" style={{ display: 'block' }}>Price ($)</label>
                <input
                  type="number"
                  value={newTaskData.price}
                  onChange={(e) => setNewTaskData({ ...newTaskData, price: e.target.value })}
                  className="w-full"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2" style={{ display: 'block' }}>Material Spec</label>
                <input
                  type="text"
                  value={newTaskData.materialSpec}
                  onChange={(e) => setNewTaskData({ ...newTaskData, materialSpec: e.target.value })}
                  className="w-full"
                  placeholder="e.g. Aluminum 6061"
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <Button variant="secondary" onClick={() => { setIsTaskModalOpen(false); setEditingProjectId(null); setActiveMenuId(null); }}>Cancel</Button>
              <Button onClick={handleSaveTask} disabled={!newTaskData.title.trim()}>{editingProjectId ? 'Save Changes' : 'Create Task'}</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Projects;
