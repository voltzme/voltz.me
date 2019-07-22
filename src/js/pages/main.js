import SmoothScroll from 'smooth-scroll';
import {domNode, modal, onPageLoad} from '../utils';

onPageLoad('main', () => {
  new SmoothScroll('.main-intro-more', {
    speed: 500,
    updateURL: false,
  });

  const video = document.querySelector('.main-intro-video');
  if (window.innerWidth > 780) {
    video.append(
      domNode('source', {
        src: require('../../assets/promo_720p.mp4'),
      }));
  } else {
    video.append(
      domNode('source', {
        src: require('../../assets/promo_360p.mp4'),
      }));
  }

  video.play();

  document.querySelectorAll('.main-faq-item').forEach((item) => {
    const answer = item.querySelector('.main-faq-item-answer');

    const answerHeight = answer.clientHeight + 'px';
    item.classList.add('loaded');

    item.addEventListener('click', () => {
      if (item.classList.contains('open')) {
        item.classList.remove('open');

        answer.removeAttribute('style');
      } else {
        answer.setAttribute(
          'style',
          'height: ' + answerHeight,
        );
        item.classList.add('open');
      }
    });
  });

  document.querySelector('.main-map-map').classList.add('loaded');

  const bookModal = (
    modal(document.querySelector('#book-modal'), {
      white: true,
    })
  );
  document.querySelector('.book-form-hide').
    addEventListener('click', (e) => {
      e.preventDefault();
      bookModal.close();
    });

  document.querySelectorAll('a[href="#book-modal"]').
    forEach((node) => {
      node.addEventListener('click', (e) => {
        e.preventDefault();
        bookModal.open();
      });
    });
});
