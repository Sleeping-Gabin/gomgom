$(function() {
  const cartBg = $(".modal-cart-bg");
  const closeBtn = $(".modal-cart .modal-close-btn");
  const cartOption = $(".modal-cart .cart-container .cart-option");
  const dropdowns = $(".modal-cart .cart-container .cart-option .dropdown");
  const dropdownList = $(".modal-cart .cart-container .cart-option .dropdown .dropdown-menu li");

  //닫기 버튼 클릭시 닫기
  closeBtn.on("click", function() {
    clearOptions(dropdowns);

    cartBg.css("display", "none");
  });

  //배경 클릭 시 닫기
  cartBg.on("click", function(e) {
    if (e.target === e.currentTarget) {
      cartBg.css("display", "none");
    }
  });

  //스크롤 금지
  cartBg.on("wheel", function(e) {
    e.preventDefault();
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

  //메뉴 선택시
  dropdownList.on("click", function() {
    const dropdown = $(this).parents(".dropdown");

    let idx = dropdowns.index(dropdown);
    let selectText = $(this).text();

    //선택 메뉴 표시
    dropdown.children("p").text(selectText);

    if (idx < dropdowns.length-1) {
      //다음 옵션을 선택 가능하게 하고, 이후 옵션들을 초기화
      dropdowns.eq(idx+1).addClass("selectable");
      dropdowns.slice(idx+2).removeClass("selectable");
      clearMenuText(dropdowns.slice(idx+1));
    }
    else {
      clearOptions(dropdowns);
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
  
  //메뉴 이름 초기화
  function clearMenuText(menus) {
    menus.each((i, menu) => {
      let defaultText = $(menu).siblings("p").text();
      $(menu).children("p").text("--- " + defaultText + " 선택 ---");
    });
  }
  
  //전체 메뉴 초기화
  function clearOptions(menus) {
    closeMenu($(menus));
  
    menus.removeClass("selectable");
    menus.first().addClass("selectable");
  
    clearMenuText(menus);
  }
});
