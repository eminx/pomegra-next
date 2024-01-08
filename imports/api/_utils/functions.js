import Resizer from 'react-image-file-resizer';

function notificationsCounter(notifications) {
  let notificationsCount = 0;
  if (notifications && notifications.length > 0) {
    notifications.forEach((notification) => {
      notificationsCount += notification.count;
    });
  }

  return notificationsCount;
}

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','),
    mime = arr[0]?.match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

const resizeImage = (image, desiredImageWidth) =>
  new Promise((resolve, reject) => {
    Resizer.imageFileResizer(
      image,
      desiredImageWidth,
      400,
      'JPEG',
      95,
      0,
      (uri) => {
        if (!uri) {
          reject({ reason: 'image cannot be resized' });
        }
        const uploadableImage = dataURLtoFile(uri, image.name);
        resolve(uploadableImage);
      },
      'base64'
    );
  });

const uploadImage = (image, directory) =>
  new Promise((resolve, reject) => {
    const upload = slingshotUpload(directory);
    upload.send(image, (error, downloadUrl) => {
      if (error) {
        reject(error);
      }
      resolve(downloadUrl);
    });
  });

const parseUrlForSSL = (imageLink) => {
  let imageUrl = imageLink;

  if (imageUrl && imageUrl.substring(0, 5) === 'http:') {
    imageUrl = imageUrl.slice(0, 4) + 's' + imageUrl.slice(4);
  }

  return imageUrl;
};

const slingshotUpload = (directory) => new Slingshot.Upload(directory);

function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

function emailIsValid(email) {
  return /\S+@\S+\.\S+/.test(email);
}

function includesSpecialCharacters(string) {
  const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

  if (format.test(string)) {
    return true;
  } else {
    return false;
  }
}

const parseAuthors = (authors) => {
  if (!authors) {
    return <span>unknown authors</span>;
  }
  return authors.map((author, index) => (
    <span key={author}>
      {author + (authors.length !== index + 1 ? ', ' : '')}
    </span>
  ));
};

const call = (method, ...parameters) =>
  new Promise((resolve, reject) => {
    Meteor.call(method, ...parameters, (error, respond) => {
      if (error) reject(error);
      resolve(respond);
    });
  });

function getNearbyUsersOrBooks(latitude, longitude, distanceInKm, items) {
  var R = 6373;

  var latRad = (latitude * Math.PI) / 180;
  var lngRad = (longitude * Math.PI) / 180;

  var returnItems = [];

  for (var i = 0; i < items.length; i++) {
    var lat2Rad = (items[i].latitude * Math.PI) / 180;
    var lng2Rad = (items[i].longitude * Math.PI) / 180;
    var dlat = lat2Rad - latRad;
    var dlng = lng2Rad - lngRad;
    var a =
      Math.pow(Math.sin(dlat / 2), 2) +
      Math.cos(latRad) * Math.cos(lat2Rad) * Math.pow(Math.sin(dlng / 2), 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // great circle distance in radians
    var d = c * R; // Distance from user in km

    if (d < distanceInKm) returnItems.push({ ...items[i], distance: d });
  }
  return returnItems;
}

export {
  notificationsCounter,
  dataURLtoFile,
  resizeImage,
  uploadImage,
  slingshotUpload,
  parseUrlForSSL,
  validateEmail,
  parseAuthors,
  emailIsValid,
  includesSpecialCharacters,
  call,
  getNearbyUsersOrBooks,
};
