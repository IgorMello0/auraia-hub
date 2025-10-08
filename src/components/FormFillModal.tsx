import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormTemplate, FormField } from '@/contexts/FormsContext';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FormFillModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: FormTemplate;
  clientId: string;
  clientName: string;
  professionalId: string;
  professionalName: string;
  onSave: (data: Record<string, any>) => void;
}

export const FormFillModal = ({
  open,
  onOpenChange,
  template,
  clientId,
  clientName,
  professionalId,
  professionalName,
  onSave,
}: FormFillModalProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const { toast } = useToast();

  const updateField = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSave = () => {
    // Validar campos obrigatórios
    const missingFields = template.campos
      .filter(field => field.obrigatorio && !field.tipo.includes('titulo'))
      .filter(field => !formData[field.id] || formData[field.id] === '');

    if (missingFields.length > 0) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    onSave(formData);
    setFormData({});
    onOpenChange(false);
    toast({
      title: 'Ficha salva',
      description: 'A ficha foi preenchida e salva com sucesso.',
    });
  };

  const renderField = (field: FormField) => {
    if (field.tipo === 'titulo') {
      return (
        <div key={field.id} className="pt-4 pb-2">
          <h3 className="text-lg font-semibold">{field.label}</h3>
        </div>
      );
    }

    return (
      <div key={field.id} className="space-y-2">
        <Label htmlFor={field.id}>
          {field.label}
          {field.obrigatorio && <span className="text-destructive ml-1">*</span>}
        </Label>

        {field.tipo === 'texto' && (
          <Input
            id={field.id}
            placeholder={field.placeholder}
            value={formData[field.id] || ''}
            onChange={(e) => updateField(field.id, e.target.value)}
          />
        )}

        {field.tipo === 'numero' && (
          <Input
            id={field.id}
            type="number"
            placeholder={field.placeholder}
            value={formData[field.id] || ''}
            onChange={(e) => updateField(field.id, e.target.value)}
          />
        )}

        {field.tipo === 'textarea' && (
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            value={formData[field.id] || ''}
            onChange={(e) => updateField(field.id, e.target.value)}
            rows={4}
          />
        )}

        {field.tipo === 'data' && (
          <Input
            id={field.id}
            type="date"
            value={formData[field.id] || ''}
            onChange={(e) => updateField(field.id, e.target.value)}
          />
        )}

        {field.tipo === 'select' && (
          <Select
            value={formData[field.id] || ''}
            onValueChange={(value) => updateField(field.id, value)}
          >
            <SelectTrigger id={field.id}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {field.opcoes?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {field.tipo === 'radio' && (
          <RadioGroup
            value={formData[field.id] || ''}
            onValueChange={(value) => updateField(field.id, value)}
          >
            {field.opcoes?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {field.tipo === 'checkbox' && (
          <div className="space-y-2">
            {field.opcoes?.map((option, index) => {
              const currentValues = formData[field.id] || [];
              const isChecked = currentValues.includes(option);
              
              return (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.id}-${index}`}
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      const newValues = checked
                        ? [...currentValues, option]
                        : currentValues.filter((v: string) => v !== option);
                      updateField(field.id, newValues);
                    }}
                  />
                  <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
                </div>
              );
            })}
          </div>
        )}

        {field.tipo === 'assinatura' && (
          <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
            <Input
              id={field.id}
              placeholder="Digite seu nome para assinar"
              value={formData[field.id] || ''}
              onChange={(e) => updateField(field.id, e.target.value)}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{template.nome}</DialogTitle>
          {template.descricao && (
            <p className="text-sm text-muted-foreground">{template.descricao}</p>
          )}
          <div className="flex gap-4 text-xs text-muted-foreground pt-2">
            <span>Cliente: <strong>{clientName}</strong></span>
            <span>Profissional: <strong>{professionalName}</strong></span>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {template.campos.map(renderField)}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Ficha
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
