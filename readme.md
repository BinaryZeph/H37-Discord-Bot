
# H37 Discord Bot

**H37** is a specialized Discord bot designed to help the **Once Human** game community track and manage in-game reset events. The bot is capable of automating the display of upcoming loot resets, phase resets, and vendor/commission resets, along with dynamic game events like **Hal's Moving House**. It interacts with users via slash commands and automatically updates a designated channel with the latest information.

---

## Features

- **Reset Time Tracking:**
  - Automatically tracks and updates **Loot Resets** (every 4 hours), **Vendor/Commission Resets** (weekly), and **Next Phase** resets based on in-game schedule.
  - Provides a real-time countdown to these events in a specific Discord channel.

- **Hal's Moving House Tracker:**
  - Configures and tracks the location of **Hal's Moving House**.
  - Users can update the location with a slash command.

- **Slash Commands:**
  - `/ohsetphase` - Set the next phase reset date and time.
  - `/ohcreatetimerpost` - Create a new timer post in the specified channel.
  - `/ohsethallocation` - Update the location for **Hal's Moving House**.

- **Automatic Updates:**
  - The bot updates the event message in the Discord channel every minute to ensure players are always informed about the latest reset times.
  
- **Bot Activity Monitoring:**
  - Ensures the bot's activity is always set to **"Playing Once Human"** and resets if it changes.

---

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/BinaryZeph/H37-discord-bot.git
   cd H37-discord-bot
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure the bot:**

   - Create a `config.json` file in the root directory with the following structure:

   ```json
   {
     "CHANNEL_ID": "YOUR_CHANNEL_ID",
     "MESSAGE_ID": "YOUR_MESSAGE_ID",
     "BOT_TOKEN": "YOUR_DISCORD_BOT_TOKEN",
     "THUMBNAIL_URL": "YOUR_THUMBNAIL_IMAGE_URL",
     "EMBED_COLOR": "#FFFF00",
     "EMBED_TITLE": "Once Human Event Tracker",
     "LOOT_RESET_TIMES": [{ "hour": 0, "minute": 0 }, { "hour": 4, "minute": 0 }, { "hour": 8, "minute": 0 }, { "hour": 12, "minute": 0 }, { "hour": 16, "minute": 0 }, { "hour": 20, "minute": 0 }],
     "COMBINED_RESET_DAY": 1,
     "COMBINED_RESET_HOUR": 0,
     "COMBINED_RESET_MINUTE": 0,
     "NEXT_PHASE_DAY": 1,
     "NEXT_PHASE_HOUR": 0,
     "NEXT_PHASE_MINUTE": 0,
     "HAL_LOCATION": "NW of Deadsville",
     "TIMEZONE": "America/Chicago"
   }
   ```

4. **Run the bot:**

   ```bash
   node bot.js
   ```

---

## Usage

The bot operates automatically once started, posting the latest game event resets in the configured Discord channel and updating the message every minute. You can interact with the bot using the following slash commands:

- **/ohsetphase** - Set the next phase reset date and time.
- **/ohcreatetimerpost** - Create a new timer post for game events.
- **/ohsethallocation** - Update the location for **Hal's Moving House**.

The bot ensures the correct game event information is always displayed and keeps the community informed in real-time.

---

## Contribution

If you wish to contribute to **H37**, feel free to submit a pull request. Ensure you have tested your changes locally before making the request.

---

## License

[Unlicense](https://unlicense.org/)

---

## Author

Developed by Zephvarian on Discord. If you have any questions or feedback, feel free to reach out or open an issue on the repository.

---

## Disclaimer

This project is not affiliated with or endorsed by **NetEase, Inc.**. The names **H37** and **Once Human**, as well as any associated images and assets, are the intellectual property of **NetEase, Inc.**.

©1997-2024 NetEase, Inc. All Rights Reserved.
