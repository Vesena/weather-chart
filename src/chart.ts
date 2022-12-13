import { ItemData } from "./types";

const WIDTH: number = 1200;
const HEIGHT: number = 600;
const PADDING_X: number = 40;
const PADDING_Y: number = 32;
const ZERO_X: number = PADDING_X
const DPI_WIDTH: number = WIDTH*2;
const DPI_HEIGHT: number = HEIGHT*2;
const VIEW_HEIGHT: number = DPI_HEIGHT - PADDING_Y * 2
const VIEW_WIDTH: number = DPI_WIDTH - PADDING_X

export function chart(canvas: HTMLCanvasElement, data: Array<ItemData>): void {
	let verticalCanvasCenter: number = 0
	const ctx:CanvasRenderingContext2D = canvas.getContext('2d')
	canvas.width = DPI_WIDTH
	canvas.height = DPI_HEIGHT

	// === x axis
	ctx.beginPath()
	ctx.lineWidth = 1;
	ctx.strokeStyle = '#808080'
	ctx.moveTo(ZERO_X, 0)
	ctx.lineTo(ZERO_X, DPI_WIDTH)
	ctx.stroke()
	ctx.closePath()
	// ===

	// get array of values from data
	const arrayValues = data.map((item)=>item.v)

	// get max and min
	function boundaries() {
		const max = Math.floor(Math.max.apply(null,arrayValues))
		const min = Math.floor(Math.min.apply(null, arrayValues))
		return [max, min]
	}
	const [yMax, yMin] = boundaries()

	const rowsCount = []
	for (let i = yMax; i>=yMin; i--) {
		rowsCount.push(i)
	}

	// === y axis
	const step = VIEW_HEIGHT/ rowsCount.length

	for (let i = 1; i<=rowsCount.length; i++) {
		ctx.beginPath()
		ctx.lineWidth = 1;
		ctx.font = 'normal 16px Helvetica,sans-serif'
		ctx.fillStyle = '#96a2aa'
		const y = step * i
		if (rowsCount[i-1]%5 === 0) {
			if (rowsCount[i-1] === 0) {
				verticalCanvasCenter= y+ PADDING_Y;
			}
			ctx.fillText(rowsCount[i-1],5, y+ PADDING_Y-1 )
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

	const delta = Math.abs(yMax) + Math.abs(yMin)
	const yRatio = VIEW_HEIGHT/delta
	const barWidth = VIEW_WIDTH/arrayValues.length
	let barXPosition = ZERO_X

	ctx.fillStyle = "#009900";

	for (const item of arrayValues) {
		const barHeight = (item*yRatio)*-1
		ctx.fillRect(barXPosition,verticalCanvasCenter, barWidth, barHeight)
		barXPosition += barWidth
	}
}

