<script setup lang="ts">
	import { store } from '../../store';

	/** props */
	defineProps<{
		selfMode: string,
		isActive: boolean,
	}>();
</script>

<template>
	<button
		class="the-button"
		type="button"
		:class="{ 'the-button_active': isActive }"
		@click="store.currentMode = selfMode"
	>
		<slot/>
	</button>
</template>

<style scoped>
	.the-button {
		font: inherit;
		background-color: #808080;
		color: #fff;
		border: none;
		cursor: pointer;
		padding: 0.5rem 1rem;
		text-align: start;
	}

	.the-button_active, .the-button:hover {
		background-color: #009900;
	}
</style>
