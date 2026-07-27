/**
 * Local Storage Service
 * Single Responsibility: Handle all browser local storage operations
 * Follows Interface Segregation: Only exposes storage-related methods
 */

import { BioData, SavedDraft } from '@/types/biodata';
import { generateId } from '@/lib/utils';

const STORAGE_KEY = 'marriage-biodata-drafts';
const CURRENT_DRAFT_KEY = 'marriage-biodata-current';

export class LocalStorageService {
  /**
   * Check if localStorage is available
   */
  private static isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Save current draft
   */
  static saveCurrentDraft(bioData: BioData): boolean {
    try {
      if (!this.isAvailable()) {
        throw new Error('Local storage is not available');
      }

      const dataToSave = {
        ...bioData,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(CURRENT_DRAFT_KEY, JSON.stringify(dataToSave));
      return true;
    } catch (error) {
      console.error('Error saving current draft:', error);
      return false;
    }
  }

  /**
   * Load current draft
   */
  static loadCurrentDraft(): BioData | null {
    try {
      if (!this.isAvailable()) {
        return null;
      }

      const data = localStorage.getItem(CURRENT_DRAFT_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading current draft:', error);
      return null;
    }
  }

  /**
   * Clear current draft
   */
  static clearCurrentDraft(): boolean {
    try {
      if (!this.isAvailable()) {
        return false;
      }

      localStorage.removeItem(CURRENT_DRAFT_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing current draft:', error);
      return false;
    }
  }

  /**
   * Save a named draft
   */
  static saveDraft(bioData: BioData, name: string): string | null {
    try {
      if (!this.isAvailable()) {
        throw new Error('Local storage is not available');
      }

      const drafts = this.getAllDrafts();
      const draftId = bioData.id || generateId();

      const newDraft: SavedDraft = {
        id: draftId,
        bioData: { ...bioData, id: draftId },
        timestamp: new Date().toISOString(),
        name,
      };

      const existingIndex = drafts.findIndex((d) => d.id === draftId);
      if (existingIndex >= 0) {
        drafts[existingIndex] = newDraft;
      } else {
        drafts.push(newDraft);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
      return draftId;
    } catch (error) {
      console.error('Error saving draft:', error);
      return null;
    }
  }

  /**
   * Get all saved drafts
   */
  static getAllDrafts(): SavedDraft[] {
    try {
      if (!this.isAvailable()) {
        return [];
      }

      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading drafts:', error);
      return [];
    }
  }

  /**
   * Load a specific draft by ID
   */
  static loadDraft(id: string): BioData | null {
    try {
      const drafts = this.getAllDrafts();
      const draft = drafts.find((d) => d.id === id);
      return draft ? draft.bioData : null;
    } catch (error) {
      console.error('Error loading draft:', error);
      return null;
    }
  }

  /**
   * Delete a draft by ID
   */
  static deleteDraft(id: string): boolean {
    try {
      if (!this.isAvailable()) {
        return false;
      }

      const drafts = this.getAllDrafts();
      const filteredDrafts = drafts.filter((d) => d.id !== id);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredDrafts));
      return true;
    } catch (error) {
      console.error('Error deleting draft:', error);
      return false;
    }
  }

  /**
   * Clear all drafts
   */
  static clearAllDrafts(): boolean {
    try {
      if (!this.isAvailable()) {
        return false;
      }

      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing all drafts:', error);
      return false;
    }
  }

  /**
   * Get storage usage info
   */
  static getStorageInfo(): { used: number; available: boolean } {
    try {
      if (!this.isAvailable()) {
        return { used: 0, available: false };
      }

      let used = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length;
        }
      }

      return { used, available: true };
    } catch (error) {
      return { used: 0, available: false };
    }
  }
}
