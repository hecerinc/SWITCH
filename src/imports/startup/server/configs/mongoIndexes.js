import { Meteor } from 'meteor/meteor';
import Users from '/imports/api/collections/users';

// Creates an index on the field
// Mongo's https://docs.mongodb.com/v3.6/reference/method/db.collection.createIndex/#db.collection.createIndex
// BUG: ensure_index is deprecated since mongo 3.0
Meteor.startup(() => {
  Users._ensureIndex({
    username: 1,
  });
});
