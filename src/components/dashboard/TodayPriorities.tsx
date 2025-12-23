import { AlertCircle, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useTodayActions, useUpdateAction } from '@/hooks/useActions';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const priorityLabels: Record<string, string> = {
  low: 'Faible',
  medium: 'Moyenne',
  high: 'Élevée',
};

const priorityColors: Record<string, string> = {
  low: 'bg-secondary text-secondary-foreground',
  medium: 'bg-status-warning-bg text-status-warning',
  high: 'bg-status-danger-bg text-status-danger',
};

export function TodayPriorities() {
  const { data: actions, isLoading } = useTodayActions();
  const updateAction = useUpdateAction();

  const urgentActions = actions?.filter(a => a.priority === 'high' && a.status !== 'done') || [];
  const todayActions = actions?.filter(a => {
    const today = new Date().toISOString().split('T')[0];
    return a.due_date === today && a.status !== 'done' && a.priority !== 'high';
  }) || [];
  const completedToday = actions?.filter(a => a.status === 'done') || [];

  const handleToggleStatus = (actionId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'done' ? 'todo' : 'done';
    updateAction.mutate({ id: actionId, status: newStatus });
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const allActions = [...urgentActions, ...todayActions];

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
            {allActions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-status-success mb-2" />
                <p className="text-muted-foreground">Toutes les priorités sont traitées !</p>
              </div>
            ) : (
              allActions.map((action) => (
                <div
                  key={action.id}
                  className={cn(
                    'rounded-lg border p-3 transition-all hover:shadow-sm cursor-pointer',
                    action.priority === 'high' && 'border-l-4 border-l-status-danger'
                  )}
                  onClick={() => handleToggleStatus(action.id, action.status || 'todo')}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{action.title}</h4>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                        {action.description}
                      </p>
                    </div>
                    <Badge variant="outline" className={priorityColors[action.priority || 'medium']}>
                      {priorityLabels[action.priority || 'medium']}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    {action.category && (
                      <Badge variant="outline" className="text-xs">
                        {action.category.name}
                      </Badge>
                    )}
                    {action.due_date && (
                      <span>Échéance: {new Date(action.due_date).toLocaleDateString('fr-FR')}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
