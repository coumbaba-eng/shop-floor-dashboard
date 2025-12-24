import { useState, useMemo } from 'react';
import { Plus, AlertTriangle, ArrowUpRight, Lock } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProblemCard } from '@/components/problems/ProblemCard';
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
import { Card, CardContent } from '@/components/ui/card';
import {
  mockProblems,
  categoryLabels,
  priorityLabels,
  problemStatusLabels,
  type Problem,
  type KPICategory,
  type Priority,
  type ProblemStatus,
} from '@/data/mockData';
import { usePermissions, roleLabels } from '@/hooks/usePermissions';
import { useAuth } from '@/contexts/AuthContext';

export default function ProblemsPage() {
  const { role } = useAuth();
  const { canCreate, canEdit } = usePermissions();
  const canCreateProblem = canCreate('problems');
  const canEditProblem = canEdit('problems');
  
  const [problems, setProblems] = useState<Problem[]>(mockProblems);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredProblems = useMemo(() => {
    return problems.filter(problem => {
      const matchesCategory = categoryFilter === 'all' || problem.category === categoryFilter;
      const matchesSeverity = severityFilter === 'all' || problem.severity === severityFilter;
      const matchesStatus = statusFilter === 'all' || problem.status === statusFilter;
      const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           problem.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSeverity && matchesStatus && matchesSearch;
    });
  }, [problems, categoryFilter, severityFilter, statusFilter, searchQuery]);

  const handleStatusChange = (problem: Problem, status: ProblemStatus) => {
    setProblems(prev => prev.map(p => p.id === problem.id ? { ...p, status } : p));
  };

  const handleEscalate = (problem: Problem) => {
    setProblems(prev => prev.map(p => p.id === problem.id ? { ...p, escalated: true } : p));
  };

  const handleDelete = (problem: Problem) => {
    setProblems(prev => prev.filter(p => p.id !== problem.id));
  };

  // Stats
  const openCount = problems.filter(p => p.status === 'open').length;
  const inProgressCount = problems.filter(p => p.status === 'in_progress').length;
  const escalatedCount = problems.filter(p => p.escalated && p.status !== 'resolved').length;
  const highSeverityCount = problems.filter(p => p.severity === 'high' && p.status !== 'resolved').length;

  return (
    <MainLayout title="Gestion des problèmes">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-l-4 border-l-status-danger">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-status-danger" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{openCount}</p>
                  <p className="text-sm text-muted-foreground">Ouverts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-status-warning">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-status-warning" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{inProgressCount}</p>
                  <p className="text-sm text-muted-foreground">En cours</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-destructive">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <ArrowUpRight className="h-8 w-8 text-destructive" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{escalatedCount}</p>
                  <p className="text-sm text-muted-foreground">Escaladés</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-sfm-security">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-sfm-security" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{highSeverityCount}</p>
                  <p className="text-sm text-muted-foreground">Gravité élevée</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-wrap gap-3">
            <Input
              placeholder="Rechercher un problème..."
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
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[140px] bg-card">
                <SelectValue placeholder="Gravité" />
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
                {(Object.keys(problemStatusLabels) as ProblemStatus[]).map(s => (
                  <SelectItem key={s} value={s}>{problemStatusLabels[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" variant="destructive">
                <Plus className="h-4 w-4" />
                Déclarer un problème
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>Déclarer un nouveau problème</DialogTitle>
                <DialogDescription>
                  Décrivez le problème rencontré pour qu'il soit pris en charge.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Titre</Label>
                  <Input id="title" placeholder="Ex: Fuite hydraulique" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Décrivez le problème en détail..." rows={4} />
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
                    <Label htmlFor="severity">Gravité</Label>
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
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Annuler
                </Button>
                <Button variant="destructive" onClick={() => setIsCreateDialogOpen(false)}>
                  Déclarer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Problems List */}
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredProblems.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              onStatusChange={handleStatusChange}
              onEscalate={handleEscalate}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {filteredProblems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground">Aucun problème trouvé</p>
            <p className="text-muted-foreground">Modifiez vos filtres ou déclarez un nouveau problème.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
