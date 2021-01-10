// Books.find().forEach((book) => {
//   const user = Meteor.users.findOne(book.added_by || book.ownerId);
//   if (book.selfLinkGoogle) {
//     fetch(book.selfLinkGoogle)
//       .then((response) => {
//         return response.json();
//       })
//       .then((result) => {
//         const { volumeInfo } = result;
//         console.log(volumeInfo, result);
//         Books.update(book._id, {
//           $set: {
//             ...volumeInfo,
//             category: volumeInfo.categories[0],
//             titleLowerCase: volumeInfo.title.toLowerCase(),
//             ISBN:
//               volumeInfo.industryIdentifiers &&
//               volumeInfo.industryIdentifiers[0].identifier,
//             dateAdded: book.date_added,
//             imageUrl:
//               volumeInfo.thumbnail || volumeInfo.smallThumbnail,
//             ownerId: book.added_by,
//             ownerUsername: book.owner_name,
//             ownerAvatar: user.avatar && user.avatar.src,
//             xTimes: book.x_times || 0,
//             isAvailable: true,
//           },
//         });
//       });
//   } else if (book.b_title) {
//     Books.update(book._id, {
//       $set: {
//         title: book.b_title,
//         titleLowerCase: book.b_title.toLowerCase(),
//         authors: [book.b_author],
//         category: book.b_cat,
//         language: book.b_lang,
//         description: book.b_description,
//         imageUrl: book.image_url,
//         ownerId: book.added_by,
//         ownerUsername: book.owner_name,
//         ownerAvatar: user.avatar,
//         xTimes: book.x_times || 0,
//         isAvailable: true,
//       },
//     });
//   }
// });

// Messages.find().forEach((message) => {
//   Messages.update(message._id, {
//     $set: {
//       requestId: message.req_id,
//       borrowerId: message.borrower_id,
//       lenderId: message.borrower_id,
//       isSeenByOther: Boolean(message.is_seen_by_other),
//       lastMessageBy: message.last_msg_by,
//     },
//   });
// });

// Requests.find().forEach((request) => {
//   Requests.update(request._id, {
//     $set: {
//       requesterId: request.req_by,
//       bookImage: request.book_image_url,
//       ownerId: request.req_from,
//       bookTitle: request.book_name,
//       bookAuthors: request.book_author,
//       ownerUsername: request.owner_name,
//       requesterUsername: request.requester_name,
//       ownerAvatar: request.owner_profile_image,
//       requesterAvatar: request.requester_profile_image,
//       dateRequested: request.date_requested,
//       isConfirmed: request.is_confirmed || false,
//       isRepliedAndNotSeen: request.is_replied_and_not_seen || false,
//       isHanded: request.is_handed || false,
//       isReturned: request.is_returned || false,
//     },
//   });
// });
