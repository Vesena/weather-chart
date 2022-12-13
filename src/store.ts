import { reactive } from 'vue';

interface Store {
	isSaved: boolean,
	currentMode: string,
	listBorderTop: string,
	listBorderBottom: string,
	cursorStart: number,
	cursorEnd: number,
	db: IDBDatabase | null,
}

export const store: Store = reactive({
	isSaved: false,
	currentMode: 'temperature',
	listBorderTop: '',
	listBorderBottom: '',
	cursorStart: 0,
	cursorEnd: 0,
	db: null,
});
