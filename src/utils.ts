import type { ItemData } from './types';

/**
 * Request for data
 * @param url request
 * @returns data
 */
export async function getData<T>(url: string): Promise<T[]> {
    const res = await fetch(url);

    if (res.ok) {
        return await res.json();
    }

    throw new Error();
}

export function saveToDB(db: IDBDatabase, storeName: string, data: Array<ItemData>): void {
	const transaction = db.transaction([storeName], 'readwrite')

	// Do something when all the data is added to the database.
	transaction.oncomplete = (event) => {
		//console.log("All done!");
	};

	transaction.onerror = (event) => {
		// Don't forget to handle errors!
	};

	const objectStore = transaction.objectStore(storeName);
	data.forEach((item: ItemData) => {
		const request = objectStore.add(item);
		request.onsuccess = (event) => {
			//console.log(event.target.result)
			// event.target.result === customer.ssn;
		};
	});
}

export function loadData(db: IDBDatabase, storeName: string, keyRangeValue: IDBKeyRange) {
	const transaction: IDBTransaction = db.transaction([storeName], "readonly");
	const objectStore: IDBObjectStore =  transaction.objectStore(storeName);
	const allRecordsRequest: IDBRequest = objectStore.getAll(keyRangeValue);

	return new Promise((resolve, reject) => {
		transaction.oncomplete = (event) => {
			console.log("All done!", event);
		};

		transaction.onerror = (event) => {
			// Don't forget to handle errors!
		};

		allRecordsRequest.onsuccess = (event: any) => {
			resolve(event.target.result)
		}
	})
};