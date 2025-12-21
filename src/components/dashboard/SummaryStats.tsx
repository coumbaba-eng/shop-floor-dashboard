import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { mockKPIs, mockActions, mockProblems } from '@/data/mockData';

export function SummaryStats() {
  const kpiStats = {
    total: mockKPIs.length,
    success: mockKPIs.filter(k => k.status === 'success').length,
    warning: mockKPIs.filter(k => k.status === 'warning').length,
    danger: mockKPIs.filter(k => k.status === 'danger').length,
  };

  const actionStats = {
    total: mockActions.length,
    todo: mockActions.filter(a => a.status === 'todo').length,
    inProgress: mockActions.filter(a => a.status === 'in_progress').length,
    done: mockActions.filter(a => a.status === 'done').length,
  };

  const problemStats = {
    total: mockProblems.length,
    open: mockProblems.filter(p => p.status === 'open').length,
    inProgress: mockProblems.filter(p => p.status === 'in_progress').length,
    resolved: mockProblems.filter(p => p.status === 'resolved').length,
    escalated: mockProblems.filter(p => p.escalated).length,
  };

  const stats = [
    {
      title: 'KPIs conformes',
      value: kpiStats.success,
      total: kpiStats.total,
      icon: CheckCircle,
      color: 'text-status-success',
      bgColor: 'bg-status-success-bg',
      trend: 'up' as const,
      change: '+2',
    },
    {
      title: 'KPIs en alerte',
      value: kpiStats.warning + kpiStats.danger,
      total: kpiStats.total,
      icon: AlertTriangle,
      color: 'text-status-warning',
      bgColor: 'bg-status-warning-bg',
      trend: 'down' as const,
      change: '-1',
    },
    {
      title: 'Actions en cours',
      value: actionStats.inProgress,
      total: actionStats.total,
      icon: Clock,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      trend: 'stable' as const,
      change: '0',
    },
    {
      title: 'Problèmes ouverts',
      value: problemStats.open + problemStats.inProgress,
      total: problemStats.total,
      icon: AlertTriangle,
      color: 'text-status-danger',
      bgColor: 'bg-status-danger-bg',
      trend: 'up' as const,
      change: '+1',
    },
  ];

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={stat.title} className="overflow-hidden animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', stat.bgColor)}>
                <stat.icon className={cn('h-6 w-6', stat.color)} />
              </div>
              <div className={cn(
                'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
                stat.trend === 'up' && stat.title.includes('conforme') ? 'bg-status-success-bg text-status-success' : '',
                stat.trend === 'up' && !stat.title.includes('conforme') ? 'bg-status-danger-bg text-status-danger' : '',
                stat.trend === 'down' && stat.title.includes('alerte') ? 'bg-status-success-bg text-status-success' : '',
                stat.trend === 'down' && !stat.title.includes('alerte') ? 'bg-status-danger-bg text-status-danger' : '',
                stat.trend === 'stable' ? 'bg-secondary text-muted-foreground' : ''
              )}>
                <TrendIcon trend={stat.trend} />
                <span>{stat.change}</span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
              <p className="mt-1 text-3xl font-bold text-foreground">
                {stat.value}
                <span className="ml-1 text-sm font-normal text-muted-foreground">/ {stat.total}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
