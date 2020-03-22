import { Toast } from 'antd-mobile';

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

export { errorDialog, successDialog, notificationsCounter, dataURLtoFile };
