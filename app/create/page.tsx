/**
 * Create Bio Data Page
 * Enhanced main form page with section navigation and live preview
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useBioDataForm } from '@/hooks/useBioDataForm';
import { PersonalInfoSection } from '@/components/form/PersonalInfoSection';
import { ReligiousInfoSection } from '@/components/form/ReligiousInfoSection';
import { EducationSection } from '@/components/form/EducationSection';
import { ProfessionalSection } from '@/components/form/ProfessionalSection';
import { FamilySection } from '@/components/form/FamilySection';
import { ContactSection } from '@/components/form/ContactSection';
import { PhotoUploadSection } from '@/components/form/PhotoUploadSection';
import { ExpectationsSection } from '@/components/form/ExpectationsSection';
import { PreviewPanel } from '@/components/PreviewPanel';
import { SectionNavigator } from '@/components/form/SectionNavigator';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from '@/context/LanguageContext';
import { LocalStorageService } from '@/services/localStorage.service';
import { Save, FileText, Trash2, Clock, Heart, Download, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { ExportService } from '@/services/export.service';

export default function CreatePage() {
  const t = useTranslation();
  const {
    form,
    selectedTemplate,
    setSelectedTemplate,
    lastSaved,
    saveDraft,
    clearForm,
    isFormDirty,
  } = useBioDataForm();

  const { addToast } = useToast();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [draftName, setDraftName] = useState('');
  const [zoomLevel, setZoomLevel] = useState(50);
  const previewRef = useRef<HTMLDivElement>(null);

  /** Wait for next paint so zoom change is applied before capture */
  const waitForPaint = () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
  /** Extra delay so 100% zoom is fully rendered before capture */
  const EXPORT_ZOOM_DELAY_MS = 350;

  const {
    register,
    control,
    formState: { errors },
    watch,
    setValue,
  } = form;

  const formData = watch();

  const handleSaveDraft = () => {
    if (!draftName.trim()) {
      addToast('error', t('create.toast.enterDraftName'));
      return;
    }

    const draftId = saveDraft(draftName);
    if (draftId) {
      addToast('success', t('create.toast.draftSaved'));
      setShowSaveModal(false);
      setDraftName('');
    } else {
      addToast('error', t('create.toast.draftLoadFailed'));
    }
  };

  const handleLoadDraft = (draftId: string) => {
    const draft = LocalStorageService.loadDraft(draftId);
    if (draft) {
      form.reset(draft);
      addToast('success', t('create.toast.draftSaved'));
      setShowLoadModal(false);
    } else {
      addToast('error', t('create.toast.draftLoadFailed'));
    }
  };

  const handleDeleteDraft = (draftId: string) => {
    if (confirm(t('create.confirmDeleteDraft'))) {
      const success = LocalStorageService.deleteDraft(draftId);
      if (success) {
        addToast('success', t('create.toast.draftDeleted'));
        setShowLoadModal(false);
      } else {
        addToast('error', t('create.toast.draftDeleteFailed'));
      }
    }
  };

  const handleClearForm = () => {
    if (confirm(t('create.confirmClearForm'))) {
      clearForm();
      addToast('info', t('create.toast.formCleared'));
    }
  };

  const drafts = LocalStorageService.getAllDrafts();

  const handleExportPDF = async () => {
    if (!previewRef.current) {
      addToast('error', t('create.toast.previewNotReady'));
      return;
    }
    setZoomLevel(100);
    await waitForPaint();
    await new Promise((r) => setTimeout(r, EXPORT_ZOOM_DELAY_MS));
    addToast('info', t('create.toast.generatingPdf'), 2000);
    try {
      const result = await ExportService.exportToPDF(
        previewRef.current,
        `biodata-${formData.personalInfo?.fullName || 'document'}.pdf`
      );
      if (result.success) {
        addToast('success', t('create.toast.pdfDownloaded'));
      } else {
        addToast('error', result.error || t('create.toast.pdfFailed'));
      }
    } finally {
      setZoomLevel(50);
    }
  };

  const handleExportImage = async () => {
    if (!previewRef.current) {
      addToast('error', t('create.toast.previewNotReady'));
      return;
    }
    setZoomLevel(100);
    await waitForPaint();
    await new Promise((r) => setTimeout(r, EXPORT_ZOOM_DELAY_MS));
    addToast('info', t('create.toast.generatingImage'), 2000);
    try {
      const result = await ExportService.exportToImage(
        previewRef.current,
        'png',
        `biodata-${formData.personalInfo?.fullName || 'document'}.png`
      );
      if (result.success) {
        addToast('success', t('create.toast.imageDownloaded'));
      } else {
        addToast('error', result.error || t('create.toast.imageFailed'));
      }
    } finally {
      setZoomLevel(50);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S to save draft
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        setShowSaveModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-emerald-600 transition-colors hover:text-emerald-700">
                <Heart className="h-6 w-6" />
                <span className="hidden sm:inline">{t('create.bioDataMaker')}</span>
              </Link>
              <LanguageSwitcher className="hidden sm:inline-flex" />
              {lastSaved && (
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t('create.saved')} {lastSaved.toLocaleTimeString()}</span>
                  <span className="sm:hidden">{t('create.saved')}</span>
                </div>
              )}
              {isFormDirty && (
                <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-700">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                  {t('create.unsaved')}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <Download className="mr-1.5 h-4 w-4" />
                <span className="hidden sm:inline">PDF</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportImage}>
                <ImageIcon className="mr-1.5 h-4 w-4" />
                <span className="hidden sm:inline">Image</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowLoadModal(true)}>
                <FileText className="mr-1.5 h-4 w-4" />
                <span className="hidden sm:inline">{t('common.load')}</span>
              </Button>
              <Button variant="primary" size="sm" onClick={() => setShowSaveModal(true)}>
                <Save className="mr-1.5 h-4 w-4" />
                <span className="hidden sm:inline">{t('common.save')}</span>
              </Button>
              <Button variant="danger" size="sm" onClick={handleClearForm} className="hidden sm:flex">
                <Trash2 className="mr-1.5 h-4 w-4" />
                {t('create.clearForm')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Section Navigator */}
      <SectionNavigator />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Form Column */}
          <div className="space-y-8">
            {/* Template Selector */}
            <div className="animate-slideInUp rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <Select
                label={t('create.chooseTemplate')}
                options={[
                  { value: 'modern', label: `🎨 ${t('create.templateModern')}` },
                  { value: 'traditional', label: `📜 ${t('create.templateTraditional')}` },
                  { value: 'elegant', label: `✨ ${t('create.templateElegant')}` },
                ]}
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value as any)}
              />
              <p className="mt-2 text-xs text-slate-500">
                💡 {t('create.templateTip')}
              </p>
            </div>

            {/* Form Sections */}
            <form className="space-y-8" role="main" aria-label="Bio data form">
              <PersonalInfoSection 
                register={register} 
                errors={errors} 
                setValue={setValue}
                watch={watch}
              />
              <ReligiousInfoSection register={register} errors={errors} />
              <EducationSection register={register} errors={errors} />
              <ProfessionalSection register={register} errors={errors} />
              <FamilySection register={register} errors={errors} control={control} />
              <ContactSection register={register} errors={errors} />
              <PhotoUploadSection
                value={formData.photo}
                onChange={(photo) => setValue('photo', photo)}
              />
              <ExpectationsSection register={register} errors={errors} />
            </form>
          </div>

          {/* Preview Column - visible on all viewports so PDF/Image export works on mobile */}
          <div>
            <PreviewPanel 
              bioData={formData} 
              template={selectedTemplate}
              showMobilePreview={true}
              exportRef={previewRef}
              zoomLevel={zoomLevel}
              setZoomLevel={setZoomLevel}
              onExportPDF={handleExportPDF}
              onExportImage={handleExportImage}
            />
          </div>
        </div>
      </div>

      {/* Save Draft Modal */}
      <Modal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        title={t('create.saveDraftModal.title')}
        description={t('create.saveDraftModal.description')}
      >
        <div className="space-y-4">
          <Input
            type="text"
            placeholder={t('create.saveDraftModal.draftNamePlaceholder')}
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            label={t('create.saveDraftModal.draftName')}
            required
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSaveDraft();
              }
            }}
          />
          <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-800">
            <p className="font-medium">💾 {t('create.saveDraftModal.autoSaveNote')}</p>
            <p className="mt-1 text-blue-600">{t('create.saveDraftModal.autoSaveDetail')}</p>
          </div>
        </div>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowSaveModal(false)}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" onClick={handleSaveDraft}>
            <Save className="mr-1.5 h-4 w-4" />
            {t('create.saveDraft')}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Load Draft Modal */}
      <Modal
        isOpen={showLoadModal}
        onClose={() => setShowLoadModal(false)}
        title={t('create.loadDraftModal.title')}
        description={t('create.loadDraftModal.description')}
        size="lg"
      >
        {drafts.length === 0 ? (
          <div className="py-8 text-center text-slate-500">
            <FileText className="mx-auto mb-3 h-12 w-12 text-slate-300" />
            <p>{t('create.loadDraftModal.noDrafts')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 p-4 hover:border-emerald-500 hover:bg-emerald-50/30"
              >
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{draft.name}</p>
                  <p className="text-sm text-slate-500">
                    {new Date(draft.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleLoadDraft(draft.id)}
                  >
                    {t('common.load')}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteDraft(draft.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
