import SmoothScroll from 'smooth-scroll';

document.addEventListener('DOMContentLoaded', () => {
  new SmoothScroll('.main-intro-more', {
    speed: 500,
    updateURL: false,
  });

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
