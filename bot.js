/**
 * H37 Discord Bot
 * 
 * Description: 
 * H37 is a specialized Discord bot built for the Once Human game community. It automates the tracking and 
 * display of in-game event reset times (e.g., loot resets, vendor resets, and phase changes). The bot
 * also manages dynamic game events like Hal's Moving House, providing users with up-to-date information 
 * through timed updates and slash commands.
 * 
 * Core Features:
 * - Tracks and updates loot reset times, phase resets, and combined resets (Vendors, Commission).
 * - Provides dynamic tracking for Hal's Moving House with configurable location.
 * - Automatically updates a Discord channel message at regular intervals.
 * - Uses slash commands for interaction (e.g., setting phase times, creating timer posts).
 * - Periodically checks and ensures the bot's activity status is correctly set.
 * 
 * Configuration: 
 * Configurable settings such as message IDs, reset times, and bot token are loaded from a JSON file (config.json). 
 * The configuration is dynamically updated when necessary (e.g., when a new message ID is created).
 * 
 * Author: @Zephvarian on Discord
 * Date: 9/15/2024
 * License: Unlicense
 */

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const moment = require('moment-timezone');
const { commands } = require('./commands');  // Import commands
const { 
    getNextLootReset, 
    getCombinedReset, 
    getNextPhaseReset, 
    getTownSecurementReset 
} = require('./resetTimers');  // Import reset timer functions
const { loadConfig, saveConfig } = require('./configHandler');  // Import config handler

// Load configuration from config file
let config = loadConfig();

// Extract values from the configuration
const CHANNEL_ID = config.CHANNEL_ID;
let MESSAGE_ID = config.MESSAGE_ID;  // The ID of the message to update
const BOT_TOKEN = config.BOT_TOKEN;
const THUMBNAIL_URL = config.THUMBNAIL_URL;
const EMBED_COLOR = config.EMBED_COLOR;
const EMBED_TITLE = config.EMBED_TITLE;
const LOOT_RESET_TIMES = config.LOOT_RESET_TIMES;
const COMBINED_RESET_DAY = config.COMBINED_RESET_DAY;
const COMBINED_RESET_HOUR = config.COMBINED_RESET_HOUR;
const COMBINED_RESET_MINUTE = config.COMBINED_RESET_MINUTE;
let NEXT_PHASE_DAY = config.NEXT_PHASE_DAY;
let NEXT_PHASE_HOUR = config.NEXT_PHASE_HOUR;
let NEXT_PHASE_MINUTE = config.NEXT_PHASE_MINUTE;
let HAL_LOCATION = config.HAL_LOCATION || 'NW of Deadsville';  // Default location if not set
const TIMEZONE = config.TIMEZONE || 'America/Chicago';  // Default to CDT/CST

// Save config to persist changes (e.g., MESSAGE_ID or other updated settings)
function updateConfig() {
    saveConfig(config);
}

// Initialize Discord client with necessary intents
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Register slash commands on bot startup
client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);

    // Register slash commands globally for the bot
    await client.application.commands.set(commands);

    // Set the bot's status to "Playing Once Human"
    client.user.setPresence({
        activities: [{ name: 'Once Human' }],
        status: 'online'
    });

    console.log('Activity set to "Playing Once Human".');

    // Fetch the Discord channel using the channel ID
    const channel = await client.channels.fetch(CHANNEL_ID);

    if (!MESSAGE_ID) {
        console.log('Message ID not found. Please type /ohcreatetimerpost to create a new timer post.');
    } else {
        try {
            // Fetch the message to ensure it's valid
            const message = await channel.messages.fetch(MESSAGE_ID);
            console.log('Message found. Updating the message right away.');
            await updateMessage(channel);  // Update right away on login
            setInterval(() => updateMessage(channel), 60 * 1000);  // Update every minute
        } catch (error) {
            console.error('Message ID is invalid or message could not be fetched. Please type /ohcreatetimerpost to create a new timer post.');
        }
    }
});

