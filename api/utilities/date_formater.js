

function formatDate(date){
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

function formatDateFromString(date, time){
    return date.slice(0,4) + "-" + date.slice(4,6) + "-" + date.slice(6, 8) + " " + time;
}

module.exports = {formatDate, formatDateFromString}