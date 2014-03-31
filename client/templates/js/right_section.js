Template.right_section.helpers({
  current_task: function () {
    return Session.get('current_task');
  },

  current_task_name: function () {
    return Session.get('current_task').name;
  },

  timer_started: function () {
    return Session.get('timer_started');
  }
});

Template.right_section.events({
  'click #startTaskTimer': function () {
    // set the task as started
    Session.set('timer_started', true);
    Timer.start(Session.get('current_task').duration);
    console.log(Session.get('timer_started'))
  },

  'click #completeTask': function () {
    stopTimer();
    // animate the chart to 0 just to deal with them finishing
    // before the timer runs out
    Chart.update(0);
    Deps.flush();

    Meteor.call('setTaskComplete', Session.get('current_task')._id, Session.get('current_task').list_id, function () {
      selectNextTask();
      console.log(Session.get('current_task'), 'is the new current task');
    });

    // TODO - Should move on to the next task here instead of just
    // selecting no task next.
  }
});

selectNextTask = function () {
  if(!Session.get('current_list')) return;

  var newTask = Tasks.find({
    list_id: Session.get('current_list')._id,
    complete: false
  }, {sort: {time_created: -1}}).fetch();

  // if there is an incomplete task left in the list
  // set it as session variable so it is selected
  if(newTask) {
    console.log('There is a task')
    return Session.set('current_task', newTask);
  }

  Session.set('current_task', null);

  console.log('new task should be', newTask, Session.get('current)'));
}
