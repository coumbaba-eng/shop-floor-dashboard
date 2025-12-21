// Types
export type KPICategory = 'security' | 'quality' | 'delivery' | 'cost' | 'performance' | 'human' | 'environment' | 'workstation';
export type KPIStatus = 'success' | 'warning' | 'danger';
export type KPITrend = 'up' | 'down' | 'stable';
export type Priority = 'low' | 'medium' | 'high';
export type ActionStatus = 'todo' | 'in_progress' | 'done';
export type ProblemStatus = 'open' | 'in_progress' | 'resolved';
export type UserRole = 'admin' | 'manager' | 'team_lead' | 'operator';
export type Frequency = 'daily' | 'weekly' | 'monthly';

export interface KPI {
  id: string;
  name: string;
  category: KPICategory;
  value: number;
  target: number;
  unit: string;
  status: KPIStatus;
  trend: KPITrend;
  frequency: Frequency;
  workstationId?: string;
  history: { date: string; value: number }[];
}

export interface Action {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: ActionStatus;
  category: KPICategory;
  dueDate: string;
  assignee: string;
  createdAt: string;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  category: KPICategory;
  severity: Priority;
  status: ProblemStatus;
  escalated: boolean;
  createdAt: string;
  resolvedAt?: string;
  workstationId?: string;
}

export interface Workstation {
  id: string;
  name: string;
  type: 'machine' | 'station';
  status: 'operational' | 'maintenance' | 'down';
  kpis: string[];
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

// Category Labels
export const categoryLabels: Record<KPICategory, string> = {
  security: 'Sécurité',
  quality: 'Qualité',
  delivery: 'Livraison',
  cost: 'Coût',
  performance: 'Performance',
  human: 'Humain',
  environment: 'Environnement',
  workstation: 'Poste',
};

export const categoryIcons: Record<KPICategory, string> = {
  security: 'Shield',
  quality: 'CheckCircle',
  delivery: 'Truck',
  cost: 'DollarSign',
  performance: 'TrendingUp',
  human: 'Users',
  environment: 'Leaf',
  workstation: 'Settings',
};

export const priorityLabels: Record<Priority, string> = {
  low: 'Faible',
  medium: 'Moyenne',
  high: 'Élevée',
};

export const statusLabels: Record<ActionStatus, string> = {
  todo: 'À faire',
  in_progress: 'En cours',
  done: 'Terminée',
};

export const problemStatusLabels: Record<ProblemStatus, string> = {
  open: 'Ouvert',
  in_progress: 'En cours',
  resolved: 'Résolu',
};

export const roleLabels: Record<UserRole, string> = {
  admin: 'Administrateur',
  manager: 'Manager',
  team_lead: "Chef d'équipe",
  operator: 'Opérateur',
};

// Generate history data
const generateHistory = (baseValue: number, days: number = 30): { date: string; value: number }[] => {
  const history = [];
  const today = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const variance = (Math.random() - 0.5) * baseValue * 0.2;
    history.push({
      date: date.toISOString().split('T')[0],
      value: Math.round((baseValue + variance) * 100) / 100,
    });
  }
  return history;
};

