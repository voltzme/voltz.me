import SmoothScroll from 'smooth-scroll';
import {addOnClickLogEvent, onPageLoad} from '../utils';

onPageLoad('book2', () => {
  new SmoothScroll('.book2-intro-btn', {
    speed: 500,
    updateURL: false,
  });

  new SmoothScroll('.book2-intro-btn-mobile', {
    speed: 500,
    updateURL: false,
  });

  addOnClickLogEvent('.book2-form .btn-primary', 'contactUs', {
    target: 'Form',
  });
  addOnClickLogEvent('.book2-form .btn-vk', 'contactUs', {
    target: 'VKontakte',
  });
  addOnClickLogEvent('.book2-form .btn-fb', 'contactUs', {
    target: 'Facebook',
  });
  addOnClickLogEvent('.book2-form .btn-whatsapp', 'contactUs', {
    target: 'WhatsApp',
  });
});
