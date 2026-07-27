import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import clsx from 'clsx';

interface DraggableWidgetProps {
  id: string;
  className?: string;
  children: React.ReactNode;
}

export const DraggableWidget = ({ id, className, children }: DraggableWidgetProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        "relative group rounded-xl bg-white dark:bg-gray-900 shadow-sm border transition-colors duration-500 overflow-hidden",
        isDragging ? "border-brand shadow-lg ring-2 ring-brand/20 opacity-90" : "border-gray-100 dark:border-gray-800",
        className
      )}
    >
      <div 
        {...attributes} 
        {...listeners}
        className="absolute top-4 right-4 z-10 cursor-grab active:cursor-grabbing p-1 text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 dark:bg-gray-900/50 rounded-md"
        title="Arrastrar para reordenar"
      >
        <GripVertical className="w-5 h-5" />
      </div>
      {children}
    </div>
  );
};
