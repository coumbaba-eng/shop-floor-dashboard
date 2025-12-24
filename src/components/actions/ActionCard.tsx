import { Calendar, User, MoreVertical, Check, Clock, AlertCircle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { type Action, categoryLabels, priorityLabels, statusLabels } from '@/data/mockData';
import { usePermissions } from '@/hooks/usePermissions';

interface ActionCardProps {
  action: Action;
  onStatusChange?: (action: Action, status: Action['status']) => void;
  onEdit?: (action: Action) => void;
  onDelete?: (action: Action) => void;
  compact?: boolean;
}

const priorityConfig = {
  low: { color: 'bg-secondary text-secondary-foreground', dot: 'bg-muted-foreground' },
  medium: { color: 'bg-[hsl(var(--status-warning)/0.15)] text-[hsl(var(--status-warning))]', dot: 'bg-[hsl(var(--status-warning))]' },
  high: { color: 'bg-[hsl(var(--status-danger)/0.15)] text-[hsl(var(--status-danger))]', dot: 'bg-[hsl(var(--status-danger))]' },
};

const statusConfig = {
  todo: { icon: Clock, color: 'text-muted-foreground', bg: 'bg-secondary' },
  in_progress: { icon: AlertCircle, color: 'text-[hsl(var(--status-warning))]', bg: 'bg-[hsl(var(--status-warning)/0.1)]' },
  done: { icon: Check, color: 'text-[hsl(var(--status-success))]', bg: 'bg-[hsl(var(--status-success)/0.1)]' },
};

export function ActionCard({ action, onStatusChange, onEdit, onDelete, compact = false }: ActionCardProps) {
  const { hasPermission, canEdit, canDelete } = usePermissions();
  const isOverdue = new Date(action.dueDate) < new Date() && action.status !== 'done';
  const isToday = action.dueDate === new Date().toISOString().split('T')[0];

  const canComplete = hasPermission('complete_actions');
  const canEditAction = canEdit('actions');
  const canDeleteAction = canDelete('actions');
  const hasAnyAction = canComplete || canEditAction || canDeleteAction;

  const StatusIcon = statusConfig[action.status].icon;

  const handleToggleStatus = () => {
    if (!canComplete) return;
    onStatusChange?.(action, action.status === 'done' ? 'todo' : 'done');
  };

  if (compact) {
    return (
      <div className={cn(
        'flex items-center gap-3 rounded-xl border bg-card p-4 transition-all duration-300',
        'hover:shadow-md hover:-translate-y-0.5',
        isOverdue && action.status !== 'done' && 'border-l-4 border-l-[hsl(var(--status-danger))]'
      )}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleToggleStatus}
                disabled={!canComplete}
                className={cn(
                  'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all',
                  action.status === 'done' 
                    ? 'border-[hsl(var(--status-success))] bg-[hsl(var(--status-success))] text-white' 
                    : canComplete 
                      ? 'border-muted-foreground/40 hover:border-[hsl(var(--status-success))] hover:bg-[hsl(var(--status-success)/0.1)]'
                      : 'border-muted-foreground/20 cursor-not-allowed opacity-50'
                )}
              >
                {action.status === 'done' && <Check className="h-4 w-4" />}
                {!canComplete && action.status !== 'done' && <Lock className="h-3 w-3 text-muted-foreground" />}
              </button>
            </TooltipTrigger>
            {!canComplete && (
              <TooltipContent>
                <p>Vous n'avez pas la permission de modifier le statut</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        <div className="flex-1 min-w-0">
          <p className={cn('text-sm font-medium truncate', action.status === 'done' && 'line-through text-muted-foreground')}>
            {action.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={cn(
              'text-xs font-medium',
              isOverdue ? 'text-[hsl(var(--status-danger))]' : isToday ? 'text-[hsl(var(--status-warning))]' : 'text-muted-foreground'
            )}>
              {isToday ? "Aujourd'hui" : action.dueDate}
            </span>
            <span className={cn('h-1.5 w-1.5 rounded-full', priorityConfig[action.priority].dot)} />
          </div>
        </div>
        <Badge variant="outline" className="text-xs shrink-0">
          {categoryLabels[action.category]}
        </Badge>
      </div>
    );
  }

  return (
    <Card className={cn(
      'overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 animate-fade-in',
      isOverdue && action.status !== 'done' && 'border-l-4 border-l-[hsl(var(--status-danger))]',
      action.priority === 'high' && action.status !== 'done' && 'ring-1 ring-[hsl(var(--status-danger)/0.2)]'
    )}>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="flex items-start gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleToggleStatus}
                  disabled={!canComplete}
                  className={cn(
                    'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all mt-0.5',
                    action.status === 'done' 
                      ? 'border-[hsl(var(--status-success))] bg-[hsl(var(--status-success))] text-white shadow-sm' 
                      : canComplete
                        ? 'border-muted-foreground/40 hover:border-[hsl(var(--status-success))] hover:bg-[hsl(var(--status-success)/0.1)]'
                        : 'border-muted-foreground/20 cursor-not-allowed opacity-50'
                  )}
                >
                  {action.status === 'done' && <Check className="h-4 w-4" />}
                  {!canComplete && action.status !== 'done' && <Lock className="h-3 w-3 text-muted-foreground" />}
                </button>
              </TooltipTrigger>
              {!canComplete && (
                <TooltipContent>
                  <p>Vous n'avez pas la permission de modifier le statut</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <div>
            <h3 className={cn('font-semibold text-foreground', action.status === 'done' && 'line-through text-muted-foreground')}>
              {action.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{action.description}</p>
          </div>
        </div>
        {hasAnyAction && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-secondary">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover w-48">
              {canComplete && (
                <>
                  <DropdownMenuItem onClick={() => onStatusChange?.(action, 'todo')}>
                    <Clock className="mr-2 h-4 w-4" />
                    Marquer à faire
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange?.(action, 'in_progress')}>
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Marquer en cours
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange?.(action, 'done')}>
                    <Check className="mr-2 h-4 w-4" />
                    Marquer terminée
                  </DropdownMenuItem>
                </>
              )}
              {canEditAction && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onEdit?.(action)}>
                    Modifier
                  </DropdownMenuItem>
                </>
              )}
              {canDeleteAction && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onDelete?.(action)} className="text-destructive focus:text-destructive">
                    Supprimer
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={cn('font-medium', priorityConfig[action.priority].color)}>
            {priorityLabels[action.priority]}
          </Badge>
          <Badge variant="outline" className="bg-muted/50">
            {categoryLabels[action.category]}
          </Badge>
          <div className={cn('flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium', statusConfig[action.status].bg)}>
            <StatusIcon className={cn('h-3.5 w-3.5', statusConfig[action.status].color)} />
            <span className={statusConfig[action.status].color}>{statusLabels[action.status]}</span>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <User className="h-4 w-4" />
            <span className="font-medium">{action.assignee}</span>
          </div>
          <div className={cn(
            'flex items-center gap-1.5 font-medium',
            isOverdue && action.status !== 'done' && 'text-[hsl(var(--status-danger))]',
            isToday && action.status !== 'done' && 'text-[hsl(var(--status-warning))]',
            !isOverdue && !isToday && 'text-muted-foreground'
          )}>
            <Calendar className="h-4 w-4" />
            <span>{isToday ? "Aujourd'hui" : action.dueDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
