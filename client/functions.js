import React from 'react';
import { Toast } from 'antd-mobile';
import Resizer from 'react-image-file-resizer';

function errorDialog(text, duration = 3) {
  Toast.fail(text, duration);
}

function successDialog(text, duration = 3) {
  Toast.success(text, duration);
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

function resizeImage(image, desiredImageWidth, callback) {
  Resizer.imageFileResizer(
    image.file,
    desiredImageWidth,
    400,
    'JPEG',
    100,
    0,
    (uri) => {
      callback(uri);
    },
    'base64',
  );
}

const parseUrlForSSL = (imageLink) => {
  let image_url = imageLink;

  if (image_url && image_url.substring(0, 5) === 'http:') {
    image_url = image_url.slice(0, 4) + 's' + image_url.slice(4);
  }

  return image_url;
};

function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
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

export {
  errorDialog,
  successDialog,
  notificationsCounter,
  dataURLtoFile,
  resizeImage,
  parseUrlForSSL,
  validateEmail,
  parseAuthors,
};
