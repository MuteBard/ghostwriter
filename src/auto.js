const { mouse: robot, Point, Button } = require("@nut-tree-fork/nut-js");
const { getFile } = require("./service/fileManager");

async function getData() {
	const path = "./data/positions-actions-timings.json";
	return getFile(path);
}

async function execute() {
	const boxes = await getData();
	const { time: updatedBoxes, loops: loopTimes } = JSON.parse(boxes);
	const loopedBoxes = loop(loopTimes, updatedBoxes);
	const sequentialTimes = makeTimeSequential(loopedBoxes);
	const deathBox = {
		title: 'Final Process',
		action: 'exit',
		seconds: 1,
		minutes: 0,
		x: 0,
		y: 0,
		text: '',
		time: sequentialTimes[sequentialTimes.length - 1] + 1000
	  }
	const finalBoxes = loopedBoxes.map((box, index) => {
		return {
			...box,
			time: sequentialTimes[index],
		};
	});
	finalBoxes.push(deathBox);
	finalBoxes.forEach((box) => processActions(box));
	return finalBoxes;
}

async function processActions(box) {
	setTimeout(async () => {
		const minutesStr =
			box.minutes == 1 ? `${box.minutes} minute` : `${box.minutes} minutes`;
		const secondsStr =
			box.seconds == 1 ? `${box.seconds} second` : `${box.seconds} seconds`;
		console.log(`Executed ${box.title} in ${minutesStr} and ${secondsStr}`);
		await actionSelector(box);
	}, box.time);
}

async function actionSelector(box) {
	switch (box.action) {
		case "click":
			await simpleClick(box);
			break;
		case "click-type":
			clickType(box);
			break;
		case "click-scroll":
			break;
		case "click-drag":
			break;
		case "exit":
			process.exit(1);
		default:
			throw new Error(`Unknown action given for ${box.title}:  ${box.action}`);
	}
}

function loop(times, boxes) {
	return [...Array(times)].flatMap((_, index) => {
		return boxes;
	});
}

async function simpleClick(box) {
	const point = new Point(box.x, box.y);
	await robot.setPosition(point);
	await robot.click(Button.LEFT);
	await robot.click(Button.LEFT);
	await robot.click(Button.LEFT);
	await robot.click(Button.LEFT);
	await robot.click(Button.LEFT);
	await robot.click(Button.LEFT);
}

function clickType(box) {}

function clickDrag(box) {}

function clickScroll(box) {}

function convertTimeToMilli(minutes, seconds) {
	const minMilli = minutes * 60 * 1000;
	const secMilli = seconds * 1000;
	return minMilli + secMilli;
}

function makeTimeSequential(boxes) {
	return boxes
		.map((box) => convertTimeToMilli(box.minutes, box.seconds))
		.reduce((list, currentValue) => {
			let newValue;
			if (list.length > 0) {
				newValue = list[list.length - 1] + currentValue;
			} else {
				newValue = currentValue;
			}
			list.push(newValue);
			return list;
		}, []);
}

exports.execute = execute;
