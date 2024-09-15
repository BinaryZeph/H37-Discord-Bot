// resetTimers.js
const moment = require('moment-timezone');

function getNextLootReset(LOOT_RESET_TIMES, TIMEZONE) {
    const now = moment().tz(TIMEZONE);
    let nextReset = null;

    for (const reset of LOOT_RESET_TIMES) {
        const resetTime = moment().tz(TIMEZONE).set({
            hour: reset.hour,
            minute: reset.minute,
            second: 0,
        });

        if (resetTime.isAfter(now)) {
            nextReset = resetTime;
            break;
        }
    }

    if (!nextReset) {
        nextReset = moment().tz(TIMEZONE).add(1, 'day').set({
            hour: LOOT_RESET_TIMES[0].hour,
            minute: LOOT_RESET_TIMES[0].minute,
            second: 0,
        });
    }

    return nextReset;
}

function getCombinedReset(COMBINED_RESET_DAY, COMBINED_RESET_HOUR, COMBINED_RESET_MINUTE, TIMEZONE) {
    let nextCombinedReset = moment().tz(TIMEZONE).set({
        hour: COMBINED_RESET_HOUR,
        minute: COMBINED_RESET_MINUTE,
        second: 0,
    });

    while (nextCombinedReset.day() !== COMBINED_RESET_DAY) {
        nextCombinedReset.add(1, 'day');
    }

    return nextCombinedReset;
}

function getNextPhaseReset(NEXT_PHASE_DAY, NEXT_PHASE_HOUR, NEXT_PHASE_MINUTE, TIMEZONE) {
    return moment().tz(TIMEZONE).set({
        date: NEXT_PHASE_DAY,
        hour: NEXT_PHASE_HOUR,
        minute: NEXT_PHASE_MINUTE,
        second: 0,
    });
}

function getTownSecurementReset(TIMEZONE) {
    const now = moment().tz(TIMEZONE);
    const resetTime = moment().tz(TIMEZONE).set({
        hour: 19,
        minute: 0,
        second: 0,
    });

    if (resetTime.isBefore(now)) {
        resetTime.add(1, 'day');
    }

    return resetTime;
}

module.exports = {
    getNextLootReset,
    getCombinedReset,
    getNextPhaseReset,
    getTownSecurementReset
};