// Mock KPIs
export const mockKPIs: KPI[] = [
  // Security
  { id: 'kpi-1', name: 'Incidents sécurité', category: 'security', value: 0, target: 0, unit: '', status: 'success', trend: 'stable', frequency: 'daily', history: generateHistory(0.5) },
  { id: 'kpi-2', name: 'Jours sans accident', category: 'security', value: 127, target: 100, unit: 'jours', status: 'success', trend: 'up', frequency: 'daily', history: generateHistory(120) },
  
  // Quality
  { id: 'kpi-3', name: 'Taux de rebut', category: 'quality', value: 2.3, target: 2, unit: '%', status: 'warning', trend: 'down', frequency: 'daily', history: generateHistory(2.5) },
  { id: 'kpi-4', name: 'Taux de conformité', category: 'quality', value: 98.5, target: 99, unit: '%', status: 'warning', trend: 'up', frequency: 'daily', history: generateHistory(98) },
  { id: 'kpi-5', name: 'Réclamations client', category: 'quality', value: 3, target: 2, unit: '', status: 'danger', trend: 'up', frequency: 'weekly', history: generateHistory(2.5) },
  
  // Delivery
  { id: 'kpi-6', name: 'Taux de livraison à temps', category: 'delivery', value: 96.2, target: 95, unit: '%', status: 'success', trend: 'up', frequency: 'daily', history: generateHistory(95) },
  { id: 'kpi-7', name: 'Délai moyen de production', category: 'delivery', value: 4.2, target: 4, unit: 'h', status: 'warning', trend: 'stable', frequency: 'daily', history: generateHistory(4.1) },
  
  // Cost
  { id: 'kpi-8', name: 'Coût par unité', category: 'cost', value: 12.5, target: 12, unit: '€', status: 'warning', trend: 'down', frequency: 'weekly', history: generateHistory(12.8) },
  { id: 'kpi-9', name: 'Consommation énergie', category: 'cost', value: 850, target: 900, unit: 'kWh', status: 'success', trend: 'down', frequency: 'daily', history: generateHistory(870) },
  
  // Performance
  { id: 'kpi-10', name: 'TRS (OEE)', category: 'performance', value: 85.3, target: 85, unit: '%', status: 'success', trend: 'up', frequency: 'daily', history: generateHistory(84) },
  { id: 'kpi-11', name: 'Productivité', category: 'performance', value: 112, target: 100, unit: '%', status: 'success', trend: 'up', frequency: 'daily', history: generateHistory(108) },
  { id: 'kpi-12', name: 'Temps de cycle', category: 'performance', value: 45, target: 42, unit: 's', status: 'danger', trend: 'up', frequency: 'daily', history: generateHistory(44) },
  
  // Human
  { id: 'kpi-13', name: 'Taux présence', category: 'human', value: 94.5, target: 95, unit: '%', status: 'warning', trend: 'stable', frequency: 'daily', history: generateHistory(94) },
  { id: 'kpi-14', name: 'Heures formation', category: 'human', value: 24, target: 20, unit: 'h', status: 'success', trend: 'up', frequency: 'monthly', history: generateHistory(22) },
  
  // Environment
  { id: 'kpi-15', name: 'Déchets recyclés', category: 'environment', value: 78, target: 80, unit: '%', status: 'warning', trend: 'up', frequency: 'weekly', history: generateHistory(75) },
  { id: 'kpi-16', name: 'Émissions CO2', category: 'environment', value: 42, target: 45, unit: 't', status: 'success', trend: 'down', frequency: 'monthly', history: generateHistory(44) },
  
  // Workstation
  { id: 'kpi-17', name: 'Disponibilité machines', category: 'workstation', value: 92, target: 90, unit: '%', status: 'success', trend: 'stable', frequency: 'daily', workstationId: 'ws-1', history: generateHistory(91) },
  { id: 'kpi-18', name: 'MTBF', category: 'workstation', value: 156, target: 150, unit: 'h', status: 'success', trend: 'up', frequency: 'weekly', workstationId: 'ws-1', history: generateHistory(152) },
  { id: 'kpi-19', name: 'MTTR', category: 'workstation', value: 2.5, target: 2, unit: 'h', status: 'danger', trend: 'stable', frequency: 'weekly', workstationId: 'ws-2', history: generateHistory(2.3) },
];

// Mock Actions
export const mockActions: Action[] = [
  { id: 'act-1', title: 'Calibrer capteur ligne 3', description: 'Recalibrer le capteur de température de la ligne 3 suite à dérive constatée', priority: 'high', status: 'todo', category: 'quality', dueDate: new Date().toISOString().split('T')[0], assignee: 'Martin D.', createdAt: '2024-01-15' },
  { id: 'act-2', title: 'Formation sécurité équipe B', description: 'Session de rappel des procédures de sécurité pour l\'équipe B', priority: 'high', status: 'in_progress', category: 'security', dueDate: new Date().toISOString().split('T')[0], assignee: 'Sophie L.', createdAt: '2024-01-14' },
  { id: 'act-3', title: 'Maintenance préventive M-102', description: 'Maintenance préventive mensuelle de la machine M-102', priority: 'medium', status: 'todo', category: 'workstation', dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], assignee: 'Pierre M.', createdAt: '2024-01-13' },
  { id: 'act-4', title: 'Optimiser flux logistique', description: 'Réorganiser le flux de pièces entre les postes 4 et 5', priority: 'low', status: 'in_progress', category: 'delivery', dueDate: '2024-01-25', assignee: 'Julie R.', createdAt: '2024-01-10' },
  { id: 'act-5', title: 'Analyser rebuts semaine 2', description: 'Analyse des causes racines des rebuts de la semaine 2', priority: 'high', status: 'done', category: 'quality', dueDate: '2024-01-18', assignee: 'Marc T.', createdAt: '2024-01-12' },
  { id: 'act-6', title: 'Mise à jour documentation', description: 'Mettre à jour les fiches de poste suite aux modifications process', priority: 'low', status: 'todo', category: 'human', dueDate: '2024-01-30', assignee: 'Anne B.', createdAt: '2024-01-16' },
  { id: 'act-7', title: 'Tri déchets zone stockage', description: 'Réorganiser le tri sélectif dans la zone de stockage', priority: 'medium', status: 'todo', category: 'environment', dueDate: '2024-01-22', assignee: 'Lucas G.', createdAt: '2024-01-14' },
  { id: 'act-8', title: 'Révision budget Q1', description: 'Préparer la révision budgétaire du premier trimestre', priority: 'medium', status: 'in_progress', category: 'cost', dueDate: '2024-01-28', assignee: 'Claire H.', createdAt: '2024-01-11' },
];

