<script setup lang="ts">
	import { onMounted } from 'vue';
	import {
		getData,
		saveDataToDB,
		createSelectorList,
		getIndexedDBRecords,
	} from './utils';
	import type { ItemData } from './types';
	import { store } from './store';
	import TheButton from './components/TheButton/TheButton.vue';
	import RangePicker from './components/RangePicker/RangePicker.vue';
	import TheChart from './components/TheChart/TheChart.vue';
	import { chart } from './chart';

	onMounted(() => {
		const dbRequest: IDBOpenDBRequest = indexedDB.open('weather_service_archive');

		dbRequest.onerror = (event: any) => {
			throw new Error(event.target.error);
		};

		dbRequest.onupgradeneeded = (event: any): void => {
			const db: IDBDatabase = event.target.result;
			db.onerror = (event: any) => {
				throw new Error(event.target.error);
			};

			db.createObjectStore('temperature', { keyPath: "t" });
			db.createObjectStore('precipitation', { keyPath: "t" });
		};

		dbRequest.onsuccess = (event: any): void => {
			store.db = event.target.result;
			store.isPageLoading = true;
			getIndexedDBRecords(store.db, store.currentMode)
				.then((records) => {
					if (records.length) {
						store.list = createSelectorList(records);
						store.isPageLoading = false;
					} else {
						getData<ItemData>(store.currentMode)
							.then((data) => {
								store.list = createSelectorList(data);
								chart(store.canvas, data);
								return data;
							})
							.then((data) => {
								saveDataToDB(store.db, store.currentMode, data);
							});
					}
				});
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
			<range-picker/>
			<the-chart/>
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
