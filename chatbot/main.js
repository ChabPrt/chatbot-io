import './style.css'
import {initForm} from './src/form.js'
import {Bot} from './src/bot.js';
import {Message} from './src/messages.js';

const app = document.getElementById('app');

const chatbotComponent = await (await fetch('/src/components/chatbot.html')).text();
app.innerHTML = chatbotComponent;

initForm();

await Bot.init();

await Message.init();