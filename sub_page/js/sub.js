import { sorting, filteringByPrice, changePage } from "./product.js";

$(function() {
  viewMiniLogo();

  addSortingMenuEvent();
  addFilteringInputEvent();

  addFixBtnEvent();
});

//스크롤 시 gnb에 로고를 보임
function viewMiniLogo() {
  const miniLogo = document.querySelector(".gnb .mini-logo");
  const header = document.querySelector(".header");
  const gnbOuter = document.querySelector(".gnb-outer");

  window.addEventListener("scroll", function() {
    let currentTop = this.window.scrollY;
    let headerHeight = header.clientHeight + gnbOuter.clientHeight;

    if (currentTop > headerHeight) {
      miniLogo.style.width = "120px";
    }
    else {
      miniLogo.style.width = "0px";
    }
  });
}

//top/bottom 버튼 이벤트 추가
function addFixBtnEvent() {
  let maxHeight = $(document).innerHeight();
  const speed = 1000 / maxHeight;

  //top 버튼 클릭 시 부드럽게 상승
  $(".fix-btn-box .top-btn").on("click", function(e) {
    e.preventDefault();

    $("html, body").stop().animate({ 
      scrollTop: "0" 
    }, speed * $(window).scrollTop());
  });

  //bottom 버튼 클릭 시 부드럽게 하강
  $(".fix-btn-box .bottom-btn").on("click", function(e) {
    e.preventDefault();
    
    $("html, body").stop().animate({ 
      scrollTop: maxHeight 
    }, speed * (maxHeight - $(window).scrollTop()));
  });
}

function addSortingMenuEvent() {
  const sortingMenu = $(".page-info .sorting");
  const sortingItems = sortingMenu.find(".dropdown-menu li");

  sortingMenu.on("click", function() {
    let currentHeight = $(this).children(".dropdown-menu").innerHeight();

    if (currentHeight == 0) {
      openMenu($(this));
    }
    else {
      closeMenu($(this));
    }
  });

  sortingItems.on("click", function() {
    let selectText = $(this).html();
    let idx = $(this).index();

    //선택 메뉴 표시
    sortingMenu.children("p").html(selectText);
    sorting(idx);
    changePage(1);
  });
}

function addFilteringInputEvent() {
  const filteringBox = document.querySelector(".page-info .filtering");
  const minPriceInput = filteringBox.querySelector(".min-price");
  const maxPriceInput = filteringBox.querySelector(".max-price");

  let minPrice = parseInt(minPriceInput.value);
  let maxPrice = parseInt(maxPriceInput.value);

  
  minPriceInput.addEventListener("change", filtering);
  maxPriceInput.addEventListener("change", filtering);

  function filtering() {
    let newMinPrice = parseInt(minPriceInput.value);
    let newMaxPrice = parseInt(maxPriceInput.value);

    if (newMinPrice > newMaxPrice && newMinPrice && newMaxPrice) {
      alert("최소 가격보다 최대 가격이 더 커야합니다.");
      minPriceInput.value = minPrice;
      maxPriceInput.value = maxPrice;
    }
    else {
      minPrice = minPriceInput.value;
      maxPrice = maxPriceInput.value;
    }

    filteringByPrice(minPrice, maxPrice);
    changePage(1);
  }
}

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