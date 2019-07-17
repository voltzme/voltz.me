import SmoothScroll from 'smooth-scroll';

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.classList.contains('main')) {
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
      modal(document.querySelector('#main-book-modal'), {
        white: true,
      })
    );
    document.querySelector('.main-book-form-hide').
      addEventListener('click', (e) => {
        e.preventDefault();
        bookModal.close();
      });

    document.querySelectorAll('a[href="#main-book-modal"]').
      forEach((node) => {
        node.addEventListener('click', (e) => {
          e.preventDefault();
          bookModal.open();
        });
      });
  }
});

function modal(modalNode, opts = {}) {
  const overlayNode = domNode('div', {
    class: 'modal-overlay ' + (opts.white ? 'white' : 'black'),
  });

  const wrapperNode = modalNode.closest('.modal-wrapper');

  const close = () => {
    document.body.classList.remove('fixed');
    document.body.removeChild(overlayNode);
    wrapperNode.classList.remove('visible');
  };

  const open = () => {
    document.body.classList.add('fixed');
    document.body.appendChild(overlayNode);

    wrapperNode.classList.add('visible');
  };

  const closeIconNode = wrapperNode.querySelector('.modal-close');
  if (closeIconNode) {
    closeIconNode.addEventListener('click', (e) => {
      e.preventDefault();
      close();
    });
  }

  return {open, close};
}

function domNode(tagName, attrs = {}) {
  const el = document.createElement(tagName);

  Object.entries(attrs).map(([attr, value]) => {
    el.setAttribute(attr, value);
  });

  return el;
}
