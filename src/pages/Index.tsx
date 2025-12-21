import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { CategoryOverview } from '@/components/kpi/CategoryOverview';
import { SummaryStats } from '@/components/dashboard/SummaryStats';
import { TodayPriorities } from '@/components/dashboard/TodayPriorities';
import { RecentProblems } from '@/components/dashboard/RecentProblems';
import { KPICard } from '@/components/kpi/KPICard';
import { KPIChart } from '@/components/charts/KPIChart';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { mockKPIs, type KPICategory } from '@/data/mockData';

const Index = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category: KPICategory) => {
    navigate(`/kpis?category=${category}`);
  };

  // Get critical and warning KPIs for quick display
  const criticalKPIs = mockKPIs.filter(k => k.status === 'danger').slice(0, 3);
  const warningKPIs = mockKPIs.filter(k => k.status === 'warning').slice(0, 3);
  const highlightedKPIs = [...criticalKPIs, ...warningKPIs].slice(0, 4);

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
        {highlightedKPIs.length > 0 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">KPIs nécessitant attention</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {highlightedKPIs.map((kpi) => (
                <KPICard key={kpi.id} kpi={kpi} />
              ))}
            </div>
          </div>
        )}

        {/* Charts Grid */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Tendances récentes</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockKPIs.slice(0, 3).map((kpi) => (
              <KPIChart key={kpi.id} kpi={kpi} />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
