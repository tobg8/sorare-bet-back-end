const schedule = require('node-schedule');
const date = new Date(2021, 04, 15, 2, 28, 0);

const job = schedule.scheduleJob(date, function(){
  console.log('The world is going to end today.');
});