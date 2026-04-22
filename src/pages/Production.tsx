import React, { useState } from 'react';
import { Plus, MoreHorizontal, Bookmark, Pause, Folder, Smartphone, Clock, Type, BarChart2, Cloud, Settings } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './Production.css';

interface BaseTask {
  id: string;
  title: string;
  color: string;
  progress?: number;
  total?: number;
  assigned?: string;
  date?: string;
  avatar?: number;
  icon?: 'bookmark' | 'pause';
  type?: string;
}

interface Column {
  id: string;
  label: string;
  color: string; // The accent color logic
  cardColor: string; // The specific card color class to use
  tasks: BaseTask[];
}

const initialColumns: Record<string, Column> = {
  todo: {
    id: 'todo',
    label: 'To Do',
    color: '#e0e0e0',
    cardColor: 'grey',
    tasks: [
      { id: 't1', title: 'Build Relationships', assigned: 'Craig Curry', date: '21.11.23', color: 'grey', progress: 1, total: 4, avatar: 2 },
      { id: 't2', title: 'Create Training Programs', assigned: 'Brandon Crawford', date: '23.11.23', color: 'grey', progress: 3, total: 4, avatar: 6 },
    ],
  },
  inProgress: {
    id: 'inProgress',
    label: 'In Progress',
    color: '#b5adc4', // purple/lavender
    cardColor: 'purple',
    tasks: [
      { id: 't3', title: 'Resolve Payment Disputes', assigned: 'Clair Burge', date: '8.11.23', color: 'purple', progress: 3, total: 4, avatar: 1 },
      { id: 't4', title: 'Train Employees', assigned: 'Craig Curry', date: '8.11.23', color: 'purple', progress: 1, total: 4, avatar: 2 },
    ],
  },
  inReview: {
    id: 'inReview',
    label: 'In Review',
    color: '#d7a4cb', // pink/rose
    cardColor: 'pink',
    tasks: [
      { id: 't5', title: 'Develop Processing Plans', assigned: 'Clair Burge', date: '12.11.23', color: 'pink', progress: 2, total: 4, icon: 'bookmark', avatar: 1 },
      { id: 't6', title: 'Develop Strategic Plans', assigned: 'Christian Bass', date: '15.11.23', color: 'pink', progress: 2, total: 4, avatar: 4 },
    ],
  },
  done: {
    id: 'done',
    label: 'Done',
    color: '#cdcc00', // yellow-green
    cardColor: 'yellow',
    tasks: [
      { id: 't7', title: 'Market Services', assigned: 'Clair Burge', date: '5.11.23', color: 'yellow', progress: 2, total: 3, avatar: 1 },
    ],
  },
};

