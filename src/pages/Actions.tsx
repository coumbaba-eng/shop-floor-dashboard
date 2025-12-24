import { useState, useMemo } from 'react';
import { Plus, Lock } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ActionCard } from '@/components/actions/ActionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  mockActions,
  categoryLabels,
  priorityLabels,
  statusLabels,
  type Action,
  type KPICategory,
  type Priority,
  type ActionStatus,
} from '@/data/mockData';
import { usePermissions, roleLabels } from '@/hooks/usePermissions';
import { useAuth } from '@/contexts/AuthContext';

export default function ActionsPage() {
  const { role } = useAuth();
  const { canCreate, canEdit, canDelete, hasPermission } = usePermissions();
  
  const [actions, setActions] = useState<Action[]>(mockActions);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const canCreateAction = canCreate('actions');
  const canEditActions = canEdit('actions');
  const canDeleteActions = canDelete('actions');
  const canCompleteActions = hasPermission('complete_actions');

  const filteredActions = useMemo(() => {
    return actions.filter(action => {
      const matchesCategory = categoryFilter === 'all' || action.category === categoryFilter;
      const matchesPriority = priorityFilter === 'all' || action.priority === priorityFilter;
      const matchesStatus = statusFilter === 'all' || action.status === statusFilter;
      const matchesSearch = action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           action.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesPriority && matchesStatus && matchesSearch;
    });
  }, [actions, categoryFilter, priorityFilter, statusFilter, searchQuery]);

  const handleStatusChange = (action: Action, status: ActionStatus) => {
    if (!canCompleteActions && !canEditActions) return;
    setActions(prev => prev.map(a => a.id === action.id ? { ...a, status } : a));
  };

  const handleDelete = (action: Action) => {
    if (!canDeleteActions) return;
    setActions(prev => prev.filter(a => a.id !== action.id));
  };

  const todoActions = filteredActions.filter(a => a.status === 'todo');
  const inProgressActions = filteredActions.filter(a => a.status === 'in_progress');
  const doneActions = filteredActions.filter(a => a.status === 'done');

  return (
    <MainLayout title="Gestion des actions">
      <div className="space-y-6">
        {/* Permission Banner */}
        {!canEditActions && (
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 border border-border/50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Mode consultation</p>
              <p className="text-sm text-muted-foreground">
                En tant que <span className="font-medium">{role ? roleLabels[role] : 'utilisateur'}</span>, vous pouvez 
                {canCompleteActions ? ' marquer les actions comme terminées' : ' uniquement consulter les actions'}.
              </p>
            </div>
          </div>
        )}

        {/* Header Actions */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-wrap gap-3">
            <Input
              placeholder="Rechercher une action..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs bg-card"
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px] bg-card">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">Toutes</SelectItem>
                {(Object.keys(categoryLabels) as KPICategory[]).map(cat => (
                  <SelectItem key={cat} value={cat}>{categoryLabels[cat]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[140px] bg-card">
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">Toutes</SelectItem>
                {(Object.keys(priorityLabels) as Priority[]).map(p => (
                  <SelectItem key={p} value={p}>{priorityLabels[p]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-card">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">Tous</SelectItem>
                {(Object.keys(statusLabels) as ActionStatus[]).map(s => (
                  <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {canCreateAction ? (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-md hover:shadow-lg transition-all">
                  <Plus className="h-4 w-4" />
                  Nouvelle action
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card">
                <DialogHeader>
                  <DialogTitle>Créer une nouvelle action</DialogTitle>
                  <DialogDescription>
                    Définissez les détails de l'action à réaliser.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Titre</Label>
                    <Input id="title" placeholder="Ex: Calibrer le capteur" className="bg-secondary/30" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Décrivez l'action à réaliser..." className="bg-secondary/30" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="category">Catégorie</Label>
                      <Select>
                        <SelectTrigger className="bg-secondary/30">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {(Object.keys(categoryLabels) as KPICategory[]).map(cat => (
                            <SelectItem key={cat} value={cat}>{categoryLabels[cat]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priorité</Label>
                      <Select>
                        <SelectTrigger className="bg-secondary/30">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {(Object.keys(priorityLabels) as Priority[]).map(p => (
                            <SelectItem key={p} value={p}>{priorityLabels[p]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="dueDate">Date d'échéance</Label>
                      <Input id="dueDate" type="date" className="bg-secondary/30" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="assignee">Responsable</Label>
                      <Input id="assignee" placeholder="Nom du responsable" className="bg-secondary/30" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={() => setIsCreateDialogOpen(false)} className="shadow-sm">
                    Créer l'action
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="gap-2 opacity-50 cursor-not-allowed" disabled>
                    <Lock className="h-4 w-4" />
                    Nouvelle action
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Vous n'avez pas la permission de créer des actions</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {filteredActions.length} action{filteredActions.length > 1 ? 's' : ''} trouvée{filteredActions.length > 1 ? 's' : ''}
          </p>
          {(categoryFilter !== 'all' || priorityFilter !== 'all' || statusFilter !== 'all') && (
            <Badge variant="secondary" className="text-xs">
              Filtré
            </Badge>
          )}
        </div>

        {/* Kanban View */}
        <Tabs defaultValue="kanban" className="w-full">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="kanban" className="data-[state=active]:bg-card data-[state=active]:shadow-sm">Kanban</TabsTrigger>
            <TabsTrigger value="list" className="data-[state=active]:bg-card data-[state=active]:shadow-sm">Liste</TabsTrigger>
          </TabsList>
          
          <TabsContent value="kanban" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* To Do Column */}
              <div className="rounded-2xl bg-secondary/30 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">À faire</h3>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                    {todoActions.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {todoActions.map((action, index) => (
                    <div key={action.id} className={`animate-slide-up stagger-${Math.min(index + 1, 6)}`}>
                      <ActionCard
                        action={action}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                      />
                    </div>
                  ))}
                  {todoActions.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-8">Aucune action à faire</p>
                  )}
                </div>
              </div>

              {/* In Progress Column */}
              <div className="rounded-2xl bg-[hsl(var(--status-warning)/0.08)] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">En cours</h3>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(var(--status-warning)/0.2)] text-xs font-semibold text-[hsl(var(--status-warning))]">
                    {inProgressActions.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {inProgressActions.map((action, index) => (
                    <div key={action.id} className={`animate-slide-up stagger-${Math.min(index + 1, 6)}`}>
                      <ActionCard
                        action={action}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                      />
                    </div>
                  ))}
                  {inProgressActions.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-8">Aucune action en cours</p>
                  )}
                </div>
              </div>

              {/* Done Column */}
              <div className="rounded-2xl bg-[hsl(var(--status-success)/0.08)] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Terminées</h3>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(var(--status-success)/0.2)] text-xs font-semibold text-[hsl(var(--status-success))]">
                    {doneActions.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {doneActions.map((action, index) => (
                    <div key={action.id} className={`animate-slide-up stagger-${Math.min(index + 1, 6)}`}>
                      <ActionCard
                        action={action}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                      />
                    </div>
                  ))}
                  {doneActions.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-8">Aucune action terminée</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            <div className="space-y-3">
              {filteredActions.map((action, index) => (
                <div key={action.id} className={`animate-slide-up stagger-${Math.min(index + 1, 6)}`}>
                  <ActionCard
                    action={action}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
              {filteredActions.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg font-medium text-foreground">Aucune action trouvée</p>
                  <p className="text-muted-foreground">Modifiez vos filtres pour voir plus de résultats</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
