import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  FileText,
  Calendar,
  CheckSquare,
  List,
  Type,
  Heading,
  PenTool,
  Save,
  Eye,
  Search
} from 'lucide-react';
import { toast } from 'sonner';
import { useForms, FormField, FormTemplate } from '@/contexts/FormsContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const fieldTypeIcons = {
  texto: Type,
  numero: Type,
  textarea: FileText,
  select: List,
  checkbox: CheckSquare,
  radio: CheckSquare,
  data: Calendar,
  titulo: Heading,
  assinatura: PenTool
};

const fieldTypeLabels = {
  texto: 'Texto Simples',
  numero: 'Número',
  textarea: 'Texto Longo',
  select: 'Múltipla Escolha',
  checkbox: 'Caixa de Seleção',
  radio: 'Opção Única',
  data: 'Data',
  titulo: 'Título/Seção',
  assinatura: 'Campo de Assinatura'
};

export const FormTemplateBuilder = () => {
  const { templates, addTemplate, updateTemplate, deleteTemplate: deleteTemplateContext } = useForms();
  const [currentTemplate, setCurrentTemplate] = useState<FormTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const createNewTemplate = () => {
    const newTemplate: FormTemplate = {
      id: Date.now().toString(),
      nome: 'Novo Modelo',
      descricao: '',
      tipo: 'Geral',
      campos: [],
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    };
    setCurrentTemplate(newTemplate);
    setIsEditing(true);
  };

  const addField = (tipo: FormField['tipo']) => {
    if (!currentTemplate) return;

    const newField: FormField = {
      id: Date.now().toString(),
      tipo,
      label: tipo === 'titulo' ? 'Nova Seção' : 'Novo Campo',
      obrigatorio: false,
      opcoes: ['select', 'checkbox', 'radio'].includes(tipo) ? ['Opção 1', 'Opção 2'] : undefined,
      placeholder: ''
    };

    setCurrentTemplate({
      ...currentTemplate,
      campos: [...currentTemplate.campos, newField]
    });
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    if (!currentTemplate) return;

    setCurrentTemplate({
      ...currentTemplate,
      campos: currentTemplate.campos.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    });
  };

  const removeField = (fieldId: string) => {
    if (!currentTemplate) return;

    setCurrentTemplate({
      ...currentTemplate,
      campos: currentTemplate.campos.filter(field => field.id !== fieldId)
    });
  };

  const moveField = (fieldId: string, direction: 'up' | 'down') => {
    if (!currentTemplate) return;

    const index = currentTemplate.campos.findIndex(f => f.id === fieldId);
    if (index === -1) return;

    const newCampos = [...currentTemplate.campos];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= newCampos.length) return;

    [newCampos[index], newCampos[newIndex]] = [newCampos[newIndex], newCampos[index]];

    setCurrentTemplate({
      ...currentTemplate,
      campos: newCampos
    });
  };

  const saveTemplate = () => {
    if (!currentTemplate) return;

    if (!currentTemplate.nome.trim()) {
      toast.error('Por favor, defina um nome para o modelo');
      return;
    }

    const updatedTemplate = {
      ...currentTemplate,
      atualizadoEm: new Date().toISOString()
    };

    const existingTemplate = templates.find(t => t.id === currentTemplate.id);
    
    if (existingTemplate) {
      updateTemplate(updatedTemplate);
    } else {
      addTemplate(updatedTemplate);
    }

    setCurrentTemplate(null);
    setIsEditing(false);
    toast.success('Modelo salvo com sucesso!');
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Tem certeza que deseja excluir este modelo?')) {
      deleteTemplateContext(templateId);
      toast.success('Modelo excluído com sucesso!');
    }
  };

  const filteredTemplates = templates.filter(template =>
    template.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.descricao.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.tipo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const editTemplate = (template: FormTemplate) => {
    setCurrentTemplate(template);
    setIsEditing(true);
  };

  if (isEditing && currentTemplate) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {templates.find(t => t.id === currentTemplate.id) ? 'Editar Modelo' : 'Criar Novo Modelo'}
            </h2>
            <p className="text-muted-foreground">Configure os campos do seu formulário</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? 'Ocultar' : 'Visualizar'}
            </Button>
            <Button variant="outline" onClick={() => {
              setIsEditing(false);
              setCurrentTemplate(null);
            }}>
              Cancelar
            </Button>
            <Button onClick={saveTemplate}>
              <Save className="w-4 h-4 mr-2" />
              Salvar Modelo
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Section */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Modelo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome do Modelo</Label>
                  <Input
                    id="nome"
                    value={currentTemplate.nome}
                    onChange={(e) => setCurrentTemplate({ ...currentTemplate, nome: e.target.value })}
                    placeholder="Ex: Anamnese Odontológica"
                  />
                </div>
                <div>
                  <Label htmlFor="tipo">Tipo de Ficha</Label>
                  <Input
                    id="tipo"
                    value={currentTemplate.tipo}
                    onChange={(e) => setCurrentTemplate({ ...currentTemplate, tipo: e.target.value })}
                    placeholder="Ex: Anamnese, Evolução, Laser..."
                  />
                </div>
                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={currentTemplate.descricao}
                    onChange={(e) => setCurrentTemplate({ ...currentTemplate, descricao: e.target.value })}
                    placeholder="Descreva o propósito deste formulário..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Adicionar Campo</CardTitle>
                <CardDescription>Escolha o tipo de campo que deseja adicionar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(fieldTypeLabels).map(([tipo, label]) => {
                    const Icon = fieldTypeIcons[tipo as FormField['tipo']];
                    return (
                      <Button
                        key={tipo}
                        variant="outline"
                        onClick={() => addField(tipo as FormField['tipo'])}
                        className="justify-start"
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {label}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campos do Formulário ({currentTemplate.campos.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {currentTemplate.campos.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhum campo adicionado. Comece adicionando campos acima.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {currentTemplate.campos.map((field, index) => {
                      const Icon = fieldTypeIcons[field.tipo];
                      return (
                        <Card key={field.id} className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-start gap-2">
                              <div className="flex flex-col gap-1 mt-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => moveField(field.id, 'up')}
                                  disabled={index === 0}
                                >
                                  ↑
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => moveField(field.id, 'down')}
                                  disabled={index === currentTemplate.campos.length - 1}
                                >
                                  ↓
                                </Button>
                              </div>
                              <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-2">
                                  <Icon className="w-4 h-4" />
                                  <Badge variant="outline">{fieldTypeLabels[field.tipo]}</Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeField(field.id)}
                                    className="ml-auto"
                                  >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
                                </div>

                                <div>
                                  <Label>Label do Campo</Label>
                                  <Input
                                    value={field.label}
                                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                                    placeholder="Nome do campo"
                                  />
                                </div>

                                {!['titulo', 'assinatura'].includes(field.tipo) && (
                                  <div>
                                    <Label>Placeholder (opcional)</Label>
                                    <Input
                                      value={field.placeholder || ''}
                                      onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                                      placeholder="Texto de ajuda..."
                                    />
                                  </div>
                                )}

                                {['select', 'checkbox', 'radio'].includes(field.tipo) && (
                                  <div>
                                    <Label>Opções (uma por linha)</Label>
                                    <Textarea
                                      value={field.opcoes?.join('\n') || ''}
                                      onChange={(e) => updateField(field.id, { 
                                        opcoes: e.target.value.split('\n').filter(o => o.trim()) 
                                      })}
                                      placeholder="Opção 1&#10;Opção 2&#10;Opção 3"
                                      rows={3}
                                    />
                                  </div>
                                )}

                                {!['titulo'].includes(field.tipo) && (
                                  <div className="flex items-center gap-2">
                                    <Checkbox
                                      id={`required-${field.id}`}
                                      checked={field.obrigatorio}
                                      onCheckedChange={(checked) => 
                                        updateField(field.id, { obrigatorio: checked as boolean })
                                      }
                                    />
                                    <Label htmlFor={`required-${field.id}`}>Campo obrigatório</Label>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="lg:sticky lg:top-4 lg:h-fit">
              <Card>
                <CardHeader>
                  <CardTitle>Pré-visualização</CardTitle>
                  <CardDescription>Como o formulário será exibido</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                    <div>
                      <h3 className="text-lg font-bold">{currentTemplate.nome}</h3>
                      {currentTemplate.descricao && (
                        <p className="text-sm text-muted-foreground">{currentTemplate.descricao}</p>
                      )}
                    </div>

                    {currentTemplate.campos.map((field) => {
                      const Icon = fieldTypeIcons[field.tipo];
                      
                      if (field.tipo === 'titulo') {
                        return (
                          <div key={field.id} className="pt-4">
                            <h4 className="text-md font-semibold flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              {field.label}
                            </h4>
                          </div>
                        );
                      }

                      return (
                        <div key={field.id} className="space-y-2">
                          <Label>
                            {field.label}
                            {field.obrigatorio && <span className="text-destructive ml-1">*</span>}
                          </Label>
                          
                          {field.tipo === 'texto' && (
                            <Input placeholder={field.placeholder} disabled />
                          )}
                          
                          {field.tipo === 'numero' && (
                            <Input type="number" placeholder={field.placeholder} disabled />
                          )}
                          
                          {field.tipo === 'textarea' && (
                            <Textarea placeholder={field.placeholder} disabled />
                          )}
                          
                          {field.tipo === 'data' && (
                            <Input type="date" disabled />
                          )}
                          
                          {field.tipo === 'select' && (
                            <Select disabled>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione..." />
                              </SelectTrigger>
                              <SelectContent>
                                {field.opcoes?.map((opt, i) => (
                                  <SelectItem key={i} value={opt}>{opt}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          
                          {field.tipo === 'checkbox' && (
                            <div className="space-y-2">
                              {field.opcoes?.map((opt, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <Checkbox id={`prev-${field.id}-${i}`} disabled />
                                  <Label htmlFor={`prev-${field.id}-${i}`}>{opt}</Label>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {field.tipo === 'radio' && (
                            <div className="space-y-2">
                              {field.opcoes?.map((opt, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <input type="radio" name={`prev-${field.id}`} disabled />
                                  <Label>{opt}</Label>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {field.tipo === 'assinatura' && (
                            <div className="border-2 border-dashed rounded-lg p-8 text-center bg-background">
                              <PenTool className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">Área de Assinatura</p>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {currentTemplate.campos.length > 0 && (
                      <Button className="w-full" disabled>
                        Enviar Formulário
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Modelos de Fichas</h2>
          <p className="text-muted-foreground">
            Crie e gerencie modelos de formulários personalizados
          </p>
        </div>
        <Button onClick={createNewTemplate}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Modelo
        </Button>
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

      {filteredTemplates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              {templates.length === 0 ? 'Nenhum modelo criado' : 'Nenhuma ficha encontrada'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {templates.length === 0
                ? 'Comece criando seu primeiro modelo de formulário personalizado'
                : 'Tente buscar com outros termos'
              }
            </p>
            {templates.length === 0 && (
              <Button onClick={createNewTemplate}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Modelo
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => {
            return (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <FileText className="w-5 h-5" />
                        {template.nome}
                      </CardTitle>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {template.tipo}
                      </Badge>
                    </div>
                  </div>
                  {template.descricao && (
                    <CardDescription className="line-clamp-2">{template.descricao}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Campos:</span>
                      <Badge variant="secondary">{template.campos.length}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Atualizado em: {new Date(template.atualizadoEm).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => editTemplate(template)}
                      >
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
