import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KPIChart } from '@/components/charts/KPIChart';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  mockKPIs,
  mockWorkstations,
  categoryLabels,
  type KPI,
  type KPICategory,
} from '@/data/mockData';

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export default function TrendsPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [periodFilter, setPeriodFilter] = useState<string>('30');
  const [workstationFilter, setWorkstationFilter] = useState<string>('all');

  const filteredKPIs = mockKPIs.filter(kpi => {
    const matchesCategory = categoryFilter === 'all' || kpi.category === categoryFilter;
    const matchesWorkstation = workstationFilter === 'all' || kpi.workstationId === workstationFilter;
    return matchesCategory && matchesWorkstation;
  });

  // Prepare multi-KPI comparison data
  const getComparisonData = () => {
    const days = parseInt(periodFilter);
    const kpis = filteredKPIs.slice(0, 5); // Max 5 KPIs for comparison

    if (kpis.length === 0) return [];

    const dates = kpis[0].history.slice(-days).map(h => h.date);
    
    return dates.map(date => {
      const dataPoint: Record<string, any> = {
        date: new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      };
      
      kpis.forEach(kpi => {
        const historyItem = kpi.history.find(h => h.date === date);
        dataPoint[kpi.name] = historyItem?.value || 0;
      });
      
      return dataPoint;
    });
  };

  const comparisonData = getComparisonData();
  const displayedKPIs = filteredKPIs.slice(0, 5);

  return (
    <MainLayout title="Tendances">
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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

          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-[180px] bg-card">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="7">7 derniers jours</SelectItem>
              <SelectItem value="14">14 derniers jours</SelectItem>
              <SelectItem value="30">30 derniers jours</SelectItem>
            </SelectContent>
          </Select>

          <Select value={workstationFilter} onValueChange={setWorkstationFilter}>
            <SelectTrigger className="w-[200px] bg-card">
              <SelectValue placeholder="Poste / Machine" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">Tous les postes</SelectItem>
              {mockWorkstations.map(ws => (
                <SelectItem key={ws.id} value={ws.id}>{ws.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="comparison" className="w-full">
          <TabsList>
            <TabsTrigger value="comparison">Comparaison</TabsTrigger>
            <TabsTrigger value="individual">Par KPI</TabsTrigger>
          </TabsList>

          <TabsContent value="comparison" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Évolution comparée des KPIs</CardTitle>
              </CardHeader>
              <CardContent>
                {displayedKPIs.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                      <Legend />
                      {displayedKPIs.map((kpi, index) => (
                        <Line
                          key={kpi.id}
                          type="monotone"
                          dataKey={kpi.name}
                          stroke={COLORS[index % COLORS.length]}
                          strokeWidth={2}
                          dot={{ fill: COLORS[index % COLORS.length], strokeWidth: 2, r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                    Aucun KPI à afficher. Modifiez les filtres.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="individual" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredKPIs.map((kpi) => (
                <KPIChart key={kpi.id} kpi={kpi} height={200} />
              ))}
            </div>
            {filteredKPIs.length === 0 && (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                Aucun KPI à afficher. Modifiez les filtres.
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Summary Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {displayedKPIs.slice(0, 4).map((kpi) => {
            const history = kpi.history.slice(-parseInt(periodFilter));
            const avg = history.reduce((acc, h) => acc + h.value, 0) / history.length;
            const min = Math.min(...history.map(h => h.value));
            const max = Math.max(...history.map(h => h.value));

            return (
              <Card key={kpi.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{kpi.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Min</p>
                      <p className="text-lg font-bold text-foreground">{min.toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Moy</p>
                      <p className="text-lg font-bold text-accent">{avg.toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Max</p>
                      <p className="text-lg font-bold text-foreground">{max.toFixed(1)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
