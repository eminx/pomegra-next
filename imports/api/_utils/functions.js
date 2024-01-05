import React from 'react';
import { Toast } from 'antd-mobile';
import Resizer from 'react-image-file-resizer';

function showToast(content, duration = 2000, position = 'center', icon) {
  Toast.show({
    content,
    duration,
    icon,
    position,
  });
}

function errorDialog(content, duration, position) {
  showToast(content, duration, position, 'fail');
}

function successDialog(content, duration, position) {
  showToast(content, duration, position, 'success');
}

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
    mime = arr[0].match(/:(.*?);/)[1],
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

export {
  errorDialog,
  successDialog,
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
};
