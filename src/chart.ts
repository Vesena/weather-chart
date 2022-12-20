import { ItemData } from "./types";

const WIDTH: number = 1200;
const HEIGHT: number = 600;
const PADDING_X: number = 40;
const PADDING_Y: number = 32;
const ZERO_X: number = PADDING_X;
const DPI_WIDTH: number = WIDTH*2;
const DPI_HEIGHT: number = HEIGHT*2;
const VIEW_HEIGHT: number = DPI_HEIGHT - PADDING_Y * 2;
const VIEW_WIDTH: number = DPI_WIDTH - PADDING_X;

let verticalCanvasCenter: number = 0;

/**
 * Draw grid
 * @param ctx
 * @param step
 * @param linesNumber
 */
function gridDraw(ctx: CanvasRenderingContext2D, step: number, linesNumber: number[]): void {
	// === x axis
	ctx.beginPath()
	ctx.lineWidth = 1;
	ctx.strokeStyle = '#808080'
	ctx.moveTo(ZERO_X, 0)
	ctx.lineTo(ZERO_X, DPI_WIDTH)
	ctx.stroke()
	ctx.closePath()
	// ===

	// === y axis
	for (let i = 1; i <= linesNumber.length; i++) {
		ctx.beginPath()
		ctx.lineWidth = 1;
		ctx.font = 'normal 16px Helvetica,sans-serif'
		ctx.fillStyle = '#96a2aa'

		const y = step * i

		if (linesNumber[i-1]%5 === 0) {
			if (linesNumber[i-1] === 0) {
				verticalCanvasCenter= y+ PADDING_Y;
			}
			ctx.fillText(linesNumber[i-1].toString(),5, y+ PADDING_Y-1 )
			ctx.moveTo(0,y+ PADDING_Y)
			ctx.lineTo(DPI_WIDTH, y+ PADDING_Y)
			ctx.strokeStyle = '#000'
		} else {
			ctx.strokeStyle = '#bbb'
			ctx.moveTo(0,y+ PADDING_Y)
			ctx.lineTo(DPI_WIDTH, y+ PADDING_Y)
		}

		ctx.stroke()
		ctx.closePath()
	}
	// ===
}

/**
 * Draw column
 * @param ctx
 * @param yMax
 * @param yMin
 * @param valuesArray
 */
function dataDraw(ctx: CanvasRenderingContext2D, yMax: number, yMin: number, valuesArray: number[]): void {
	const delta = Math.abs(yMax) + Math.abs(yMin)
	const yRatio = VIEW_HEIGHT/delta
	const barWidth = VIEW_WIDTH/valuesArray.length
	let barXPosition = ZERO_X

	ctx.fillStyle = "#009900";

	for (const item of valuesArray) {
		const barHeight = (item*yRatio)*-1
		ctx.fillRect(barXPosition, verticalCanvasCenter, barWidth, barHeight)
		barXPosition += barWidth
	}
}

/**
 * Draw column
 * @param array
 * @returns {Array} of minimum and maximum value
 */
function boundaries(array: number[]): number[] {
	const max: number = Math.floor(Math.max.apply(null,array))
	const min: number = Math.floor(Math.min.apply(null, array))
	return [max, min]
}

/**
 * Draw chart
 * @param canvas
 * @param data
 */
export function chart<T>(canvas: HTMLCanvasElement, data: Array<ItemData>): void {
	verticalCanvasCenter = 0;

	canvas.width = DPI_WIDTH
	canvas.height = DPI_HEIGHT

	const ctx: CanvasRenderingContext2D = canvas.getContext('2d')

	// get array of values from data
	const valuesArray: number[] = data.map((item: ItemData) => item.v)

	// get max and min value
	const [yMax, yMin] = boundaries(valuesArray)

	const linesNumber: number[] = []
	for (let i = yMax; i >= yMin; i--) {
		linesNumber.push(i)
	}

	const step = VIEW_HEIGHT/linesNumber.length

	gridDraw(ctx, step, linesNumber)

	dataDraw(ctx,yMax, yMin, valuesArray)
}

