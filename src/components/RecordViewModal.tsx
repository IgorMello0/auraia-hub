import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, User, Clock, Eye, FileImage } from 'lucide-react';
import { EvolutionRecord } from './EvolutionForm';
import { AnamnesisRecord } from './AnamnesisForm';
import { DocumentViewer } from './DocumentViewer';

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
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{ url: string; name: string; type: 'pdf' | 'image' } | null>(null);
  
  if (!record) return null;

  const handleViewDocument = (attachmentName: string) => {
    // Detectar tipo de arquivo pela extensão
    const ext = attachmentName.split('.').pop()?.toLowerCase();
    const isPdf = ext === 'pdf';
    const isImage = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext || '');
    
    // URL de exemplo - em produção, isso viria do backend/storage
    const mockUrl = isPdf 
      ? 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      : 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800';
    
    setSelectedDocument({
      url: mockUrl,
      name: attachmentName,
      type: isPdf ? 'pdf' : 'image'
    });
    setViewerOpen(true);
  };

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
            <div className="grid gap-3 sm:grid-cols-2">
              {evolution.attachments.map((attachment, index) => {
                const ext = attachment.split('.').pop()?.toLowerCase();
                const isPdf = ext === 'pdf';
                const isImage = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext || '');
                
                return (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {isPdf ? (
                        <FileText className="h-5 w-5 text-red-500 shrink-0" />
                      ) : isImage ? (
                        <FileImage className="h-5 w-5 text-blue-500 shrink-0" />
                      ) : (
                        <FileText className="h-5 w-5 shrink-0" />
                      )}
                      <span className="text-sm truncate">{attachment}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDocument(attachment)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
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
    <>
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

      {selectedDocument && (
        <DocumentViewer
          isOpen={viewerOpen}
          onClose={() => {
            setViewerOpen(false);
            setSelectedDocument(null);
          }}
          fileUrl={selectedDocument.url}
          fileName={selectedDocument.name}
          fileType={selectedDocument.type}
        />
      )}
    </>
  );
};