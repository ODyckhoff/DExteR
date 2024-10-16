import { Events } from 'discord.js';

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        client.user.setPresence({
            activities: [
                { 
                    name: 'Watching over Saviors', 
                    type: 4
                }
            ], 
            status: 'online', 
            afk: false 
        });
    }
}