import React, { createContext, useContext, useState, useEffect } from 'react';

export interface FormField {
  id: string;
  tipo: 'texto' | 'numero' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'data' | 'titulo' | 'assinatura';
  label: string;
  obrigatorio: boolean;
  opcoes?: string[];
  placeholder?: string;
}

export interface FormTemplate {
  id: string;
  nome: string;
  descricao: string;
  tipo: string;
  campos: FormField[];
  criadoEm: string;
  atualizadoEm: string;
}

export interface FormAssignment {
  templateId: string;
  professionalIds: string[];
}

export interface FilledForm {
  id: string;
  templateId: string;
  templateName: string;
  clientId: string;
  clientName: string;
  professionalId: string;
  professionalName: string;
  data: Record<string, any>;
  criadoEm: string;
}

interface FormsContextType {
  templates: FormTemplate[];
  assignments: FormAssignment[];
  filledForms: FilledForm[];
  addTemplate: (template: FormTemplate) => void;
  updateTemplate: (template: FormTemplate) => void;
  deleteTemplate: (templateId: string) => void;
  assignTemplate: (templateId: string, professionalIds: string[]) => void;
  getAssignedTemplates: (professionalId: string) => FormTemplate[];
  addFilledForm: (form: FilledForm) => void;
  getClientForms: (clientId: string) => FilledForm[];
  getFormById: (formId: string) => FilledForm | undefined;
}

const FormsContext = createContext<FormsContextType | undefined>(undefined);

export function FormsProvider({ children }: { children: React.ReactNode }) {
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [assignments, setAssignments] = useState<FormAssignment[]>([]);
  const [filledForms, setFilledForms] = useState<FilledForm[]>([]);

  // Carregar dados do localStorage
  useEffect(() => {
    const storedTemplates = localStorage.getItem('formTemplates');
    const storedAssignments = localStorage.getItem('formAssignments');
    const storedFilledForms = localStorage.getItem('filledForms');

    if (storedTemplates) {
      setTemplates(JSON.parse(storedTemplates));
    }
    if (storedAssignments) {
      setAssignments(JSON.parse(storedAssignments));
    }
    if (storedFilledForms) {
      setFilledForms(JSON.parse(storedFilledForms));
    }
  }, []);

  // Salvar templates
  const addTemplate = (template: FormTemplate) => {
    const newTemplates = [...templates, template];
    setTemplates(newTemplates);
    localStorage.setItem('formTemplates', JSON.stringify(newTemplates));
  };

  const updateTemplate = (template: FormTemplate) => {
    const newTemplates = templates.map(t => t.id === template.id ? template : t);
    setTemplates(newTemplates);
    localStorage.setItem('formTemplates', JSON.stringify(newTemplates));
  };

  const deleteTemplate = (templateId: string) => {
    const newTemplates = templates.filter(t => t.id !== templateId);
    setTemplates(newTemplates);
    localStorage.setItem('formTemplates', JSON.stringify(newTemplates));
    
    // Remover atribuições
    const newAssignments = assignments.filter(a => a.templateId !== templateId);
    setAssignments(newAssignments);
    localStorage.setItem('formAssignments', JSON.stringify(newAssignments));
  };

  // Atribuições
  const assignTemplate = (templateId: string, professionalIds: string[]) => {
    const existingIndex = assignments.findIndex(a => a.templateId === templateId);
    let newAssignments;

    if (existingIndex >= 0) {
      newAssignments = [...assignments];
      newAssignments[existingIndex] = { templateId, professionalIds };
    } else {
      newAssignments = [...assignments, { templateId, professionalIds }];
    }

    setAssignments(newAssignments);
    localStorage.setItem('formAssignments', JSON.stringify(newAssignments));
  };

  const getAssignedTemplates = (professionalId: string): FormTemplate[] => {
    const assignedTemplateIds = assignments
      .filter(a => a.professionalIds.includes(professionalId))
      .map(a => a.templateId);
    
    return templates.filter(t => assignedTemplateIds.includes(t.id));
  };

  // Fichas preenchidas
  const addFilledForm = (form: FilledForm) => {
    const newFilledForms = [...filledForms, form];
    setFilledForms(newFilledForms);
    localStorage.setItem('filledForms', JSON.stringify(newFilledForms));
  };

  const getClientForms = (clientId: string): FilledForm[] => {
    return filledForms.filter(f => f.clientId === clientId);
  };

  const getFormById = (formId: string): FilledForm | undefined => {
    return filledForms.find(f => f.id === formId);
  };

  return (
    <FormsContext.Provider value={{
      templates,
      assignments,
      filledForms,
      addTemplate,
      updateTemplate,
      deleteTemplate,
      assignTemplate,
      getAssignedTemplates,
      addFilledForm,
      getClientForms,
      getFormById,
    }}>
      {children}
    </FormsContext.Provider>
  );
}

export function useForms() {
  const context = useContext(FormsContext);
  if (context === undefined) {
    throw new Error('useForms must be used within a FormsProvider');
  }
  return context;
}
