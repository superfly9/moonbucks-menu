export const qs = (target, scope = document) => scope.querySelector(target);
export const qsAll = (target, scope = document) =>
  scope.querySelectorAll(target);

export const eventListener = (eventType, handler, scope = document) => {
  scope.addEventListener(eventType, handler);
};

const $menuForm = qs("#espresso-menu-form");
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

const menuEditHandler = (e) => {
  console.log("[e]:", e);
  const newMenuName = window.prompt("수정할 메뉴명을 입력해주세요.");
  if (newMenuName.trim()) {
    const menu = e.target.closest(".menu-list-item");
    qs(".menu-name", menu).innerText = newMenuName;
  }
};

const menuRemoveHandler = (e) => {
  const menuName = qs(
    ".menu-name",
    e.target.closest(".menu-list-item")
  ).innerText;

  if (window.confirm(`${menuName} 메뉴를 삭제하시겠습니까?`)) {
    e.target.closest(".menu-list-item").remove();
  }
};

$menuForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = $menuInput.value;
  const name = value.trim();

  if (name === "") return;
  else menuAddHandler(name);
});

$menuList.addEventListener("click", (e) => {
  let type = undefined;
  if (e.target.classList.contains("menu-edit-button")) {
    type = "edit";
  }
  if (e.target.classList.contains("menu-remove-button")) {
    type = "remove";
  }

  if (!type) return;

  const event = e;
  const menuClickHandler = {
    edit: () => menuEditHandler(event),
    remove: () => menuRemoveHandler(event),
  }[type];

  menuClickHandler();
});
