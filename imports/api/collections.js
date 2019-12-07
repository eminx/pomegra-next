import { Mongo } from 'meteor/mongo';

Books = new Mongo.Collection('books');
Requests = new Mongo.Collection('requests');
Messages = new Mongo.Collection('messages');

export { Books, Requests, Messages };
