const { getFile } = require("./service/fileManager");
const { execute } = require("./auto");

let allBoxes = [];
const selectAction = [
	{
		key: "id",
		value: `actions`,
	},
	{
		key: "name",
		value: `actions`,
	},
];

const selectSeconds = [
	{
		key: "id",
		value: `seconds`,
	},
	{
		key: "name",
		value: `seconds`,
	},
];

const selectMinutes = [
	{
		key: "id",
		value: `minutes`,
	},
	{
		key: "name",
		value: `minutes`,
	},
];

const selectLoops = [
	{
		key: "id",
		value: `loops`,
	},
	{
		key: "name",
		value: `loops`,
	},
];

const actionOptions = [
	{
		text: "Click",
		attributes: [
			{
				key: "value",
				value: "click",
			},
		],
	},
	// {
	// 	text: "Click and Type",
	// 	attributes: [
	// 		{
	// 			key: "value",
	// 			value: "click-type",
	// 		},
	// 	],
	// },
	// {
	// 	text: "Click and Scroll",
	// 	attributes: [
	// 		{
	// 			key: "value",
	// 			value: "click-scroll",
	// 		},
	// 	],
	// },
	// {
	// 	text: "Click and Drag",
	// 	attributes: [
	// 		{
	// 			key: "value",
	// 			value: "click-drag",
	// 		},
	// 	],
	// },
];

const secondOptions = [...Array(60)].map((_, index) => {
	const number = index + 1;
	return {
		text: number === 1 ? `${number} second` : `${number} seconds`,
		attributes: [
			{
				key: "value",
				value: number,
			},
		],
	};
});

const minuteOptions = [...Array(60)].map((_, index) => {
	const number = index;
	return {
		text: number === 1 ? `${number} minute` : `${number} minutes`,
		attributes: [
			{
				key: "value",
				value: number,
			},
		],
	};
});

const loopOptions = [1, 3, 5, 10, 15, 20, 25, 50, 100, 250, 500, 1000].map(
	(values) => {
		const number = values;
		return {
			text: number === 1 ? `${number} loop` : `${number} loops`,
			attributes: [
				{
					key: "value",
					value: number,
				},
			],
		};
	}
);

async function handleTimings() {
	await hidePositionPhase();
}

function handlePosition() {
	hideTimingPhase();
}

function handleMenu() {
	findClickAndType();
}

async function handleSaveTime() {
	const menuCards = Array.from(document.querySelectorAll(".menuCard"));
	const loopCard = menuCards.pop();
	const path = "./data/positions-actions-timings.json";
	const timeResults = menuCards.map((menuCard, index) => {
		const title = menuCard.children[0].innerHTML;
		const action = menuCard.children[1].children[1].value;
		const seconds = Number(menuCard.children[2].children[1].value);
		const minutes = Number(menuCard.children[3].children[1].value);
		let text = "";

		if (Array.from(menuCard.children).length === 5) {
			text = menuCard.children[4].value;
		}

		return {
			title,
			action,
			seconds,
			minutes,
			x: allBoxes[index].x,
			y: allBoxes[index].y,
			text,
		};
	});

	let loopResults = Number(loopCard.children[1].children[1].value);

	await makeFile(
		path,
		JSON.stringify({ time: timeResults, loops: loopResults }, null, 4)
	);

	const container = document.getElementById("container");
	const savePosition = document.getElementById("save-position");
	const time = document.getElementById("time");
	const saveTime = document.getElementById("save-time");
	const position = document.getElementById("position");
	const menu = document.getElementById("menu");
	const exit = document.getElementById("exit");

	container.style.display = "none";
	savePosition.style.display = "none";
	time.style.display = "none";
	position.style.display = "none";
	menu.style.display = "none";
	menu.innerHTML = "";
	saveTime.style.display = "none";
	exit.style.display = "inline";
}

async function handleExit() {
	if (typeof nw !== "undefined" && nw.App) {
		console.log("Exiting the NW.js application...");
		const win = nw.Window.get();
		win.hide();
		console.log("asdad");
		await execute();
	}
}

async function hidePositionPhase() {
	const container = document.getElementById("container");
	const savePosition = document.getElementById("save-position");
	const time = document.getElementById("time");
	const saveTime = document.getElementById("save-time");
	const position = document.getElementById("position");
	const menu = document.getElementById("menu");
	const add = document.getElementById("add");
	const remove = document.getElementById("remove");

	container.style.display = "none";
	savePosition.style.display = "none";
	time.style.display = "none";
	position.style.display = "inline";
	menu.style.display = "flex";
	saveTime.style.display = "inline";
	add.style.display = "none";
	remove.style.display = "none";

	const strData = await getJsonData();
	allBoxes = JSON.parse(strData);
	buildMenu(allBoxes);
}

