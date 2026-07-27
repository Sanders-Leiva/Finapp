import { useState, useEffect } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

import { KPICards } from '../components/dashboard/KPICards';
import { CashFlowChart } from '../components/dashboard/CashFlowChart';
import { ExpensesByCategory } from '../components/dashboard/ExpensesByCategory';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { AIInsightsWidget } from '../components/dashboard/AIInsightsWidget';
import { PullToRefresh } from '../components/PullToRefresh';
import { useStore } from '../store/useStore';
import { DraggableWidget } from '../components/dashboard/DraggableWidget';

const WIDGET_COMPONENTS: Record<string, { component: React.ReactNode, span: string }> = {
  'kpis': { component: <KPICards />, span: 'col-span-12' },
  'ai_insights': { component: <AIInsightsWidget />, span: 'col-span-12' },
  'cashflow': { component: <CashFlowChart />, span: 'col-span-12' },
  'expenses': { component: <ExpensesByCategory />, span: 'col-span-12 lg:col-span-6' },
  'recent': { component: <RecentTransactions />, span: 'col-span-12 lg:col-span-6' },
};

const DEFAULT_ORDER = ['kpis', 'ai_insights', 'cashflow', 'expenses', 'recent'];

export const Dashboard = () => {
  const { refreshData } = useStore();
  const [widgetOrder, setWidgetOrder] = useState<string[]>(DEFAULT_ORDER);

  useEffect(() => {
    const savedOrder = localStorage.getItem('finapp-dashboard-order');
    if (savedOrder) {
      try {
        const parsed = JSON.parse(savedOrder);
        // Verify it contains all our widgets
        if (Array.isArray(parsed) && parsed.length === DEFAULT_ORDER.length) {
          setWidgetOrder(parsed);
        }
      } catch (e) {
        console.error('Error parsing dashboard order', e);
      }
    }
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Require 5px movement before dragging starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setWidgetOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        localStorage.setItem('finapp-dashboard-order', JSON.stringify(newOrder));
        return newOrder;
      });
    }
  };

  return (
    <PullToRefresh onRefresh={refreshData}>
      <div className="animate-in fade-in duration-500 pb-20 lg:pb-6">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-12 gap-6">
            <SortableContext 
              items={widgetOrder}
              strategy={rectSortingStrategy}
            >
              {widgetOrder.map((id) => (
                <DraggableWidget 
                  key={id} 
                  id={id} 
                  className={WIDGET_COMPONENTS[id]?.span || 'col-span-12'}
                >
                  {WIDGET_COMPONENTS[id]?.component}
                </DraggableWidget>
              ))}
            </SortableContext>
          </div>
        </DndContext>
      </div>
    </PullToRefresh>
  );
};
