/**
 * Share State Service
 * Single Responsibility: Encode and decode form state into a URL-safe string
 * Uses base64 encoding entirely client-side — no data leaves the device
 */

import { BioData, TemplateType } from '@/types/biodata';

// ── Onboarding session bridge ────────────────────────────────────────────────
// sessionStorage keys used to pass onboarding wizard data to the create page.
// This is more reliable than URL hash since Next.js client-side navigation
// can have timing issues when reading window.location.hash on mount.

const ONBOARDING_DATA_KEY = 'mbdm_onboarding_data';
const ONBOARDING_TEMPLATE_KEY = 'mbdm_onboarding_template';

/**
 * Save onboarding wizard selections to sessionStorage so the create page
 * can pick them up reliably after navigation.
 */
export function saveOnboardingSession(
  data: Partial<BioData>,
  template: TemplateType
): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(ONBOARDING_DATA_KEY, JSON.stringify(data));
    sessionStorage.setItem(ONBOARDING_TEMPLATE_KEY, template);
  } catch { /* ignore */ }
}

/**
 * Check (without consuming) whether an onboarding session is waiting.
 * Used by useBioDataForm to skip loading the localStorage draft when
 * the wizard is about to provide fresh data.
 */
export function hasOnboardingSession(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(ONBOARDING_DATA_KEY) !== null;
  } catch {
    return false;
  }
}

/**
 * Read and immediately clear the onboarding session from sessionStorage.
 * Returns null for both fields if no onboarding session exists.
 */
export function consumeOnboardingSession(): {
  data: Partial<BioData> | null;
  template: TemplateType | null;
} {
  if (typeof window === 'undefined') return { data: null, template: null };
  try {
    const rawData = sessionStorage.getItem(ONBOARDING_DATA_KEY);
    const rawTemplate = sessionStorage.getItem(ONBOARDING_TEMPLATE_KEY);

    // Clear immediately so refresh doesn't re-apply
    sessionStorage.removeItem(ONBOARDING_DATA_KEY);
    sessionStorage.removeItem(ONBOARDING_TEMPLATE_KEY);

    const data = rawData ? (JSON.parse(rawData) as Partial<BioData>) : null;
    const template = (rawTemplate as TemplateType) ?? null;
    return { data, template };
  } catch {
    return { data: null, template: null };
  }
}

const HASH_PREFIX = 'data=';

/**
 * Encode form state to a URL-safe base64 string and update the URL hash.
 * Returns the full shareable URL string.
 */
export function encodeStateToUrl(data: Partial<BioData>): string {
  try {
    // Remove photo (base64 images are too large for URLs)
    const { photo: _photo, ...dataWithoutPhoto } = data as BioData;
    const json = JSON.stringify(dataWithoutPhoto);
    const encoded = btoa(encodeURIComponent(json));
    const hash = `${HASH_PREFIX}${encoded}`;
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${hash}`);
    }
    return `${typeof window !== 'undefined' ? window.location.origin : ''}${typeof window !== 'undefined' ? window.location.pathname : '/create'}#${hash}`;
  } catch (error) {
    console.error('Failed to encode state:', error);
    return typeof window !== 'undefined' ? window.location.href : '';
  }
}

/**
 * Parse the URL hash into a key-value map.
 * Handles both `#data=...` (legacy single-value) and `#data=...&key=val` formats.
 */
function parseHashParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const hash = window.location.hash.slice(1);
  if (!hash) return {};
  const params: Record<string, string> = {};
  for (const segment of hash.split('&')) {
    const eqIdx = segment.indexOf('=');
    if (eqIdx === -1) continue;
    params[segment.slice(0, eqIdx)] = segment.slice(eqIdx + 1);
  }
  return params;
}

/**
 * Decode form state from the current URL hash.
 * Returns null if no valid state is found.
 */
export function decodeStateFromUrl(): Partial<BioData> | null {
  if (typeof window === 'undefined') return null;
  try {
    const params = parseHashParams();
    const encoded = params['data'];
    if (!encoded) return null;
    const json = decodeURIComponent(atob(encoded));
    const parsed = JSON.parse(json);
    return parsed as Partial<BioData>;
  } catch {
    return null;
  }
}

/**
 * Decode the template name from the current URL hash (set by the onboarding wizard).
 * Returns null if not present.
 */
export function decodeTemplateFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  return parseHashParams()['template'] ?? null;
}

/**
 * Copy a URL string to the clipboard.
 * Returns true if successful.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch {
    return false;
  }
}
