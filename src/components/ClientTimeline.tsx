import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Clock, User, Download, Eye } from 'lucide-react';
import { EvolutionRecord } from './EvolutionForm';
import { AnamnesisRecord } from './AnamnesisForm';

interface ClientTimelineProps {
  records: (EvolutionRecord | AnamnesisRecord)[];
  onViewRecord: (record: EvolutionRecord | AnamnesisRecord) => void;
}

export const ClientTimeline: React.FC<ClientTimelineProps> = ({
  records,
  onViewRecord
}) => {
  const sortedRecords = records.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRecordTitle = (record: EvolutionRecord | AnamnesisRecord) => {
    if (record.type === 'evolution') {
      return 'Evolução Médica';
    }
    return 'Anamnese';
  };

  const getRecordContent = (record: EvolutionRecord | AnamnesisRecord) => {
    if (record.type === 'evolution') {
      return (record as EvolutionRecord).content;
    }
    return (record as AnamnesisRecord).chiefComplaint;
  };

  const getBadgeVariant = (type: string) => {
    return type === 'evolution' ? 'default' : 'secondary';
  };

  if (records.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            Nenhum registro encontrado para este paciente.
            <br />
            Clique no botão "+" para criar uma nova evolução ou anamnese.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Histórico do Paciente</h3>
        <Badge variant="outline">{records.length} registros</Badge>
      </div>
      
      <div className="space-y-3">
        {sortedRecords.map((record) => (
          <Card key={record.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <CardTitle className="text-base">{getRecordTitle(record)}</CardTitle>
                  </div>
                  <Badge variant={getBadgeVariant(record.type)}>
                    {record.type === 'evolution' ? 'Evolução' : 'Anamnese'}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewRecord(record)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {getRecordContent(record)}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(record.date)}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {record.professional}
                    </div>
                  </div>
                  
                  {record.type === 'evolution' && (record as EvolutionRecord).attachments.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {(record as EvolutionRecord).attachments.length} anexos
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};