import { Message } from './messages.js';
import { Bot } from './bot.js';

export function initForm() {
    const form = document.querySelector('#chat-form');
    const input = document.querySelector('#message-input');
    const chatBox = document.querySelector('#chat-box');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const messageContent = input.value.trim();

        if (messageContent) {
            await Message.send({
                senderName: 'Vous',
                content: messageContent,
                icon: 'userIcon.png',
                date: Date.now(),
                isUser: true
            });

            let matchedCommand = false;

            const bots = Bot.getBots();
            for (const bot of bots) {
                for (const command of bot.commands) {
                    const regex = new RegExp(command.pattern);
                    if (regex.test(messageContent)) {
						if (messageContent.toLowerCase() !== 'qui es tu') matchedCommand = true;
                        const match = regex.exec(messageContent);
                        const response = await command.fetch(...match.slice(1));
                        await Message.send({
                            content: response,
                            senderName: bot.name,
                            date: Date.now(),
                            icon: bot.icon,
                            isUser: false
                        });
                        break;
                    }
                }
                if (matchedCommand) break;
            }

            if (!matchedCommand && messageContent.toLowerCase() !== 'qui es tu') {
                await Message.send({
                    content: "Commande inconnue : Utilisez la commande 'help' pour en savoir plus.",
                    senderName: 'Chatbot',
                    date: Date.now(),
                    icon: 'commandBot.png',
                    isUser: false
                });
            }

            chatBox.scrollTop = chatBox.scrollHeight;
            input.value = '';
        }
    });
}
