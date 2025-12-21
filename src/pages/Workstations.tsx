import { useState } from 'react';
import { Factory, Settings, AlertTriangle, CheckCircle, Wrench } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KPICard } from '@/components/kpi/KPICard';
import { KPIChart } from '@/components/charts/KPIChart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { cn } from '@/lib/utils';
import { mockWorkstations, mockKPIs, type Workstation } from '@/data/mockData';

const statusConfig = {
  operational: { label: 'Opérationnel', color: 'bg-status-success', icon: CheckCircle },
  maintenance: { label: 'Maintenance', color: 'bg-status-warning', icon: Wrench },
  down: { label: 'Arrêt', color: 'bg-status-danger', icon: AlertTriangle },
};

export default function WorkstationsPage() {
  const [selectedWorkstation, setSelectedWorkstation] = useState<Workstation | null>(null);

  // Comparison data
  const comparisonData = mockWorkstations.map(ws => ({
    name: ws.name.replace('Machine ', 'M-').replace("Ligne d'assemblage ", 'L-').replace('Poste de contrôle ', 'PC-'),
    disponibilité: 85 + Math.random() * 15,
    performance: 75 + Math.random() * 20,
    qualité: 90 + Math.random() * 10,
  }));

  const getWorkstationKPIs = (ws: Workstation) => {
    return mockKPIs.filter(kpi => ws.kpis.includes(kpi.id));
  };

  return (
    <MainLayout title="Postes / Machines">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-status-success-bg">
                <CheckCircle className="h-6 w-6 text-status-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockWorkstations.filter(w => w.status === 'operational').length}
                </p>
                <p className="text-sm text-muted-foreground">Opérationnels</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-status-warning-bg">
                <Wrench className="h-6 w-6 text-status-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockWorkstations.filter(w => w.status === 'maintenance').length}
                </p>
                <p className="text-sm text-muted-foreground">En maintenance</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-status-danger-bg">
                <AlertTriangle className="h-6 w-6 text-status-danger" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockWorkstations.filter(w => w.status === 'down').length}
                </p>
                <p className="text-sm text-muted-foreground">En arrêt</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList>
            <TabsTrigger value="list">Liste des postes</TabsTrigger>
            <TabsTrigger value="comparison">Comparaison</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {mockWorkstations.map((ws) => {
                const StatusIcon = statusConfig[ws.status].icon;
                const kpis = getWorkstationKPIs(ws);

                return (
                  <Card
                    key={ws.id}
                    className={cn(
                      'cursor-pointer transition-all hover:shadow-md',
                      selectedWorkstation?.id === ws.id && 'ring-2 ring-accent'
                    )}
                    onClick={() => setSelectedWorkstation(ws)}
                  >
                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'flex h-12 w-12 items-center justify-center rounded-xl',
                          ws.type === 'machine' ? 'bg-sfm-workstation/10' : 'bg-sfm-performance/10'
                        )}>
                          {ws.type === 'machine' ? (
                            <Settings className="h-6 w-6 text-sfm-workstation" />
                          ) : (
                            <Factory className="h-6 w-6 text-sfm-performance" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{ws.name}</h3>
                          <p className="text-sm text-muted-foreground capitalize">{ws.type}</p>
                        </div>
                      </div>
                      <Badge className={cn('gap-1', statusConfig[ws.status].color, 'text-white')}>
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig[ws.status].label}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      {kpis.length > 0 ? (
                        <div className="space-y-2">
                          {kpis.map(kpi => (
                            <KPICard key={kpi.id} kpi={kpi} compact />
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Aucun KPI associé</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Comparaison des performances</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      domain={[0, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`${value.toFixed(1)}%`]}
                    />
                    <Legend />
                    <Bar dataKey="disponibilité" name="Disponibilité" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="performance" name="Performance" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="qualité" name="Qualité" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Selected Workstation Details */}
        {selectedWorkstation && (
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Détails: {selectedWorkstation.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {getWorkstationKPIs(selectedWorkstation).map(kpi => (
                  <KPIChart key={kpi.id} kpi={kpi} height={200} />
                ))}
                {getWorkstationKPIs(selectedWorkstation).length === 0 && (
                  <p className="text-muted-foreground col-span-2 text-center py-8">
                    Aucun KPI associé à ce poste.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
