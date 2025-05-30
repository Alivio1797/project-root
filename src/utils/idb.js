export async function openDB(dbName = 'story-db', storeName = 'stories') {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve({ db: request.result, storeName });
  });
}

export async function addItem(dbName, storeName, item) {
  const { db, storeName: s } = await openDB(dbName, storeName);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(s, 'readwrite');
    const store = tx.objectStore(s);
    const request = store.add({ ...item, created: Date.now() });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllItems(dbName, storeName) {
  const { db, storeName: s } = await openDB(dbName, storeName);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(s, 'readonly');
    const store = tx.objectStore(s);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteItem(dbName, storeName, key) {
  const { db, storeName: s } = await openDB(dbName, storeName);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(s, 'readwrite');
    const store = tx.objectStore(s);
    const request = store.delete(key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}