export function getQueryParam(param) {
  const qs = window.location.search;

  param = param.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + param + '=([^&#]*)');
  const results = regex.exec(qs);
  return results === null ?
    null :
    decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export function modal(modalNode, opts = {}) {
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

export function domNode(tagName, attrs = {}, innerHtml = undefined) {
  const el = document.createElement(tagName);

  Object.entries(attrs).map(([attr, value]) => {
    el.setAttribute(attr, value);
  });

  if (innerHtml !== undefined) {
    el.innerHTML = innerHtml;
  }

  return el;
}

export function onPageLoad(pageName, callback) {
  document.addEventListener('DOMContentLoaded', (e) => {
    if (document.body.classList.contains(pageName)) {
      callback();
    }
  });
}

export function logEvent(eventName, eventParams = undefined) {
  amplitude.getInstance().logEvent(eventName, eventParams);
}

export function addOnClickHandler(selector, callback) {
  document.querySelectorAll(selector).forEach((node) => {
    node.addEventListener('click', callback);
  });
}

export function addOnClickLogEvent(selector, event, eventParams = undefined) {
  addOnClickHandler(selector, () => {
    logEvent(event, eventParams);
  });
}
