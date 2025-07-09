$(function() {
  const cartBg = $(".modal-cart-bg");
  const cart = $(".modal-cart");
  const closeBtn = cart.find(".modal-close-btn");
  const cartOption = cart.find(".cart-container .cart-option");
  const dropdowns = cartOption.find(".dropdown");
  const dropdownItems = dropdowns.find(".dropdown-menu li");

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

  //각 메뉴 아이템 선택 시 텍스트 변경
  dropdowns.each((i, dropdown) => addMenuChangeTxtEvent($(dropdown)));

  //메뉴 아이템 선택 시 다른 옵션의 선택 가능 여부 변경
  dropdownItems.on("click", function() {
    const dropdown = $(this).parents(".dropdown");
    let idx = dropdowns.index(dropdown);

    if (idx < dropdowns.length-1) { //마지막 옵션이 아닐 때
      //다음 옵션을 선택 가능하게 하고, 이후 옵션들을 초기화
      dropdowns.eq(idx+1).addClass("selectable");
      dropdowns.slice(idx+2).removeClass("selectable");
      clearMenuText(dropdowns.slice(idx+1));
    }
    else { //마지막 옵션
      clearOptions(dropdowns);
    }
  });
    
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

//드롭다운 메뉴를 엶
function openMenu(dropdown, speed=100) {
  let menuHeight = dropdown.find(".dropdown-menu ul").outerHeight();

  dropdown.children(".dropdown-close-btn").show();
  dropdown.children(".dropdown-open-btn").hide();
  dropdown.children(".dropdown-menu").animate({ 
    height: menuHeight 
  }, speed);
}

//드롭다운 메뉴를 닫음
function closeMenu(dropdown, speed=100) {
  dropdown.children(".dropdown-close-btn").hide();
  dropdown.children(".dropdown-open-btn").show();
  dropdown.children(".dropdown-menu").animate({ 
    height: 0 
  }, speed);
}

//드롭다운 메뉴 선택 시 텍스트 변경 이벤트 추가
function addMenuChangeTxtEvent(dropdown) {
  const dropdownItems = dropdown.find(".dropdown-menu li");

  dropdownItems.on("click", function() {
    let selectText = $(this).html();

    //선택 메뉴 표시
    dropdown.children("p").html(selectText);
  });
}