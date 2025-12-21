import { AlertTriangle, ArrowRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getOpenProblems, categoryLabels, priorityLabels, problemStatusLabels, type Problem } from '@/data/mockData';
import { Link } from 'react-router-dom';

const severityColors = {
  low: 'bg-secondary text-secondary-foreground',
  medium: 'bg-status-warning-bg text-status-warning',
  high: 'bg-status-danger-bg text-status-danger',
};

const statusColors = {
  open: 'bg-status-danger-bg text-status-danger',
  in_progress: 'bg-status-warning-bg text-status-warning',
  resolved: 'bg-status-success-bg text-status-success',
};

export function RecentProblems() {
  const problems = getOpenProblems();

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <AlertTriangle className="h-5 w-5 text-status-warning" />
          Problèmes ouverts
          <Badge variant="destructive" className="ml-2">
            {problems.length}
          </Badge>
        </CardTitle>
        <Link to="/problems">
          <Button variant="ghost" size="sm" className="gap-1 text-accent hover:text-accent/80">
            Voir tout
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-3 pr-4">
            {problems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Aucun problème ouvert</p>
              </div>
            ) : (
              problems.map((problem) => (
                <div
                  key={problem.id}
                  className={cn(
                    'rounded-lg border p-3 transition-all hover:shadow-sm',
                    problem.severity === 'high' && 'border-l-4 border-l-status-danger'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground">{problem.title}</h4>
                        {problem.escalated && (
                          <Badge variant="destructive" className="flex items-center gap-0.5 text-[10px]">
                            <ArrowUpRight className="h-3 w-3" />
                            Escaladé
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{problem.description}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className={severityColors[problem.severity]}>
                      {priorityLabels[problem.severity]}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {categoryLabels[problem.category]}
                    </Badge>
                    <Badge variant="outline" className={cn('text-xs', statusColors[problem.status])}>
                      {problemStatusLabels[problem.status]}
                    </Badge>
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
