Template.task.events({
  'click .task': function () {
    // stop any other timer
    stopTimer()
    // do we want to show the timer for complete tasks?
    if(this.complete) return;

    Session.set('current_task', this);

    var self = this;
    Meteor.setTimeout(function () {
      Chart.draw(self.duration);
    }, 50)
  },

  'click .cross': function (evt) {
    evt.stopImmediatePropagation();

    console.log(Session.get('current_task')._id, this._id);

    if(Session.get('current_task')._id === this._id) {
      console.log('curren task complete whilst time happening');
      stopTimer();
      Chart.update(0);
      Session.set('current_task', null);
    }
    // stopTimer();
    // animate the chart to 0 just to deal with them finishing
    // before the timer runs out
    // Chart.update(this.duration);
    Meteor.call('setTaskComplete', this._id, this.list_id);
  },

  'click .tick': function (evt) {
    evt.stopImmediatePropagation();
    stopTimer();
    Chart.update(0);
    Meteor.call('setTaskIncomplete', this._id, this.list_id);
  }

});

Template.task.helpers({
  selected: function () {
    if(!Session.get('current_task')) return;
    return this._id === Session.get('current_task')._id;
  }
});
