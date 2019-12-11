import { Meteor } from 'meteor/meteor'

Meteor.methods({
  insertBook: theBook => {
    console.log(theBook)
    const user = Meteor.user()
    if (!user) {
      return false
    }
    const currentUserId = user._id
    const myHoods = user.profile.neighborhoods
    const myLocation = {
      countryCode: 'XX',
      regionName: 'N/A'
    }
    if (user.location_info) {
      myLocation = {
        countryCode: user.location_info.countryCode,
        regionName: user.location_info.regionName
      }
    }

    const myBook = {
      date_added: new Date(),
      b_title: theBook.title,
      b_title_lowercase: theBook.title.toLowerCase(),
      b_author: theBook.authors[0],
      b_author_lowercase: theBook.authors[0].toLowerCase(),
      b_lang: theBook.language || '',
      image_url: theBook.imageLinks && theBook.imageLinks.thumbnail,
      b_cat: (theBook.categories && theBook.categories[0]) || '',
      b_ISBN: theBook.industryIdentifiers[0],
      selfLinkGoogle: theBook.selfLink,
      added_by: currentUserId,
      owner_name: userName,
      owner_profile_image_url: user.profile.image_url,
      x_times: 0,
      is_available: 1,
      hoods: myHoods,
      location: myLocation
    }

    const bookId = Books.insert(myBook, function (error, result) {
      if (error) {
        console.log(error, 'error!')
      } else {
        return bookId
      }
    })
  },

  removeBook: bookId => {
    if (!Meteor.userId()) {
      return
    }
    const theBook = Books.findOne(bookId)
    if (theBook.added_by !== Meteor.userId()) {
      return
    }
    Books.remove({ _id: bookId })
  },

  updateBook: function (bTitle, bAuthor, bLang, bCat, bDesc, bookId) {
    if (!Meteor.userId()) {
      return false
    }
    const theBook = Books.findOne(bookId)
    if (theBook.added_by !== Meteor.userId()) {
      return
    }
    Books.update(
      { _id: bookId },
      {
        $set: {
          b_title: bTitle,
          b_author: bAuthor,
          b_lang: bLang,
          b_cat: bCat,
          b_description: bDesc
        }
      }
    )
  },

  addLocationInfo: function (locationInfo) {
    if (!Meteor.userId()) {
      return false
    }
    const user = Meteor.user() || null
    user && user.location_info
      ? null
      : Meteor.users.update(
        { _id: user._id },
        {
          $set: {
            location_info: locationInfo,
            'profile.isLocationRegistered': true
          },
          $addToSet: {
            'profile.neighborhoods': locationInfo.city
          }
        }
      )
  }
})

Meteor.publish('myBooks', function () {
  const currentUserId = this.userId
  return Books.find({
    added_by: currentUserId
  })
})
1
