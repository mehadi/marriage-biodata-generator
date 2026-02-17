/**
 * Contact Section Component
 * Single Responsibility: Handle contact information form fields
 */

'use client';

import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { BioData } from '@/types/biodata';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { useLanguage } from '@/context/LanguageContext';
import { Mail, Phone, MessageCircle } from 'lucide-react';

interface ContactSectionProps {
  register: UseFormRegister<BioData>;
  errors: FieldErrors<BioData>;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ register, errors }) => {
  const t = useLanguage().t;

  return (
    <Card id="contact">
      <CardHeader>
        <CardTitle>{t('form.contact.title')}</CardTitle>
        <CardDescription>{t('form.contact.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label={t('form.contact.email')}
            type="email"
            placeholder={t('form.contact.emailPlaceholder')}
            icon={<Mail className="h-4 w-4" />}
            {...register('contactInfo.email')}
            error={errors.contactInfo?.email?.message ? t(errors.contactInfo.email.message as string) : undefined}
          />

          <Input
            label={t('form.contact.phone')}
            type="tel"
            placeholder={t('form.contact.phonePlaceholder')}
            icon={<Phone className="h-4 w-4" />}
            {...register('contactInfo.phone')}
            error={errors.contactInfo?.phone?.message ? t(errors.contactInfo.phone.message as string) : undefined}
          />

          <Input
            label={t('form.contact.whatsapp')}
            type="tel"
            placeholder={t('form.contact.phonePlaceholder')}
            icon={<MessageCircle className="h-4 w-4" />}
            {...register('contactInfo.whatsapp')}
            error={errors.contactInfo?.whatsapp?.message ? t(errors.contactInfo.whatsapp.message as string) : undefined}
            hint={t('form.contact.whatsappHint')}
          />

          <Input
            label={t('form.contact.guardianContact')}
            type="tel"
            placeholder={t('form.contact.guardianPlaceholder')}
            icon={<Phone className="h-4 w-4" />}
            {...register('contactInfo.guardianContact')}
            error={errors.contactInfo?.guardianContact?.message ? t(errors.contactInfo.guardianContact.message as string) : undefined}
          />

          <div className="md:col-span-2">
            <Textarea
              label={t('form.contact.permanentAddress')}
              placeholder={t('form.contact.permanentAddressPlaceholder')}
              rows={3}
              {...register('contactInfo.permanentAddress')}
              error={errors.contactInfo?.permanentAddress?.message ? t(errors.contactInfo.permanentAddress.message as string) : undefined}
            />
          </div>

          <div className="md:col-span-2">
            <Textarea
              label={t('form.contact.currentAddress')}
              placeholder={t('form.contact.currentAddressPlaceholder')}
              rows={3}
              {...register('contactInfo.currentAddress')}
              error={errors.contactInfo?.currentAddress?.message ? t(errors.contactInfo.currentAddress.message as string) : undefined}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
