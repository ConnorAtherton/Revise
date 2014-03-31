Meteor.publish('tasks', function () {
  return Tasks.find({ owner: this.userId });
});

Meteor.publish('lists', function () {
  return Lists.find({ owner: this.userId });
});
