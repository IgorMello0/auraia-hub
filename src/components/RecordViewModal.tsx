import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, User, Clock } from 'lucide-react';
import { EvolutionRecord } from './EvolutionForm';
import { AnamnesisRecord } from './AnamnesisForm';

interface RecordViewModalProps {
  record: EvolutionRecord | AnamnesisRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RecordViewModal: React.FC<RecordViewModalProps> = ({
  record,
  isOpen,
  onClose
}) => {
  if (!record) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderEvolutionContent = (evolution: EvolutionRecord) => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Evolução Médica</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{evolution.content}</p>
        </CardContent>
      </Card>

      {evolution.attachments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Anexos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {evolution.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{attachment}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderAnamnesisContent = (anamnesis: AnamnesisRecord) => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Queixa Principal</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{anamnesis.chiefComplaint}</p>
        </CardContent>
      </Card>

      {anamnesis.personalHistory && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Antecedentes Pessoais</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{anamnesis.personalHistory}</p>
          </CardContent>
        </Card>
      )}

      {anamnesis.familyHistory && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Antecedentes Familiares</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{anamnesis.familyHistory}</p>
          </CardContent>
        </Card>
      )}

      {anamnesis.medications && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Medicamentos em Uso</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{anamnesis.medications}</p>
          </CardContent>
        </Card>
      )}

      {anamnesis.allergies && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alergias</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{anamnesis.allergies}</p>
          </CardContent>
        </Card>
      )}

      {anamnesis.socialHistory && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">História Social</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{anamnesis.socialHistory}</p>
          </CardContent>
        </Card>
      )}

      {anamnesis.systemsReview && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revisão de Sistemas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{anamnesis.systemsReview}</p>
          </CardContent>
        </Card>
      )}

      {anamnesis.physicalExam && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Exame Físico</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{anamnesis.physicalExam}</p>
          </CardContent>
        </Card>
      )}

      {anamnesis.observations && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{anamnesis.observations}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              {record.type === 'evolution' ? 'Evolução Médica' : 'Anamnese'}
              <Badge variant={record.type === 'evolution' ? 'default' : 'secondary'}>
                {record.type === 'evolution' ? 'Evolução' : 'Anamnese'}
              </Badge>
            </DialogTitle>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatDate(record.date)}
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {record.professional}
            </div>
          </div>
        </DialogHeader>

        {record.type === 'evolution' 
          ? renderEvolutionContent(record as EvolutionRecord)
          : renderAnamnesisContent(record as AnamnesisRecord)
        }
      </DialogContent>
    </Dialog>
  );
};