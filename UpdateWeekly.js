var fs = require('fs');

var date = new Date();

setTimeout(checkDate, 0);

function checkDate()
{
    var nextUpdate = fs.readFileSync('update.txt', 'utf8');
    if(nextUpdate == date.getDate())
    {
        fs.writeFileSync('update.txt', (date.addDays(7)).getDate());
    }
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}