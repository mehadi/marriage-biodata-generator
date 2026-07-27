/**
 * Create Bio Data Page
 * Enhanced with: mobile tab navigation, demo mode, shareable link,
 * WhatsApp export, dark mode toggle, section-reorder, and analytics
 */

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useBioDataForm } from '@/hooks/useBioDataForm';
import { SortableFormSections, DEFAULT_SECTION_ORDER, SectionId } from '@/components/form/SortableFormSections';
import { PreviewPanel } from '@/components/PreviewPanel';
import { SectionNavigator } from '@/components/form/SectionNavigator';
import { TemplateSelector } from '@/components/form/TemplateSelector';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { useTranslation } from '@/context/LanguageContext';
import { LocalStorageService } from '@/services/localStorage.service';
import { AnalyticsService } from '@/services/analytics.service';
import { encodeStateToUrl, copyToClipboard, decodeStateFromUrl, decodeTemplateFromUrl, consumeOnboardingSession } from '@/lib/shareState';
import {
  Save,
  FileText,
  Trash2,
  Clock,
  Heart,
  Download,
  Image as ImageIcon,
  Printer,
  ChevronDown,
  Edit3,
  Eye,
  Share2,
  Smartphone,
  FlaskConical,
  ServerIcon,
} from 'lucide-react';
import Link from 'next/link';

type MobileTab = 'edit' | 'preview';

