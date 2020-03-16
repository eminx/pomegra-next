import { Toast } from 'antd-mobile';

const toastDuration = 2;

function errorDialog(text) {
  Toast.fail(text, toastDuration);
}

function successDialog(text) {
  Toast.success(text, toastDuration);
}

export { errorDialog, successDialog };
