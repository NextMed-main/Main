/**
 * Browser-compatible Private State Provider
 * 
 * Uses localStorage to persist private state in the browser.
 * This is a browser alternative to LevelDB-based storage used in Node.js.
 * 
 * Based on the pattern from dev-tools/frontend.
 */

/**
 * Private state provider interface for Midnight.js
 */
export interface PrivateStateProvider<T extends string> {
  get(id: T): Promise<Uint8Array | null>;
  set(id: T, state: Uint8Array): Promise<void>;
  remove(id: T): Promise<void>;
}

/**
 * Options for browser private state provider
 */
export interface BrowserPrivateStateOptions {
  privateStateStoreName: string;
}

/**
 * Create a localStorage-based Private State Provider for browser environments
 * 
 * @param options - Configuration options
 * @param options.privateStateStoreName - Unique name for the storage key
 * @returns PrivateStateProvider instance
 */
export function browserPrivateStateProvider<T extends string>(
  options: BrowserPrivateStateOptions
): PrivateStateProvider<T> {
  const storageKey = `midnight_private_state_${options.privateStateStoreName}`;

  return {
    /**
     * Retrieve the private state from localStorage
     */
    async get(_id: T): Promise<Uint8Array | null> {
      try {
        if (typeof window === "undefined" || typeof localStorage === "undefined") {
          return null;
        }
        const stored = localStorage.getItem(storageKey);
        if (!stored) {
          return null;
        }
        const bytes = JSON.parse(stored) as number[];
        return new Uint8Array(bytes);
      } catch (error) {
        console.error("Failed to retrieve private state:", error);
        return null;
      }
    },

    /**
     * Store the private state to localStorage
     */
    async set(_id: T, state: Uint8Array): Promise<void> {
      try {
        if (typeof window === "undefined" || typeof localStorage === "undefined") {
          throw new Error("localStorage is not available");
        }
        const bytes = Array.from(state);
        localStorage.setItem(storageKey, JSON.stringify(bytes));
      } catch (error) {
        console.error("Failed to save private state:", error);
        throw error;
      }
    },

    /**
     * Remove the private state from localStorage
     */
    async remove(_id: T): Promise<void> {
      try {
        if (typeof window === "undefined" || typeof localStorage === "undefined") {
          return;
        }
        localStorage.removeItem(storageKey);
      } catch (error) {
        console.error("Failed to delete private state:", error);
        throw error;
      }
    },
  };
}

/**
 * Clear all Midnight private state from localStorage
 * 
 * Useful for debugging or resetting wallet state
 */
export function clearAllPrivateState(): void {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return;
  }
  
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("midnight_private_state_")) {
      keysToRemove.push(key);
    }
  }
  
  for (const key of keysToRemove) {
    localStorage.removeItem(key);
  }
  
  console.log(`Cleared ${keysToRemove.length} Midnight private state entries`);
}
