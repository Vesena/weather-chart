<script setup lang="ts">
	import { onMounted, ref, watch } from 'vue';
	import { store } from '../../store';
	import { chart } from '../../chart';
  	import { getData, saveDataToDB, getIndexedDBRecords } from '../../utils';
	import { ItemData } from '../../types';

	/** data */
	const canvas = ref<HTMLCanvasElement | null>(null)

	watch(
		[
			() => store.db,
			() => store.cursorStart,
			() => store.cursorEnd,
			() => store.currentMode,
		],
		([db, cursorStart, cursorEnd, currentMode]) => {
			if (!store.isPageLoading) {
				const keyRangeValue: IDBKeyRange = getKeyRange(cursorStart, cursorEnd);

				getIndexedDBRecords(db, currentMode, keyRangeValue)
					.then((records) => {
						if (records.length) {
							chart(store.canvas, records);
						} else {
							getData<ItemData>(store.currentMode)
								.then((data) => {
									const startPosition = data.findIndex((item) => item.t === keyRangeValue.lower)
									const endPosition = data.findIndex((item) => item.t ===keyRangeValue.upper) + 1
									const drawRecords = data.slice(startPosition, endPosition)

									chart(store.canvas, drawRecords);
									return data
								})
								.then((data) => {
									saveDataToDB(db, store.currentMode, data)
								})
						}
					});
			}
		}
	);

	onMounted(() => {
		store.canvas = canvas.value
	})

	const getKeyRange = (cursorStart: number, cursorEnd: number): IDBKeyRange => {
		const lowerBound: string = `${ cursorStart }-01-01`;
		const upperBound: string = `${ cursorEnd }-12-31`;
		return IDBKeyRange.bound(lowerBound, upperBound)
	};
</script>

<template>
	<div class="the-chart">
		<canvas class="the-canvas" ref="canvas"></canvas>
	</div>
</template>

<style scoped>
	.the-chart {
		width: 1200px;
		height: 600px;
	}

	.the-canvas {
		outline: 1px solid #808080;
		width: 100%;
		height: 100%;
	}
</style>
