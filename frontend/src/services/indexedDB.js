// IndexedDB Service for persistent source storage
// Handles large file data that exceeds localStorage limits

const DB_NAME = '4youAIHub';
const DB_VERSION = 1;
const SOURCES_STORE = 'sources';

let db = null;

/**
 * Initialize IndexedDB
 * @returns {Promise<IDBDatabase>}
 */
export function initDB() {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('IndexedDB error:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      console.log('IndexedDB initialized');
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      
      // Create sources store if it doesn't exist
      if (!database.objectStoreNames.contains(SOURCES_STORE)) {
        const store = database.createObjectStore(SOURCES_STORE, { keyPath: 'id' });
        store.createIndex('category', 'category', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
        console.log('Sources store created');
      }
    };
  });
}

/**
 * Get all sources from IndexedDB
 * @returns {Promise<Array>}
 */
export async function getSourcesFromDB() {
  try {
    const database = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(SOURCES_STORE, 'readonly');
      const store = transaction.objectStore(SOURCES_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        console.log(`Loaded ${request.result.length} sources from IndexedDB`);
        resolve(request.result || []);
      };

      request.onerror = () => {
        console.error('Error loading sources:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('getSourcesFromDB error:', error);
    return [];
  }
}

/**
 * Save sources to IndexedDB
 * @param {Array} sources - Array of source objects
 * @returns {Promise<void>}
 */
export async function saveSourcesToDB(sources) {
  try {
    const database = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(SOURCES_STORE, 'readwrite');
      const store = transaction.objectStore(SOURCES_STORE);

      // Clear existing sources first
      const clearRequest = store.clear();
      
      clearRequest.onsuccess = () => {
        // Add all sources
        sources.forEach(source => {
          store.put(source);
        });
      };

      transaction.oncomplete = () => {
        console.log(`Saved ${sources.length} sources to IndexedDB`);
        resolve();
      };

      transaction.onerror = () => {
        console.error('Error saving sources:', transaction.error);
        reject(transaction.error);
      };
    });
  } catch (error) {
    console.error('saveSourcesToDB error:', error);
  }
}

/**
 * Add a single source to IndexedDB
 * @param {Object} source - Source object to add
 * @returns {Promise<void>}
 */
export async function addSourceToDB(source) {
  try {
    const database = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(SOURCES_STORE, 'readwrite');
      const store = transaction.objectStore(SOURCES_STORE);
      const request = store.put(source);

      request.onsuccess = () => {
        console.log(`Added source: ${source.name}`);
        resolve();
      };

      request.onerror = () => {
        console.error('Error adding source:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('addSourceToDB error:', error);
  }
}

/**
 * Remove a source from IndexedDB
 * @param {string} id - Source ID to remove
 * @returns {Promise<void>}
 */
export async function removeSourceFromDB(id) {
  try {
    const database = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(SOURCES_STORE, 'readwrite');
      const store = transaction.objectStore(SOURCES_STORE);
      const request = store.delete(id);

      request.onsuccess = () => {
        console.log(`Removed source: ${id}`);
        resolve();
      };

      request.onerror = () => {
        console.error('Error removing source:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('removeSourceFromDB error:', error);
  }
}

/**
 * Clear all sources from IndexedDB
 * @returns {Promise<void>}
 */
export async function clearAllSources() {
  try {
    const database = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(SOURCES_STORE, 'readwrite');
      const store = transaction.objectStore(SOURCES_STORE);
      const request = store.clear();

      request.onsuccess = () => {
        console.log('All sources cleared');
        resolve();
      };

      request.onerror = () => {
        console.error('Error clearing sources:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('clearAllSources error:', error);
  }
}
