$(function() {
  viewMiniLogo();

  //상품 정렬 드롭다운 선택 시 텍스트 변경
  addMenuChangeTxtEvent($(".page-info .sorting"));

  addProductEvent();

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

//상품 이벤트 추가
function addProductEvent() {
  const product = $(".product");
  const productIconList = $(".product .product-icon");

  //상품 클릭 시 상세페이지로
  product.on("click", function() {
    window.open("../detail_page/detail_page.html", "_blank").focus();
  });

  //관심 아이콘 클릭 시 이동하지 않음
  productIconList.children("li:nth-of-type(1)").on("click", function() {
    return false;
  });

  //옵션 아이콘 클릭 시 옵션 표시
  productIconList.children("li:nth-of-type(2)").on("click", function() {
    $(this).parent().siblings(".product-option").toggle();
    return false;
  });

  //상품에서 마우스가 나가면 옵션 비표시
  product.on("mouseleave blur", function() {
    $(this).find(".product-option").hide();
  });
  
  //장바구니 아이콘 클릭 시 장바구니 모달창 표시
  productIconList.children("li:nth-of-type(3)").on("click", function() {
    $(".modal-cart-bg").css("display", "flex");
    return false;
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

//드롭다운 메뉴 선택 시 텍스트 변경 이벤트 추가
function addMenuChangeTxtEvent(dropdown) {
  const dropdownItems = dropdown.find(".dropdown-menu li");

  dropdownItems.on("click", function() {
    let selectText = $(this).html();

    //선택 메뉴 표시
    dropdown.children("p").html(selectText);
  });
}