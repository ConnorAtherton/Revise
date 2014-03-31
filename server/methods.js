Meteor.methods({
  saveList: function (list_name) {
    var list = {
      name: formatString(list_name),
      time_created: Date.now(),
      number_of_tasks: 0,
      tasks_complete: 0,
      owner: Meteor.user()._id
    }
    Lists.insert(list);
  },

  saveTask: function (task_name, duration, list_id) {
    var task = {
      name: formatString(task_name),
      duration: duration,
      time_created: Date.now(),
      list_id: list_id,
      owner: Meteor.user()._id,
      complete: false
    }
    var task_id = Tasks.insert(task);
    Lists.update({_id: list_id}, {$inc: {number_of_tasks: 1}});

    return task_id;
  },

  setTaskComplete: function (task_id, list_id) {
    Tasks.update({_id: task_id}, {$set: {complete: true}});
    Lists.update({_id: list_id}, {$inc: {tasks_complete: 1}})
  },

  setTaskIncomplete: function (task_id, list_id) {
    Tasks.update({_id: task_id}, {$set: {complete: false}});
    Lists.update({_id: list_id}, {$inc: {tasks_complete: -1}})
  }
});

function formatString(string)
{
    return capitaliseFirstLetter( string.toLowerCase() );
}

function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}