// Handle slash commands like /ohsetphase, /ohcreatetimerpost, and /ohsethallocation
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ohsetphase') {
        const datetimeString = interaction.options.getString('datetime');

        // Parse the datetime string and adjust for the specified timezone
        const newPhaseMoment = moment(datetimeString, 'MM/DD/YYYY h:mma').tz(TIMEZONE);

        if (!newPhaseMoment.isValid()) {
            await interaction.reply({ content: 'Invalid date format. Please use MM/DD/YYYY HH:MMAM/PM format.', ephemeral: true });
            return;
        }

        // Update config with the new phase reset time and save it
        config.NEXT_PHASE_DAY = newPhaseMoment.date();
        config.NEXT_PHASE_HOUR = newPhaseMoment.hour();
        config.NEXT_PHASE_MINUTE = newPhaseMoment.minute();
        updateConfig();

        await interaction.reply(`Next phase reset has been set to ${newPhaseMoment.format('MMMM Do YYYY, h:mm A z')}.`);
        console.log(`Next phase reset updated to: ${newPhaseMoment.format('MMMM Do YYYY, h:mm A z')}`);
    }

    if (commandName === 'ohcreatetimerpost') {
        const channel = await client.channels.fetch(CHANNEL_ID);
        if (!channel) {
            await interaction.reply({ content: 'Error: Channel not found.', ephemeral: true });
            return;
        }

        // Create a new message for the timer post
        const embed = new EmbedBuilder()
            .setTitle(EMBED_TITLE)
            .setColor(EMBED_COLOR)
            .setThumbnail(THUMBNAIL_URL)
            .addFields({ name: 'Placeholder', value: 'This is a new timer post.' });

        const message = await channel.send({ embeds: [embed] });

        // Update config with the new message ID and save it
        MESSAGE_ID = message.id;
        config.MESSAGE_ID = MESSAGE_ID;
        updateConfig();

        await interaction.reply(`Timer post created with ID: ${MESSAGE_ID}.`);
    }

    if (commandName === 'ohsethallocation') {
        const newLocation = interaction.options.getString('location');

        // Update Hal's Moving House location and save it
        config.HAL_LOCATION = newLocation;
        HAL_LOCATION = newLocation;
        updateConfig();

        await interaction.reply(`Hal's Moving House location has been updated to: ${newLocation}`);
    }
});

// Update the message with the latest reset times
async function updateMessage(channel) {
    try {
        const lootReset = getNextLootReset(LOOT_RESET_TIMES, TIMEZONE);
        const combinedReset = getCombinedReset(COMBINED_RESET_DAY, COMBINED_RESET_HOUR, COMBINED_RESET_MINUTE, TIMEZONE);
        const nextPhase = getNextPhaseReset(NEXT_PHASE_DAY, NEXT_PHASE_HOUR, NEXT_PHASE_MINUTE, TIMEZONE);
        const townSecurementReset = getTownSecurementReset(TIMEZONE);

        const embed = new EmbedBuilder()
            .setTitle(EMBED_TITLE)
            .setColor(EMBED_COLOR)
            .setThumbnail(THUMBNAIL_URL)
            .addFields(
                { name: '📦 Loot', value: `<t:${lootReset.unix()}:t>, <t:${lootReset.unix()}:R>`, inline: false },
                { name: `🐈 Town Securement Unit`, value: `<t:${townSecurementReset.unix()}:t>, <t:${townSecurementReset.unix()}:R>`, inline: false },
                { name: '✅ Vendors and Commissions', value: `<t:${combinedReset.unix()}:F>, <t:${combinedReset.unix()}:R>`, inline: false },
                { name: `🏠 Hal's Moving House`, value: `<t:${combinedReset.unix()}:F>, <t:${combinedReset.unix()}:R>\nLast Seen: ${HAL_LOCATION}`, inline: false },
                { name: '😈 Next Phase', value: `<t:${nextPhase.unix()}:F>, <t:${nextPhase.unix()}:R>`, inline: false },
                { name: 'Detail', value: '*Loot resets every 4 hours, you must re-log in order to loot.\nVendor, Commission, and Purifiers reset weekly.\nHal\'s Moving House moves between 4 spots each week.*', inline: false }
            )
            .setFooter({ text: `Last Update: ${moment().tz(TIMEZONE).format('h:mm A z')}` });

        const message = await channel.messages.fetch(MESSAGE_ID);
        await message.edit({ embeds: [embed] });
        console.log('Message edited successfully.');

    } catch (error) {
        console.error(`Error updating message: ${error.message}`);
    }
}

// Periodically check and reset bot's activity status
function checkBotActivity() {
    const currentActivity = client.user.presence.activities[0]?.name;

    if (currentActivity !== 'Once Human') {
        console.log('Activity changed, resetting to "Playing Once Human".');
        client.user.setPresence({
            activities: [{ name: 'Once Human' }],
            status: 'online'
        });
    }
}

// Set interval to periodically check bot's activity (every 5 minutes)
setInterval(checkBotActivity, 5 * 60 * 1000);

// Log the bot in using the token
client.login(BOT_TOKEN).catch(error => {
    console.error(`Error logging in: ${error.message}`);
});

// Required console message to mark startup as successful
console.log('successfully finished startup');
