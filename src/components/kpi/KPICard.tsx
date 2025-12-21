import { TrendingUp, TrendingDown, Minus, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type KPI, categoryLabels } from '@/data/mockData';

interface KPICardProps {
  kpi: KPI;
  onEdit?: (kpi: KPI) => void;
  onDelete?: (kpi: KPI) => void;
  onViewHistory?: (kpi: KPI) => void;
  compact?: boolean;
}

const statusColors = {
  success: 'border-l-status-success',
  warning: 'border-l-status-warning',
  danger: 'border-l-status-danger',
};

const statusBg = {
  success: 'bg-status-success-bg',
  warning: 'bg-status-warning-bg',
  danger: 'bg-status-danger-bg',
};

const statusText = {
  success: 'text-status-success',
  warning: 'text-status-warning',
  danger: 'text-status-danger',
};

const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
  if (trend === 'up') return <TrendingUp className="h-4 w-4" />;
  if (trend === 'down') return <TrendingDown className="h-4 w-4" />;
  return <Minus className="h-4 w-4" />;
};

export function KPICard({ kpi, onEdit, onDelete, onViewHistory, compact = false }: KPICardProps) {
  const percentage = kpi.target !== 0 ? ((kpi.value / kpi.target) * 100).toFixed(0) : '100';
  const isOnTarget = kpi.status === 'success';

  if (compact) {
    return (
      <div className={cn(
        'flex items-center justify-between rounded-lg border-l-4 bg-card p-3',
        statusColors[kpi.status]
      )}>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">{kpi.name}</p>
          <p className="text-xs text-muted-foreground">{categoryLabels[kpi.category]}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className={cn('text-lg font-bold', statusText[kpi.status])}>
              {kpi.value}{kpi.unit}
            </p>
            <p className="text-xs text-muted-foreground">/ {kpi.target}{kpi.unit}</p>
          </div>
          <div className={cn(
            'flex items-center rounded-full px-2 py-1',
            kpi.trend === 'up' && 'text-status-success',
            kpi.trend === 'down' && 'text-status-danger',
            kpi.trend === 'stable' && 'text-muted-foreground'
          )}>
            <TrendIcon trend={kpi.trend} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={cn(
      'overflow-hidden border-l-4 transition-all duration-200 hover:shadow-md animate-fade-in',
      statusColors[kpi.status]
    )}>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{categoryLabels[kpi.category]}</p>
          <h3 className="text-base font-semibold text-foreground">{kpi.name}</h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem onClick={() => onViewHistory?.(kpi)}>Voir historique</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(kpi)}>Modifier</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete?.(kpi)} className="text-destructive">
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <p className={cn('text-3xl font-bold', statusText[kpi.status])}>
              {kpi.value}
              <span className="ml-1 text-sm font-normal text-muted-foreground">{kpi.unit}</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Objectif: {kpi.target}{kpi.unit}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className={cn(
              'flex items-center gap-1 rounded-full px-2 py-1 text-sm font-medium',
              kpi.trend === 'up' && 'bg-status-success-bg text-status-success',
              kpi.trend === 'down' && 'bg-status-danger-bg text-status-danger',
              kpi.trend === 'stable' && 'bg-secondary text-muted-foreground'
            )}>
              <TrendIcon trend={kpi.trend} />
              <span>{kpi.trend === 'up' ? 'Hausse' : kpi.trend === 'down' ? 'Baisse' : 'Stable'}</span>
            </div>
            <div className={cn(
              'rounded-full px-3 py-1 text-xs font-medium',
              statusBg[kpi.status],
              statusText[kpi.status]
            )}>
              {percentage}% de l'objectif
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              kpi.status === 'success' && 'bg-status-success',
              kpi.status === 'warning' && 'bg-status-warning',
              kpi.status === 'danger' && 'bg-status-danger'
            )}
            style={{ width: `${Math.min(parseFloat(percentage), 100)}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
