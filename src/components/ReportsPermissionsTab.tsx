import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  Users,
  Calendar,
  FileText,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react';

interface Report {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  enabled: boolean;
}

interface ReportsPermissionsTabProps {
  professionalId: number;
}

const defaultReports: Report[] = [
  {
    id: 'financial-overview',
    name: 'Visão Geral Financeira',
    description: 'Dashboard com receitas, despesas e lucro',
    category: 'Financeiro',
    icon: DollarSign,
    enabled: false,
  },
  {
    id: 'financial-detailed',
    name: 'Relatório Financeiro Detalhado',
    description: 'Análise completa de transações financeiras',
    category: 'Financeiro',
    icon: TrendingUp,
    enabled: false,
  },
  {
    id: 'patients-list',
    name: 'Lista de Pacientes',
    description: 'Visualizar todos os pacientes cadastrados',
    category: 'Pacientes',
    icon: Users,
    enabled: true,
  },
  {
    id: 'patients-statistics',
    name: 'Estatísticas de Pacientes',
    description: 'Gráficos e análises sobre a base de pacientes',
    category: 'Pacientes',
    icon: PieChart,
    enabled: true,
  },
  {
    id: 'appointments-calendar',
    name: 'Calendário de Agendamentos',
    description: 'Visão mensal e semanal de agendamentos',
    category: 'Agendamentos',
    icon: Calendar,
    enabled: true,
  },
  {
    id: 'appointments-analytics',
    name: 'Análise de Agendamentos',
    description: 'Métricas de taxa de ocupação e cancelamentos',
    category: 'Agendamentos',
    icon: BarChart3,
    enabled: true,
  },
  {
    id: 'evolution-records',
    name: 'Registros de Evolução',
    description: 'Histórico de evoluções dos pacientes',
    category: 'Fichas',
    icon: FileText,
    enabled: true,
  },
  {
    id: 'activity-log',
    name: 'Log de Atividades',
    description: 'Registro de todas as ações realizadas',
    category: 'Sistema',
    icon: Activity,
    enabled: false,
  },
];

export const ReportsPermissionsTab = ({ professionalId }: ReportsPermissionsTabProps) => {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    // Carregar do localStorage ou usar defaults
    const storageKey = `reports_professional_${professionalId}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      setReports(JSON.parse(stored));
    } else {
      setReports(defaultReports);
    }
  }, [professionalId]);

  const handleToggleReport = (reportId: string) => {
    const updatedReports = reports.map((report) =>
      report.id === reportId ? { ...report, enabled: !report.enabled } : report
    );
    setReports(updatedReports);
    
    // Salvar no localStorage
    const storageKey = `reports_professional_${professionalId}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedReports));
  };

  // Agrupar relatórios por categoria
  const categories = Array.from(new Set(reports.map(r => r.category)));
  const enabledCount = reports.filter(r => r.enabled).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2">Relatórios e Permissões</h3>
          <p className="text-sm text-muted-foreground">
            Configure quais relatórios o profissional pode visualizar
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {enabledCount} de {reports.length} habilitados
        </Badge>
      </div>

      {categories.map((category) => {
        const categoryReports = reports.filter(r => r.category === category);
        return (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <h4 className="font-semibold text-sm">{category}</h4>
              <div className="h-px bg-border flex-1" />
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {categoryReports.map((report) => {
                const Icon = report.icon;
                return (
                  <Card
                    key={report.id}
                    className={`transition-all ${report.enabled ? 'border-primary/50' : ''}`}
                  >
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            report.enabled ? 'bg-primary/10' : 'bg-muted'
                          }`}>
                            <Icon className={`h-5 w-5 ${
                              report.enabled ? 'text-primary' : 'text-muted-foreground'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-sm mb-1 truncate">{report.name}</h5>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {report.description}
                            </p>
                          </div>
                        </div>
                        <Switch
                          id={report.id}
                          checked={report.enabled}
                          onCheckedChange={() => handleToggleReport(report.id)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-semibold text-sm">i</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Informação sobre Permissões</p>
              <p className="text-xs text-muted-foreground">
                Relatórios financeiros geralmente são restritos a gestores. Configure as permissões de acordo com o cargo e responsabilidades do profissional.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
