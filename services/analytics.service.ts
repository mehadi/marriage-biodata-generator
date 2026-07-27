/**
 * Analytics Service
 * Single Responsibility: Push structured events to GTM dataLayer for tracking
 * All events follow a consistent schema for easy GTM trigger configuration
 */

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export type AnalyticsEventName =
  | 'template_selected'
  | 'section_completed'
  | 'export_triggered'
  | 'export_success'
  | 'export_failed'
  | 'draft_saved'
  | 'language_switched'
  | 'demo_loaded'
  | 'share_link_copied'
  | 'dark_mode_toggled';

interface BaseEventPayload {
  event: AnalyticsEventName;
}

interface TemplateSelectedPayload extends BaseEventPayload {
  event: 'template_selected';
  template_name: string;
}

interface SectionCompletedPayload extends BaseEventPayload {
  event: 'section_completed';
  section_name: string;
}

interface ExportTriggeredPayload extends BaseEventPayload {
  event: 'export_triggered';
  export_format: string;
}

interface ExportSuccessPayload extends BaseEventPayload {
  event: 'export_success';
  export_format: string;
}

interface ExportFailedPayload extends BaseEventPayload {
  event: 'export_failed';
  export_format: string;
  error_message: string;
}

interface DraftSavedPayload extends BaseEventPayload {
  event: 'draft_saved';
  draft_type: 'named' | 'auto';
}

interface LanguageSwitchedPayload extends BaseEventPayload {
  event: 'language_switched';
  language_code: string;
}

interface DemoLoadedPayload extends BaseEventPayload {
  event: 'demo_loaded';
}

interface ShareLinkCopiedPayload extends BaseEventPayload {
  event: 'share_link_copied';
}

interface DarkModeToggledPayload extends BaseEventPayload {
  event: 'dark_mode_toggled';
  mode: 'dark' | 'light';
}

type EventPayload =
  | TemplateSelectedPayload
  | SectionCompletedPayload
  | ExportTriggeredPayload
  | ExportSuccessPayload
  | ExportFailedPayload
  | DraftSavedPayload
  | LanguageSwitchedPayload
  | DemoLoadedPayload
  | ShareLinkCopiedPayload
  | DarkModeToggledPayload;

export class AnalyticsService {
  private static push(payload: EventPayload): void {
    if (typeof window === 'undefined') return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload as unknown as Record<string, unknown>);
  }

  static trackTemplateSelected(templateName: string): void {
    this.push({ event: 'template_selected', template_name: templateName });
  }

  static trackSectionCompleted(sectionName: string): void {
    this.push({ event: 'section_completed', section_name: sectionName });
  }

  static trackExportTriggered(format: string): void {
    this.push({ event: 'export_triggered', export_format: format });
  }

  static trackExportSuccess(format: string): void {
    this.push({ event: 'export_success', export_format: format });
  }

  static trackExportFailed(format: string, errorMessage: string): void {
    this.push({ event: 'export_failed', export_format: format, error_message: errorMessage });
  }

  static trackDraftSaved(type: 'named' | 'auto'): void {
    this.push({ event: 'draft_saved', draft_type: type });
  }

  static trackLanguageSwitched(languageCode: string): void {
    this.push({ event: 'language_switched', language_code: languageCode });
  }

  static trackDemoLoaded(): void {
    this.push({ event: 'demo_loaded' });
  }

  static trackShareLinkCopied(): void {
    this.push({ event: 'share_link_copied' });
  }

  static trackDarkModeToggled(mode: 'dark' | 'light'): void {
    this.push({ event: 'dark_mode_toggled', mode });
  }
}
