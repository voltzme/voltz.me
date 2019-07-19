export function getQueryParam(param) {
  const qs = window.location.search;

  param = param.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + param + '=([^&#]*)');
  const results = regex.exec(qs);
  return results === null ?
    null :
    decodeURIComponent(results[1].replace(/\+/g, ' '));
}
