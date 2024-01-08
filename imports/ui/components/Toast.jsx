import React from 'react';
import { Toast } from 'antd-mobile';

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

export { errorDialog, successDialog };
