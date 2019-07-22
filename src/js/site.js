import {determineLocale} from './i18n';
import {domNode, logEvent} from './utils';

import './pages/main';
import './pages/book2';

document.addEventListener('DOMContentLoaded', () => {
  if (determineLocale() !== true) {
    return;
  }

  const locale = window.location.pathname.startsWith('/en') ? 'en' : 'ru';
  logEvent('pageView', {
    path: window.location.pathname,
    locale: locale,
  });

  document.querySelectorAll('.mailto').forEach((node) => {
    let prefix = node.querySelector('.mailto-prefix');

    let email = node.innerText.replace('\n', '').replace(' ', '');
    if (prefix) {
      prefix = prefix.innerText.replace('\n', '');
      email = email.substr(prefix.length);
    }

    node.parentNode.replaceChild(
      domNode('a', {href: 'mailto:' + email}, email),
      node,
    );
  });
});
