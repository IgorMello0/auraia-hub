import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { FilledForm, FormTemplate } from '@/contexts/FormsContext';
import { Calendar, User, Briefcase } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FormViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filledForm: FilledForm;
  template: FormTemplate;
}

export const FormViewModal = ({
  open,
  onOpenChange,
  filledForm,
  template,
}: FormViewModalProps) => {
  const renderFieldValue = (field: any, value: any) => {
    if (!value) return <span className="text-muted-foreground">Não preenchido</span>;

    if (field.tipo === 'checkbox' && Array.isArray(value)) {
      return value.join(', ');
    }

    if (field.tipo === 'data') {
      try {
        return format(new Date(value), 'dd/MM/yyyy', { locale: ptBR });
      } catch {
        return value;
      }
    }

    return value;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{filledForm.templateName}</DialogTitle>
          <div className="flex flex-wrap gap-3 text-sm pt-2">
            <Badge variant="outline" className="gap-1">
              <User className="w-3 h-3" />
              {filledForm.clientName}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Briefcase className="w-3 h-3" />
              {filledForm.professionalName}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Calendar className="w-3 h-3" />
              {format(new Date(filledForm.criadoEm), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {template.campos.map((field) => {
            if (field.tipo === 'titulo') {
              return (
                <div key={field.id} className="pt-4 pb-2 border-t">
                  <h3 className="text-lg font-semibold">{field.label}</h3>
                </div>
              );
            }

            return (
              <div key={field.id} className="space-y-1">
                <Label className="text-sm font-medium">{field.label}</Label>
                <div className="text-sm bg-muted/30 p-3 rounded-md">
                  {renderFieldValue(field, filledForm.data[field.id])}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
