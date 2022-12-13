import type { ItemData } from './types';

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

export function saveToDB(db: IDBDatabase, storeName: string, data: Array<ItemData>): void {
	const transaction = db.transaction([storeName], 'readwrite')


	transaction.oncomplete = (event) => {
		console.log("All done!", event);
	};

	transaction.onerror = (event) => {
		// Don't forget to handle errors!
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
export function getIndexedDBKeys<T>(db: IDBDatabase, storeName: string): Promise<T> {
	const transaction = db.transaction([storeName], "readonly");
	const objectStore = transaction.objectStore(storeName);
	const allKeysRequest: IDBRequest = objectStore.getAllKeys();

	return new Promise((resolve, reject) => {
		transaction.onerror = (event: any) => reject(new Error(`Erroe ${event.target.error}`));
		allKeysRequest.onsuccess = (event: any) => {
			console.log(event.target.result)
			resolve(event.target.result);
		}
	});
};

/**
 * Request for data
 * @params db, storeName request
 * @returns records
 */
export function getIndexedDBRecords<T>(db: IDBDatabase, storeName: string, keyRangeValue: IDBKeyRange): Promise<T> {
	const transaction: IDBTransaction = db.transaction([storeName], "readonly");
	const objectStore: IDBObjectStore =  transaction.objectStore(storeName);
	const allRecordsRequest: IDBRequest = objectStore.getAll(keyRangeValue);

	return new Promise((resolve, reject) => {
		transaction.onerror = (event: any) => reject(new Error(`Erroe ${event.target.error}`));
		allRecordsRequest.onsuccess = (event: any) => resolve(event.target.result);
	});
};
