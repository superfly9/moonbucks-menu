export const qs = (target, scope = document) => scope.querySelector(target);
export const qsAll = (target, scope = document) =>
  scope.querySelectorAll(target);

export const eventListener = (eventType, handler, scope = document) => {
  scope.addEventListener(eventType, handler);
};

const $menuInput = qs("#espresso-menu-name");
const $menuList = qs("#espresso-menu-list");
const $menuCount = qs(".menu-count");

const menuDOM = (name) => `
<li class="menu-list-item d-flex items-center py-2">
<span class="w-100 pl-2 menu-name">${name}</span>
<button
    type="button"
    class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
>
    수정
</button>
<button
    type="button"
    class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
>
    삭제
</button>
</li>
`;

const menuAddHandler = (name) => {
  $menuList.insertAdjacentHTML("beforeEnd", menuDOM(name));
  $menuInput.value = "";
  const menuCount = $menuList.children.length;
  $menuCount.innerText = `${menuCount} 개`;
};

qs("#espresso-menu-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const value = $menuInput.value;
  const name = value.trim();

  if (name === "") return;
  else menuAddHandler(name);
});
