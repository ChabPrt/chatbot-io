import { Message } from './messages.js';

export class History {
    constructor(messages) {
        if (History.instance) return History.instance;

        History.instance = this;
        History.messages = messages;
    }

    static init() {
        if (!History.instance) {
            new History(
                JSON.parse(localStorage.getItem('messageHistory') ?? '[]')
                    .map(m => new Message(m.content, m.senderName, m.date, m.avatar, m.fromUser))
            );
        }
        return History.instance;
    }

    static getMessageFromHistory() {
        if (!History.instance) History.init();
        return History.messages;
    }

    static addMessageToHistory(message) {
        if (!History.instance) {
            History.init();
        }

        History.messages.push(message);
        localStorage.setItem('messageHistory', JSON.stringify(History.messages));
    }
}
