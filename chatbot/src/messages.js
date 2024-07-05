import { History } from './history.js';
import { Loading } from './loading.js';

export class Message {
    constructor(content, senderName, date, icon, isUser) {
        this.content = content;
        this.date = date;
        this.senderName = senderName;
        this.icon = icon;
        this.isUser = isUser;
    }

    async render() {
        const messageContainer = document.querySelector('#chat-box');
        const messageItemHtml = await (await fetch('./src/components/msg.html')).text();
        const parser = new DOMParser();
        const messageItem = parser.parseFromString(messageItemHtml, 'text/html').firstChild;

        messageItem.querySelector('[item-type="message"]').innerHTML = this.content;
        messageItem.querySelector('[item-type="name"]').innerHTML = this.senderName;
        messageItem.querySelector('[item-type="date"]').innerHTML = new Date(this.date).toLocaleString();

        if (this.isUser) {
            messageItem.querySelector(".message-block").classList.add('flex-row-reverse');
            messageItem.querySelector(".message-info").classList.add('text-right');
            messageItem.querySelector('[item-type="icon"]').remove();
        } else {
            const response = await fetch('/' + this.icon);
            const blob = await response.blob();
            messageItem.querySelector('[item-type="icon"]').src = URL.createObjectURL(blob);
        }

        messageContainer.appendChild(messageItem);
        return messageItem;
    }

    static async send({ content, senderName, date, icon, isUser }) {
        const message = new Message(content, senderName, date, icon, isUser);
        await message.render();
        History.addMessageToHistory(message);
    }

    static async init() {
        const history = History.getMessageFromHistory();
        for (const message of history) {
            await message.render();
        }
        const chatBox = document.querySelector('#chat-box');
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    static async showLoadingMessage() {
        const loading = Loading();
        const messageContainer = document.querySelector('#chat-box');
        messageContainer.appendChild(loading);
        messageContainer.scrollTop = messageContainer.scrollHeight;
        return loading;
    }
}
