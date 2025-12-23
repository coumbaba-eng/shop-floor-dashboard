import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Gauge,
  ListTodo,
  AlertTriangle,
  Factory,
  TrendingUp,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  CheckCircle,
  Truck,
  DollarSign,
  Users,
  Leaf,
  Cog,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuth, AppRole } from '@/contexts/AuthContext';
import { categoryLabels, type KPICategory } from '@/data/mockData';

interface NavItem {
  title: string;
  icon: React.ElementType;
  path: string;
  allowedRoles?: AppRole[];
}

const mainNavItems: NavItem[] = [
  { title: 'Tableau de bord', icon: LayoutDashboard, path: '/' },
  { title: 'KPIs', icon: Gauge, path: '/kpis' },
  { title: 'Actions', icon: ListTodo, path: '/actions' },
  { title: 'Problèmes', icon: AlertTriangle, path: '/problems' },
  { title: 'Postes / Machines', icon: Factory, path: '/workstations', allowedRoles: ['admin', 'manager', 'team_leader'] },
  { title: 'Tendances', icon: TrendingUp, path: '/trends' },
  { title: 'Rapports', icon: FileText, path: '/reports', allowedRoles: ['admin', 'manager'] },
];

const categoryIcons: Record<KPICategory, React.ElementType> = {
  security: Shield,
  quality: CheckCircle,
  delivery: Truck,
  cost: DollarSign,
  performance: TrendingUp,
  human: Users,
  environment: Leaf,
  workstation: Cog,
};

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { role } = useAuth();

  const filteredNavItems = mainNavItems.filter(item => {
    if (!item.allowedRoles) return true;
    if (!role) return false;
    return item.allowedRoles.includes(role);
  });

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className={cn(
          'flex h-16 items-center border-b border-sidebar-border px-4',
          collapsed ? 'justify-center' : 'justify-between'
        )}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                <Factory className="h-5 w-5 text-sidebar-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">SFM Pro</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    collapsed && 'justify-center px-2'
                  )}
                  title={collapsed ? item.title : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              );
            })}
          </nav>

          {!collapsed && (
            <>
              <Separator className="my-4 bg-sidebar-border" />
              
              <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                Catégories
              </div>
              
              <nav className="space-y-1">
                {(Object.keys(categoryLabels) as KPICategory[]).map((category) => {
                  const Icon = categoryIcons[category];
                  return (
                    <NavLink
                      key={category}
                      to={`/kpis?category=${category}`}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span>{categoryLabels[category]}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3">
          <NavLink
            to="/settings"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              collapsed && 'justify-center px-2'
            )}
            title={collapsed ? 'Paramètres' : undefined}
          >
            <Settings className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Paramètres</span>}
          </NavLink>
        </div>
      </div>
    </aside>
  );
}
