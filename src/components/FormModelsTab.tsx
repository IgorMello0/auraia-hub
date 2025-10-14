import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useForms } from '@/contexts/FormsContext';
import {
  FileText,
  Sparkles,
  User,
  Heart,
  Droplet,
  Eye,
  CheckCircle2,
  Search,
  Activity,
} from 'lucide-react';

interface FormModelsTabProps {
  professionalId: string;
}

// Mapeamento de ícones por tipo de ficha
const iconMap: Record<string, any> = {
  'Anamnese': User,
  'Evolução': FileText,
  'Laser': Sparkles,
  'Avaliação': Eye,
  'Tratamento': Droplet,
  'Cardiologia': Heart,
  'Geral': Activity,
};

export const FormModelsTab = ({ professionalId }: FormModelsTabProps) => {
  const { templates, assignments, assignTemplate } = useForms();
  const [searchQuery, setSearchQuery] = useState('');

  // Verifica se uma ficha está atribuída ao profissional
  const isAssigned = (templateId: string): boolean => {
    const assignment = assignments.find(a => a.templateId === templateId);
    return assignment ? assignment.professionalIds.includes(professionalId) : false;
  };

  // Toggle atribuição
  const handleToggleForm = (templateId: string) => {
    const currentAssignment = assignments.find(a => a.templateId === templateId);
    let newProfessionalIds: string[] = [];

    if (currentAssignment) {
      // Se já tem atribuição, adiciona ou remove o profissional
      if (currentAssignment.professionalIds.includes(professionalId)) {
        newProfessionalIds = currentAssignment.professionalIds.filter(id => id !== professionalId);
      } else {
        newProfessionalIds = [...currentAssignment.professionalIds, professionalId];
      }
    } else {
      // Se não tem atribuição, cria com esse profissional
      newProfessionalIds = [professionalId];
    }

    assignTemplate(templateId, newProfessionalIds);
  };

  // Conta quantas fichas estão atribuídas
  const assignedCount = templates.filter(t => isAssigned(t.id)).length;

  // Filtrar fichas com base na busca
  const filteredTemplates = templates.filter(template =>
    template.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.tipo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.descricao.toLowerCase().includes(searchQuery.toLowerCase())
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
          {assignedCount} de {templates.length} atribuídas
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
          filteredTemplates.map((template) => {
          const assigned = isAssigned(template.id);
          const Icon = iconMap[template.tipo] || Activity;
          return (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                assigned ? 'border-primary/50 bg-primary/5' : ''
              }`}
              onClick={() => handleToggleForm(template.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    assigned ? 'bg-primary/10' : 'bg-muted'
                  }`}>
                    <Icon className={`h-5 w-5 ${assigned ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-base truncate">{template.nome}</CardTitle>
                      {assigned && (
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs mb-2">
                      {template.tipo}
                    </Badge>
                    <CardDescription className="text-xs">
                      {template.descricao}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {template.campos.length} campos
                  </span>
                  <Checkbox
                    id={template.id}
                    checked={assigned}
                    onCheckedChange={() => handleToggleForm(template.id)}
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
