import { Bot } from './bot.js';
import { Message } from './messages.js';

let apiCallsInProgress = {};

async function fetchWithLoading(url) {
    if (apiCallsInProgress[url]) {
        return apiCallsInProgress[url];
    }

    const loadingElement = await Message.showLoadingMessage();

    const fetchPromise = fetch(url)
        .then(response => response.text())
        .catch(error => {
            throw error;
        })
        .finally(() => {
            loadingElement.stopLoading();
            delete apiCallsInProgress[url];
        });

    apiCallsInProgress[url] = fetchPromise;
    return fetchPromise;
}

export const bots = [
    {
        defaultVisibility: true,
        name: "May the 4th be with you",
        icon: "starwarsBot.png",
        commands: [
            {
                pattern: /.*qui es tu.*/i,
                fetch: () => "Encyclopédie de Star Wars, je suis"
            },
            {
                help: "Donne moi un personnage de Star Wars",
                pattern: /.*personnage.*/i,
                fetch: async () => {
                    try {
                        const random = Math.floor(Math.random() * 83) + 1;
                        const response = await fetch(`https://swapi.dev/api/people/${random}`, {
                            headers: {
                                'Accept': 'application/json'
                            }
                        });
                        const data = await response.json();
                        return data.name;
                    } catch (error) {
                        return "Erreur lors de la récupération des données.";
                    }
                }
            },
            {
                help: "Donne moi 5 planètes de Star Wars",
                pattern: /.*(\d+) planete.*/i,
                fetch: async (limit) => {
                    try {
                        const response = await fetch('https://swapi.dev/api/planets/', {
                            headers: {
                                'Accept': 'application/json'
                            }
                        });
                        const data = await response.json();
                        return data.results.slice(0, limit).map(item => item.name).join('<br>');
                    } catch (error) {
                        return "Erreur lors de la récupération des données.";
                    }
                }
            },
            {
                help: "Anakin Skywalker est-il dans Star Wars ? (Oui et c'est le meilleur, je veux rien savoir.)",
                pattern: /.*(\w+) est-il dans.*/i,
                fetch: async (person) => {
                    try {
                        const response = await fetch(`https://swapi.dev/api/people/?search=${person}`, {
                            headers: {
                                'Accept': 'application/json'
                            }
                        });
                        const data = await response.json();
                        return data.results.length > 0 ? `${data.results[0].name} est dans Star Wars.` : "Il ne fait pas partie de Star Wars...";
                    } catch (error) {
                        return "Erreur lors de la récupération des données.";
                    }
                }
            }
        ]
    },
    {
        defaultVisibility: true,
        name: "Proverbe et Citation",
        icon: "quoteBot.png",
        commands: [
            {
                pattern: /.*qui es tu.*/i,
                fetch: () => "Ton compagnon de citation"
            },
            {
                help: "Donne moi une citation",
                pattern: /.*\bcitation\b(?!.*\bconnues\b).*/i,
                fetch: async () => {
                    try {
                        const response = await fetch(`https://api.quotable.io/random`);
                        const data = await response.json();
                        return `<p><em>"${data.content}"</em><br>- ${data.author}</p>`;
                    } catch (error) {
                        return "Aucune citation trouvée.";
                    }
                }
            },
            {
                help: "Donne moi 3 citations connues",
                pattern: /.*\b(\d+)\b\s+citations\s+connues.*/i,
                fetch: async (count) => {
                    try {
                        const citationsPromises = Array.from({ length: parseInt(count, 10) }).map(async () => {
                            const response = await fetch(`https://api.quotable.io/random`);
                            const data = await response.json();
                            return `<p><em>"${data.content}"</em><br>- ${data.author}</p>`;
                        });
                        
                        const citations = await Promise.all(citationsPromises);
                        return citations.join('<br>');
                    } catch (error) {
                        return "Aucune citation trouvée.";
                    }
                }
            },
            {
                help: "Qu'a dit Voltaire dans sa vie",
                pattern: /.*dit (\w+).*/i,
                fetch: async (author) => {
                    try {
                        const response = await fetch(`https://api.quotable.io/quotes?author=${author}`);
                        const data = await response.json();
                        return data.results.length > 0 
                            ? `<p><em>"${data.results[0].content}"</em><br>- ${data.results[0].author}</p>` 
                            : "Aucune citation trouvée.";
                    } catch (error) {
                        return "Aucune citation trouvée.";
                    }
                }
            }
        ]
    },
    {
        defaultVisibility: true,
        name: "Math & Matic",
        icon: "mathsMistoryBot.png",
        commands: [
            {
                pattern: /.*qui es tu.*/i,
                fetch: () => "Je suis l'enfant entre Yvan Monka et Nota Bene"
            },
            {
                help: "Que s'est-il passé en l'an 2001",
                pattern: /.*l'an (\d+).*/i,
                fetch: async (yearNumber) => {
                    try {
                        const data = await fetchWithLoading(`http://numbersapi.com/${yearNumber}/year`);
                        return data;
                    } catch (error) {
                        return "Erreur lors de la récupération des données.";
                    }
                }
            },
            {
                help: "Donne moi une particularité d'un nombre",
                pattern: /.*nombre.*/i,
                fetch: async () => {
                    try {
                        const data = await fetchWithLoading(`http://numbersapi.com/random/math`);
                        return data;
                    } catch (error) {
                        return "Erreur lors de la récupération des données.";
                    }
                }
            },
            {
                help: "Qu'est-ce qu'il s'est passé à la date du 07/15 ?",
                pattern: /.*date du (\d+\/\d+).*/i,
                fetch: async (date) => {
                    try {
                        const data = await fetchWithLoading(`http://numbersapi.com/${date}/date`);
                        return data;
                    } catch (error) {
                        return "Erreur lors de la récupération des données.";
                    }
                }
            }
        ]
    },
    {
        defaultVisibility: false,
        name: "Commandes bot",
        icon: "commandBot.png",
        commands: [
            {
                help: "Liste des commandes",
                pattern: /.*help.*/i,
                fetch: async () => {
                    try {
                        const bots = Bot.getBots().filter(b => b.defaultVisibility);
                        return bots.map(bot => bot.commands.filter(c => c.help).map(command => command.help).join('<br>')).join('<br>');
                    } catch (error) {
                        return "Erreur lors de la récupération des données.";
                    }
                }
            }
        ]
    }
];