const Production: React.FC = () => {
  const [columns, setColumns] = useState(initialColumns);

  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];

    const sourceTasks = Array.from(sourceCol.tasks);
    const destTasks = source.droppableId === destination.droppableId ? sourceTasks : Array.from(destCol.tasks);

    const [movedTask] = sourceTasks.splice(source.index, 1);
    
    // Optional feature from prompt: Update the card's color to match column on drop across columns
    if (source.droppableId !== destination.droppableId) {
      movedTask.color = destCol.cardColor;
    }
    
    destTasks.splice(destination.index, 0, movedTask);

    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceCol,
        tasks: sourceTasks,
      },
      [destination.droppableId]: {
        ...destCol,
        tasks: destTasks,
      },
    });
  };

  return (
    <div className="prod-module fade-in relative h-full">
      <div className="prod-header flex-col lg:flex-row gap-6">
         <div className="prod-title-area shrink-0">
            {/* Header Fix - Cleaned up to single line */}
            <h2 className="text-3xl font-extrabold m-0">Current Operation Status</h2>
            
            <div className="prod-filters mt-6 gap-4">
               <div className="prod-pill dark">
                  Still Running <span className="prod-badge yellow">32</span>
               </div>
               <div className="prod-pill light">
                  Disqualified <span className="prod-badge grey">4</span>
               </div>
               
               <div className="flex gap-2 ml-2">
                  <button className="prod-icon-btn bg-dark"><BarChart2 size={14}/></button>
                  <button className="prod-icon-btn bg-light"><Settings size={14}/></button>
               </div>
            </div>
         </div>

         {/* Stats Row Fix - Stacked Blocks */}
         <div className="prod-stats gap-8 flex-wrap lg:flex-nowrap">
             <div className="prod-stat-block">
                <span className="prod-stat-label">Week's Tasks</span>
                <span className="prod-stat-number">132</span>
             </div>
             <div className="prod-stat-block">
                <span className="prod-stat-label">Pending Approval</span>
                <span className="prod-stat-number">34</span>
             </div>
             <div className="prod-stat-block">
                <span className="prod-stat-label">Employees Involved</span>
                <span className="prod-stat-number">22</span>
             </div>
             
             <div className="prod-stat-icons flex gap-2 ml-4 self-center">
                <button className="prod-icon-btn outline border border-color"><BarChart2 size={16}/></button>
                <button className="prod-icon-btn outline border border-color"><Settings size={16}/></button>
             </div>
         </div>
      </div>
      
      {/* Kanban Board Container */}
      <div className="prod-kanban-board custom-scrollbar">
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.values(columns).map((column) => (
             <div key={column.id} className="prod-kanban-column">
                <div className="prod-kanban-header">
                   <div className="flex items-center gap-2">
                     <span className="prod-kanban-dot" style={{ backgroundColor: column.color }}></span>
                     <span className="prod-kanban-title">{column.label}</span>
                     <span className="prod-kanban-count">{column.tasks.length}</span>
                   </div>
                   <button className="prod-icon-btn outline"><Plus size={16}/></button>
                </div>
                
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                     <div 
                       className={`prod-kanban-droppable custom-scrollbar ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
                       ref={provided.innerRef}
                       {...provided.droppableProps}
                     >
                       {column.tasks.map((task, index) => (
                         <Draggable key={task.id} draggableId={task.id} index={index}>
                           {(provided, snapshot) => (
                             <div
                               ref={provided.innerRef}
                               {...provided.draggableProps}
                               {...provided.dragHandleProps}
                               className={`prod-card ${task.color} ${snapshot.isDragging ? 'dragging' : ''}`}
                             >
                               <div className="prod-card-action"><MoreHorizontal size={18}/></div>
                               <h4 className="prod-card-title">{task.title}</h4>
                               
                               {task.total !== undefined && task.progress !== undefined && (
                                 <div className="prod-progress">
                                   {Array.from({length: task.total}).map((_, i) => (
                                      <div key={i} className={`prod-progress-bar ${i < task.progress! ? 'active' : ''}`}></div>
                                   ))}
                                 </div>
                               )}
                               
                               {task.assigned && (
                                 <div className="prod-avatar-row mt-6 flex justify-between items-center w-full">
                                   <div className="flex items-center gap-3">
                                     <img src={`/assets/avatars/${task.avatar}.jpg`} onError={(e) => { e.currentTarget.src = `https://i.pravatar.cc/100?img=${task.avatar}` }} alt={task.assigned} className="prod-avatar" />
                                     <div className="prod-user-info">
                                       <span className="prod-user-name">{task.assigned}</span>
                                       <span className="prod-user-date">{task.date}</span>
                                     </div>
                                   </div>
                                 </div>
                               )}
                               
                               {task.icon === 'bookmark' && (
                                 <div className="prod-card-icon"><Bookmark size={12} fill="currentColor"/></div>
                               )}
                               {task.icon === 'pause' && (
                                 <div className="prod-card-icon bg-light text-muted" style={{backgroundColor: '#ececec'}}><Pause size={12} className="text-main" fill="currentColor"/></div>
                               )}
                             </div>
                           )}
                         </Draggable>
                       ))}
                       {provided.placeholder}
                       
                       <button className="prod-add-task-btn">
                          <Plus size={16}/> Add Task
                       </button>
                     </div>
                  )}
                </Droppable>
             </div>
          ))}
        </DragDropContext>
      </div>

      {/* Floating Bottom Navigation */}
      <div className="prod-floating-bar">
         <button className="prod-icon-btn outline border border-transparent hover:bg-surface-hover"><Folder size={16}/></button>
         <button className="prod-icon-btn outline border border-transparent hover:bg-surface-hover"><Smartphone size={16}/></button>
         <button className="prod-icon-btn bg-dark scale-110 shadow-md"><Plus size={16}/></button>
         <button className="prod-icon-btn outline border border-transparent hover:bg-surface-hover"><Clock size={16}/></button>
         <button className="prod-icon-btn outline border border-transparent hover:bg-surface-hover"><Type size={16}/></button>
      </div>
    </div>
  );
};

export default Production;
