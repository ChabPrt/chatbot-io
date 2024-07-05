import {bots} from './bots.js';

export class Bot {
	constructor (name, icon, defaultVisibility, commands) {
		this.name = name;
		this.icon = icon;
		this.defaultVisibility = defaultVisibility;
		this.commands = commands
	}

	async getBotElement() {
		const botItemHtml = await (await fetch('./src/components/item.html')).text();

		const parser = new DOMParser();

		const botItem = parser.parseFromString(botItemHtml, 'text/html').querySelector('.item');
		botItem.querySelector('#botName').innerText = this.name;

		const response = await fetch('/' + this.icon);
		const blob = await response.blob();
		botItem.querySelector('#botIcon').src = URL.createObjectURL(blob);

		return botItem;
	}

	static async init() {
		const bots = Bot.getBots().filter(b => b.defaultVisibility);

		if(bots.length === 0) return;

		const botContainer = document.querySelector('#bot-list');

		for (const bot of bots) {
			botContainer.appendChild(await bot.getBotElement());
		}
	}

	static getBots() {
		return bots.map(botData => new Bot(botData.name, botData.icon, botData.defaultVisibility, botData.commands));
	}
}