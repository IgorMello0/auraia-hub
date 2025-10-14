import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  FileText,
  Sparkles,
  User,
  Heart,
  Droplet,
  Eye,
  CheckCircle2,
  Search,
} from 'lucide-react';

interface FormTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  icon: any;
  fieldsCount: number;
  assigned: boolean;
}

interface FormModelsTabProps {
  professionalId: number;
}

const defaultFormTemplates: FormTemplate[] = [
  {
    id: 'anamnesis-general',
    name: 'Anamnese Geral',
    type: 'Anamnese',
    description: 'Ficha de anamnese padrão para primeira consulta',
    icon: User,
    fieldsCount: 12,
    assigned: true,
  },
  {
    id: 'evolution-general',
    name: 'Evolução Padrão',
    type: 'Evolução',
    description: 'Registro de evolução do tratamento',
    icon: FileText,
    fieldsCount: 8,
    assigned: true,
  },
  {
    id: 'laser-facial',
    name: 'Laser Facial',
    type: 'Laser',
    description: 'Procedimentos de laser facial',
    icon: Sparkles,
    fieldsCount: 15,
    assigned: false,
  },
  {
    id: 'laser-corporal',
    name: 'Laser Corporal',
    type: 'Laser',
    description: 'Procedimentos de laser corporal',
    icon: Sparkles,
    fieldsCount: 14,
    assigned: false,
  },
  {
    id: 'aesthetic-evaluation',
    name: 'Avaliação Estética',
    type: 'Avaliação',
    description: 'Avaliação completa para procedimentos estéticos',
    icon: Eye,
    fieldsCount: 20,
    assigned: true,
  },
  {
    id: 'cardiology-anamnesis',
    name: 'Anamnese Cardiológica',
    type: 'Anamnese',
    description: 'Ficha especializada em cardiologia',
    icon: Heart,
    fieldsCount: 18,
    assigned: false,
  },
  {
    id: 'hydration-treatment',
    name: 'Tratamento de Hidratação',
    type: 'Tratamento',
    description: 'Protocolo de hidratação facial',
    icon: Droplet,
    fieldsCount: 10,
    assigned: true,
  },
];

export const FormModelsTab = ({ professionalId }: FormModelsTabProps) => {
  const [formTemplates, setFormTemplates] = useState<FormTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Carregar do localStorage ou usar defaults
    const storageKey = `form_templates_professional_${professionalId}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      const storedData = JSON.parse(stored);
      // Merge stored data with default icons
      const mergedTemplates = defaultFormTemplates.map(defaultTemplate => {
        const storedTemplate = storedData.find((t: any) => t.id === defaultTemplate.id);
        return storedTemplate ? { ...defaultTemplate, assigned: storedTemplate.assigned } : defaultTemplate;
      });
      setFormTemplates(mergedTemplates);
    } else {
      setFormTemplates(defaultFormTemplates);
    }
  }, [professionalId]);

  const handleToggleForm = (formId: string) => {
    const updatedForms = formTemplates.map((form) =>
      form.id === formId ? { ...form, assigned: !form.assigned } : form
    );
    setFormTemplates(updatedForms);
    
    // Salvar no localStorage (sem os ícones)
    const storageKey = `form_templates_professional_${professionalId}`;
    const dataToStore = updatedForms.map(({ id, assigned }) => ({ id, assigned }));
    localStorage.setItem(storageKey, JSON.stringify(dataToStore));
  };

  const assignedCount = formTemplates.filter(f => f.assigned).length;

  // Filtrar fichas com base na busca
  const filteredTemplates = formTemplates.filter(form =>
    form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Modelos de Fichas</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie e atribua fichas personalizadas ao profissional
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {assignedCount} de {formTemplates.length} atribuídas
        </Badge>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, tipo ou categoria..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTemplates.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-muted-foreground">
            Nenhuma ficha encontrada com os critérios de busca.
          </div>
        ) : (
          filteredTemplates.map((form) => {
          const Icon = form.icon;
          return (
            <Card
              key={form.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                form.assigned ? 'border-primary/50 bg-primary/5' : ''
              }`}
              onClick={() => handleToggleForm(form.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    form.assigned ? 'bg-primary/10' : 'bg-muted'
                  }`}>
                    <Icon className={`h-5 w-5 ${form.assigned ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-base truncate">{form.name}</CardTitle>
                      {form.assigned && (
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs mb-2">
                      {form.type}
                    </Badge>
                    <CardDescription className="text-xs">
                      {form.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {form.fieldsCount} campos
                  </span>
                  <Checkbox
                    id={form.id}
                    checked={form.assigned}
                    onCheckedChange={() => handleToggleForm(form.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })
        )}
      </div>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-semibold text-sm">i</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Sobre Modelos de Fichas</p>
              <p className="text-xs text-muted-foreground">
                As fichas atribuídas ficarão disponíveis no botão "+" dentro do cadastro do cliente. 
                O profissional poderá criar novos registros usando esses modelos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
