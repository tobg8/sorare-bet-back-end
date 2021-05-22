module.exports.cron_job = function()
{
        console.log('Eating breakfast...');
        Kitchen.eat();
        console.log('done.');
}

require('make-runnable');