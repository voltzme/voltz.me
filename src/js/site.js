import SmoothScroll from 'smooth-scroll';

function domNode(tagName, attrs = {}) {
  const el = document.createElement(tagName);

  Object.entries(attrs).map(([attr, value]) => {
    el.setAttribute(attr, value);
  });

  return el;
}

document.addEventListener('DOMContentLoaded', () => {
  new SmoothScroll('.main-intro-more', {
    speed: 500,
    updateURL: false,
  });

  const video = document.querySelector('.main-intro-video');
  if (window.innerWidth > 780) {
    video.append(
      domNode('source', {
        src: require('../assets/promo_720p.mp4'),
      }));
  } else {
    video.append(
      domNode('source', {
        src: require('../assets/promo_360p.mp4'),
      }));
  }

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
});
