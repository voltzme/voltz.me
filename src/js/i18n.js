import Cookie from 'js-cookie';
import {getQueryParam} from './utils';

export function determineLocale() {
  const urlLocale = !window.location.pathname.startsWith('/en') ? 'ru' : 'en';

  const queryLocale = getQueryParam('l');

  if (queryLocale && ['ru', 'en'].includes(queryLocale)) {
    Cookie.set('locale', queryLocale);

    if (queryLocale !== urlLocale) {
      redirectToLocale(queryLocale);
      return;
    }
  }

  if (queryLocale === 'auto' || queryLocale === '') {
    Cookie.remove('locale');
    redirectToLocale('ru');
    return;
  }

  const cookieLocale = Cookie.get('locale');
  if (cookieLocale) {
    if (urlLocale !== cookieLocale) {
      redirectToLocale(cookieLocale);
    }
    return;
  }

  const browserLocale = window.navigator.languages.some(
    (lng) => ['ru', 'ru-RU'].includes(lng)) ? 'ru' : 'en';
  if (urlLocale !== browserLocale) {
    redirectToLocale(browserLocale);
  }
}

function redirectToLocale(locale) {
  const path = window.location.pathname.startsWith('/en')
    ? window.location.pathname.substr(3)
    : window.location.pathname;

  if (locale === 'ru') {
    window.location = window.location.origin + path;
  } else {
    window.location = window.location.origin + '/en' + path;
  }
}
