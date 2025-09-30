import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface AnamnesisFormProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
  onSave: (anamnesis: AnamnesisRecord) => void;
}

export interface AnamnesisRecord {
  id: string;
  clientId: string;
  type: 'anamnesis';
  date: string;
  chiefComplaint: string;
  personalHistory: string;
  familyHistory: string;
  allergies: string;
  medications: string;
  socialHistory: string;
  systemsReview: string;
  physicalExam: string;
  observations: string;
  professional: string;
}

export const AnamnesisForm: React.FC<AnamnesisFormProps> = ({
  isOpen,
  onClose,
  clientId,
  clientName,
  onSave
}) => {
  const [formData, setFormData] = useState({
    chiefComplaint: '',
    personalHistory: '',
    familyHistory: '',
    allergies: '',
    medications: '',
    socialHistory: '',
    systemsReview: '',
    physicalExam: '',
    observations: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.chiefComplaint.trim()) {
      toast.error('Por favor, preencha a queixa principal');
      return;
    }

    setIsSaving(true);
    
    const anamnesis: AnamnesisRecord = {
      id: Date.now().toString(),
      clientId,
      type: 'anamnesis',
      date: new Date().toISOString(),
      ...formData,
      professional: 'Dr. João Silva' // This would come from auth context
    };

    try {
      onSave(anamnesis);
      toast('Anamnese salva com sucesso!');
      setFormData({
        chiefComplaint: '',
        personalHistory: '',
        familyHistory: '',
        allergies: '',
        medications: '',
        socialHistory: '',
        systemsReview: '',
        physicalExam: '',
        observations: ''
      });
      onClose();
    } catch (error) {
      toast.error('Erro ao salvar anamnese');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg md:text-xl">Nova Anamnese - {clientName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-6">
          <Card className="w-full">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Identificação e Queixa Principal</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
              <div>
                <Label htmlFor="chiefComplaint" className="text-sm">Queixa Principal *</Label>
                <Textarea
                  id="chiefComplaint"
                  value={formData.chiefComplaint}
                  onChange={(e) => handleChange('chiefComplaint', e.target.value)}
                  placeholder="Descreva o motivo da consulta e sintomas principais..."
                  className="mt-2 text-sm"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">História</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
              <div>
                <Label htmlFor="personalHistory" className="text-sm">Antecedentes Pessoais</Label>
                <Textarea
                  id="personalHistory"
                  value={formData.personalHistory}
                  onChange={(e) => handleChange('personalHistory', e.target.value)}
                  placeholder="Doenças anteriores, cirurgias, hospitalizações..."
                  className="mt-2 text-sm"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="familyHistory" className="text-sm">Antecedentes Familiares</Label>
                <Textarea
                  id="familyHistory"
                  value={formData.familyHistory}
                  onChange={(e) => handleChange('familyHistory', e.target.value)}
                  placeholder="Doenças familiares relevantes..."
                  className="mt-2 text-sm"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="socialHistory" className="text-sm">História Social</Label>
                <Textarea
                  id="socialHistory"
                  value={formData.socialHistory}
                  onChange={(e) => handleChange('socialHistory', e.target.value)}
                  placeholder="Tabagismo, etilismo, atividade física, profissão..."
                  className="mt-2 text-sm"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Medicações e Alergias</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
              <div>
                <Label htmlFor="medications" className="text-sm">Medicamentos em Uso</Label>
                <Textarea
                  id="medications"
                  value={formData.medications}
                  onChange={(e) => handleChange('medications', e.target.value)}
                  placeholder="Liste os medicamentos atuais, dosagens e frequência..."
                  className="mt-2 text-sm"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="allergies" className="text-sm">Alergias</Label>
                <Textarea
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) => handleChange('allergies', e.target.value)}
                  placeholder="Alergias medicamentosas, alimentares ou ambientais..."
                  className="mt-2 text-sm"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Exame Físico e Revisão de Sistemas</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
              <div>
                <Label htmlFor="systemsReview" className="text-sm">Revisão de Sistemas</Label>
                <Textarea
                  id="systemsReview"
                  value={formData.systemsReview}
                  onChange={(e) => handleChange('systemsReview', e.target.value)}
                  placeholder="Revisão por sistemas: cardiovascular, respiratório, gastrointestinal..."
                  className="mt-2 text-sm"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="physicalExam" className="text-sm">Exame Físico</Label>
                <Textarea
                  id="physicalExam"
                  value={formData.physicalExam}
                  onChange={(e) => handleChange('physicalExam', e.target.value)}
                  placeholder="Sinais vitais, exame físico geral e específico..."
                  className="mt-2 text-sm"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="observations" className="text-sm">Observações Adicionais</Label>
                <Textarea
                  id="observations"
                  value={formData.observations}
                  onChange={(e) => handleChange('observations', e.target.value)}
                  placeholder="Outras observações relevantes..."
                  className="mt-2 text-sm"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto text-sm">
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto text-sm">
              {isSaving ? 'Salvando...' : 'Salvar Anamnese'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};