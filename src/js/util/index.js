export const qs = (scope = document, target) => scope.querySelector(target);
export const qsAll = (scope = document, target) =>
  scope.querySelectorAll(target);

export const eventListener = (eventType, handler, scope = document) => {
  scope.addEventListener(eventType, handler);
};
