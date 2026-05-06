import type { GeneratedPrompt } from './types';

const DB_NAME = 'apeiron';
const DB_VERSION = 1;
const STORE_NAME = 'prompts';

export class PromptStore {
  private db: IDBDatabase | null = null;
  private hashCache = new Set<string>();

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'hash' });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.loadHashCache().then(resolve).catch(reject);
      };

      request.onerror = () => reject(request.error);
    });
  }

  private async loadHashCache(): Promise<void> {
    if (!this.db) return;
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAllKeys();
      request.onsuccess = () => {
        for (const key of request.result) {
          this.hashCache.add(key as string);
        }
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  get seenHashes(): Set<string> {
    return this.hashCache;
  }

  get count(): number {
    return this.hashCache.size;
  }

  async save(prompt: GeneratedPrompt): Promise<void> {
    if (!this.db || this.hashCache.has(prompt.hash)) return;
    this.hashCache.add(prompt.hash);

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(prompt);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async getRecent(limit = 50): Promise<GeneratedPrompt[]> {
    if (!this.db) return [];
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const index = store.index('createdAt');
      const request = index.openCursor(null, 'prev');
      const results: GeneratedPrompt[] = [];
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor && results.length < limit) {
          results.push(cursor.value as GeneratedPrompt);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async toggleFavorite(hash: string): Promise<boolean> {
    if (!this.db) return false;
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(hash);
      getReq.onsuccess = () => {
        const prompt = getReq.result as GeneratedPrompt | undefined;
        if (!prompt) { resolve(false); return; }
        prompt.favorited = !prompt.favorited;
        store.put(prompt);
        tx.oncomplete = () => resolve(prompt.favorited);
      };
      getReq.onerror = () => reject(getReq.error);
    });
  }
}
