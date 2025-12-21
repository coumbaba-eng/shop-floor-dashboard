import {
  Shield,
  CheckCircle,
  Truck,
  DollarSign,
  TrendingUp,
  Users,
  Leaf,
  Cog,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { type KPICategory, categoryLabels, getKPIsByCategory } from '@/data/mockData';

const categoryConfig: Record<KPICategory, { icon: React.ElementType; color: string; bgColor: string }> = {
  security: { icon: Shield, color: 'text-sfm-security', bgColor: 'bg-sfm-security/10' },
  quality: { icon: CheckCircle, color: 'text-sfm-quality', bgColor: 'bg-sfm-quality/10' },
  delivery: { icon: Truck, color: 'text-sfm-delivery', bgColor: 'bg-sfm-delivery/10' },
  cost: { icon: DollarSign, color: 'text-sfm-cost', bgColor: 'bg-sfm-cost/10' },
  performance: { icon: TrendingUp, color: 'text-sfm-performance', bgColor: 'bg-sfm-performance/10' },
  human: { icon: Users, color: 'text-sfm-human', bgColor: 'bg-sfm-human/10' },
  environment: { icon: Leaf, color: 'text-sfm-environment', bgColor: 'bg-sfm-environment/10' },
  workstation: { icon: Cog, color: 'text-sfm-workstation', bgColor: 'bg-sfm-workstation/10' },
};

interface CategoryOverviewProps {
  onCategoryClick?: (category: KPICategory) => void;
}

export function CategoryOverview({ onCategoryClick }: CategoryOverviewProps) {
  const categories = Object.keys(categoryLabels) as KPICategory[];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
      {categories.map((category, index) => {
        const config = categoryConfig[category];
        const Icon = config.icon;
        const kpis = getKPIsByCategory(category);
        const successCount = kpis.filter(k => k.status === 'success').length;
        const warningCount = kpis.filter(k => k.status === 'warning').length;
        const dangerCount = kpis.filter(k => k.status === 'danger').length;

        return (
          <Card
            key={category}
            className={cn(
              'cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 animate-slide-up',
              config.bgColor
            )}
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => onCategoryClick?.(category)}
          >
            <CardContent className="p-4">
              <div className={cn('mb-3 flex h-10 w-10 items-center justify-center rounded-lg', config.bgColor)}>
                <Icon className={cn('h-5 w-5', config.color)} />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{categoryLabels[category]}</h3>
              <div className="mt-2 flex items-center gap-1">
                {successCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-status-success text-[10px] font-bold text-white">
                    {successCount}
                  </span>
                )}
                {warningCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-status-warning text-[10px] font-bold text-white">
                    {warningCount}
                  </span>
                )}
                {dangerCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-status-danger text-[10px] font-bold text-white">
                    {dangerCount}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
