import { useState } from 'react';
import { FileText, Download, Calendar, Printer } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { KPICard } from '@/components/kpi/KPICard';
import { ActionCard } from '@/components/actions/ActionCard';
import {
  mockKPIs,
  mockActions,
  mockProblems,
  categoryLabels,
  type KPICategory,
} from '@/data/mockData';
import { cn } from '@/lib/utils';

export default function ReportsPage() {
  const [reportType, setReportType] = useState<'daily' | 'weekly'>('daily');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const filteredKPIs = selectedCategory === 'all'
    ? mockKPIs
    : mockKPIs.filter(k => k.category === selectedCategory);

  const kpiStats = {
    total: filteredKPIs.length,
    success: filteredKPIs.filter(k => k.status === 'success').length,
    warning: filteredKPIs.filter(k => k.status === 'warning').length,
    danger: filteredKPIs.filter(k => k.status === 'danger').length,
  };

  const actionStats = {
    total: mockActions.length,
    done: mockActions.filter(a => a.status === 'done').length,
    inProgress: mockActions.filter(a => a.status === 'in_progress').length,
  };

  const problemStats = {
    total: mockProblems.length,
    open: mockProblems.filter(p => p.status === 'open').length,
    resolved: mockProblems.filter(p => p.status === 'resolved').length,
  };

  const handleExportPDF = () => {
    // Simulation - dans une vraie app, cela déclencherait une génération PDF
    alert('Export PDF déclenché (simulation). Dans une version complète, cela génèrerait un fichier PDF.');
  };

  return (
    <MainLayout title="Rapports">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Tabs value={reportType} onValueChange={(v) => setReportType(v as 'daily' | 'weekly')}>
              <TabsList>
                <TabsTrigger value="daily">Rapport journalier</TabsTrigger>
                <TabsTrigger value="weekly">Rapport hebdomadaire</TabsTrigger>
              </TabsList>
            </Tabs>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px] bg-card">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">Toutes catégories</SelectItem>
                {(Object.keys(categoryLabels) as KPICategory[]).map(cat => (
                  <SelectItem key={cat} value={cat}>{categoryLabels[cat]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Printer className="h-4 w-4" />
              Imprimer
            </Button>
            <Button className="gap-2" onClick={handleExportPDF}>
              <Download className="h-4 w-4" />
              Exporter PDF
            </Button>
          </div>
        </div>

        {/* Report Preview */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8" />
                <div>
                  <CardTitle className="text-xl">
                    Rapport {reportType === 'daily' ? 'Journalier' : 'Hebdomadaire'}
                  </CardTitle>
                  <p className="text-sm text-primary-foreground/80">{today}</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-primary">
                Shop Floor Management
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Section 1: Résumé des KPIs */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-sm">1</span>
                Résumé des KPIs
              </h2>
              
              <div className="grid gap-4 md:grid-cols-4 mb-4">
                <div className="rounded-lg border p-4 text-center">
                  <p className="text-3xl font-bold text-foreground">{kpiStats.total}</p>
                  <p className="text-sm text-muted-foreground">Total KPIs</p>
                </div>
                <div className="rounded-lg border border-status-success bg-status-success-bg p-4 text-center">
                  <p className="text-3xl font-bold text-status-success">{kpiStats.success}</p>
                  <p className="text-sm text-status-success">Conformes</p>
                </div>
                <div className="rounded-lg border border-status-warning bg-status-warning-bg p-4 text-center">
                  <p className="text-3xl font-bold text-status-warning">{kpiStats.warning}</p>
                  <p className="text-sm text-status-warning">Attention</p>
                </div>
                <div className="rounded-lg border border-status-danger bg-status-danger-bg p-4 text-center">
                  <p className="text-3xl font-bold text-status-danger">{kpiStats.danger}</p>
                  <p className="text-sm text-status-danger">Critiques</p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {filteredKPIs.slice(0, 6).map(kpi => (
                  <KPICard key={kpi.id} kpi={kpi} compact />
                ))}
              </div>
            </section>

            <Separator className="my-6" />

            {/* Section 2: Actions */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-sm">2</span>
                Actions
              </h2>

              <div className="grid gap-4 md:grid-cols-3 mb-4">
                <div className="rounded-lg border p-4 text-center">
                  <p className="text-3xl font-bold text-foreground">{actionStats.total}</p>
                  <p className="text-sm text-muted-foreground">Total actions</p>
                </div>
                <div className="rounded-lg border border-status-warning bg-status-warning-bg p-4 text-center">
                  <p className="text-3xl font-bold text-status-warning">{actionStats.inProgress}</p>
                  <p className="text-sm text-status-warning">En cours</p>
                </div>
                <div className="rounded-lg border border-status-success bg-status-success-bg p-4 text-center">
                  <p className="text-3xl font-bold text-status-success">{actionStats.done}</p>
                  <p className="text-sm text-status-success">Terminées</p>
                </div>
              </div>

              <div className="space-y-2">
                {mockActions.slice(0, 4).map(action => (
                  <ActionCard key={action.id} action={action} compact />
                ))}
              </div>
            </section>

            <Separator className="my-6" />

            {/* Section 3: Problèmes */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-sm">3</span>
                Problèmes
              </h2>

              <div className="grid gap-4 md:grid-cols-3 mb-4">
                <div className="rounded-lg border p-4 text-center">
                  <p className="text-3xl font-bold text-foreground">{problemStats.total}</p>
                  <p className="text-sm text-muted-foreground">Total problèmes</p>
                </div>
                <div className="rounded-lg border border-status-danger bg-status-danger-bg p-4 text-center">
                  <p className="text-3xl font-bold text-status-danger">{problemStats.open}</p>
                  <p className="text-sm text-status-danger">Ouverts</p>
                </div>
                <div className="rounded-lg border border-status-success bg-status-success-bg p-4 text-center">
                  <p className="text-3xl font-bold text-status-success">{problemStats.resolved}</p>
                  <p className="text-sm text-status-success">Résolus</p>
                </div>
              </div>

              <div className="space-y-2">
                {mockProblems.slice(0, 3).map(problem => (
                  <div
                    key={problem.id}
                    className={cn(
                      'rounded-lg border p-3',
                      problem.status === 'open' && 'border-l-4 border-l-status-danger',
                      problem.status === 'in_progress' && 'border-l-4 border-l-status-warning',
                      problem.status === 'resolved' && 'border-l-4 border-l-status-success'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{problem.title}</h4>
                      <Badge variant="outline" className={cn(
                        problem.status === 'open' && 'bg-status-danger-bg text-status-danger',
                        problem.status === 'in_progress' && 'bg-status-warning-bg text-status-warning',
                        problem.status === 'resolved' && 'bg-status-success-bg text-status-success'
                      )}>
                        {problem.status === 'open' ? 'Ouvert' : problem.status === 'in_progress' ? 'En cours' : 'Résolu'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{problem.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <Separator className="my-6" />

            {/* Section 4: Avancement */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-sm">4</span>
                Avancement global
              </h2>

              <div className="rounded-lg border p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progression des objectifs</span>
                  <span className="text-sm font-bold text-accent">
                    {Math.round((kpiStats.success / kpiStats.total) * 100)}%
                  </span>
                </div>
                <div className="h-4 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-status-success transition-all"
                    style={{ width: `${(kpiStats.success / kpiStats.total) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {kpiStats.success} KPIs sur {kpiStats.total} atteignent leurs objectifs.
                </p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
