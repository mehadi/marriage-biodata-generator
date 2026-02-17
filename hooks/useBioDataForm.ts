/**
 * Bio Data Form Hook
 * Single Responsibility: Manage form state and auto-save logic
 * Follows Dependency Inversion: Uses services through abstractions
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BioData, TemplateType } from '@/types/biodata';
import { BioDataSchema } from '@/services/validation.service';
import { LocalStorageService } from '@/services/localStorage.service';
import { debounce } from '@/lib/utils';

const getInitialBioData = (): Partial<BioData> => ({
  personalInfo: {
    fullName: '',
    dateOfBirth: '',
    height: '',
    complexion: '',
    bloodGroup: '',
    maritalStatus: 'Never Married',
    nationality: '',
    placeOfBirth: '',
  },
  religiousInfo: {
    prayerPractice: '',
    quranRecitation: '',
    islamicKnowledge: '',
    hijabOrBeard: '',
    sect: '',
    madhab: '',
    otherReligiousInfo: '',
  },
  education: {
    highestQualification: '',
    institution: '',
    fieldOfStudy: '',
    yearOfCompletion: '',
    additionalQualifications: '',
  },
  professionalInfo: {
    occupation: '',
    company: '',
    designation: '',
    incomeRange: '',
    workLocation: '',
  },
  familyInfo: {
    fatherName: '',
    fatherOccupation: '',
    motherName: '',
    motherOccupation: '',
    siblings: [],
    familyValues: '',
    economicStatus: 'Middle class',
    familyType: 'Nuclear',
  },
  contactInfo: {
    email: '',
    phone: '',
    whatsapp: '',
    permanentAddress: '',
    currentAddress: '',
    guardianContact: '',
  },
  partnerExpectations: {
    ageRange: '',
    heightRange: '',
    educationExpectation: '',
    occupationExpectation: '',
    religiousExpectation: '',
    otherExpectations: '',
  },
  photo: undefined,
  additionalInfo: '',
});

export interface UseBioDataFormReturn {
  form: UseFormReturn<any>;
  selectedTemplate: TemplateType;
  setSelectedTemplate: (template: TemplateType) => void;
  autoSaveEnabled: boolean;
  setAutoSaveEnabled: (enabled: boolean) => void;
  lastSaved: Date | null;
  loadDraft: (draftId: string) => void;
  saveDraft: (name: string) => string | null;
  clearForm: () => void;
  isFormDirty: boolean;
}

export const useBioDataForm = (): UseBioDataFormReturn => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isFormDirty, setIsFormDirty] = useState(false);

  // Initialize form with react-hook-form
  const form = useForm<any>({
    resolver: zodResolver(BioDataSchema),
    defaultValues: getInitialBioData(),
    mode: 'onChange',
  });

  const { watch, reset, setValue } = form;

  // Load saved draft on mount
  useEffect(() => {
    const savedDraft = LocalStorageService.loadCurrentDraft();
    if (savedDraft) {
      reset(savedDraft);
      setLastSaved(new Date(savedDraft.updatedAt || Date.now()));
    }
  }, [reset]);

  // Debounced auto-save function
  const debouncedSave = useCallback(
    debounce((data: any) => {
      if (autoSaveEnabled) {
        const success = LocalStorageService.saveCurrentDraft(data as BioData);
        if (success) {
          setLastSaved(new Date());
          setIsFormDirty(false);
        }
      }
    }, 2000),
    [autoSaveEnabled]
  );

  // Watch for form changes and trigger auto-save
  useEffect(() => {
    const subscription = watch((data) => {
      setIsFormDirty(true);
      debouncedSave(data);
    });

    return () => subscription.unsubscribe();
  }, [watch, debouncedSave]);

  // Load a specific draft
  const loadDraft = useCallback(
    (draftId: string) => {
      const draft = LocalStorageService.loadDraft(draftId);
      if (draft) {
        reset(draft);
        setLastSaved(new Date(draft.updatedAt || Date.now()));
        setIsFormDirty(false);
      }
    },
    [reset]
  );

  // Save as named draft
  const saveDraft = useCallback(
    (name: string): string | null => {
      const data = form.getValues() as BioData;
      const draftId = LocalStorageService.saveDraft(data, name);
      if (draftId) {
        setLastSaved(new Date());
        setIsFormDirty(false);
      }
      return draftId;
    },
    [form]
  );

  // Clear form
  const clearForm = useCallback(() => {
    reset(getInitialBioData());
    LocalStorageService.clearCurrentDraft();
    setLastSaved(null);
    setIsFormDirty(false);
  }, [reset]);

  return {
    form,
    selectedTemplate,
    setSelectedTemplate,
    autoSaveEnabled,
    setAutoSaveEnabled,
    lastSaved,
    loadDraft,
    saveDraft,
    clearForm,
    isFormDirty,
  };
};
