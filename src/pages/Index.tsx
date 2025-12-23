import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { CategoryOverview } from '@/components/kpi/CategoryOverview';
import { SummaryStats } from '@/components/dashboard/SummaryStats';
import { TodayPriorities } from '@/components/dashboard/TodayPriorities';
import { RecentProblems } from '@/components/dashboard/RecentProblems';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useKPIs, getKPIStatusColor, getKPITrendIcon } from '@/hooks/useKPIs';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const navigate = useNavigate();
  const { data: kpis, isLoading: kpisLoading } = useKPIs();

  const handleCategoryClick = (categoryCode: string) => {
    navigate(`/kpis?category=${categoryCode}`);
  };

  // Get critical and warning KPIs for quick display
  const criticalKPIs = kpis?.filter(k => k.status === 'red').slice(0, 3) || [];
  const warningKPIs = kpis?.filter(k => k.status === 'orange').slice(0, 3) || [];
  const highlightedKPIs = [...criticalKPIs, ...warningKPIs].slice(0, 4);

  const TrendIcon = ({ trend }: { trend: string | null }) => {
    const icon = getKPITrendIcon(trend);
    if (icon === 'up') return <TrendingUp className="h-4 w-4" />;
    if (icon === 'down') return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const statusColors = {
    success: 'bg-status-success',
    warning: 'bg-status-warning',
    danger: 'bg-status-danger',
  };

  return (
    <MainLayout title="Tableau de bord">
      <div className="space-y-6">
        {/* Summary Statistics */}
        <SummaryStats />

        {/* Category Overview */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Vue par catégorie</h2>
          <CategoryOverview onCategoryClick={handleCategoryClick} />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Today's Priorities */}
          <TodayPriorities />

          {/* Middle Column - Recent Problems */}
          <RecentProblems />

          {/* Right Column - Status Distribution */}
          <CategoryPieChart />
        </div>

        {/* KPIs requiring attention */}
        {kpisLoading ? (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">KPIs nécessitant attention</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-8 w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : highlightedKPIs.length > 0 ? (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">KPIs nécessitant attention</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {highlightedKPIs.map((kpi) => {
                const statusColor = getKPIStatusColor(kpi.status);
                return (
                  <Card 
                    key={kpi.id} 
                    className={cn(
                      'cursor-pointer transition-all hover:shadow-md',
                      kpi.status === 'red' && 'border-l-4 border-l-status-danger'
                    )}
                    onClick={() => navigate(`/kpis`)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm font-medium">{kpi.name}</CardTitle>
                        <Badge className={cn(statusColors[statusColor], 'text-white')}>
                          <TrendIcon trend={kpi.trend} />
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">{kpi.current_value}</span>
                        <span className="text-sm text-muted-foreground">/ {kpi.target_value} {kpi.unit}</span>
                      </div>
                      {kpi.category && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          {kpi.category.name}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </MainLayout>
  );
};

export default Index;
