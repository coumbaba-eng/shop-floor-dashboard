import { Calendar, User, MoreVertical, Check, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Action, categoryLabels, priorityLabels, statusLabels } from '@/data/mockData';

interface ActionCardProps {
  action: Action;
  onStatusChange?: (action: Action, status: Action['status']) => void;
  onEdit?: (action: Action) => void;
  onDelete?: (action: Action) => void;
  compact?: boolean;
}

const priorityConfig = {
  low: { color: 'bg-secondary text-secondary-foreground', dot: 'bg-muted-foreground' },
  medium: { color: 'bg-status-warning-bg text-status-warning', dot: 'bg-status-warning' },
  high: { color: 'bg-status-danger-bg text-status-danger', dot: 'bg-status-danger' },
};

const statusConfig = {
  todo: { icon: Clock, color: 'text-muted-foreground', bg: 'bg-secondary' },
  in_progress: { icon: AlertCircle, color: 'text-status-warning', bg: 'bg-status-warning-bg' },
  done: { icon: Check, color: 'text-status-success', bg: 'bg-status-success-bg' },
};

export function ActionCard({ action, onStatusChange, onEdit, onDelete, compact = false }: ActionCardProps) {
  const isOverdue = new Date(action.dueDate) < new Date() && action.status !== 'done';
  const isToday = action.dueDate === new Date().toISOString().split('T')[0];

  const StatusIcon = statusConfig[action.status].icon;

  if (compact) {
    return (
      <div className="flex items-center gap-3 rounded-lg border bg-card p-3 transition-all hover:shadow-sm">
        <button
          onClick={() => onStatusChange?.(action, action.status === 'done' ? 'todo' : 'done')}
          className={cn(
            'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors',
            action.status === 'done' ? 'border-status-success bg-status-success text-white' : 'border-muted-foreground hover:border-status-success'
          )}
        >
          {action.status === 'done' && <Check className="h-4 w-4" />}
        </button>
        <div className="flex-1 min-w-0">
          <p className={cn('text-sm font-medium truncate', action.status === 'done' && 'line-through text-muted-foreground')}>
            {action.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={cn('text-xs', isOverdue ? 'text-status-danger' : isToday ? 'text-status-warning' : 'text-muted-foreground')}>
              {action.dueDate}
            </span>
            <span className={cn('h-1.5 w-1.5 rounded-full', priorityConfig[action.priority].dot)} />
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {categoryLabels[action.category]}
        </Badge>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md animate-fade-in">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="flex items-start gap-3">
          <button
            onClick={() => onStatusChange?.(action, action.status === 'done' ? 'todo' : 'done')}
            className={cn(
              'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all mt-0.5',
              action.status === 'done' 
                ? 'border-status-success bg-status-success text-white' 
                : 'border-muted-foreground/50 hover:border-status-success hover:bg-status-success-bg'
            )}
          >
            {action.status === 'done' && <Check className="h-4 w-4" />}
          </button>
          <div>
            <h3 className={cn('font-semibold text-foreground', action.status === 'done' && 'line-through text-muted-foreground')}>
              {action.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{action.description}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem onClick={() => onStatusChange?.(action, 'todo')}>Marquer à faire</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange?.(action, 'in_progress')}>Marquer en cours</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange?.(action, 'done')}>Marquer terminée</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(action)}>Modifier</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete?.(action)} className="text-destructive">Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={priorityConfig[action.priority].color}>
            {priorityLabels[action.priority]}
          </Badge>
          <Badge variant="outline">
            {categoryLabels[action.category]}
          </Badge>
          <div className={cn('flex items-center gap-1 rounded-full px-2 py-1 text-xs', statusConfig[action.status].bg)}>
            <StatusIcon className={cn('h-3 w-3', statusConfig[action.status].color)} />
            <span className={statusConfig[action.status].color}>{statusLabels[action.status]}</span>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{action.assignee}</span>
          </div>
          <div className={cn('flex items-center gap-1', isOverdue && 'text-status-danger', isToday && 'text-status-warning')}>
            <Calendar className="h-4 w-4" />
            <span>{isToday ? "Aujourd'hui" : action.dueDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
