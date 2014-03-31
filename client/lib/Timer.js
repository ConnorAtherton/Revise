Timer = (function() {

  var interval;

  var start = function(duration) {

    console.log('starting the timer', duration, 'minutes')

    duration = Utils.m_to_ms(duration);

    interval = Meteor.setInterval(function() {
        // it it's not reduce the time by 1 second
        duration = duration - 1000;

        if(duration === 0) {
          Chart.complete();
          return Meteor.clearInterval(interval);
        }

        // check to see if it is divisible by 60, if it is change
        // number displayed on the chart
        if(duration % 60000 === 0)
          Chart.reduceByMinute();

        // update the arc on the chart to reflect the new duration
        Chart.update(duration);

    }, 1000);
  }

  var stop = function () {
    return Meteor.clearInterval(interval);
  }

  return {
    start: start,
    stop: stop
  }

})()
