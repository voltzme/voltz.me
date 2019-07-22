import SmoothScroll from 'smooth-scroll';
import {onPageLoad} from '../utils';

onPageLoad('book2', () => {
  new SmoothScroll('.book2-intro-btn', {
    speed: 500,
    updateURL: false,
  });

  new SmoothScroll('.book2-intro-btn-mobile', {
    speed: 500,
    updateURL: false,
  });
});
