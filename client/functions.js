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

export { errorDialog, successDialog, notificationsCounter };
