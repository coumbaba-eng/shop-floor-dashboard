import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Filter, Grid, List } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { KPICard } from '@/components/kpi/KPICard';
import { KPIChart } from '@/components/charts/KPIChart';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  mockKPIs,
  categoryLabels,
  type KPI,
  type KPICategory,
  type KPIStatus,
  type Frequency,
} from '@/data/mockData';

export default function KPIsPage() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') as KPICategory | null;
  
  const [kpis, setKpis] = useState<KPI[]>(mockKPIs);
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory || 'all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null);

  const filteredKPIs = useMemo(() => {
    return kpis.filter(kpi => {
      const matchesCategory = categoryFilter === 'all' || kpi.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || kpi.status === statusFilter;
      const matchesSearch = kpi.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [kpis, categoryFilter, statusFilter, searchQuery]);

  const handleDelete = (kpi: KPI) => {
    setKpis(prev => prev.filter(k => k.id !== kpi.id));
  };

  const handleViewHistory = (kpi: KPI) => {
    setSelectedKPI(kpi);
  };

  return (
    <MainLayout title="Gestion des KPIs">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 gap-3">
            <Input
              placeholder="Rechercher un KPI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px] bg-card">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">Toutes catégories</SelectItem>
                {(Object.keys(categoryLabels) as KPICategory[]).map(cat => (
                  <SelectItem key={cat} value={cat}>{categoryLabels[cat]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] bg-card">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="success">Conforme</SelectItem>
                <SelectItem value="warning">Attention</SelectItem>
                <SelectItem value="danger">Critique</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border bg-card p-1">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nouveau KPI
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card">
                <DialogHeader>
                  <DialogTitle>Créer un nouveau KPI</DialogTitle>
                  <DialogDescription>
                    Définissez les paramètres du nouveau KPI à suivre.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nom du KPI</Label>
                    <Input id="name" placeholder="Ex: Taux de productivité" />
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
                      <Label htmlFor="frequency">Fréquence</Label>
                      <Select>
                        <SelectTrigger className="bg-card">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          <SelectItem value="daily">Journalière</SelectItem>
                          <SelectItem value="weekly">Hebdomadaire</SelectItem>
                          <SelectItem value="monthly">Mensuelle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="target">Objectif</Label>
                      <Input id="target" type="number" placeholder="100" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="unit">Unité</Label>
                      <Input id="unit" placeholder="%, €, h..." />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={() => setIsCreateDialogOpen(false)}>
                    Créer le KPI
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground">
          {filteredKPIs.length} KPI{filteredKPIs.length > 1 ? 's' : ''} trouvé{filteredKPIs.length > 1 ? 's' : ''}
        </p>

        {/* KPI Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredKPIs.map((kpi) => (
              <KPICard
                key={kpi.id}
                kpi={kpi}
                onDelete={handleDelete}
                onViewHistory={handleViewHistory}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredKPIs.map((kpi) => (
              <KPICard
                key={kpi.id}
                kpi={kpi}
                compact
                onDelete={handleDelete}
                onViewHistory={handleViewHistory}
              />
            ))}
          </div>
        )}

        {/* KPI History Modal */}
        {selectedKPI && (
          <Dialog open={!!selectedKPI} onOpenChange={() => setSelectedKPI(null)}>
            <DialogContent className="bg-card max-w-2xl">
              <DialogHeader>
                <DialogTitle>Historique: {selectedKPI.name}</DialogTitle>
                <DialogDescription>
                  Évolution des 30 derniers jours
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Tabs defaultValue="line">
                  <TabsList className="mb-4">
                    <TabsTrigger value="line">Courbe</TabsTrigger>
                    <TabsTrigger value="bar">Histogramme</TabsTrigger>
                  </TabsList>
                  <TabsContent value="line">
                    <KPIChart kpi={selectedKPI} chartType="line" height={300} />
                  </TabsContent>
                  <TabsContent value="bar">
                    <KPIChart kpi={selectedKPI} chartType="bar" height={300} />
                  </TabsContent>
                </Tabs>
              </div>
              <DialogFooter>
                <Button onClick={() => setSelectedKPI(null)}>Fermer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </MainLayout>
  );
}
