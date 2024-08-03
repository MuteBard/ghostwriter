const { mouse: robot, Point, Button } = require("@nut-tree-fork/nut-js");
let remainingTime = 0;

async function getData() {
	const path = "./data/positions-actions-timings.json";
	return getFile(path);
}

async function execute() {
	await simpleClick({ x: 500, y: 500 });
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
			step: `${index + 1} / ${loopedBoxes.length}`
		};
	});
	finalBoxes.push(deathBox);
	finalBoxes.forEach((box) => processActions(box, finalBoxes));
	return finalBoxes;
}

async function processActions(box, finalBoxes) {
	setTimeout(async () => {
		const minutesStr =
			box.minutes == 1 ? `${box.minutes} minute` : `${box.minutes} minutes`;
		const secondsStr =
			box.seconds == 1 ? `${box.seconds} second` : `${box.seconds} seconds`;
		console.log(`Executed ${box.title} in ${minutesStr} and ${secondsStr}`);
		displayLoopCount(box, finalBoxes)
		await actionSelector(box);
	}, box.time);
}

function displayLoopCount(box, finalBoxes) {
	if (box.step) {

		const steps = document.getElementById("step");
		const loops = document.getElementById("loop");
		const totalTime = finalBoxes[finalBoxes.length - 1].time;
		const remainingTime = totalTime - box.time;
		const t = convertMilliseconds(remainingTime)

		steps.innerHTML = `Step ${box.step}`
		loops.innerHTML = `Loop ${box.currentLoop}`
		remain.innerHTML = `Time Remaining: Hours : ${t.hours} | Minutes: ${t.minutes} | Seconds: ${t.seconds}`
	}
}

async function actionSelector(box) {
	switch (box.action) {
		case "click":
			await simpleClick(box);
			break;
		case "click-double":
			await simpleClick(box);
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

/**
 * Loop the boxes based on the desired number of times and also indicate what loop each set of boxes belongs to
 * At the end, flatten the list of objects into one list
 * @param {*} times 
 * @param {*} boxes
 * @returns boxes
 */
function loop(times, boxes) {
	return [...Array(times)].flatMap((_, index) => {
		return boxes.map((box) => {
			return { ...box, currentLoop: index + 1 };
		});
	});
}

async function simpleClick(box) {
	const point = new Point(box.x, box.y);
	await robot.setPosition(point);
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

function convertMilliseconds(ms) {
    let seconds = Math.floor(ms / 1000);
    let hours = Math.floor(seconds / 3600);
    seconds = seconds % 3600;
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    return { hours, minutes, seconds };
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
