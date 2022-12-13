<script setup lang="ts">
	import { ref, onMounted, watch } from 'vue';
	import { getData } from './utils';
	import type { ItemData } from './types';
	import { store } from './store'
	import TheButton from './components/TheButton/TheButton.vue'
	import RangePicker from './components/RangePicker/RangePicker.vue'
	import TheChart from './components/TheChart/TheChart.vue'

	/** data */
	let isFirstAppearance = ref<boolean>(false)
	//let temperature = ref<ItemData[]>([]);
	//let precipitation = ref<ItemData[]>([]);

	watch([isFirstAppearance, () => store.db], ([isFirstAppearance, db]) => {
		if (isFirstAppearance && db) {
			//save
			getData<ItemData>('../data/temperature.json')
				.then((data)=>{
					//console.log(data);
					saveToDB(db, 'temperature', data)
				})
		} else {
			//load
		}

	})

	/** methods */
	const saveToDB = (db: IDBDatabase, storeName: string, data:any) => {
		const transaction = db.transaction([storeName], 'readwrite')

		// Do something when all the data is added to the database.
		transaction.oncomplete = (event) => {
			//console.log("All done!");
		};

		transaction.onerror = (event) => {
			// Don't forget to handle errors!
		};

		const objectStore = transaction.objectStore(storeName);
		data.forEach((item) => {
			const request = objectStore.add(item);
			request.onsuccess = (event) => {
				//console.log(event.target.result)
				// event.target.result === customer.ssn;
			};
		});


		//const objectStore = .objectStore(storeName)
		/*console.log(objectStore)
		data.forEach((item:any) => {
			objectStore.add(item);
		})
		objectStore.transaction.onerror = function(event) {
			console.log(event)
		};
		objectStore.transaction.oncomplete = function(event) {
			console.log(event)
		};*/

	}

	onMounted(() => {
		const dbRequest: IDBOpenDBRequest = indexedDB.open('weather_service_archive');

		dbRequest.onupgradeneeded = (event: any): void => {
			const db: IDBDatabase = event.target.result
			db.createObjectStore('temperature', {keyPath: "t"});
			db.createObjectStore('precipitation', {keyPath: "t"});
			isFirstAppearance.value = true
		}

		dbRequest.onsuccess = (event: any): void => {

			const db: IDBDatabase = event.target.result
			store.db = db
			const transaction = db.transaction(['temperature'], "readonly");
			// Do something when all the data is added to the database.
			transaction.oncomplete = (event) => {
				//console.log("All done!");
			};

			transaction.onerror = (event) => {
				// Don't forget to handle errors!
			};

			const objectStore = transaction.objectStore('temperature');

			const countRequest: IDBRequest = objectStore.count();
			countRequest.onsuccess = () => {
				if (countRequest.result) {
					// get init parameters
					const allKeysRequest: IDBRequest = objectStore.getAllKeys();
					allKeysRequest.onsuccess = () => {
						store.listBorderTop = allKeysRequest.result[0];
						store.listBorderBottom = allKeysRequest.result[allKeysRequest.result.length-1];
						store.cursorStart = new Date(store.listBorderTop).getFullYear();
						store.cursorEnd = new Date(store.listBorderBottom).getFullYear();;
					}

				} else {
					//save data + get init parameters
				}
			}
		}
	});
</script>

<template>
		<h1 class="app__title">Архив метеослужбы</h1>
		<div class="app__wrapper">
			<div class="app__buttons">
				<the-button
					:self-mode="'temperature'"
					:is-active="store.currentMode==='temperature'"
				>
					Температура
				</the-button>
				<the-button
					:self-mode="'precipitation'"
					:is-active="store.currentMode==='precipitation'"
				>
					Осадки
				</the-button>
			</div>
			<div class="app__main">
				<range-picker />
				<the-chart />
			</div>
		</div>
</template>

<style scoped>
	.app__title {
		margin: 0 0 32px;
	}

	.app__wrapper {
		display: grid;
		grid-template-columns: min-content 1fr;
		column-gap: 1rem;
	}

	.app__buttons {
		display: grid;
		grid-template-rows: min-content min-content;
		row-gap: 0.5rem;
	}
</style>
