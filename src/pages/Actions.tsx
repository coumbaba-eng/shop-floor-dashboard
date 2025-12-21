import { useState, useMemo } from 'react';
import { Plus, Filter } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ActionCard } from '@/components/actions/ActionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export default function ActionsPage() {
  const [actions, setActions] = useState<Action[]>(mockActions);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

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
    setActions(prev => prev.map(a => a.id === action.id ? { ...a, status } : a));
  };

  const handleDelete = (action: Action) => {
    setActions(prev => prev.filter(a => a.id !== action.id));
  };

  const todoActions = filteredActions.filter(a => a.status === 'todo');
  const inProgressActions = filteredActions.filter(a => a.status === 'in_progress');
  const doneActions = filteredActions.filter(a => a.status === 'done');

  return (
    <MainLayout title="Gestion des actions">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-wrap gap-3">
            <Input
              placeholder="Rechercher une action..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
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
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
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
                  <Input id="title" placeholder="Ex: Calibrer le capteur" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Décrivez l'action à réaliser..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Catégorie</Label>
                    <Select>
                      <SelectTrigger className="bg-card">
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
                      <SelectTrigger className="bg-card">
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
                    <Input id="dueDate" type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="assignee">Responsable</Label>
                    <Input id="assignee" placeholder="Nom du responsable" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>
                  Créer l'action
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Kanban View */}
        <Tabs defaultValue="kanban" className="w-full">
          <TabsList>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="list">Liste</TabsTrigger>
          </TabsList>
          
          <TabsContent value="kanban" className="mt-4">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* To Do Column */}
              <div className="rounded-xl bg-secondary/30 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">À faire</h3>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                    {todoActions.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {todoActions.map((action) => (
                    <ActionCard
                      key={action.id}
                      action={action}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>

              {/* In Progress Column */}
              <div className="rounded-xl bg-status-warning-bg/30 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">En cours</h3>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-status-warning-bg text-xs font-medium text-status-warning">
                    {inProgressActions.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {inProgressActions.map((action) => (
                    <ActionCard
                      key={action.id}
                      action={action}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>

              {/* Done Column */}
              <div className="rounded-xl bg-status-success-bg/30 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Terminées</h3>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-status-success-bg text-xs font-medium text-status-success">
                    {doneActions.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {doneActions.map((action) => (
                    <ActionCard
                      key={action.id}
                      action={action}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-4">
            <div className="space-y-3">
              {filteredActions.map((action) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
