import type { ItemData } from './types';
import { store } from './store';

/**
 * Request for data
 * @param url request
 * @returns data
 */
export async function getData<T>(url: string): Promise<T[]> {
    const res = await fetch(`../data/${url}.json`);

    if (res.ok) {
        return await res.json();
    }

    throw new Error();
}

/**
 * Save data to indexedDB
 * @param url request
 * @param data
 */
export function saveToDB(db: IDBDatabase, storeName: string, data: Array<ItemData>): void {
	const transaction = db.transaction([storeName], 'readwrite')


	transaction.oncomplete = () => {
		store.isSaved = true
	};

	const objectStore = transaction.objectStore(storeName);
	data.forEach((item: ItemData) => {
		objectStore.add(item);
	});
}

/**
 * Request for data
 * @params db, storeName request
 * @returns keys
 */
export function getIndexedDBKeys(db: IDBDatabase, storeName: string): Promise<string[]> {
	const transaction = db.transaction([storeName], "readonly");
	const objectStore = transaction.objectStore(storeName);
	const allKeysRequest: IDBRequest = objectStore.getAllKeys();

	return new Promise((resolve, reject) => {
		transaction.onerror = (event: any) => reject(new Error(`Error ${event.target.error}`));
		allKeysRequest.onsuccess = (event: any) => resolve(event.target.result);
	});
}

/**
 * Request for data
 * @params db, storeName request
 * @returns records
 */
export function getIndexedDBRecords(db: IDBDatabase, storeName: string, keyRangeValue?: IDBKeyRange | null ): Promise<ItemData[]> {
	const transaction: IDBTransaction = db.transaction([storeName], "readonly");
	const objectStore: IDBObjectStore =  transaction.objectStore(storeName);
	const allRecordsRequest: IDBRequest = objectStore.getAll(keyRangeValue);

	return new Promise((resolve, reject) => {
		transaction.onerror = (event: any) => reject(new Error(`Error ${event.target.error}`));
		allRecordsRequest.onsuccess = (event: any) => resolve(event.target.result);
	});
}
