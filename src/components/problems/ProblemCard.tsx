import { AlertTriangle, Clock, CheckCircle, ArrowUpRight, MoreVertical, Lock } from 'lucide-react';
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
import { type Problem, categoryLabels, priorityLabels, problemStatusLabels } from '@/data/mockData';
import { usePermissions } from '@/hooks/usePermissions';

interface ProblemCardProps {
  problem: Problem;
  onStatusChange?: (problem: Problem, status: Problem['status']) => void;
  onEscalate?: (problem: Problem) => void;
  onEdit?: (problem: Problem) => void;
  onDelete?: (problem: Problem) => void;
}

const severityConfig = {
  low: { color: 'bg-secondary text-secondary-foreground', border: 'border-l-muted-foreground' },
  medium: { color: 'bg-[hsl(var(--status-warning)/0.15)] text-[hsl(var(--status-warning))]', border: 'border-l-[hsl(var(--status-warning))]' },
  high: { color: 'bg-[hsl(var(--status-danger)/0.15)] text-[hsl(var(--status-danger))]', border: 'border-l-[hsl(var(--status-danger))]' },
};

const statusConfig = {
  open: { icon: AlertTriangle, color: 'text-[hsl(var(--status-danger))]', bg: 'bg-[hsl(var(--status-danger)/0.1)]' },
  in_progress: { icon: Clock, color: 'text-[hsl(var(--status-warning))]', bg: 'bg-[hsl(var(--status-warning)/0.1)]' },
  resolved: { icon: CheckCircle, color: 'text-[hsl(var(--status-success))]', bg: 'bg-[hsl(var(--status-success)/0.1)]' },
};

export function ProblemCard({ problem, onStatusChange, onEscalate, onEdit, onDelete }: ProblemCardProps) {
  const { hasPermission, canEdit, canDelete } = usePermissions();
  
  const canEditProblem = canEdit('problems');
  const canDeleteProblem = canDelete('problems');
  const canEscalate = hasPermission('escalate_problems');
  const hasAnyAction = canEditProblem || canDeleteProblem || canEscalate;

  const StatusIcon = statusConfig[problem.status].icon;

  return (
    <Card className={cn(
      'overflow-hidden border-l-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 animate-fade-in',
      severityConfig[problem.severity].border,
      problem.escalated && 'ring-1 ring-destructive/20',
      problem.severity === 'high' && problem.status !== 'resolved' && 'pulse-danger'
    )}>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="flex items-start gap-3">
          <div className={cn(
            'flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl shadow-sm',
            statusConfig[problem.status].bg
          )}>
            <StatusIcon className={cn('h-5 w-5', statusConfig[problem.status].color)} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground">{problem.title}</h3>
              {problem.escalated && (
                <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0 shadow-sm flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" />
                  Escaladé
                </Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{problem.description}</p>
          </div>
        </div>
        {hasAnyAction ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-secondary">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover w-48">
              {canEditProblem && (
                <>
                  <DropdownMenuItem onClick={() => onStatusChange?.(problem, 'open')}>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Marquer ouvert
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange?.(problem, 'in_progress')}>
                    <Clock className="mr-2 h-4 w-4" />
                    Marquer en cours
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange?.(problem, 'resolved')}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Marquer résolu
                  </DropdownMenuItem>
                </>
              )}
              {canEscalate && !problem.escalated && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onEscalate?.(problem)} className="text-destructive focus:text-destructive">
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Escalader
                  </DropdownMenuItem>
                </>
              )}
              {canEditProblem && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onEdit?.(problem)}>
                    Modifier
                  </DropdownMenuItem>
                </>
              )}
              {canDeleteProblem && (
                <DropdownMenuItem onClick={() => onDelete?.(problem)} className="text-destructive focus:text-destructive">
                  Supprimer
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-1 text-muted-foreground text-xs">
            <Lock className="h-3 w-3" />
            <span>Lecture seule</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={cn('font-medium', severityConfig[problem.severity].color)}>
            Gravité: {priorityLabels[problem.severity]}
          </Badge>
          <Badge variant="outline" className="bg-muted/50">
            {categoryLabels[problem.category]}
          </Badge>
          <div className={cn('flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium', statusConfig[problem.status].bg)}>
            <StatusIcon className={cn('h-3.5 w-3.5', statusConfig[problem.status].color)} />
            <span className={statusConfig[problem.status].color}>{problemStatusLabels[problem.status]}</span>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>Créé le <span className="font-medium text-foreground">{problem.createdAt}</span></span>
          {problem.resolvedAt && (
            <span className="text-[hsl(var(--status-success))] font-medium">Résolu le {problem.resolvedAt}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
