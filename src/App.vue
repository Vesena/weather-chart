<script setup lang="ts">
	import { onMounted } from 'vue';
	import { getData, getIndexedDBKeys, saveToDB } from './utils';
	import type { ItemData } from './types';
	import { store } from './store';
	import TheButton from './components/TheButton/TheButton.vue';
	import RangePicker from './components/RangePicker/RangePicker.vue';
	import TheChart from './components/TheChart/TheChart.vue';

	onMounted(() => {
		const dbRequest: IDBOpenDBRequest = indexedDB.open('weather_service_archive');

		dbRequest.onupgradeneeded = (event: any): void => {
			const db: IDBDatabase = event.target.result
			db.createObjectStore('temperature', { keyPath: "t" });
			db.createObjectStore('precipitation', { keyPath: "t" });
			getData<ItemData>(store.currentMode)
				.then((data) => {
					saveToDB(db, store.currentMode, data);
				})
		}

		dbRequest.onsuccess = (event: any): void => {
			const db: IDBDatabase = event.target.result
			store.db = db
			getIndexedDBKeys(db, store.currentMode)
				.then((keys) => setInitParams(keys));
		}
	});

	/** methods */
	const setInitParams = (keys: string[]): void => {
		store.listBorderTop = keys[0];
		store.listBorderBottom = keys[keys.length - 1];
		store.cursorStart = new Date(store.listBorderTop).getFullYear();
		store.cursorEnd = new Date(store.listBorderBottom).getFullYear();
	};
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