function hideTimingPhase() {
	const container = document.getElementById("container");
	const savePosition = document.getElementById("save-position");
	const time = document.getElementById("time");
	const saveTime = document.getElementById("save-time");
	const position = document.getElementById("position");
	const menu = document.getElementById("menu");
	const add = document.getElementById("add");
	const remove = document.getElementById("remove");

	container.style.display = "block";
	savePosition.style.display = "inline";
	time.style.display = "inline";
	position.style.display = "none";
	menu.style.display = "none";
	menu.innerHTML = "";
	saveTime.style.display = "none";
	add.style.display = "inline";
	remove.style.display = "inline";
}

async function getJsonData() {
	const path = "./data/positions.json";
	return await getFile(path);
}

function buildMenu(boxes) {
	const menu = document.getElementById("menu");
	boxes.forEach((box) => {
		const menuCard = createMenuCard(box);
		menu.appendChild(menuCard);
	});
	const loopsCard = createLoopsCard();
	menu.appendChild(loopsCard);
}

function findClickAndType() {
	const menuCards = Array.from(document.querySelectorAll(".menuCard"));
	menuCards.forEach((menuCard) => {
		const select = menuCard.children[1].children[1];
		if (select.value === "click-type" && menuCard.children.length <= 4) {
			const input = document.createElement("input");
			input.type = "text";
			input.placeholder = "Enter your text";
			menuCard.appendChild(input);
		}
	});
}

function createDropDown(box, labelText, selectList, optionsList) {
	const dropDownContainer = document.createElement("div");
	const label = document.createElement("label");
	const select = document.createElement("select");

	dropDownContainer.classList.add("dropdown");
	label.innerHTML = labelText;

	selectList.map((attribute) =>
		select.setAttribute(attribute.key, `box-${box.id}-${attribute.value}`)
	);
	optionsList.map((optionData) => {
		const option = document.createElement("option");
		option.innerHTML = optionData.text;
		optionData.attributes.map((attribute) =>
			option.setAttribute(attribute.key, attribute.value)
		);
		select.appendChild(option);
	});

	dropDownContainer.appendChild(label);
	dropDownContainer.appendChild(select);

	return dropDownContainer;
}

function createMenuCard(box) {
	//create elements
	const menuCard = document.createElement("div");
	const h3 = document.createElement("h3");

	const dropDownAction = createDropDown(
		box,
		"Select an Action",
		selectAction,
		actionOptions
	);
	const dropDownSeconds = createDropDown(
		box,
		"Duration in Seconds",
		selectSeconds,
		secondOptions
	);
	const dropDownMinutes = createDropDown(
		box,
		"Duration in Minutes",
		selectMinutes,
		minuteOptions
	);

	//populate elements and classes
	menuCard.classList.add("menuCard");
	menuCard.style.backgroundColor = getColor(box.rawColor, 1);
	menuCard.style.opacity = 1;

	h3.classList.add("menuCardTitle");
	h3.innerHTML = `Box ${box.id}`;

	menuCard.appendChild(h3);
	menuCard.appendChild(dropDownAction);
	menuCard.appendChild(dropDownSeconds);
	menuCard.appendChild(dropDownMinutes);

	return menuCard;
}

function createLoopsCard() {
	const menuCard = document.createElement("div");
	const h3 = document.createElement("h3");

	const dropDownLoops = createDropDown(
		{ id: -1 },
		"Number of Loops",
		selectLoops,
		loopOptions
	);
	menuCard.classList.add("menuCard", "loopCard");
	menuCard.style.backgroundColor = "#bcdefe";
	menuCard.style.opacity = 1;

	h3.classList.add("menuCardTitle");
	h3.innerHTML = `Loop Instructions`;

	menuCard.appendChild(h3);
	menuCard.appendChild(dropDownLoops);

	return menuCard;
}

const timings = document.getElementById("time");
timings.addEventListener("click", handleTimings);

const position = document.getElementById("position");
position.addEventListener("click", handlePosition);

const menuBlock = document.getElementById("menu");
menuBlock.addEventListener("click", handleMenu);

const saveTime = document.getElementById("save-time");
saveTime.addEventListener("click", handleSaveTime);

const exit = document.getElementById("exit");
exit.addEventListener("click", handleExit);
