Template.list.events({
  'click .list': function () {
    closeListForm();
    Session.set('current_list', this);
  }
});

Template.list.helpers({
  task_or_tasks: function () {
    return this.number_of_tasks === 1 ? 'task' : 'tasks';
  },

  percentage_complete: function () {
    console.log('Percentage complete', this.tasks_complete, this.number_of_tasks, (this.tasks_complete / this.number_of_tasks));
    if(this.tasks_complete === 0) return 0;
    return (this.tasks_complete / this.number_of_tasks) * 100;
  }
});
