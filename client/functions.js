import { Toast } from 'antd-mobile';
import Resizer from 'react-image-file-resizer';

const toastDuration = 2;

function errorDialog(text) {
  Toast.fail(text, toastDuration);
}

function successDialog(text) {
  Toast.success(text, toastDuration);
}

function notificationsCounter(notifications) {
  let notificationsCount = 0;
  if (notifications && notifications.length > 0) {
    notifications.forEach(notification => {
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
    uri => {
      callback(uri);
    },
    'base64'
  );
}

const parseUrlForSSL = imageLink => {
  let image_url = imageLink;

  if (image_url && image_url.substring(0, 5) === 'http:') {
    image_url = image_url.slice(0, 4) + 's' + image_url.slice(4);
  }

  return image_url;
};

export {
  errorDialog,
  successDialog,
  notificationsCounter,
  dataURLtoFile,
  resizeImage,
  parseUrlForSSL
};
