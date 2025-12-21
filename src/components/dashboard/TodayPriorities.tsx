import { AlertCircle, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ActionCard } from '@/components/actions/ActionCard';
import { getTodayActions, type Action } from '@/data/mockData';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function TodayPriorities() {
  const [actions, setActions] = useState<Action[]>(getTodayActions());

  const urgentActions = actions.filter(a => a.priority === 'high' && a.status !== 'done');
  const todayActions = actions.filter(a => a.dueDate === new Date().toISOString().split('T')[0] && a.status !== 'done');
  const completedToday = actions.filter(a => a.status === 'done');

  const handleStatusChange = (action: Action, status: Action['status']) => {
    setActions(prev => prev.map(a => a.id === action.id ? { ...a, status } : a));
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Priorités du jour</CardTitle>
        <Link to="/actions">
          <Button variant="ghost" size="sm" className="gap-1 text-accent hover:text-accent/80">
            Voir tout
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {/* Summary */}
        <div className="mb-4 grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-status-danger-bg p-3 text-center">
            <AlertCircle className="mx-auto h-5 w-5 text-status-danger" />
            <p className="mt-1 text-2xl font-bold text-status-danger">{urgentActions.length}</p>
            <p className="text-xs text-status-danger/80">Urgent</p>
          </div>
          <div className="rounded-lg bg-status-warning-bg p-3 text-center">
            <Clock className="mx-auto h-5 w-5 text-status-warning" />
            <p className="mt-1 text-2xl font-bold text-status-warning">{todayActions.length}</p>
            <p className="text-xs text-status-warning/80">Aujourd'hui</p>
          </div>
          <div className="rounded-lg bg-status-success-bg p-3 text-center">
            <CheckCircle2 className="mx-auto h-5 w-5 text-status-success" />
            <p className="mt-1 text-2xl font-bold text-status-success">{completedToday.length}</p>
            <p className="text-xs text-status-success/80">Terminées</p>
          </div>
        </div>

        {/* Actions List */}
        <ScrollArea className="h-[300px]">
          <div className="space-y-2 pr-4">
            {urgentActions.length === 0 && todayActions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-status-success mb-2" />
                <p className="text-muted-foreground">Toutes les priorités sont traitées !</p>
              </div>
            ) : (
              [...urgentActions, ...todayActions.filter(a => a.priority !== 'high')].map((action) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  compact
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
