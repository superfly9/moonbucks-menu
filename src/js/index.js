export const qs = (target, scope = document) => scope.querySelector(target);
export const qsAll = (target, scope = document) =>
  scope.querySelectorAll(target);

export const eventListener = (eventType, handler, scope = document) => {
  scope.addEventListener(eventType, handler);
};

const $menuInput = qs("#espresso-menu-name");
const $menuList = qs("#espresso-menu-list");
const $menuCount = qs(".menu-count");

qs("#espresso-menu-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const value = $menuInput.value;
  const name = value.trim();

  if (name === "") {
    return;
  } else {
    const newMenu = `
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

    $menuList.insertAdjacentHTML("beforeEnd", newMenu);
    $menuInput.value = "";
    const menuCount = $menuList.children.length;
    $menuCount.innerText = `${menuCount} 개`;

    $menuList.addEventListener("click", (e) => {
      // type :edit / remove / undefined

      console.log("[target before]:", e.target, "[event]:", e);
      let type = undefined;
      if (e.target.classList.contains("menu-edit-button")) {
        type = "edit";
      }
      if (e.target.classList.contains("menu-remove-button")) {
        type = "remove";
      }

      if (!type) return;

      const editHandler = () => {
        if (window.prompt("수정할 메뉴명을 입력해주세요.")) {
          console.log(e.target.parentNode);
        }
      };

      const menuClickHandler = {
        edit: editHandler,
        remove: () => console.log("remove"),
      }[type];

      menuClickHandler();
    });
  }
});
