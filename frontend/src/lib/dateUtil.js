export function convertDateToJulianDay(date) {// https://stackoverflow.com/a/11760121
    return Math.floor((date / 86400000) - (date.getTimezoneOffset() / 1440) + 2440587.5);
}

export function convertJulianDayToDate(julianDay) {// TODO: is this reliable?
    const now = new Date();
    return new Date(
        (julianDay - 2440587.5 + (now.getTimezoneOffset() / 1440)) * 86400000
    );
}
