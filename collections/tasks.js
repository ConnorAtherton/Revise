Tasks = new Meteor.Collection('tasks');

// allow rules
Tasks.allow({
  insert: function (userId, doc) {
    return false; //  must insert through a meteor method
  },
  update: function (userId, doc, fields, modifier) {
    for (var i = 0; i < docs.length; i++) {
      if (docs[i].user_id !== userId) {
        return false;
      };
    };
    return true;
  },
  remove: function (userId, doc) {
    for (var i = 0; i < docs.length; i++) {
      if (docs[i].user_id !== userId) {
        return false;
      };
    };
    return true;
  }
});
