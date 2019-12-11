import { Meteor } from 'meteor/meteor'

Meteor.publish('me', function () {
  const userId = this.userId
  if (userId) {
    return Meteor.users.find(userId)
  }
})

Meteor.publish('suggestedBooks', function () {
  const userId = this.userId
  return Books.find(
    {
      added_by: !currentUserId
    },
    { limit: 20 }
  )
})

Meteor.publish('myBooks', function () {
  const currentUserId = this.userId
  return Books.find({
    added_by: currentUserId
  })
})
