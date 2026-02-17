/**
 * Photo Upload Section Component
 * Single Responsibility: Handle profile photo upload
 */

'use client';

import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';
import { Upload, X, User } from 'lucide-react';
import { fileToBase64 } from '@/lib/utils';

interface PhotoUploadSectionProps {
  value?: string;
  onChange: (base64: string | undefined) => void;
}

export const PhotoUploadSection: React.FC<PhotoUploadSectionProps> = ({ value, onChange }) => {
  const t = useLanguage().t;
  const [preview, setPreview] = useState<string | undefined>(value);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError(t('form.photo.errorImageOnly'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(t('form.photo.errorSize'));
      return;
    }

    setError('');
    setIsUploading(true);

    try {
      const base64 = await fileToBase64(file);
      setPreview(base64);
      onChange(base64);
    } catch (err) {
      setError(t('form.photo.errorUpload'));
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(undefined);
    onChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card id="photo">
      <CardHeader>
        <CardTitle>{t('form.photo.title')}</CardTitle>
        <CardDescription>{t('form.photo.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="relative h-48 w-48 overflow-hidden rounded-lg border-2 border-dashed border-slate-300 bg-slate-50">
            {preview ? (
              <>
                <img
                  src={preview}
                  alt={t('common.profile')}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white shadow-lg transition-colors hover:bg-red-600"
                  aria-label={t('form.photo.removePhoto')}
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center text-slate-400">
                <User className="mb-2 h-16 w-16" />
                <p className="text-sm">{t('form.photo.noPhoto')}</p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <Button
            type="button"
            variant="outline"
            onClick={handleClick}
            isLoading={isUploading}
            disabled={isUploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {preview ? t('form.photo.changePhoto') : t('form.photo.uploadPhoto')}
          </Button>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <p className="text-center text-xs text-slate-500">
            {t('form.photo.recommended')}
            <br />
            {t('form.photo.acceptedFormats')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
