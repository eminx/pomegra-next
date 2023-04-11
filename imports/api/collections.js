import { Mongo } from "meteor/mongo";

const BooksCollection = new Mongo.Collection("books");
const RequestsCollection = new Mongo.Collection("requests");
const MessagesCollection = new Mongo.Collection("messages");

export { BooksCollection, MessagesCollection, RequestsCollection };
