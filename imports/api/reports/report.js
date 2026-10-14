import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import 'meteor/aldeed:collection2/static';
import { Schemas } from '../_utils/schemas';

const ReportsCollection = new Mongo.Collection('reports');

RequestsCollection.schema = new SimpleSchema({
  _id: Schemas.Id,
  contentId: { type: String, optional: true },
  context: { type: String, optional: true },
  report: { type: String, optional: true },
  status: { type: String, optional: true },
  usernameConcerning: { type: String, optional: true },
  usernameReported: { type: String, optional: true },
});

ReportsCollection.attachSchema(RequestsCollection.schema);

export default ReportsCollection;
