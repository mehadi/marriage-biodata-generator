/**
 * DatePicker Component
 * Enhanced date picker with easy year selection and better UX
 * Uses react-day-picker for excellent UX and accessibility
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, subYears } from 'date-fns';
import { Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-day-picker/dist/style.css';

interface DatePickerProps {
  label?: string;
  value?: string;
  onChange?: (date: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  hint?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  error,
  required,
  placeholder = 'Select date',
  disabled,
  minDate,
  maxDate,
  hint,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );
  const [displayMonth, setDisplayMonth] = useState<Date>(
    value ? new Date(value) : subYears(new Date(), 25)
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && onChange) {
      onChange(format(date, 'yyyy-MM-dd'));
    }
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDate(undefined);
    if (onChange) {
      onChange('');
    }
  };

  const handleQuickAge = (years: number) => {
    const birthDate = subYears(new Date(), years);
    setDisplayMonth(birthDate);
    setSelectedDate(birthDate);
    if (onChange) {
      onChange(format(birthDate, 'yyyy-MM-dd'));
    }
    setIsOpen(false);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = new Date(displayMonth);
    newMonth.setMonth(parseInt(e.target.value));
    setDisplayMonth(newMonth);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = new Date(displayMonth);
    newMonth.setFullYear(parseInt(e.target.value));
    setDisplayMonth(newMonth);
  };

  const displayValue = selectedDate ? format(selectedDate, 'PPP') : '';

  // Generate year options (from 1950 to current year)
  const currentYear = new Date().getFullYear();
  const startYear = 1950;
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => currentYear - i
  );

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full rounded-lg border px-4 py-2.5 text-left text-sm
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
            ${error 
              ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500' 
              : 'border-slate-300 bg-white text-slate-900 hover:border-emerald-400 focus:border-emerald-500'
            }
            ${disabled ? 'cursor-not-allowed bg-slate-100 text-slate-400' : 'cursor-pointer'}
            ${selectedDate ? 'font-medium' : 'text-slate-500'}
          `}
          aria-label={label}
          aria-required={required}
          aria-invalid={!!error}
        >
          <div className="flex items-center justify-between">
            <span>{displayValue || placeholder}</span>
            <div className="flex items-center gap-1">
              {selectedDate && !disabled && (
                <X
                  className="h-4 w-4 text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={handleClear}
                />
              )}
              <Calendar className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </button>

        {isOpen && (
          <div
            className="absolute z-50 mt-2 rounded-xl border border-slate-200 bg-white shadow-2xl animate-fadeIn"
            style={{ left: 0 }}
          >
            {/* Quick Age Selection */}
            <div className="border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-3">
              <p className="mb-2 text-xs font-semibold text-slate-700">Quick Select Age:</p>
              <div className="flex flex-wrap gap-2">
                {[20, 22, 25, 28, 30, 35, 40].map((age) => (
                  <button
                    key={age}
                    type="button"
                    onClick={() => handleQuickAge(age)}
                    className="rounded-md bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-all hover:bg-emerald-600 hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {age} yrs
                  </button>
                ))}
              </div>
            </div>

            {/* Month and Year Dropdowns */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 p-3">
              <button
                type="button"
                onClick={() => {
                  const newMonth = new Date(displayMonth);
                  newMonth.setMonth(newMonth.getMonth() - 1);
                  setDisplayMonth(newMonth);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-emerald-100 transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4 text-slate-600" />
              </button>

              <div className="flex flex-1 gap-2">
                <select
                  value={displayMonth.getMonth()}
                  onChange={handleMonthChange}
                  className="flex-1 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-emerald-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  {months.map((month, index) => (
                    <option key={month} value={index}>
                      {month}
                    </option>
                  ))}
                </select>

                <select
                  value={displayMonth.getFullYear()}
                  onChange={handleYearChange}
                  className="w-24 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-emerald-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newMonth = new Date(displayMonth);
                  newMonth.setMonth(newMonth.getMonth() + 1);
                  setDisplayMonth(newMonth);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-emerald-100 transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4 text-slate-600" />
              </button>
            </div>

            {/* Calendar */}
            <div className="p-3">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={handleSelect}
                month={displayMonth}
                onMonthChange={setDisplayMonth}
                disabled={
                  (() => {
                    const matchers: Array<{ before: Date } | { after: Date }> = [];
                    if (minDate) matchers.push({ before: minDate });
                    if (maxDate) matchers.push({ after: maxDate });
                    return matchers.length > 0 ? matchers : undefined;
                  })()
                }
                className="datepicker-custom"
                classNames={{
                  months: 'flex flex-col',
                  month: 'space-y-3',
                  caption: 'hidden',
                  table: 'w-full border-collapse',
                  head_row: 'flex mb-1',
                  head_cell: 'text-slate-500 rounded-md w-10 font-medium text-xs',
                  row: 'flex w-full mt-1',
                  cell: 'text-center text-sm p-0 relative focus-within:relative focus-within:z-20',
                  day: 'h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-emerald-50 hover:text-emerald-900 rounded-lg transition-all hover:scale-110',
                  day_selected: 'bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white focus:bg-emerald-600 focus:text-white font-semibold shadow-md',
                  day_today: 'bg-blue-50 text-blue-900 font-semibold ring-1 ring-blue-200',
                  day_outside: 'text-slate-300 opacity-50',
                  day_disabled: 'text-slate-300 opacity-30 cursor-not-allowed hover:bg-transparent',
                  day_hidden: 'invisible',
                }}
              />
            </div>

            {/* Footer with Today button */}
            <div className="border-t border-slate-200 bg-slate-50 p-3">
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  setDisplayMonth(today);
                  setSelectedDate(today);
                  if (onChange) {
                    onChange(format(today, 'yyyy-MM-dd'));
                  }
                  setIsOpen(false);
                }}
                className="w-full rounded-md bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-emerald-700 hover:to-teal-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Select Today
              </button>
            </div>
          </div>
        )}
      </div>

      {hint && !error && (
        <p className="mt-1 text-xs text-slate-500">{hint}</p>
      )}

      {error && (
        <p className="mt-1 text-xs text-red-600 animate-shake" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
