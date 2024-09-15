// commands.js
const { SlashCommandBuilder } = require('discord.js');

const commands = [
    new SlashCommandBuilder()
        .setName('ohsetphase')
        .setDescription('Set the next phase reset date and time.')
        .addStringOption(option => option
            .setName('datetime')
            .setDescription('The next phase date and time in MM/DD/YYYY HH:MMAM/PM format')
            .setRequired(true)),
    new SlashCommandBuilder()
        .setName('ohcreatetimerpost')
        .setDescription('Create the timer post and update config with its ID.'),
    new SlashCommandBuilder()
        .setName('ohsethallocation')
        .setDescription('Set the location for Hal\'s Moving House.')
        .addStringOption(option => option
            .setName('location')
            .setDescription('Enter the new location for Hal\'s Moving House.')
            .setRequired(true)
            .setMaxLength(255))
];

module.exports = { commands };
