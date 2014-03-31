Chart = (function() {

  var width = 400,
      height = 450,
      twoPi = 2 * Math.PI,
      progress = 0,
      total = null, // set when draw() is called
      formatPercent = d3.format(".0%");

  var arc = d3.svg.arc()
      .startAngle(0)
      .innerRadius(100)
      .outerRadius(180);

  var svg,
      meter,
      foreground,
      text,
      overlay,
      drawn = false;

  // duration is expected in minutes
  var draw = function(duration) {

    console.log('Chart drawing', duration);

    // if it's already drawn remove it and redraw
    // Another solution is being worked on through changint
    // svg config instead of removing it.
    if(svg)
      d3.select("svg").remove();

    total = Utils.m_to_s(duration);

    svg = d3.select("#chart_container").append("svg")
          .attr("width", width)
          .attr("height", height)
        .append("g")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      meter = svg.append("g")
          .attr("class", "progress-meter");

      meter.append("path")
          .attr("class", "background")
          .attr("d", arc.endAngle(twoPi));

      foreground = meter.append("path")
          .attr("class", "foreground");

      overlay = meter.append("circle")
          .attr("id", "chart_overlay")
          .attr('r', '140')
          .attr("dy", ".35em")
          .attr("dx", ".35em");

      drawText();

      // animate the maximum time chosen by calling update here
      update(Utils.s_to_ms(total));
      drawn = true;
  }

  var drawText = function () {
    text = meter.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .text(Utils.s_to_m(total));
  }

  var update = function(newValue) {

    console.log('Chart updating', newValue);

    if(!drawn)
      return;

    // convert from ms to s
    newValue = Utils.ms_to_s(newValue);

    var i = d3.interpolate(progress, newValue / total);

    d3.transition().tween("progress", function() {
          return function(t) {
            progress = i(t);
            foreground.attr("d", arc.endAngle(twoPi * progress));
          };
       });

  }

  var complete = function() {
    // mark the current task as complete so the ui can update.
    // set the value equal to currently selected task id
    //                TODO!!!!!!!!
    update(0);
    Session.set('current_task_complete', true);
    console.log('The timer is complete!!');
  }

  var destroy = function() {
    drawn = false;
    //meter.transition().delay(250).attr("transform", "scale(0)");
    // could always remove the dom nodes altogether but is that efficient?
    // Need to limit redrawing the svg node each time a new task is selected....
  }

  var reduceByMinute = function() {
    var old = text.text();
    return text.text( old - 1 );
  }

  var changeConfiguration = function (duration) {
    total = duration;
    text.text(duration);
    update(Utils.m_to_ms(duration));
  }

  // needed to make it shrink
  // meter.transition().delay(250).attr("transform", "scale(0)");

  return {
    draw: draw,
    update: update,
    complete: complete,
    destroy: destroy,
    reduceByMinute: reduceByMinute
  }

})()
