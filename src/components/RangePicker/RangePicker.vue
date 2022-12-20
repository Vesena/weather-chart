<script setup lang="ts">
	import { watch } from 'vue';
	import { store } from '../../store';
	import TheSelector from '../TheSelector/TheSelector.vue';

	watch(() => store.list, (list) => {
		if (list) {
			store.cursorStart = list[0];
			store.cursorEnd = list[list.length - 1];
		}
	});
</script>

<template>
	<div class="app__selector">
		<the-selector
			:list="store.list"
			:init-value="store.cursorStart"
			:range-name="'Start'"
			v-model="store.cursorStart"
		/>
		<the-selector
			:list="store.list"
			:init-value="store.cursorEnd"
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