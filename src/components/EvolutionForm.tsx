import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, FileText, X } from 'lucide-react';

interface EvolutionFormProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
  onSave: (evolution: EvolutionRecord) => void;
}

export interface EvolutionRecord {
  id: string;
  clientId: string;
  type: 'evolution';
  date: string;
  content: string;
  attachments: string[];
  signature?: string;
  professional: string;
}

export const EvolutionForm: React.FC<EvolutionFormProps> = ({
  isOpen,
  onClose,
  clientId,
  clientName,
  onSave
}) => {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileNames = Array.from(files).map(file => file.name);
      setAttachments(prev => [...prev, ...fileNames]);
      toast('Arquivos anexados com sucesso!');
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error('Por favor, preencha o conteúdo da evolução');
      return;
    }

    setIsSaving(true);
    
    const evolution: EvolutionRecord = {
      id: Date.now().toString(),
      clientId,
      type: 'evolution',
      date: new Date().toISOString(),
      content,
      attachments,
      professional: 'Dr. João Silva' // This would come from auth context
    };

    try {
      onSave(evolution);
      toast('Evolução salva com sucesso!');
      setContent('');
      setAttachments([]);
      onClose();
    } catch (error) {
      toast.error('Erro ao salvar evolução');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg md:text-xl">Nova Evolução - {clientName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-6">
          <div>
            <Label htmlFor="content" className="text-sm">Evolução Médica</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Descreva a evolução do paciente, observações clínicas, procedimentos realizados..."
              className="min-h-[150px] sm:min-h-[200px] mt-2 text-sm"
            />
          </div>

          <div>
            <Label className="text-sm">Anexos</Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2 w-full">
                <Input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Label
                  htmlFor="file-upload"
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 border border-dashed border-muted-foreground/25 rounded-md cursor-pointer hover:border-muted-foreground/50 transition-colors w-full sm:w-auto text-sm"
                >
                  <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>Anexar arquivos</span>
                </Label>
              </div>
              
              {attachments.length > 0 && (
                <div className="space-y-1.5">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="text-xs sm:text-sm truncate">{file}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                        className="h-7 w-7 p-0 flex-shrink-0"
                      >
                        <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto text-sm">
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto text-sm">
              {isSaving ? 'Salvando...' : 'Salvar Evolução'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};