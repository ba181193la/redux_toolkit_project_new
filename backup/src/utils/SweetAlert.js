import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import SuccessGif from '../assets/Gifs/SuccessGif1.gif';
import InfoGif from '../assets/Gifs/InfoGif.gif';
import ErrorGif from '../assets/Gifs/error.gif';
import LoginBgImage from '../assets/images/loginbgcolor.png';

const showSweetAlert = ({
  type,
  title,
  text,
  icon,
  gif,
  callback,
  timer,
  cancelButtonText,
  confirmButtonText,
  height,
  width,
}) => {
  const isGif = gif && !icon;

  Swal.fire({
    title,
    text,
    html: isGif
      ? `<img src="${gif}" height=${height || '150px'} width=${width || '150px'} alt="GIF" />
         <div class="swal2-html-container" id="swal2-html-container" style="display: block;">${text}</div>`
      : text,
    icon: isGif ? '' : type,
    imageUrl: icon,
    imageHeight: 50,
    imageAlt: 'Custom icon',
    showConfirmButton: confirmButtonText,
    showCancelButton: cancelButtonText,
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText,
    focusConfirm: false,
    confirmButtonColor: '#0083c0',
    cancelButtonColor: '#d33',
    customClass: {
      popup: 'my-swal-popup',
    },
    timer,
    timerProgressBar: timer,
  }).then(async (result) => {
    if (result.isConfirmed && (type === 'delete' || type === 'edit')) {
      await callback();
    }
  });
};

const showToastAlert = ({ type, text, icon, gif }) => {
  let isGif = gif && !icon;
  switch (type) {
    case 'custom_success':
      gif = SuccessGif;
      break;
    case 'custom_info':
      gif = InfoGif;
      break;

    case 'custom_error':
      gif = ErrorGif;
      break;

    default:
      break;
  }
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  Toast.fire({
    icon: isGif ? '' : type,
    imageUrl: icon,
    imageHeight: 150,
    imageWidth: 150,
    imageAlt: 'Custom icon',
    html: isGif
      ? `<div style="display:flex;align-items: center;gap: 10px;"><img src="${gif}" height="50px" width="50px" alt="GIF" />
         <div class="swal2-html-container" id="swal2-html-container" style="display: block;">${text}</div></div>`
      : icon
        ? ''
        : `<div class="swal2-html-container" id="swal2-html-container" style="display: block;">${text}</div>`,
  });
};

const showLicenseToastAlert = ({
  type,
  text,
  icon,
  gif,
  position,
  customClass,
  setIsPadding,
  width,
}) => {
  let isGif = gif && !icon;
  switch (type) {
    case 'custom_success':
      gif = SuccessGif;
      break;
    case 'custom_info':
      gif = InfoGif;
      break;

    case 'custom_error':
      gif = ErrorGif;
      break;

    default:
      break;
  }
  const Toast = Swal.mixin({
    toast: true,
    position: position || 'top-end',
    showConfirmButton: false,
    customClass: {
      popup: customClass || '',
    },
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
      toast.onclick = (e) => e.stopPropagation();
      const closeButton = toast.querySelector('.toast-close');
      if (closeButton) {
        closeButton.addEventListener('click', (event) => {
          Swal.close();
          setIsPadding(false);
        });
      }
      window.addEventListener('beforeunload', () => Swal.close());
    },
  });

  Toast.fire({
    icon: isGif ? '' : type,
    imageUrl: icon,
    imageHeight: 150,
    imageWidth: 150,
    imageAlt: 'Custom icon',
    width: width || '',
    html: isGif
      ? `<div style="display:flex;align-items: center;gap: 10px;"><img src="${gif}" height="50px" width="50px" alt="GIF" />
         <div class="swal2-html-container" id="swal2-html-container" style="display: block; white-space: nowrap;">${text}</div>
         <button class="toast-close">×</button></div>`
      : icon
        ? ''
        : `<div class="swal2-html-container" id="swal2-html-container" style="display: block; white-space: nowrap;">${text}</div>`,
  });
};

const showPasswordExpiryAlert = ({ link, userId }) => {
  Swal.fire({
    title: 'Your password has expired.',
    html: `Please click here <a href= "/ResetPassword/${userId}" style='color: blue; text-decoration: underline;'>${link}</a>. to reset password.`,
    icon: 'warning',
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
  });
  document.body.style.background = `url(${LoginBgImage}) no-repeat center center fixed`;
  document.body.style.backgroundSize = 'cover';
};

export {
  showSweetAlert,
  showToastAlert,
  showLicenseToastAlert,
  showPasswordExpiryAlert,
};
