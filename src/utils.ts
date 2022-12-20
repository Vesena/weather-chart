import type { ItemData } from './types';
import { store } from './store';

/**
 * Generate list for year selectors
 * @param data
 * @returns { Array } list of years
 */
export function createSelectorList(data: ItemData[]): Array<number> {
	const arr: Array<number> = [];
	const start = data[0].t;
	const end = data[data.length - 1].t;
	const startYear: number = new Date(start).getFullYear();
	const endYear: number = new Date(end).getFullYear();

	for (let i = startYear; i <= endYear; i++) {
		arr.push(i);
	}

	return arr;
}

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
 * Request for records from IndexedDB
 * @param db IndexedDB
 * @param storeName
 * @param keyRangeValue
 * @returns {Promise} Promise object represents records from IndexedDB
 */
export function getIndexedDBRecords(db: IDBDatabase, storeName: string, keyRangeValue?: IDBKeyRange | null ): Promise<[any]> {
	const transaction: IDBTransaction = db.transaction(storeName, "readonly");
	const objectStore: IDBObjectStore =  transaction.objectStore(storeName);
	const allRecordsRequest: IDBRequest = objectStore.getAll(keyRangeValue);

	return new Promise((resolve, reject) => {
		transaction.onerror = (event: any) => reject(new Error(`Error ${event.target.error}`));

		allRecordsRequest.onsuccess = (event: any) => resolve(event.target.result);
	});
}

/**
 * Save data to indexedDB
 * @param db IndexedDB
 * @param storeName
 * @param data
 */
export function saveDataToDB(db: IDBDatabase, storeName: string, data: ItemData[]): void {
	const transaction: IDBTransaction = db.transaction(storeName, 'readwrite')
	const objectStore: IDBObjectStore = transaction.objectStore(storeName);

	transaction.oncomplete = () => {
		store.isPageLoading = false;
	};

	for (let i of data) {
		objectStore.add(i);
	}
}

