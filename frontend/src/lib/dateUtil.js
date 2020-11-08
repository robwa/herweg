export function convertDateToJulianDay(date) {// https://stackoverflow.com/a/11760121
    return Math.floor((date / 86400000) - (date.getTimezoneOffset() / 1440) + 2440587.5);
}
