export const qs = (target, scope = document) => scope.querySelector(target);
export const qsAll = (target, scope = document) =>
  scope.querySelectorAll(target);

export const eventListener = (eventType, handler, scope = document) => {
  scope.addEventListener(eventType, handler);
};

const $menuForm = qs("#menu-form");
const $menuInput = qs("#menu-name");
const $menuList = qs("#menu-list");
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
  <li class="menu-list-item d-flex items-center py-2" data-id=${index}>
  <span class="w-100 pl-2 menu-name ${soldOut ? 'sold-out':''}">${name}</span>
  <button
    type="button"
    class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
  >
    품절
  </button>
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

  const hasSavedData = savedData?.[CURRENT_CATEGORY] && Array.isArray(savedData[CURRENT_CATEGORY]);
    
  if (!hasSavedData) categoryObjectMaker();

  DATA = hasSavedData ? { ...savedData } : { ...INITIAL_DATA };

  render();
};

init();

const categoryClickHandler =(e) => {
  if (!e.target.classList.contains('cafe-category-name')) return;

  CURRENT_CATEGORY = e.target.dataset.categoryName;

  qs('.menu-title').innerHTML = e.target.innerHTML;
  render();
}

$category.addEventListener("click", categoryClickHandler);

const menuAddHandler = (name) => {

  DATA[CURRENT_CATEGORY].push({ name, soldOut: false , id : DATA[CURRENT_CATEGORY].length + 1 });

  $menuInput.value = "";
  store.setItem("data", DATA);
  render();
};

const menuEditHandler = e => {
  const menuTarget= e.target.closest(".menu-list-item")
  const currentMenu = qs(".menu-name", menuTarget).innerText;
  const newMenuName = window.prompt("수정할 메뉴명을 입력해주세요.", currentMenu ) ?? ''

  if (newMenuName.trim()) {
    const menu = e.target.closest(".menu-list-item");
    const menuId = Number(menu.dataset.id);

    DATA[CURRENT_CATEGORY][menuId]['name'] = newMenuName;
    store.setItem('data',DATA)
    render();
  }
};

const menuRemoveHandler = e => {
  const menuTarget= e.target.closest(".menu-list-item")
  const menuName = qs(".menu-name", menuTarget).innerText;

  if (window.confirm(`${menuName} 메뉴를 삭제하시겠습니까?`)) {
    const menu = menuTarget;
    const menuId = Number(menu.dataset.id);

    DATA[CURRENT_CATEGORY].splice(menuId, 1);
    store.setItem('data',DATA);
    render();
  }
};

const menuSoldOutHanlder = e => {
  const menu = e.target.closest(".menu-list-item");
  const menuId = Number(menu.dataset.id);

  DATA[CURRENT_CATEGORY][menuId]['soldOut'] = !DATA[CURRENT_CATEGORY][menuId]['soldOut'];
  store.setItem('data',DATA)
  render();
}

$menuForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = $menuInput.value;
  const name = value.trim();

  if (name === "") return;
  else menuAddHandler(name);
});

$menuList.addEventListener("click", (e) => {
  
  if (e.target.classList.contains("menu-edit-button")) {
    menuEditHandler(e);
  }
  if (e.target.classList.contains("menu-remove-button")) {
    menuRemoveHandler(e);
  }
  if (e.target.classList.contains("menu-sold-out-button")) {
    menuSoldOutHanlder(e);
  }

});
