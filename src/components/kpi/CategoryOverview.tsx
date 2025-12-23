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
import { Skeleton } from '@/components/ui/skeleton';
import { useCategoryStats } from '@/hooks/useDashboardStats';

const iconMap: Record<string, React.ElementType> = {
  S: Shield,
  Q: CheckCircle,
  L: Truck,
  C: DollarSign,
  P: TrendingUp,
  H: Users,
  E: Leaf,
  W: Cog,
};

interface CategoryOverviewProps {
  onCategoryClick?: (categoryCode: string) => void;
}

export function CategoryOverview({ onCategoryClick }: CategoryOverviewProps) {
  const { data: categories, isLoading } = useCategoryStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-10 w-10 rounded-lg mb-3" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-16 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
      {categories?.map((category, index) => {
        const Icon = iconMap[category.code] || Cog;

        return (
          <Card
            key={category.id}
            className={cn(
              'cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 animate-slide-up'
            )}
            style={{ 
              animationDelay: `${index * 50}ms`,
              backgroundColor: `${category.color}10`,
            }}
            onClick={() => onCategoryClick?.(category.code)}
          >
            <CardContent className="p-4">
              <div 
                className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <Icon className="h-5 w-5" style={{ color: category.color }} />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{category.name}</h3>
              <div className="mt-2 flex items-center gap-1">
                {category.success > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-status-success text-[10px] font-bold text-white">
                    {category.success}
                  </span>
                )}
                {category.warning > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-status-warning text-[10px] font-bold text-white">
                    {category.warning}
                  </span>
                )}
                {category.danger > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-status-danger text-[10px] font-bold text-white">
                    {category.danger}
                  </span>
                )}
                {category.total === 0 && (
                  <span className="text-xs text-muted-foreground">Aucun KPI</span>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
