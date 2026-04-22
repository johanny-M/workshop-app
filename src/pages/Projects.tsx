import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useStore, ProjectColumn, Project } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus, MoreHorizontal, Paperclip, MessageSquare, Calendar, LayoutGrid, List, Search, Filter, ChevronLeft, ChevronRight, Check, Link2, Tag, Bookmark, Share, BarChart2, Cloud, Settings, Pause, Folder, Smartphone, Clock, Type } from 'lucide-react';
import './Projects.css';

const Projects: React.FC = () => {
  const { projectColumns, projects, updateProjectColumn, addProjectColumn } = useStore();
  const [view, setView] = useState<'kanban' | 'calendar' | 'list' | 'production'>('kanban');
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    updateProjectColumn(draggableId, destination.droppableId);
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

  const renderKanbanView = () => (
    <div className="projects-board-wrapper">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="projects-board">
          {projectColumns.map((column) => {
            const columnProjects = projects.filter(p => p.columnId === column.id);
            return (
              <div key={column.id} className="project-column">
                <div className="project-column-header">
                  <div className="flex items-center gap-2">
                    <span className="column-dot"></span>
                    <h3 className="font-semibold text-sm">{column.title}</h3>
                    <span className="column-count">{columnProjects.length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="btn-icon"><Plus size={16}/></button>
                    <button className="btn-icon"><MoreHorizontal size={16}/></button>
                  </div>
                </div>
                
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      className={`project-droppable ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {columnProjects.map((project, index) => (
                        <Draggable key={project.id} draggableId={project.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`project-card ${snapshot.isDragging ? 'dragging' : ''}`}
                              style={{ ...provided.draggableProps.style }}
                            >
                              <div className="project-card-header">
                                <span className={`priority-badge priority-${project.priority.toLowerCase()}`}>
                                  <span className="flag-icon">⚑</span> {project.priority}
                                </span>
                                <button className="btn-icon"><MoreHorizontal size={16}/></button>
                              </div>
                              <h4 className="project-card-title">{project.title}</h4>
                              <p className="project-card-desc">{project.description}</p>
                              
                              <div className="project-card-dueDate">
                                <Calendar size={13} className="text-muted"/>
                                <span>Due to: {project.dueDate}</span>
                              </div>
                              
                              <div className="project-card-footer">
                                <div className="avatar-stack">
                                  {project.assignees.map((avatar, idx) => (
                                    <img key={idx} src={avatar} alt="Assignee" className="avatar-sm" style={{ zIndex: 10 - idx }} />
                                  ))}
                                  <div className="avatar-sm more-avatars" style={{ zIndex: 0 }}>+3</div>
                                </div>
                                <div className="project-card-meta">
                                  <div className="meta-item">
                                    <Paperclip size={14} /> <span>0{project.attachmentsCount}</span>
                                  </div>
                                  <div className="meta-item">
                                    <MessageSquare size={14} /> <span>0{project.commentsCount}</span>
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
          <div className="add-column-wrapper">
             <button className="add-column-btn" onClick={() => setIsColumnModalOpen(true)}>
               <Plus size={20} /> Add Column
             </button>
          </div>
        </div>
      </DragDropContext>
    </div>
  );

  const renderListView = () => (
    <div className="list-view-container bg-surface border border-color rounded-xl overflow-hidden mt-6 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-hover border-b border-color">
            <th className="p-4 font-semibold text-muted text-sm">Title</th>
            <th className="p-4 font-semibold text-muted text-sm">Status</th>
            <th className="p-4 font-semibold text-muted text-sm">Priority</th>
            <th className="p-4 font-semibold text-muted text-sm">Due Date</th>
            <th className="p-4 font-semibold text-muted text-sm border-r border-color border-r-0">Assignees</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => {
             const col = projectColumns.find(c => c.id === project.columnId);
             return (
              <tr key={project.id} className="border-b border-color hover-bg-surface-hover transition-colors">
                <td className="p-4">
                  <div className="font-semibold">{project.title}</div>
                  <div className="text-xs text-muted mt-1">{project.description}</div>
                </td>
                <td className="p-4"><span className="badge">{col?.title}</span></td>
                <td className="p-4">
                  <span className={`priority-badge priority-${project.priority.toLowerCase()}`}>
                    <span className="flag-icon">⚑</span> {project.priority}
                  </span>
                </td>
                <td className="p-4 text-sm text-muted">{project.dueDate}</td>
                <td className="p-4">
                   <div className="avatar-stack">
                     {project.assignees.slice(0, 3).map((avatar, idx) => (
                       <img key={idx} src={avatar} alt="Assignee" className="avatar-sm" style={{ zIndex: 10 - idx }} />
                     ))}
                   </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
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
                 <button className="p-1 rounded-md hover-bg-surface-hover text-muted"><ChevronLeft size={16}/></button>
                 <button className="p-1 rounded-md hover-bg-surface-hover text-muted"><ChevronRight size={16}/></button>
               </div>
             </div>
             <div className="cal-month-grid text-xs font-semibold text-muted mb-2">
               <div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div><div>Su</div>
             </div>
             <div className="cal-month-grid text-sm">
               {Array.from({length: 31}).map((_, i) => (
                  <div key={i} className={`p-1.5 rounded-full cursor-pointer flex items-center justify-center w-8 h-8 mx-auto ${i===4 ? 'bg-success text-white font-bold shadow-sm' : 'hover-bg-surface-hover text-main'}`}>
                    {i+1}
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
                 <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center text-white"><Check size={12} strokeWidth={3}/></div>
                 <span>Design Review</span>
               </li>
             </ul>
           </div>

           {/* Other Calendar Checklist */}
           <div className="calendar-checklist-card bg-surface rounded-2xl p-6 border border-color shadow-sm">
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-main">Other Calendar</h3>
               <button className="text-xs font-semibold text-success hover-underline flex items-center gap-1">Add Task <Plus size={12}/></button>
             </div>
             <ul className="space-y-4">
               <li className="flex items-center gap-3 text-sm text-muted line-through font-medium opacity-70">
                 <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center text-white"><Check size={12} strokeWidth={3}/></div>
                 <span>Material Delivery</span>
               </li>
               <li className="flex items-center gap-3 text-sm text-muted line-through font-medium opacity-70">
                 <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center text-white"><Check size={12} strokeWidth={3}/></div>
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
                 <button className="p-1.5 rounded-full bg-surface-hover text-muted hover-text-main"><ChevronLeft size={16}/></button>
                 <button className="p-1.5 rounded-full bg-surface-hover text-muted hover-text-main"><ChevronRight size={16}/></button>
                </div>
              </div>
           </div>

           {/* Grid Body */}
           <div className="cal-timeline-body custom-scrollbar">
               {/* Time column */}
               <div className="cal-time-col">
                  <div className="h-16 flex items-center justify-center text-xs text-muted font-bold tracking-wider border-b border-color" style={{height: '64px'}}>GMT+8</div>
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

                  {/* Mock Events Overlay */}
                  <div className="cal-events-layer p-2">
                     {/* Meeting block */}
                     <div className="cal-event-block bg-success-transparent border-success" 
                          style={{ top: '15px', left: '1%', width: '15%', height: '90px' }}>
                        <div className="font-bold text-sm text-success mb-1">Client Meeting</div>
                        <div className="text-[10px] text-success font-semibold opacity-90 mb-2">10 Am - 11 Am</div>
                        <div className="avatar-stack scale-75 origin-left">
                          <img src="https://i.pravatar.cc/100?img=1" className="avatar-sm" style={{borderColor: 'var(--success-transparent)'}}/>
                          <img src="https://i.pravatar.cc/100?img=2" className="avatar-sm" style={{borderColor: 'var(--success-transparent)'}}/>
                        </div>
                     </div>

                     {/* Design sync block */}
                     <div className="cal-event-block bg-surface-hover border-color" 
                          style={{ top: '120px', left: '34%', width: '15%', height: '100px' }}>
                        <div className="font-bold text-sm text-main mb-1">Design Sync</div>
                        <div className="text-[10px] text-muted font-semibold mb-2">11 Am - 12 Pm</div>
                        <div className="avatar-stack scale-75 origin-left">
                          <img src="https://i.pravatar.cc/100?img=3" className="avatar-sm"/>
                          <img src="https://i.pravatar.cc/100?img=4" className="avatar-sm"/>
                        </div>
                     </div>
                     
                     {/* Material Delivery block */}
                     <div className="cal-event-block bg-success" 
                          style={{ top: '10px', left: '67.6%', width: '15%', height: '70px', border: 'none' }}>
                        <div className="font-bold text-sm text-white mb-1">Material Delivery</div>
                        <div className="text-[10px] text-white font-semibold opacity-95">10 Am - 10:45 Am</div>
                     </div>

                     {/* QA Testing Phase block */}
                     <div className="cal-event-block bg-success-transparent border-success" 
                          style={{ top: '230px', left: '84.3%', width: '15%', height: '110px' }}>
                        <div className="font-bold text-sm text-success mb-1">QA Testing</div>
                        <div className="text-[10px] text-success font-semibold opacity-90 mb-2">12 Pm - 01 Pm</div>
                        <div className="avatar-stack scale-75 origin-left">
                           <img src="https://i.pravatar.cc/100?img=5" className="avatar-sm" style={{borderColor: '#bbf7d0'}}/>
                        </div>
                     </div>
                  </div>
               </div>
           </div>
        </div>
      </div>
    );
  };

  const renderProductionView = () => {
    const prodTasks = [
      { id: 1, title: 'Develop Processing Plans', assigned: 'Clair Burge', date: '12.11.23', color: 'pink', progress: 2, total: 4, icon: 'bookmark', avatar: 1 },
      { id: 6, title: 'Develop Strategic Plans', assigned: 'Christian Bass', date: '15.11.23', color: 'pink', progress: 2, total: 4, avatar: 4 },
      { id: 11, title: 'Build Relationships', assigned: 'Craig Curry', date: '21.11.23', color: 'grey', progress: 1, total: 4, avatar: 2 },
      { id: 16, title: 'Create Training Programs', assigned: 'Brandon Crawford', date: '23.11.23', color: 'grey', progress: 3, total: 4, avatar: 6 },
      
      { id: 2, title: 'Resolve Payment Disputes', assigned: 'Clair Burge', date: '8.11.23', color: 'purple', progress: 3, total: 4, avatar: 1 },
      { id: 7, title: 'Provide Customer Service', assigned: 'Christian Bass', date: '9.11.23', color: 'purple', progress: 3, total: 4, icon: 'bookmark', avatar: 4 },
      { id: 12, title: 'Resolve Disputes', assigned: 'Brandon Crawford', date: '20.11.23', color: 'grey', progress: 3, total: 4, avatar: 6 },
      { id: 17, title: 'Develop Processing Plans', assigned: 'Helna Julie', date: '22.11.23', color: 'purple', progress: 2, total: 4, icon: 'bookmark', avatar: 3 },
      
      { id: 3, title: 'Train Employees', assigned: 'Craig Curry', date: '8.11.23', color: 'purple', progress: 1, total: 4, avatar: 2 },
      { id: 8, title: 'Improve Efficiency', assigned: 'Christian Bass', date: '10.11.23', color: 'grey', progress: 4, total: 4, avatar: 4 },
      { id: 13, title: 'Report To Management', assigned: 'Clair Burge', date: '14.11.23', color: 'purple', progress: 2, total: 4, avatar: 1 },
      { id: 18, title: 'Recruit New', color: 'purple', progress: 1, total: 4 },
      
      { id: 4, title: 'Recruit New Talent', assigned: 'Helna Julie', date: '4.11.23', color: 'yellow', progress: 2, total: 3, avatar: 3 },
      { id: 9, title: 'Market Services', assigned: 'Clair Burge', date: '5.11.23', color: 'yellow', progress: 2, total: 3, avatar: 1 },
      { id: 14, title: 'empty', type: 'placeholder', color: 'striped' },
      { id: 15, title: 'Launch Marketing Campaigns', assigned: 'Brandon Crawford', date: '5.02.24', color: 'grey', progress: 1, total: 4, icon: 'pause', avatar: 6 },
      { id: 19, title: 'Oversee Operations', assigned: 'Helna Julie', date: '6.12.23', color: 'grey', progress: 3, total: 4, avatar: 3 },
      { id: 5, title: 'Oversee Operations', assigned: 'Christian Bass', date: '1.12.23', color: 'grey', progress: 3, total: 4, avatar: 4 },
    ];

    return (
      <div className="prod-module fade-in relative h-full">
        <div className="prod-header flex-col lg:flex-row gap-6">
           <div className="prod-title-area">
              <span className="text-muted text-sm font-semibold tracking-wide uppercase">Task Schedule</span>
              <h2 className="text-3xl font-extrabold mt-1">Daily Operation</h2>
              
              <div className="prod-filters mt-6 gap-4">
                 <div className="prod-pill dark">
                    Still Running <span className="prod-badge yellow">32</span>
                 </div>
                 <div className="prod-pill light">
                    Disqualified <span className="prod-badge grey">4</span>
                 </div>
                 
                 <div className="flex gap-2 ml-2">
                    <button className="prod-icon-btn bg-dark"><LayoutGrid size={14}/></button>
                    <button className="prod-icon-btn bg-light"><Link2 size={14}/></button>
                    <button className="prod-icon-btn bg-light"><Tag size={14}/></button>
                    <button className="prod-icon-btn bg-light"><Bookmark size={14}/></button>
                    <button className="prod-icon-btn bg-light"><Share size={14}/></button>
                 </div>
              </div>
           </div>

           <div className="prod-stats gap-8">
               <div className="stat-item">
                  <span className="text-muted text-xs font-semibold uppercase mb-1 block">Week's Tasks</span>
                  <span className="text-4xl font-light">132</span>
               </div>
               <div className="stat-item">
                  <span className="text-muted text-xs font-semibold uppercase mb-1 block">Pending Approval</span>
                  <span className="text-4xl font-light">34</span>
               </div>
               <div className="stat-item">
                  <span className="text-muted text-xs font-semibold uppercase mb-1 block">Employees Involved</span>
                  <span className="text-4xl font-light">22</span>
               </div>
               
               <div className="flex gap-2 ml-4">
                  <button className="prod-icon-btn outline border border-color"><BarChart2 size={16}/></button>
                  <button className="prod-icon-btn outline border border-color"><Cloud size={16}/></button>
                  <button className="prod-icon-btn outline border border-color"><Settings size={16}/></button>
               </div>
           </div>
        </div>
        
        <div className="prod-masonry-container custom-scrollbar">
           <div className="prod-masonry">
               {prodTasks.map(task => (
                 <div key={task.id} className={`prod-card ${task.color}`}>
                   {task.type !== 'placeholder' && (
                     <>
                        <div className="prod-card-action"><MoreHorizontal size={18}/></div>
                        <h4 className="prod-card-title">{task.title}</h4>
                        
                        <div className="prod-progress">
                          {Array.from({length: task.total!}).map((_, i) => (
                             <div key={i} className={`prod-progress-bar ${i < task.progress! ? 'active' : ''}`}></div>
                          ))}
                        </div>
                        
                        {(task.assigned) && (
                          <div className="prod-avatar-row mt-6">
                            <img src={`https://i.pravatar.cc/100?img=${task.avatar}`} alt={task.assigned} className="prod-avatar" />
                            <div className="prod-user-info">
                              <span className="prod-user-name">{task.assigned}</span>
                              <span className="prod-user-date">{task.date}</span>
                            </div>
                          </div>
                        )}
                        
                        {task.icon === 'bookmark' && (
                          <div className="prod-card-icon"><Bookmark size={12} fill="currentColor"/></div>
                        )}
                        {task.icon === 'pause' && (
                          <div className="prod-card-icon bg-light text-muted" style={{backgroundColor: '#ececec'}}><Pause size={12} className="text-main" fill="currentColor"/></div>
                        )}
                     </>
                   )}
                 </div>
               ))}
           </div>
        </div>

        {/* Floating Bottom Navigation */}
        <div className="prod-floating-bar">
           <button className="prod-icon-btn outline border border-transparent hover-bg-surface-hover"><Folder size={16}/></button>
           <button className="prod-icon-btn outline border border-transparent hover-bg-surface-hover"><Smartphone size={16}/></button>
           <button className="prod-icon-btn bg-dark scale-110 shadow-md"><Plus size={16}/></button>
           <button className="prod-icon-btn outline border border-transparent hover-bg-surface-hover"><Clock size={16}/></button>
           <button className="prod-icon-btn outline border border-transparent hover-bg-surface-hover"><Type size={16}/></button>
        </div>
      </div>
    );
  };

  return (
    <div className="projects-container fade-in flex-col h-full overflow-hidden">
      <div className="projects-header">
        <div className="flex items-center gap-2 mb-1">
          <LayoutGrid size={24} className="text-primary" />
          <h1 className="text-2xl font-bold">All Project</h1>
        </div>
        
        <div className="projects-controls flex flex-wrap gap-4 items-center justify-between mt-4">
          <div className="view-toggles flex items-center gap-4">
            <button className={`view-toggle ${view === 'kanban' ? 'active' : ''}`} onClick={() => setView('kanban')}>
               <LayoutGrid size={16} /> Kanban
            </button>
            <button className={`view-toggle ${view === 'calendar' ? 'active' : ''}`} onClick={() => setView('calendar')}>
               <Calendar size={16} /> Calendar
            </button>
            <button className={`view-toggle ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>
               <List size={16} /> List
            </button>
            <button className={`view-toggle ${view === 'production' ? 'active' : ''}`} onClick={() => setView('production')}>
               <LayoutGrid size={16} /> Production
            </button>
          </div>
          
          <div className="projects-actions flex flex-wrap items-center gap-3">
             <div className="search-box relative hidden md:block">
               <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
               <input type="text" placeholder="Search" className="pl-9 pr-4 py-2 bg-surface rounded-full border border-color text-sm outline-none focus:border-primary transition-colors" />
             </div>
             <button className="btn btn-secondary rounded-full bg-surface text-sm py-2 px-4 flex items-center gap-2">
                <Filter size={16} /> Filters
             </button>
             <button className="btn btn-secondary rounded-full bg-surface text-sm py-2 px-4 flex items-center gap-2">
                <Calendar size={16} /> Date Range
             </button>
             <button className="btn rounded-full text-sm py-2 px-4 flex items-center gap-2 text-white shadow-md hover:opacity-90 transition-opacity" style={{backgroundColor: '#6366f1'}}>
                <Plus size={16} /> New Task
             </button>
          </div>
        </div>
      </div>

      <div className="projects-content flex-1 overflow-hidden mt-6 relative">
        {view === 'kanban' && renderKanbanView()}
        {view === 'list' && renderListView()}
        {view === 'calendar' && renderCalendarView()}
        {view === 'production' && renderProductionView()}
      </div>

      {isColumnModalOpen && (
        <div className="modal-overlay">
          <Card className="modal-content w-full max-w-md p-6">
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
    </div>
  );
};

export default Projects;
