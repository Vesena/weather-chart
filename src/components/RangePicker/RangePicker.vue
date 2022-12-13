<script setup lang="ts">
	import { ref, watch } from 'vue';
	import { store } from '../../store';
	import TheSelector from '../TheSelector/TheSelector.vue';

	/** data */
	let list = ref<Array<number>>([]);

	watch(() => store.listBorderTop, (val: string) => {
		if (val) {
			list.value = createList(store.listBorderTop, store.listBorderBottom);
		}
	})

	/** methods */
	const createList = (start: string, end: string): Array<number> => {
		const arr: Array<number> = [];
		const startYear: number = new Date(start).getFullYear();
		const endYear: number = new Date(end).getFullYear();

		for (let i = startYear; i <= endYear; i++) {
			arr.push(i);
		}

		return arr;
	}
</script>

<template>
	<div class="app__selector">
		<the-selector
			:list="list"
			:range-name="'Start'"
			v-model="store.cursorStart"
		/>
		<the-selector
			:list="list"
			:range-name="'End'"
			v-model="store.cursorEnd"
		/>
	</div>
</template>

<style scoped>
	.app__selector {
		margin-bottom: 8px;
		display: grid;
		grid-template-columns: 1fr 1fr;
		width: 1200px;
	}
</style>