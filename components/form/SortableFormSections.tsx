/**
 * SortableFormSections
 * Wraps bio data form sections in a drag-and-drop sortable context.
 * Section order is persisted in the form state (BioData.sectionOrder).
 */

'use client';

import React, { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { UseFormRegister, FieldErrors, Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { BioData } from '@/types/biodata';
import { PersonalInfoSection } from './PersonalInfoSection';
import { ReligiousInfoSection } from './ReligiousInfoSection';
import { EducationSection } from './EducationSection';
import { ProfessionalSection } from './ProfessionalSection';
import { FamilySection } from './FamilySection';
import { ContactSection } from './ContactSection';
import { PhotoUploadSection } from './PhotoUploadSection';
import { ExpectationsSection } from './ExpectationsSection';
import { useTranslation } from '@/context/LanguageContext';

export type SectionId =
  | 'personal'
  | 'religious'
  | 'education'
  | 'professional'
  | 'family'
  | 'contact'
  | 'photo'
  | 'expectations';

export const DEFAULT_SECTION_ORDER: SectionId[] = [
  'personal',
  'religious',
  'education',
  'professional',
  'family',
  'contact',
  'photo',
  'expectations',
];

interface SectionLabelMap {
  [key: string]: string;
}

interface SortableFormSectionsProps {
  register: UseFormRegister<BioData>;
  errors: FieldErrors<BioData>;
  control: Control<BioData>;
  setValue: UseFormSetValue<BioData>;
  watch: UseFormWatch<BioData>;
  formData: BioData;
  initialOrder?: SectionId[];
  onOrderChange?: (order: SectionId[]) => void;
}

interface SortableSectionProps {
  id: SectionId;
  label: string;
  children: React.ReactNode;
  isDragging?: boolean;
}

const SortableSection: React.FC<SortableSectionProps> = ({ id, label, children, isDragging }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isSorting } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: isSorting ? transition : undefined,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      {/* Drag handle - floats above the top-left of the section card */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`Drag to reorder ${label} section`}
        className="absolute -left-8 top-6 z-10 hidden cursor-grab touch-none rounded p-1 text-slate-400 dark:text-slate-500 opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing lg:flex"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      {children}
    </div>
  );
};

export const SortableFormSections: React.FC<SortableFormSectionsProps> = ({
  register,
  errors,
  control,
  setValue,
  watch,
  formData,
  initialOrder,
  onOrderChange,
}) => {
  const t = useTranslation();
  const [order, setOrder] = useState<SectionId[]>(initialOrder ?? DEFAULT_SECTION_ORDER);
  const [activeId, setActiveId] = useState<SectionId | null>(null);

  const sectionLabels: SectionLabelMap = {
    personal:      t('nav.personal'),
    religious:     t('nav.religious'),
    education:     t('nav.education'),
    professional:  t('nav.professional'),
    family:        t('nav.family'),
    contact:       t('nav.contact'),
    photo:         t('nav.photo'),
    expectations:  t('nav.expectations'),
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as SectionId);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);
      if (!over || active.id === over.id) return;

      setOrder((prev) => {
        const oldIndex = prev.indexOf(active.id as SectionId);
        const newIndex = prev.indexOf(over.id as SectionId);
        const newOrder = arrayMove(prev, oldIndex, newIndex);
        onOrderChange?.(newOrder);
        return newOrder;
      });
    },
    [onOrderChange],
  );

  const renderSection = (id: SectionId): React.ReactNode => {
    switch (id) {
      case 'personal':
        return (
          <PersonalInfoSection
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            control={control}
          />
        );
      case 'religious':
        return <ReligiousInfoSection register={register} errors={errors} control={control} />;
      case 'education':
        return <EducationSection register={register} errors={errors} control={control} />;
      case 'professional':
        return <ProfessionalSection register={register} errors={errors} control={control} />;
      case 'family':
        return <FamilySection register={register} errors={errors} control={control} />;
      case 'contact':
        return <ContactSection register={register} errors={errors} control={control} />;
      case 'photo':
        return (
          <PhotoUploadSection
            value={formData.photo}
            onChange={(photo) => setValue('photo', photo)}
          />
        );
      case 'expectations':
        return <ExpectationsSection register={register} errors={errors} control={control} />;
      default:
        return null;
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={order} strategy={verticalListSortingStrategy}>
        <div className="space-y-8">
          {order.map((id) => (
            <SortableSection
              key={id}
              id={id}
              label={sectionLabels[id] ?? id}
              isDragging={activeId === id}
            >
              {renderSection(id)}
            </SortableSection>
          ))}
        </div>
      </SortableContext>

      {/* Ghost overlay shown while dragging */}
      <DragOverlay>
        {activeId ? (
          <div className="rounded-xl border-2 border-dashed border-emerald-400 bg-emerald-50/50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-lg dark:border-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
            {sectionLabels[activeId] ?? activeId}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
