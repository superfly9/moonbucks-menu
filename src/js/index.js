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
const $category = qs("nav");

let INITIAL_DATA = {};
let DATA = {};
let CURRENT_CATEGORY = "";

const store = {
  setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem(key) {
    return JSON.parse(localStorage.getItem(key));
  },
};

const categoryObjectMaker = () => {
  qsAll("[data-category-name]").forEach((btn) => {
    const categoryName = btn.dataset.categoryName;
    INITIAL_DATA[categoryName] = [];
  });
};

const menuCount = () => {
  const menuCount = DATA[CURRENT_CATEGORY].length;
  $menuCount.innerText = `${menuCount} 개`;
};

const render = () => {
  menuCount();
  $menuList.innerHTML = DATA[CURRENT_CATEGORY].map(
    ({ name, soldOut }, index) => {
      return `
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
    }
  ).join("");
};

const init = () => {
  CURRENT_CATEGORY = qs("[data-category-name]").dataset.categoryName;

  const savedData = store.getItem("data");

  const hasSavedData =
    Array.isArray(savedData[CURRENT_CATEGORY]) &&
    savedData[CURRENT_CATEGORY].length > 0;

  if (!hasSavedData) categoryObjectMaker();
  DATA = hasSavedData ? { ...savedData } : { ...INITIAL_DATA };

  store.setItem("data", DATA);
  render();
};

init();

$category.addEventListener("click", (e) => {
  const categoryName = e.target.dataset.categoryName;
  const newData = { ...INITIAL_DATA, selected: categoryName };
  store.setItem("data", newData);
});

const menuAddHandler = (name) => {
  //  {
  //     espresso : [  {name ,soldOut}, {name ,soldOut} , {name ,soldOut} ],
  //     blendid :  [  {name ,soldOut}, {name ,soldOut} , {name ,soldOut} ]
  //  }
  DATA[CURRENT_CATEGORY].push({ name, soldOut: false });

  $menuInput.value = "";
  store.setItem("data", DATA);
  render();
};

const menuEditHandler = (...args) => {
  const e = args[0];
  const newMenuName = window.prompt("수정할 메뉴명을 입력해주세요.");
  if (newMenuName.trim()) {
    const menu = e.target.closest(".menu-list-item");
    qs(".menu-name", menu).innerText = newMenuName;
  }
};

const menuRemoveHandler = (...args) => {
  const e = args[0];
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
    edit: menuEditHandler.bind(null, event),
    remove: menuRemoveHandler.bind(null, event),
    // edit: menuEditHandler.bind(null, event, 10),  args : [PointerEvent,10]
  }[type];

  menuClickHandler();
});
