/**
 * Bio Data Form Hook
 * Single Responsibility: Manage form state, auto-save, demo mode, and analytics
 * Follows Dependency Inversion: Uses services through abstractions
 */

'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BioData, TemplateType } from '@/types/biodata';
import { BioDataSchema } from '@/services/validation.service';
import { LocalStorageService } from '@/services/localStorage.service';
import { AnalyticsService } from '@/services/analytics.service';
import { hasOnboardingSession } from '@/lib/shareState';
import { DEMO_BIO_DATA } from '@/lib/demoData';
import { debounce } from '@/lib/utils';
import {
  hasPersonalInfo,
  hasReligiousInfo,
  hasEducation,
  hasProfessionalInfo,
  hasFamilyInfo,
  hasContactInfo,
  hasExpectations,
} from '@/lib/sectionValidation';

const getInitialBioData = (): Partial<BioData> => ({
  personalInfo: {
    fullName: '',
    dateOfBirth: '',
    gender: undefined,
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
  photoSizePercent: 100,
  customFields: {
    'personal-info': [],
    'religious-info': [],
    education: [],
    professional: [],
    family: [],
    contact: [],
    expectations: [],
  },
  additionalInfo: '',
});

export interface SectionCompletion {
  'personal-info': boolean;
  'religious-info': boolean;
  education: boolean;
  professional: boolean;
  family: boolean;
  contact: boolean;
  photo: boolean;
  expectations: boolean;
}

export interface UseBioDataFormReturn {
  form: UseFormReturn<any>;
  selectedTemplate: TemplateType;
  setSelectedTemplate: (template: TemplateType) => void;
  autoSaveEnabled: boolean;
  setAutoSaveEnabled: (enabled: boolean) => void;
  lastSaved: Date | null;
  loadDraft: (draftId: string) => void;
  saveDraft: (name: string) => string | null;
  loadDemoData: () => void;
  clearForm: () => void;
  isFormDirty: boolean;
  sectionCompletion: SectionCompletion;
  completionPercent: number;
}

export const useBioDataForm = (): UseBioDataFormReturn => {
  const [selectedTemplate, setSelectedTemplateState] = useState<TemplateType>('modern');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isFormDirty, setIsFormDirty] = useState(false);

  // Track previously completed sections to fire analytics only on new completions
  const prevCompletion = useRef<Partial<SectionCompletion>>({});

  // Initialize form with react-hook-form
  const form = useForm<any>({
    resolver: zodResolver(BioDataSchema),
    defaultValues: getInitialBioData(),
    mode: 'onChange',
  });

  const { watch, reset, setValue } = form;

  // Load saved draft on mount — skip if onboarding wizard data is waiting
  // (the create page's own useEffect will apply onboarding data with higher priority)
  useEffect(() => {
    if (hasOnboardingSession()) return;

    const savedDraft = LocalStorageService.loadCurrentDraft();
    if (savedDraft) {
      const merged = {
        ...savedDraft,
        customFields: {
          'personal-info': [],
          'religious-info': [],
          education: [],
          professional: [],
          family: [],
          contact: [],
          expectations: [],
          ...savedDraft.customFields,
        },
      };
      reset(merged);
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
          AnalyticsService.trackDraftSaved('auto');
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

  // Derive section completion from live form values
  const formValues = watch();
  const sectionCompletion = useMemo<SectionCompletion>(() => ({
    'personal-info': hasPersonalInfo(formValues),
    'religious-info': hasReligiousInfo(formValues),
    education: hasEducation(formValues),
    professional: hasProfessionalInfo(formValues),
    family: hasFamilyInfo(formValues),
    contact: hasContactInfo(formValues),
    photo: !!formValues.photo,
    expectations: hasExpectations(formValues),
  }), [formValues]);

  // Fire analytics when a section is newly completed
  useEffect(() => {
    const keys = Object.keys(sectionCompletion) as (keyof SectionCompletion)[];
    keys.forEach((key) => {
      if (sectionCompletion[key] && !prevCompletion.current[key]) {
        AnalyticsService.trackSectionCompleted(key);
      }
    });
    prevCompletion.current = { ...sectionCompletion };
  }, [sectionCompletion]);

  const completionPercent = useMemo(() => {
    const total = Object.keys(sectionCompletion).length;
    const done = Object.values(sectionCompletion).filter(Boolean).length;
    return Math.round((done / total) * 100);
  }, [sectionCompletion]);

  // Set template and fire analytics
  const setSelectedTemplate = useCallback((template: TemplateType) => {
    setSelectedTemplateState(template);
    AnalyticsService.trackTemplateSelected(template);
  }, []);

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

  // Load demo data
  const loadDemoData = useCallback(() => {
    const demoWithDefaults = {
      ...getInitialBioData(),
      ...DEMO_BIO_DATA,
      customFields: {
        'personal-info': [],
        'religious-info': [],
        education: [],
        professional: [],
        family: [],
        contact: [],
        expectations: [],
        ...(DEMO_BIO_DATA.customFields ?? {}),
      },
    };
    reset(demoWithDefaults);
    setIsFormDirty(true);
    AnalyticsService.trackDemoLoaded();
  }, [reset]);

  // Save as named draft
  const saveDraft = useCallback(
    (name: string): string | null => {
      const data = form.getValues() as BioData;
      const draftId = LocalStorageService.saveDraft(data, name);
      if (draftId) {
        setLastSaved(new Date());
        setIsFormDirty(false);
        AnalyticsService.trackDraftSaved('named');
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
    prevCompletion.current = {};
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
    loadDemoData,
    clearForm,
    isFormDirty,
    sectionCompletion,
    completionPercent,
  };
};
