/**
 * Preview Panel Component
 * Enhanced with mobile preview modal and better UX
 */

'use client';

import React, { useRef, useState } from 'react';
import { BioData, TemplateType } from '@/types/biodata';
import { ModernTemplate } from './templates/ModernTemplate';
import { TraditionalTemplate } from './templates/TraditionalTemplate';
import { ElegantTemplate } from './templates/ElegantTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { GradientTemplate } from './templates/GradientTemplate';
import { CardTemplate } from './templates/CardTemplate';
import { FormalTemplate } from './templates/FormalTemplate';
import { HeritageTemplate } from './templates/HeritageTemplate';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { ExportService } from '@/services/export.service';
import { useLanguage } from '@/context/LanguageContext';
import { Download, Image as ImageIcon, Eye, ZoomOut, ZoomIn } from 'lucide-react';
import { useToast } from './ui/Toast';

interface PreviewPanelProps {
  bioData: Partial<BioData>;
  template: TemplateType;
  showMobilePreview?: boolean;
  /** Optional ref for parent to access preview element (e.g. for header export buttons) */
  exportRef?: React.MutableRefObject<HTMLDivElement | null>;
  /** Optional controlled zoom (e.g. for export-at-200% flow). If not provided, zoom is internal. */
  zoomLevel?: number;
  setZoomLevel?: (value: number | ((prev: number) => number)) => void;
  /** Optional export handlers from parent (run with 200% zoom then restore 50%). If not provided, use internal export. */
  onExportPDF?: () => Promise<void>;
  onExportImage?: () => Promise<void>;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ 
  bioData, 
  template,
  showMobilePreview = false,
  exportRef,
  zoomLevel: zoomLevelProp,
  setZoomLevel: setZoomLevelProp,
  onExportPDF,
  onExportImage,
}) => {
  const previewRef = useRef<HTMLDivElement>(null);

  const setPreviewRef = (el: HTMLDivElement | null) => {
    (previewRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    if (exportRef) exportRef.current = el;
  };
  const { addToast } = useToast();
  const t = useLanguage().t;
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [internalZoom, setInternalZoom] = useState(50);

  const zoomLevel = zoomLevelProp ?? internalZoom;
  const setZoomLevel = setZoomLevelProp ?? setInternalZoom;

  const handleExportPDF = async () => {
    if (onExportPDF) {
      await onExportPDF();
      return;
    }
    if (!previewRef.current) return;

    addToast('info', t('create.toast.generatingPdf'), 2000);
    const result = await ExportService.exportToPDF(
      previewRef.current,
      `biodata-${bioData.personalInfo?.fullName || 'document'}.pdf`
    );

    if (result.success) {
      addToast('success', t('create.toast.pdfDownloaded'));
    } else {
      addToast('error', result.error || t('create.toast.pdfFailed'));
    }
  };

  const handleExportImage = async () => {
    if (onExportImage) {
      await onExportImage();
      return;
    }
    if (!previewRef.current) return;

    addToast('info', t('create.toast.generatingImage'), 2000);
    const result = await ExportService.exportToImage(
      previewRef.current,
      'png',
      `biodata-${bioData.personalInfo?.fullName || 'document'}.png`
    );

    if (result.success) {
      addToast('success', t('create.toast.imageDownloaded'));
    } else {
      addToast('error', result.error || t('create.toast.imageFailed'));
    }
  };

  const renderTemplate = () => {
    const fullBioData = bioData as BioData;
    switch (template) {
      case 'traditional':
        return <TraditionalTemplate bioData={fullBioData} />;
      case 'elegant':
        return <ElegantTemplate bioData={fullBioData} />;
      case 'minimal':
        return <MinimalTemplate bioData={fullBioData} />;
      case 'gradient':
        return <GradientTemplate bioData={fullBioData} />;
      case 'card':
        return <CardTemplate bioData={fullBioData} />;
      case 'formal':
        return <FormalTemplate bioData={fullBioData} />;
      case 'heritage':
        return <HeritageTemplate bioData={fullBioData} />;
      case 'modern':
      default:
        return <ModernTemplate bioData={fullBioData} />;
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 100));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 30));
  };

  return (
    <>
      {/* Preview Panel - visible on all viewports so export (PDF/Image) works on mobile */}
      <div className="sticky top-4 space-y-4">
        {/* Export Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            <Button onClick={handleExportPDF} variant="primary" size="sm">
              <Download className="mr-1.5 h-4 w-4" />
              PDF
            </Button>
            <Button onClick={handleExportImage} variant="secondary" size="sm">
              <ImageIcon className="mr-1.5 h-4 w-4" />
              Image
            </Button>
          </div>
          
          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleZoomOut} 
              variant="ghost" 
              size="sm"
              iconOnly
              aria-label={t('common.zoomOut')}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs font-medium text-slate-600">{zoomLevel}%</span>
            <Button 
              onClick={handleZoomIn} 
              variant="ghost" 
              size="sm"
              iconOnly
              aria-label={t('common.zoomIn')}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Preview Container */}
        <div className="overflow-hidden rounded-xl border border-slate-200 shadow-lg transition-shadow duration-200 hover:shadow-xl">
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto bg-slate-100 p-4">
            <div 
              ref={setPreviewRef} 
              className="origin-top transform transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              {renderTemplate()}
            </div>
          </div>
        </div>

        {/* Preview Info */}
        <div className="rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800">
          <p className="font-medium">{t('preview.livePreview')}</p>
          <p className="mt-1 text-emerald-600">{t('preview.previewScale', { percent: String(zoomLevel) })}</p>
        </div>
      </div>

      {/* Mobile Preview Button (FAB) */}
      {showMobilePreview && (
        <button
          onClick={() => setIsPreviewModalOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-emerald-700 hover:shadow-xl active:scale-95 lg:hidden"
          aria-label={t('preview.openPreview')}
        >
          <Eye className="h-6 w-6" />
        </button>
      )}

      {/* Mobile Preview Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title={t('preview.bioDataPreview')}
        size="full"
      >
        <div className="space-y-4">
          {/* Export Buttons in Modal */}
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => {
                handleExportPDF();
                setIsPreviewModalOpen(false);
              }} 
              variant="primary" 
              size="sm"
            >
              <Download className="mr-1.5 h-4 w-4" />
              PDF
            </Button>
            <Button 
              onClick={() => {
                handleExportImage();
                setIsPreviewModalOpen(false);
              }} 
              variant="secondary" 
              size="sm"
            >
              <ImageIcon className="mr-1.5 h-4 w-4" />
              Image
            </Button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center justify-between rounded-lg bg-slate-100 p-3">
            <span className="text-sm font-medium text-slate-700">{t('preview.zoom')}</span>
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleZoomOut} 
                variant="ghost" 
                size="sm"
                iconOnly
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="min-w-[3rem] text-center text-sm font-semibold text-slate-900">
                {zoomLevel}%
              </span>
              <Button 
                onClick={handleZoomIn} 
                variant="ghost" 
                size="sm"
                iconOnly
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Preview */}
          <div className="overflow-auto rounded-lg border border-slate-200 bg-slate-100 p-4" style={{ maxHeight: '60vh' }}>
            <div 
              className="origin-top-left transform transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              {renderTemplate()}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
