const robot = require('robotjs');
const { getFile } = require('./src/service/fileManager');
const loopTimes = Number(process.argv.slice(2)[0]);

async function getData(){
    const path = "./src/positions-actions-timings.json";
    return getFile(path);
}

async function execute() {
    const boxes = await getData();
    const updatedBoxes = JSON.parse(boxes)
    const loopedBoxes = loop(loopTimes, updatedBoxes);
    const sequentialTimes = makeTimeSequential(loopedBoxes);
    const finalBoxes = loopedBoxes.map((box, index) => {
        return {
            ...box,
            time: sequentialTimes[index]
        }
    }) 
    finalBoxes.forEach(box => processActions(box))
    return finalBoxes;
}

async function processActions(box) {
    setTimeout(() => {
        const minutesStr = box.minutes == 1 ? `${box.minutes} minute` : `${box.minutes} minutes`
        const secondsStr = box.seconds == 1 ? `${box.seconds} second` : `${box.seconds} seconds`
        console.log(`Executing ${box.title} in ${minutesStr} and ${secondsStr}`);
        actionSelector(box);
    }, box.time);
}

function actionSelector(box) {
    switch(box.action) {
        case "click":
            simpleClick(box);
            break;
        case "click-type":
            clickType(box);
            break;
        case "click-scroll":
            break;
        case "click-drag":
            break;
        default:
            throw new Error(`Unknown action given for ${box.title}:  ${box.action}`);
    }
}

function loop(times, boxes){
    return [...Array(times)].flatMap((_, index) => {
        return boxes
    })
}


function simpleClick(box) {
    robot.moveMouse(box.x, box.y);
    // robot.keyTap('control')
    // robot.keyTap('control')
    robot.mouseClick();
    robot.mouseClick();
}

function clickType(box) {
    robot.moveMouseSmooth(box.x, box.y);
    robot.mouseClick();
    robot.typeString(box.text)
}

function clickDrag(box) {
    
}

function clickScroll(box) {
    
}

function convertTimeToMilli(minutes, seconds){
   const minMilli = minutes * 60 * 1000;
   const secMilli = seconds * 1000;
   return minMilli + secMilli;
}


function makeTimeSequential(boxes) {
    return boxes
        .map(box => convertTimeToMilli(box.minutes, box.seconds))
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