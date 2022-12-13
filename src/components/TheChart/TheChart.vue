<script setup lang="ts">
	import { ref, watch } from 'vue';
	import { store } from '../../store';
	import { chart } from '../../chart';
  	import { getData, saveToDB, getIndexedDBRecords } from "../../utils";
	import { ItemData } from "../../types";

	const canvas = ref<HTMLCanvasElement | null>(null)

	watch(
		[
			() => store.isSaved,
			() => store.db,
			() => store.cursorStart,
			() => store.cursorEnd,
			() => store.currentMode,
		],
		([isSaved, db, cursorStart, cursorEnd, currentMode]) => {
			if (db && isSaved && cursorStart) {
				getIndexedDBRecords(db, currentMode)
					.then((records) => chart(canvas.value, records));
				store.isSaved = false
			} else if (db && cursorStart) {
				const keyRangeValue: IDBKeyRange = getKeyRange(cursorStart, cursorEnd);

        		getIndexedDBRecords(db, currentMode, keyRangeValue)
					.then((records) => {
						if (records.length) {
							chart(canvas.value, records);
						} else {
							getData<ItemData>(currentMode)
								.then((data) => {
									saveToDB(db, currentMode, data);
								})
						}
					})
			}
		}
	);

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
