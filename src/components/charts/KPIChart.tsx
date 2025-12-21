import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type KPI } from '@/data/mockData';

interface KPIChartProps {
  kpi: KPI;
  chartType?: 'line' | 'bar';
  showTarget?: boolean;
  height?: number;
}

export function KPIChart({ kpi, chartType = 'line', showTarget = true, height = 200 }: KPIChartProps) {
  const data = kpi.history.slice(-14).map((item) => ({
    date: new Date(item.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
    value: item.value,
    target: kpi.target,
  }));

  const minValue = Math.min(...kpi.history.map(h => h.value)) * 0.9;
  const maxValue = Math.max(...kpi.history.map(h => h.value), kpi.target) * 1.1;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{kpi.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          {chartType === 'line' ? (
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis
                domain={[minValue, maxValue]}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5 }}
                name="Valeur"
              />
              {showTarget && (
                <ReferenceLine
                  y={kpi.target}
                  stroke="hsl(var(--status-success))"
                  strokeDasharray="5 5"
                  label={{
                    value: `Objectif: ${kpi.target}`,
                    position: 'right',
                    fontSize: 10,
                    fill: 'hsl(var(--status-success))',
                  }}
                />
              )}
            </LineChart>
          ) : (
            <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis
                domain={[0, maxValue]}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Valeur" />
              {showTarget && (
                <ReferenceLine
                  y={kpi.target}
                  stroke="hsl(var(--status-success))"
                  strokeDasharray="5 5"
                />
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