// Mock Problems
export const mockProblems: Problem[] = [
  { id: 'prob-1', title: 'Fuite hydraulique M-101', description: 'Fuite détectée sur le circuit hydraulique principal de la machine M-101', category: 'workstation', severity: 'high', status: 'in_progress', escalated: true, createdAt: '2024-01-17', workstationId: 'ws-1' },
  { id: 'prob-2', title: 'Non-conformité lot #4521', description: 'Lot #4521 présente un taux de défauts supérieur aux tolérances', category: 'quality', severity: 'high', status: 'open', escalated: false, createdAt: '2024-01-18' },
  { id: 'prob-3', title: 'Retard approvisionnement', description: 'Retard de livraison des composants XR-450 impactant la production', category: 'delivery', severity: 'medium', status: 'in_progress', escalated: false, createdAt: '2024-01-16' },
  { id: 'prob-4', title: 'EPI manquants vestiaires', description: 'Rupture de stock de gants et lunettes de protection dans les vestiaires', category: 'security', severity: 'high', status: 'resolved', escalated: false, createdAt: '2024-01-15', resolvedAt: '2024-01-17' },
  { id: 'prob-5', title: 'Dépassement consommation', description: 'Consommation électrique anormalement élevée sur la ligne 2', category: 'cost', severity: 'medium', status: 'open', escalated: false, createdAt: '2024-01-18', workstationId: 'ws-3' },
  { id: 'prob-6', title: 'Absentéisme équipe nuit', description: 'Taux d\'absentéisme élevé sur l\'équipe de nuit cette semaine', category: 'human', severity: 'medium', status: 'in_progress', escalated: true, createdAt: '2024-01-17' },
];

// Mock Workstations
export const mockWorkstations: Workstation[] = [
  { id: 'ws-1', name: 'Machine M-101', type: 'machine', status: 'operational', kpis: ['kpi-17', 'kpi-18'] },
  { id: 'ws-2', name: 'Machine M-102', type: 'machine', status: 'maintenance', kpis: ['kpi-19'] },
  { id: 'ws-3', name: 'Ligne d\'assemblage L1', type: 'station', status: 'operational', kpis: [] },
  { id: 'ws-4', name: 'Poste de contrôle PC-1', type: 'station', status: 'operational', kpis: [] },
  { id: 'ws-5', name: 'Machine M-103', type: 'machine', status: 'down', kpis: [] },
];

// Mock Users
export const mockUsers: User[] = [
  { id: 'user-1', name: 'Jean Dupont', role: 'admin' },
  { id: 'user-2', name: 'Marie Martin', role: 'manager' },
  { id: 'user-3', name: 'Pierre Bernard', role: 'team_lead' },
  { id: 'user-4', name: 'Sophie Petit', role: 'operator' },
];

// Current user (simulated)
export const currentUser: User = mockUsers[1]; // Manager by default

// Helper functions
export const getKPIsByCategory = (category: KPICategory): KPI[] => {
  return mockKPIs.filter(kpi => kpi.category === category);
};

export const getTodayActions = (): Action[] => {
  const today = new Date().toISOString().split('T')[0];
  return mockActions.filter(action => action.dueDate === today || action.priority === 'high');
};

export const getOpenProblems = (): Problem[] => {
  return mockProblems.filter(problem => problem.status !== 'resolved');
};

export const getCategoryStats = (): { category: KPICategory; success: number; warning: number; danger: number }[] => {
  const categories: KPICategory[] = ['security', 'quality', 'delivery', 'cost', 'performance', 'human', 'environment', 'workstation'];
  
  return categories.map(category => {
    const kpis = getKPIsByCategory(category);
    return {
      category,
      success: kpis.filter(k => k.status === 'success').length,
      warning: kpis.filter(k => k.status === 'warning').length,
      danger: kpis.filter(k => k.status === 'danger').length,
    };
  });
};
