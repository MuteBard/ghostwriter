const { makeFile } = require("./service/fileManager");
const { color, getColor } = require("./colors");

const container = document.getElementById("container");
const canvas = document.createElement("canvas");

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
let boxIndex = 1;

canvas.width = screenWidth - 50;
canvas.height = screenHeight - 40;

const ctx = canvas.getContext("2d");

let positions = [createCells(10, 10)[0]];
let boxes = positions.map((pos) => generateColorTarget(pos.id, pos.x, pos.y));
let output;

function generateColorTarget(id, x, y) {
	const randomDecimal = Math.random();
	const colorList = Object.values(color);
	const randomNumber = Math.floor(randomDecimal * colorList.length);
	const randomColor = getColor(colorList[randomNumber], 0.6);
	const colorData = {
		style: randomColor,
		color: colorList[randomNumber],
	};
	return createBox(id, x, y, colorData);
}

function updateBoxCount() {
	console.log(boxes);
	positions = [...Array(boxIndex)].map(
		(_, index) => createCells(10, 10)[index]
	);
	boxes = positions.map((pos) => generateColorTarget(pos.id, pos.x, pos.y));
	console.log(boxes);
	reDrawBoxes();
}

function reDrawBoxes() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	boxes.forEach((box) => {
		const colorData = {
			style: box.color,
			color: box.rawColor,
		};
		createBox(box.id, box.x, box.y, colorData);
	});
}

function createBox(id, x, y, colorData) {
	const width = 50;
	const height = 50;
	const { mx, my } = getPoints(x, y, width, height);

	const { style: c, color: rawColor } = colorData;

	//create square
	ctx.fillStyle = c;
	ctx.fillRect(x, y, width, height);

	//write coordinates
	ctx.fillStyle = color.WHITE;
	ctx.font = "20px Arial";
	ctx.fillText(`(${mx},${my})`, mx + 10, my);

	//write id
	ctx.fillStyle = color.WHITE;
	ctx.font = "bold 20px Arial";
	ctx.fillText(`${id}`, x + 5, y + 20);

	const radiusData = [
		{ radius: 1, color: getColor(color.RED, 0.4) },
		{ radius: 5, color: getColor(color.WHITE, 0.4) },
		{ radius: 10, color: getColor(color.RED, 0.4) },
	];

	radiusData.forEach((element) => {
		const centerX = mx;
		const centerY = my;
		const radius = element.radius;
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
		ctx.strokeStyle = element.color;
		ctx.lineWidth = 5;
		ctx.stroke();
	});

	return {
		id,
		x,
		y,
		width,
		height,
		color: c,
		rawColor,
		isDragging: false,
	};
}

function getPoints(x, y, width, height) {
	return {
		mx: x + width / 2,
		my: y + height / 2,
	};
}

function isInsideBox(x, y, box) {
	return (
		x > box.x && x < box.x + box.width && y > box.y && y < box.y + box.height
	);
}

canvas.addEventListener("mousedown", function (event) {
	const mouseX = event.offsetX;
	const mouseY = event.offsetY;

	boxes.forEach((box) => {
		if (isInsideBox(mouseX, mouseY, box)) {
			box.isDragging = true;
		}
	});

	for (let i = boxes.length - 1; i >= 0; i--) {
		if (isInsideBox(mouseX, mouseY, boxes[i])) {
			boxes[i].isSelected = true;
			break;
		}
	}
});

canvas.addEventListener("mousemove", function (event) {
	boxes.forEach((box) => {
		if (box.isDragging && box.isSelected) {
			box.x = event.offsetX - box.width / 2;
			box.y = event.offsetY - box.height / 2;
			reDrawBoxes();
		}
	});
});

canvas.addEventListener("mouseup", function (event) {
	boxes.forEach((box) => {
		box.isDragging = false;
	});
	prepareOutput(boxes);
});

function prepareOutput(boxes) {
	const simpleBoxes = boxes.map((box) => {
		return {
			id: box.id,
			x: box.x + 40,
			y: box.y + 40,
			color: box.color,
			rawColor: box.rawColor,
		};
	});
	output = JSON.stringify(simpleBoxes, null, 4);
}

async function handleSavePositions() {
	const path = "./positions.json";
	const content = output;
	await makeFile(path, content);
}

function createCells(xSize, ySize) {
	const xOffset = 35;
	const yOffset = 30;
	const xs = [...Array(xSize)].map((_, i) => i * 140 + xOffset);
	const ys = [...Array(ySize)].map((_, i) => i * 100 + yOffset);
	const coordinates = [];

	for (let xi = 0; xi < xSize; xi++) {
		for (let yi = 0; yi < ySize; yi++) {
			coordinates.push({ x: xs[xi], y: ys[yi] });
		}
	}
	return coordinates.map((coord, i) => {
		return {
			id: i + 1,
			...coord,
		};
	});
}

function handleAddBoxes() {
	if (boxIndex <= 100) {
		boxIndex++;
	}
	updateBoxCount();
}

function handleRemoveBoxes() {
	if (boxIndex > 1) {
		boxIndex--;
	}
	updateBoxCount();
}

const button = document.getElementById("save-position");
button.addEventListener("click", handleSavePositions);

const addSquares = document.getElementById("add");
addSquares.addEventListener("click", handleAddBoxes);

const removeSquares = document.getElementById("remove");
removeSquares.addEventListener("click", handleRemoveBoxes);

container.appendChild(canvas);