export default function CreatePage() {
  const t = useTranslation();
  const {
    form,
    selectedTemplate,
    setSelectedTemplate,
    lastSaved,
    saveDraft,
    loadDraft,
    loadDemoData,
    clearForm,
    isFormDirty,
    sectionCompletion,
    completionPercent,
  } = useBioDataForm();

  const { addToast } = useToast();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [zoomLevel, setZoomLevel] = useState(50);
  const [mobileTab, setMobileTab] = useState<MobileTab>('edit');
  const [sectionOrder, setSectionOrder] = useState<SectionId[]>(DEFAULT_SECTION_ORDER);
  const [shareUrl, setShareUrl] = useState<string>('');
  const previewRef = useRef<HTMLDivElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const exportMenuPanelRef = useRef<HTMLDivElement>(null);
  const exportTriggerRef = useRef<HTMLButtonElement>(null);

  const waitForPaint = () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
  const EXPORT_ZOOM_DELAY_MS = 350;

  const {
    register,
    control,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = form;

  const formData = watch();

  // On mount: apply onboarding wizard data (sessionStorage) or a shared URL link (hash)
  useEffect(() => {
    // 1. Check for onboarding wizard data first (highest priority)
    const { data: onboardingData, template: onboardingTemplate } = consumeOnboardingSession();

    if (onboardingTemplate) {
      setSelectedTemplate(onboardingTemplate);
    }

    if (onboardingData) {
      // Merge with a full blank form so react-hook-form receives all required keys
      reset({
        personalInfo: { fullName: '', dateOfBirth: '', height: '', complexion: '', bloodGroup: '', maritalStatus: 'Never Married', nationality: '', placeOfBirth: '', gender: undefined },
        religiousInfo: { prayerPractice: '', quranRecitation: '', islamicKnowledge: '', hijabOrBeard: '', sect: '', madhab: '', otherReligiousInfo: '' },
        education: { highestQualification: '', institution: '', fieldOfStudy: '', yearOfCompletion: '', additionalQualifications: '' },
        professionalInfo: { occupation: '', company: '', designation: '', incomeRange: '', workLocation: '' },
        familyInfo: { fatherName: '', fatherOccupation: '', motherName: '', motherOccupation: '', siblings: [], familyValues: '', economicStatus: 'Middle class', familyType: 'Nuclear' },
        contactInfo: { email: '', phone: '', whatsapp: '', permanentAddress: '', currentAddress: '', guardianContact: '' },
        partnerExpectations: { ageRange: '', heightRange: '', educationExpectation: '', occupationExpectation: '', religiousExpectation: '', otherExpectations: '' },
        customFields: { 'personal-info': [], 'religious-info': [], education: [], professional: [], family: [], contact: [], expectations: [] },
        additionalInfo: '',
        photoSizePercent: 100,
        ...onboardingData,
      });
      addToast('info', t('create.toast.onboardingLoaded'));
      return; // Skip URL hash check when onboarding data is present
    }

    // 2. Fall back to URL hash for shareable links
    const sharedState = decodeStateFromUrl();
    const templateFromUrl = decodeTemplateFromUrl();

    if (templateFromUrl) {
      setSelectedTemplate(templateFromUrl as Parameters<typeof setSelectedTemplate>[0]);
    }

    if (sharedState) {
      reset({
        personalInfo: { fullName: '', dateOfBirth: '', height: '', complexion: '', bloodGroup: '', maritalStatus: 'Never Married', nationality: '', placeOfBirth: '', gender: undefined },
        religiousInfo: { prayerPractice: '', quranRecitation: '', islamicKnowledge: '', hijabOrBeard: '', sect: '', madhab: '', otherReligiousInfo: '' },
        education: { highestQualification: '', institution: '', fieldOfStudy: '', yearOfCompletion: '', additionalQualifications: '' },
        professionalInfo: { occupation: '', company: '', designation: '', incomeRange: '', workLocation: '' },
        familyInfo: { fatherName: '', fatherOccupation: '', motherName: '', motherOccupation: '', siblings: [], familyValues: '', economicStatus: 'Middle class', familyType: 'Nuclear' },
        contactInfo: { email: '', phone: '', whatsapp: '', permanentAddress: '', currentAddress: '', guardianContact: '' },
        partnerExpectations: { ageRange: '', heightRange: '', educationExpectation: '', occupationExpectation: '', religiousExpectation: '', otherExpectations: '' },
        customFields: { 'personal-info': [], 'religious-info': [], education: [], professional: [], family: [], contact: [], expectations: [] },
        additionalInfo: '',
        photoSizePercent: 100,
        ...sharedState,
      });
      addToast('info', t('create.toast.sharedBioLoaded'));
    }

    // Clear the hash so refresh doesn't re-load
    if (sharedState || templateFromUrl) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Compute shareable URL debounced — used for the QR code footer
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window === 'undefined') return;
      try {
        const { photo: _p, ...dataWithoutPhoto } = formData as Parameters<typeof encodeStateToUrl>[0] & { photo?: unknown };
        const json = JSON.stringify(dataWithoutPhoto);
        const encoded = btoa(encodeURIComponent(json));
        setShareUrl(`${window.location.origin}/create#data=${encoded}`);
      } catch {
        // Non-critical — QR code simply won't render
      }
    }, 1500);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  // Close export menu on outside click or Escape; Escape also refocuses the trigger
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowExportMenu(false);
        exportTriggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Auto-focus the first export menu item when it opens, for keyboard users
  useEffect(() => {
    if (showExportMenu) {
      exportMenuPanelRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus();
    }
  }, [showExportMenu]);

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
      loadDraft(draftId);
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

  const handleLoadDemo = () => {
    if (confirm(t('create.confirmLoadDemo'))) {
      loadDemoData();
      addToast('success', t('create.toast.demoLoaded'));
    }
  };

  const handleSharePreview = async () => {
    const url = encodeStateToUrl(formData);
    const copied = await copyToClipboard(url);
    if (copied) {
      addToast('success', t('create.shareLinkCopied'));
      AnalyticsService.trackShareLinkCopied();
    } else {
      addToast('error', t('create.shareLinkFailed'));
    }
  };

  const drafts = LocalStorageService.getAllDrafts();

  const withZoom = async (fn: () => Promise<void>) => {
    setZoomLevel(100);
    await waitForPaint();
    await new Promise((r) => setTimeout(r, EXPORT_ZOOM_DELAY_MS));
    try {
      await fn();
    } finally {
      setZoomLevel(50);
    }
  };

  const handleExportPDF = async () => {
    setShowExportMenu(false);
    if (!previewRef.current) {
      addToast('error', t('create.toast.previewNotReady'));
      return;
    }
    AnalyticsService.trackExportTriggered('pdf');
    addToast('info', t('create.toast.generatingPdf'), 2000);
    const { ExportService } = await import('@/services/export.service');
    await withZoom(async () => {
      const result = await ExportService.exportToPDF(
        previewRef.current!,
        `biodata-${formData.personalInfo?.fullName || 'document'}.pdf`
      );
      if (result.success) {
        addToast('success', t('create.toast.pdfDownloaded'));
        AnalyticsService.trackExportSuccess('pdf');
      } else {
        addToast('error', result.error || t('create.toast.pdfFailed'));
        AnalyticsService.trackExportFailed('pdf', result.error || 'unknown');
      }
    });
  };

  const handleExportImage = async () => {
    setShowExportMenu(false);
    if (!previewRef.current) {
      addToast('error', t('create.toast.previewNotReady'));
      return;
    }
    AnalyticsService.trackExportTriggered('image');
    addToast('info', t('create.toast.generatingImage'), 2000);
    const { ExportService } = await import('@/services/export.service');
    await withZoom(async () => {
      const result = await ExportService.exportToImage(
        previewRef.current!,
        'png',
        `biodata-${formData.personalInfo?.fullName || 'document'}.png`
      );
      if (result.success) {
        addToast('success', t('create.toast.imageDownloaded'));
        AnalyticsService.trackExportSuccess('image');
      } else {
        addToast('error', result.error || t('create.toast.imageFailed'));
        AnalyticsService.trackExportFailed('image', result.error || 'unknown');
      }
    });
  };

  const handleExportWhatsApp = async () => {
    setShowExportMenu(false);
    if (!previewRef.current) {
      addToast('error', t('create.toast.previewNotReady'));
      return;
    }
    AnalyticsService.trackExportTriggered('whatsapp');
    addToast('info', t('create.toast.generatingWhatsapp'), 2000);
    const { ExportService } = await import('@/services/export.service');
    await withZoom(async () => {
      const result = await ExportService.exportToWhatsAppCard(
        previewRef.current!,
        `biodata-whatsapp-${formData.personalInfo?.fullName || 'document'}.png`
      );
      if (result.success) {
        addToast('success', t('create.toast.whatsappDownloaded'));
        AnalyticsService.trackExportSuccess('whatsapp');
      } else {
        addToast('error', result.error || t('create.toast.whatsappFailed'));
        AnalyticsService.trackExportFailed('whatsapp', result.error || 'unknown');
      }
    });
  };

  const handlePrint = async () => {
    setShowExportMenu(false);
    if (!previewRef.current) {
      addToast('error', t('create.toast.previewNotReady'));
      return;
    }
    AnalyticsService.trackExportTriggered('print');
    const { ExportService } = await import('@/services/export.service');
    const result = ExportService.preparePrint(previewRef.current);
    if (result.success) {
      AnalyticsService.trackExportSuccess('print');
    } else {
      addToast('error', result.error || 'Print failed');
      AnalyticsService.trackExportFailed('print', result.error || 'unknown');
    }
  };

  const handleExportServerPDF = useCallback(async () => {
    setShowExportMenu(false);
    AnalyticsService.trackExportTriggered('server-pdf');
    addToast('info', 'Generating high-quality PDF on server…', 3000);
    const filename = `biodata-${formData.personalInfo?.fullName || 'document'}.pdf`;
    const { ExportService } = await import('@/services/export.service');
    const result = await ExportService.exportToPDFServerSide(formData, filename);
    if (result.success) {
      addToast('success', 'Server PDF downloaded!');
      AnalyticsService.trackExportSuccess('server-pdf');
    } else {
      addToast('error', result.error || 'Server PDF failed.');
      AnalyticsService.trackExportFailed('server-pdf', result.error ?? 'unknown');
    }
  }, [formData, addToast, t]);

  // Keyboard shortcut: Ctrl/Cmd+S → save draft
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        setShowSaveModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm dark:border-slate-700 dark:bg-slate-900/95">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            {/* Left: brand + status */}
            <div className="flex min-w-0 items-center gap-3">
              <Link
                href="/"
                className="flex shrink-0 items-center gap-2 text-xl font-bold text-emerald-600 transition-colors hover:text-emerald-700"
              >
                <Heart className="h-5 w-5" />
                <span className="hidden sm:inline">{t('create.bioDataMaker')}</span>
              </Link>

              <LanguageSwitcher className="hidden md:inline-flex" />

              {lastSaved && (
                <div className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700 sm:flex dark:bg-emerald-900/30 dark:text-emerald-400">
                  <Clock className="h-3 w-3" />
                  <span>{t('create.saved')} {lastSaved.toLocaleTimeString()}</span>
                </div>
              )}

              {isFormDirty && (
                <span className="hidden items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs text-amber-700 sm:flex dark:bg-amber-900/30 dark:text-amber-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                  {t('create.unsaved')}
                </span>
              )}
            </div>

            {/* Right: actions */}
            <div className="flex shrink-0 items-center gap-2">
              <DarkModeToggle />

              {/* Demo button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLoadDemo}
                title={t('create.loadDemoTitle')}
                className="hidden sm:flex"
              >
                <FlaskConical className="mr-1.5 h-4 w-4 text-violet-500" />
                <span className="hidden lg:inline">{t('create.loadDemo')}</span>
              </Button>

              {/* Share */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSharePreview}
                title={t('create.sharePreview')}
              >
                <Share2 className="mr-1.5 h-4 w-4 text-blue-500" />
                <span className="hidden lg:inline">{t('create.sharePreview')}</span>
              </Button>

              {/* Export dropdown */}
              <div ref={exportMenuRef} className="relative">
                <Button
                  ref={exportTriggerRef}
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExportMenu((prev) => !prev)}
                  aria-haspopup="true"
                  aria-expanded={showExportMenu}
                  aria-controls="export-menu"
                >
                  <Download className="mr-1.5 h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                  <ChevronDown className="ml-1 h-3.5 w-3.5" />
                </Button>

                {showExportMenu && (
                  <div
                    id="export-menu"
                    role="menu"
                    ref={exportMenuPanelRef}
                    aria-label="Export options"
                    onKeyDown={(e) => {
                      const items = Array.from(
                        exportMenuPanelRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? []
                      );
                      const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement);
                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        items[(currentIndex + 1) % items.length]?.focus();
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        items[(currentIndex - 1 + items.length) % items.length]?.focus();
                      }
                    }}
                    className="absolute right-0 top-full z-50 mt-1.5 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl animate-scaleIn dark:border-slate-700 dark:bg-slate-800"
                  >
                    <button
                      role="menuitem"
                      onClick={handleExportPDF}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-emerald-900/20"
                    >
                      <Download className="h-4 w-4 text-emerald-600" />
                      PDF
                    </button>
                    <button
                      role="menuitem"
                      onClick={handleExportImage}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-emerald-900/20"
                    >
                      <ImageIcon className="h-4 w-4 text-blue-500" />
                      Image (PNG)
                    </button>
                    <button
                      role="menuitem"
                      onClick={handleExportWhatsApp}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-emerald-900/20"
                    >
                      <Smartphone className="h-4 w-4 text-green-500" />
                      WhatsApp Card
                    </button>
                    <button
                      role="menuitem"
                      onClick={handleExportServerPDF}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-emerald-900/20"
                    >
                      <ServerIcon className="h-4 w-4 text-violet-500" />
                      Server PDF
                    </button>
                    <button
                      role="menuitem"
                      onClick={handlePrint}
                      className="flex w-full items-center gap-3 border-t border-slate-100 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-emerald-900/20"
                    >
                      <Printer className="h-4 w-4 text-slate-500" />
                      Print
                    </button>
                  </div>
                )}
              </div>

              {/* Draft actions */}
              <Button variant="outline" size="sm" onClick={() => setShowLoadModal(true)} className="hidden sm:flex">
                <FileText className="mr-1.5 h-4 w-4" />
                <span className="hidden sm:inline">{t('common.load')}</span>
              </Button>

              <Button variant="primary" size="sm" onClick={() => setShowSaveModal(true)}>
                <Save className="mr-1.5 h-4 w-4" />
                <span className="hidden sm:inline">{t('common.save')}</span>
              </Button>

              <Button variant="danger" size="sm" onClick={handleClearForm} className="hidden lg:flex">
                <Trash2 className="mr-1.5 h-4 w-4" />
                {t('create.clearForm')}
              </Button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 flex items-center gap-3">
            <div className="relative flex-1 overflow-hidden rounded-full bg-slate-100 h-1.5 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500 ease-out"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            <span className="shrink-0 text-xs font-medium text-slate-500 dark:text-slate-400">
              {completionPercent}%
            </span>
          </div>
        </div>
      </header>

      {/* Section Navigator — desktop only */}
      <div className="hidden lg:block">
        <SectionNavigator sectionCompletion={sectionCompletion} />
      </div>

      {/* ── Mobile Tab Bar ── */}
      <div className="sticky top-[73px] z-40 flex border-b border-slate-200 bg-white shadow-sm lg:hidden dark:border-slate-700 dark:bg-slate-900">
        <button
          onClick={() => setMobileTab('edit')}
          className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
            mobileTab === 'edit'
              ? 'border-b-2 border-emerald-600 text-emerald-600'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Edit3 className="h-4 w-4" />
          {t('create.editTab')}
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
            mobileTab === 'preview'
              ? 'border-b-2 border-emerald-600 text-emerald-600'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Eye className="h-4 w-4" />
          {t('create.previewTab')}
        </button>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:pl-52">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Form Column */}
          <div className={`space-y-8 ${mobileTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
            {/* Visual Template Selector */}
            <div className="animate-slideInUp rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
              <TemplateSelector
                value={selectedTemplate}
                onChange={setSelectedTemplate}
              />
            </div>

            {/* Form Sections — drag-and-drop reorderable */}
            <div id="main-content" role="main" aria-label="Bio data form">
              <SortableFormSections
                register={register}
                errors={errors}
                control={control}
                setValue={setValue}
                watch={watch}
                formData={formData}
                initialOrder={sectionOrder}
                onOrderChange={(newOrder) => {
                  setSectionOrder(newOrder);
                  setValue('sectionOrder', newOrder);
                }}
              />
            </div>
          </div>

          {/* Preview Column */}
          <div className={mobileTab === 'edit' ? 'hidden lg:block' : 'block'}>
            <PreviewPanel
              bioData={formData}
              template={selectedTemplate}
              showMobilePreview={false}
              exportRef={previewRef}
              zoomLevel={zoomLevel}
              setZoomLevel={setZoomLevel}
              onExportPDF={handleExportPDF}
              onExportImage={handleExportImage}
              onPhotoSizeChange={(percent) => setValue('photoSizePercent', percent)}
              shareUrl={shareUrl || undefined}
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
              if (e.key === 'Enter') handleSaveDraft();
            }}
          />
          <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            <p className="flex items-center gap-1.5 font-medium">
              <Save className="h-3.5 w-3.5 shrink-0" />
              {t('create.saveDraftModal.autoSaveNote')}
            </p>
            <p className="mt-1 text-blue-600 dark:text-blue-400">{t('create.saveDraftModal.autoSaveDetail')}</p>
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
                className="flex items-center justify-between rounded-lg border border-slate-200 p-4 hover:border-emerald-500 hover:bg-emerald-50/30 dark:border-slate-700 dark:hover:border-emerald-600"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-900 dark:text-slate-100">{draft.name}</p>
                  <p className="text-sm text-slate-500">
                    {new Date(draft.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="ml-3 flex shrink-0 gap-2">
                  <Button variant="primary" size="sm" onClick={() => handleLoadDraft(draft.id)}>
                    {t('common.load')}
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteDraft(draft.id)}>
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
