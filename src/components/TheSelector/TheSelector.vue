<script setup lang="ts">
	import { ref, computed, watch } from 'vue';
	import { store } from '../../store';

	/** props */
	const props = defineProps<{
		list: Array<number>,
		initValue: any,
		rangeName: string,
	}>();

	/** data */
	const selected = ref<number| null>(null);
	const optionItems = ref<HTMLOptionsCollection | []>([]);

	const isDisabled = computed<boolean>(() => {
		for (let item of optionItems.value) {
			if (props.rangeName === 'Start') {
				item.disabled = item.value > store.cursorEnd
			} else if (props.rangeName === 'End') {
				item.disabled = item.value < store.cursorStart
			}
		}

		return false
	});

	watch(() => props.initValue, (initValue) => {
		selected.value = initValue;
	})
</script>

<template>
	<select class="the-selector" v-model="selected">
		<option
			v-for="item in list"
			:value="item"
			:disabled="isDisabled"
			ref="optionItems"
		>
			{{ item }}
		</option>
	</select>
</template>

<style scoped>
	.the-selector {
		font: inherit;
		color: #808080;
		padding: 4px;
		border-color: #808080;
	}
</style>
