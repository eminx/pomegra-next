// Books.find().forEach((book) => {
//   if (book.selfLinkGoogle) {
//     fetch(book.selfLinkGoogle)
//       .then((response) => {
//         return response.json();
//       })
//       .then((result) => {
//         const { volumeInfo } = result;
//         Books.update(book._id, {
//           ...volumeInfo,
//           category: volumeInfo.categories[0],
//           titleLowerCase: volumeInfo.title.toLowerCase(),
//           ISBN:
//             volumeInfo.industryIdentifiers &&
//             volumeInfo.industryIdentifiers[0].identifier,
//           dateAdded: new Date(),
//           imageUrl:
//             volumeInfo.thumbnail || volumeInfo.smallThumbnail,
//           ownerId: book.added_by,
//           ownerUsername: book.owner_name,
//           ownerAvatar: user.avatar,
//           xTimes: book.x_times || 0,
//           isAvailable: true,
//         });
//       });
//     return;
//   }
//   Books.update(book._id, {
//     $set: {
//       title: book.b_title,
//       authors: [book.b_author],
//       category: book.b_cat,
//       language: book.b_lang,
//       description: book.b_description,
//       imageUrl: book.image_url,
//       xTimes: book.x_times || 0,
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
//       isConfirmed: request.is_confirmed,
//       isRepliedAndNotSeen: request.is_replied_and_not_seen,
//       isHanded: request.is_handed,
//       isReturned: request.is_returned,
//     },
//   });
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
