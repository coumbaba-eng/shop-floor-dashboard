import { Bell, Search, User, ChevronDown, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth, AppRole } from '@/contexts/AuthContext';

interface TopBarProps {
  title: string;
}

const roleLabels: Record<AppRole, string> = {
  admin: 'Administrateur',
  manager: 'Manager',
  team_leader: 'Chef d\'équipe',
  operator: 'Opérateur',
};

const roleColors: Record<AppRole, string> = {
  admin: 'bg-status-danger/20 text-status-danger',
  manager: 'bg-primary/20 text-primary',
  team_leader: 'bg-status-warning/20 text-status-warning',
  operator: 'bg-status-success/20 text-status-success',
};

export function TopBar({ title }: TopBarProps) {
  const navigate = useNavigate();
  const { user, profile, role, signOut } = useAuth();

  const displayName = profile?.first_name && profile?.last_name
    ? `${profile.first_name} ${profile.last_name}`
    : profile?.email || user?.email || 'Utilisateur';

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      </div>

      {/* Center section - Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            className="w-full pl-10 bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-accent"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-status-danger text-[10px] font-medium text-white">
            3
          </span>
        </Button>

        {/* Role Badge */}
        {role && (
          <Badge className={`${roleColors[role]} border-0 font-normal`}>
            {roleLabels[role]}
          </Badge>
        )}

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {profile?.first_name ? (
                  <span className="text-sm font-medium">
                    {profile.first_name[0]}{profile.last_name?.[0] || ''}
                  </span>
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>
              <span className="hidden md:inline font-medium max-w-32 truncate">{displayName}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{displayName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
