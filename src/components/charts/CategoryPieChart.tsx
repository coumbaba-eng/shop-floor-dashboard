import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCategoryStats, categoryLabels } from '@/data/mockData';

const COLORS = {
  success: 'hsl(var(--status-success))',
  warning: 'hsl(var(--status-warning))',
  danger: 'hsl(var(--status-danger))',
};

export function CategoryPieChart() {
  const stats = getCategoryStats();
  
  const data = [
    { name: 'Conforme', value: stats.reduce((acc, s) => acc + s.success, 0), color: COLORS.success },
    { name: 'Attention', value: stats.reduce((acc, s) => acc + s.warning, 0), color: COLORS.warning },
    { name: 'Critique', value: stats.reduce((acc, s) => acc + s.danger, 0), color: COLORS.danger },
  ].filter(d => d.value > 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Répartition des statuts KPI</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              formatter={(value) => <span style={{ color: 'hsl(var(--foreground))' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
