import { AlertTriangle, Clock, CheckCircle, ArrowUpRight, MoreVertical } from 'lucide-react';
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
import { type Problem, categoryLabels, priorityLabels, problemStatusLabels } from '@/data/mockData';

interface ProblemCardProps {
  problem: Problem;
  onStatusChange?: (problem: Problem, status: Problem['status']) => void;
  onEscalate?: (problem: Problem) => void;
  onEdit?: (problem: Problem) => void;
  onDelete?: (problem: Problem) => void;
}

const severityConfig = {
  low: { color: 'bg-secondary text-secondary-foreground', border: 'border-l-muted-foreground' },
  medium: { color: 'bg-status-warning-bg text-status-warning', border: 'border-l-status-warning' },
  high: { color: 'bg-status-danger-bg text-status-danger', border: 'border-l-status-danger' },
};

const statusConfig = {
  open: { icon: AlertTriangle, color: 'text-status-danger', bg: 'bg-status-danger-bg' },
  in_progress: { icon: Clock, color: 'text-status-warning', bg: 'bg-status-warning-bg' },
  resolved: { icon: CheckCircle, color: 'text-status-success', bg: 'bg-status-success-bg' },
};

export function ProblemCard({ problem, onStatusChange, onEscalate, onEdit, onDelete }: ProblemCardProps) {
  const StatusIcon = statusConfig[problem.status].icon;

  return (
    <Card className={cn(
      'overflow-hidden border-l-4 transition-all duration-200 hover:shadow-md animate-fade-in',
      severityConfig[problem.severity].border
    )}>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="flex items-start gap-3">
          <div className={cn(
            'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full',
            statusConfig[problem.status].bg
          )}>
            <StatusIcon className={cn('h-5 w-5', statusConfig[problem.status].color)} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{problem.title}</h3>
              {problem.escalated && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" />
                  Escaladé
                </Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{problem.description}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem onClick={() => onStatusChange?.(problem, 'open')}>Marquer ouvert</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange?.(problem, 'in_progress')}>Marquer en cours</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange?.(problem, 'resolved')}>Marquer résolu</DropdownMenuItem>
            {!problem.escalated && (
              <DropdownMenuItem onClick={() => onEscalate?.(problem)} className="text-status-danger">
                Escalader
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onEdit?.(problem)}>Modifier</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete?.(problem)} className="text-destructive">Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={severityConfig[problem.severity].color}>
            Gravité: {priorityLabels[problem.severity]}
          </Badge>
          <Badge variant="outline">
            {categoryLabels[problem.category]}
          </Badge>
          <div className={cn('flex items-center gap-1 rounded-full px-2 py-1 text-xs', statusConfig[problem.status].bg)}>
            <StatusIcon className={cn('h-3 w-3', statusConfig[problem.status].color)} />
            <span className={statusConfig[problem.status].color}>{problemStatusLabels[problem.status]}</span>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>Créé le {problem.createdAt}</span>
          {problem.resolvedAt && (
            <span className="text-status-success">Résolu le {problem.resolvedAt}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
