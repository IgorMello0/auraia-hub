import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Calendar,
  MessageCircle,
  DollarSign,
  Users,
  BarChart3,
  FileText,
  ClipboardList,
  Sparkles,
} from 'lucide-react';

interface Module {
  id: string;
  name: string;
  description: string;
  icon: any;
  enabled: boolean;
}

interface ModulesAccessTabProps {
  professionalId: number;
}

const defaultModules: Module[] = [
  {
    id: 'appointments',
    name: 'Agendamentos',
    description: 'Visualizar e gerenciar agendamentos',
    icon: Calendar,
    enabled: true,
  },
  {
    id: 'conversations',
    name: 'Conversas',
    description: 'Acessar mensagens e conversas com clientes',
    icon: MessageCircle,
    enabled: true,
  },
  {
    id: 'financial',
    name: 'Financeiro',
    description: 'Visualizar relatórios financeiros e pagamentos',
    icon: DollarSign,
    enabled: false,
  },
  {
    id: 'clients',
    name: 'Clientes',
    description: 'Gerenciar cadastro de clientes',
    icon: Users,
    enabled: true,
  },
  {
    id: 'reports',
    name: 'Relatórios',
    description: 'Acessar relatórios e análises',
    icon: BarChart3,
    enabled: true,
  },
  {
    id: 'anamnesis',
    name: 'Fichas de Anamnese',
    description: 'Criar e visualizar fichas de anamnese',
    icon: ClipboardList,
    enabled: true,
  },
  {
    id: 'evolution',
    name: 'Fichas de Evolução',
    description: 'Registrar evoluções de tratamento',
    icon: FileText,
    enabled: true,
  },
  {
    id: 'laser',
    name: 'Fichas de Laser',
    description: 'Gerenciar procedimentos a laser',
    icon: Sparkles,
    enabled: false,
  },
];

export const ModulesAccessTab = ({ professionalId }: ModulesAccessTabProps) => {
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    // Carregar do localStorage ou usar defaults
    const storageKey = `modules_professional_${professionalId}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      const storedData = JSON.parse(stored);
      // Merge stored data with default icons
      const mergedModules = defaultModules.map(defaultModule => {
        const storedModule = storedData.find((m: any) => m.id === defaultModule.id);
        return storedModule ? { ...defaultModule, enabled: storedModule.enabled } : defaultModule;
      });
      setModules(mergedModules);
    } else {
      setModules(defaultModules);
    }
  }, [professionalId]);

  const handleToggleModule = (moduleId: string) => {
    const updatedModules = modules.map((module) =>
      module.id === moduleId ? { ...module, enabled: !module.enabled } : module
    );
    setModules(updatedModules);
    
    // Salvar no localStorage (sem os ícones)
    const storageKey = `modules_professional_${professionalId}`;
    const dataToStore = updatedModules.map(({ id, enabled }) => ({ id, enabled }));
    localStorage.setItem(storageKey, JSON.stringify(dataToStore));
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Módulos do Sistema</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Habilite ou desabilite o acesso aos diferentes módulos do sistema
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Card key={module.id} className={module.enabled ? 'border-primary/50' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      module.enabled ? 'bg-primary/10' : 'bg-muted'
                    }`}>
                      <Icon className={`h-5 w-5 ${module.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <CardTitle className="text-base">{module.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {module.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Switch
                    id={module.id}
                    checked={module.enabled}
                    onCheckedChange={() => handleToggleModule(module.id)}
                  />
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-semibold text-sm">i</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Informação sobre Módulos</p>
              <p className="text-xs text-muted-foreground">
                As alterações são salvas automaticamente. O profissional verá apenas os módulos habilitados no menu lateral.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
