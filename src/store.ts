import { reactive } from 'vue';

interface Store {
	canvas: any,
	currentMode: string,
	cursorEnd: number,
	cursorStart: number,
	db: IDBDatabase | null,
	isPageLoading: boolean,
	list: number[],
}

export const store: Store = reactive({
	canvas: null,
	currentMode: 'temperature',
	cursorEnd: 0,
	cursorStart: 0,
	db: null,
	isPageLoading: false,
	list: [],
});