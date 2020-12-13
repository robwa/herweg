export function convertDateToJulianDay(date: Date) {// https://stackoverflow.com/a/11760121
    return Math.floor((date.getDate() / 86400000) - (date.getTimezoneOffset() / 1440) + 2440587.5);
}

export function convertJulianDayToDate(julianDay: number) {// TODO: is this reliable?
    const now = new Date();
    return new Date(
        (julianDay - 2440587.5 + (now.getTimezoneOffset() / 1440)) * 86400000
    );
}
