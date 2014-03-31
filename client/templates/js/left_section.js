var new_list_open = false,
    new_task_open = false;

Template.left_section.helpers({
  adding_list: function () {
    return Session.get('adding_list');
  },

  adding_task: function () {
    return Session.get('adding_task');
  },

  viewing_list: function () {
    return Session.get('current_list');
  },

  current_list_name: function () {
    return Session.get('current_list').name;
  }
});

Template.left_section.events({
  'click #newList': function () {
    resetTasks();
    return new_list_open ? closeListForm() : showListForm();
  },

  'click #newTask': function () {
    return new_task_open ? closeTaskForm() : showTaskForm();
  },

  'click #viewLists': function () {
    closeTaskForm();
    resetTasks();
    return Session.set('current_list', null);
  },

  'click #saveList': function (evt, tmpl) {
    evt.preventDefault();
    var list_name = tmpl.find('#listName').value;
    console.log('saving list', list_name);
    // throw in more validation
    if (list_name.length === 0) return;

    Meteor.call('saveList', list_name, function (err, newList) {
      if(err)
        return;

      closeListForm();
    });

  },

  'click #saveTask': function (evt, tmpl) {
    evt.preventDefault();
    var task_name = tmpl.find('#taskName').value,
        duration = tmpl.find('#scrubbing-horizontal-array').innerHTML,
        task_id,
        task;

    // throw in more validation
    if (task_name.length === 0) return;

    Meteor.call('saveTask', task_name, ~~duration, Session.get('current_list')._id, function (err, task) {
      if(err) return;
      task_id = task;
    });

    Meteor.setTimeout(function () {
      task = Tasks.find({ _id: task_id }).fetch();
      Session.set('current_task', task[0]);
      // Stop any other timer
      stopTimer();
      closeTaskForm();
      Chart.draw(task[0].duration);
    }, 50);
  }
});

Template.left_section.lists = function () {
  return Lists.find({}, {sort: {time_created: -1}});
}

Template.left_section.tasks = function () {
  return Tasks.find({ list_id: Session.get('current_list')._id }, {sort: {time_created: 1}});
}

showListForm = function () {
  Session.set('adding_list', true);
  new_list_open = true;
  Meteor.setTimeout(function(){
    activateInput( $('#listName') );
  }, 10);
}

closeListForm = function () {
  Session.set('adding_list', false);
  new_list_open = false;
}

showTaskForm = function () {
  Session.set('adding_task', true);
  new_task_open = true;
  // Short delay to let things settle before displaying the form.
  Meteor.setTimeout(function(){
    showScrubber();
    activateInput( $('#taskName') );
  }, 10);
}

showScrubber = function ()  {
  var node = document.querySelector('#scrubbing-horizontal-array');
  new Scrubbing ( node , {
    adapter : new ArrayAdapter(["5", "10", "15" ,"20", "25", "30"]),
    resolver : Scrubbing.resolver.HorizontalProvider ( 25 )
  });
}

closeTaskForm = function () {
  Session.set('adding_task', false);
  new_task_open = false;
}

resetTasks = function () {
  Session.set('current_task', null);
  Chart.destroy();
  stopTimer();
}

stopTimer = function () {
  Session.set('timer_started', null);
  Timer.stop();
}

activateInput = function (input) {
  input.focus();
  input.select();
}
