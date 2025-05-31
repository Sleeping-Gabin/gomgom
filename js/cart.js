$(function() {
  const cartBg = $(".modal-cart-bg");
  const closeBtn = $(".modal-cart .modal-close-btn");
  const cartOption = $(".modal-cart .cart-container .cart-option");
  const dropdowns = $(".modal-cart .cart-container .cart-option .dropdown");

  //닫기 버튼 클릭시 닫기
  closeBtn.on("click", function() {
    cartBg.css("display", "none");
  });

  //선택 가능한 옵션 메뉴 클릭시 메뉴를 보이거나 닫음
  cartOption.on("click", ".dropdown.selectable", function() {
    let currentHeight = $(this).children(".dropdown-menu").innerHeight();

    if (currentHeight == 0) {
      closeMenu(dropdowns);
      openMenu($(this));
    }
    else {
      closeMenu($(this));
    }
  });

  //메뉴를 엶
  function openMenu(menu) {
    let menuHeight = menu.find(".dropdown-menu ul").outerHeight();
  
    menu.children(".dropdown-close-btn").show();
    menu.children(".dropdown-open-btn").hide();
    menu.children(".dropdown-menu").animate(
      { height: menuHeight },
      100
    );
  }
  
  //메뉴를 닫음
  function closeMenu(menu) {
    menu.children(".dropdown-close-btn").hide();
    menu.children(".dropdown-open-btn").show();
    menu.children(".dropdown-menu").animate(
      { height: 0 },
      100
    );
  }
});
