import React from 'react';
import { createRoot } from 'react-dom/client';
import { createStandaloneToast } from '@chakra-ui/react';

const { ToastContainer, toast } = createStandaloneToast();

const toastContainer = document.getElementById('toast-root');
createRoot(toastContainer).render(
  <>
    <ToastContainer />
  </>
);

const timeOutTime = 3;

const renderToast = (status, text, duration) => {
  toast({
    description: text,
    duration: (duration || timeOutTime) * 1000,
    isClosable: true,
    position: 'top',
    status,
  });
};

function errorDialog(content, duration) {
  renderToast('error', content, duration);
  // console.log('error');
}

function successDialog(content, duration) {
  renderToast('success', content, duration);
  // console.log('success');
}

export { errorDialog, successDialog };
