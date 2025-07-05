$(function() {
  detailImgEvent();

  controlOption();

  detailBarEvent();

  productEvent();

  //리뷰 정렬 드롭다운 선택 시 텍스트 변경
  dropdownChangeTxtEvent($(".product-review-section .review-list-container .review-list-info .review-sorting"));

  reviewEvent();

  fixBtnEvent();

  passwordModal();
});

function detailImgEvent() {
  const bigImg = $(".product-detail-section .detail-img-container .detail-img-big");
  const smallImgs = $(".product-detail-section .detail-img-container .detail-img-candidate .detail-img-small");

  //작은 이미지 선택 시 큰 이미지로 보여줌
  smallImgs.on("click", function() {
    let imgUrl = $(this).children("img").attr("src");
    bigImg.css("background-image", `url("${imgUrl}")`);

    smallImgs.removeClass("select-img");
    $(this).addClass("select-img");
  });

  //box slider
  $(".box-slider").bxSlider({
    slideWidth: 85,
    slideMargin: 20,
    minSlides: 4,
    maxSlides: 4,
    moveSlides: 1,
    speed: 300,
    pager: false,
    infiniteLoop: false,
    hideControlOnEnd: true,
  });
}

function controlOption() {
  const option = $(".product-detail-section .purchase-detail-container .detail-option");
  const dropdowns = $(".product-detail-section .purchase-detail-container .detail-option .dropdown");
  const dropdownList = $(".product-detail-section .purchase-detail-container .detail-option .dropdown .dropdown-menu li");

  //선택 가능한 옵션 메뉴 클릭시 메뉴를 보이거나 닫음
  option.on("click", ".dropdown.selectable", function() {
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
}

function detailBarEvent() {
  const detailBarLink = $(".detail-bar a");

  //상세 페이지 마이크로 링크 이동
  detailBarLink.on("click", function(e) {
    e.preventDefault();
    
    $(window).scrollTo(this.hash, 300);
  });
}

function productEvent() {
  const product = $(".product");

  //상품 클릭 시 상세페이지로
  product.on("click", function() {
    window.open("../detail_page/detail_page.html", "_blank").focus();
  });
}

function reviewEvent() {

  //후기 리스트
  const reviewList = $(".product-review-section .review-list-container .review-list");

  //더보기 버튼 클릭 시
  reviewList.on("click", ".review .review-expand-btn", function() {
    $(this).parents(".review").addClass("expand-review");
    $(this).siblings(".review-reduce-btn").show();
    $(this).hide();
  });

  //접기 버튼 클릭 시
  reviewList.on("click", ".review .review-reduce-btn", function() {
    $(this).parents(".review").removeClass("expand-review");
    $(this).siblings(".review-expand-btn").show();
    $(this).hide();
  });

  //수정, 삭제 버튼 클릭 시 비밀번호 입력 화면 표시
  reviewList.on("click", ".review .review-control-btn", function() {
    $(".modal-pw-bg").css("display", "flex");
  });
}

function fixBtnEvent() {
  let maxHeight = $(document).innerHeight();
  const speed = 1000 / maxHeight;

  //top 버튼 클릭 시 부드럽게 상승
  $(".fix-btn-box .top-btn").on("click", function(e) {
    e.preventDefault();

    $("html, body").stop().animate(
      { scrollTop: "0" },
      speed * $(window).scrollTop()
    );
  });

  //bottom 버튼 클릭 시 부드럽게 하강
  $(".fix-btn-box .bottom-btn").on("click", function(e) {
    e.preventDefault();
    
    $("html, body").stop().animate(
      { scrollTop: maxHeight },
      speed * (maxHeight - $(window).scrollTop())
    );
  });
}

function passwordModal() {
  const pwBg = $(".modal-pw-bg");
  const closeBtn = $(".modal-pw .modal-close-btn");

  //닫기 버튼 클릭 시 닫음
  closeBtn.on("click", function() {
    pwBg.css("display", "none");
  });

  //배경 클릭 시 닫기
  pwBg.on("click", function(e) {
    if (e.target === e.currentTarget) {
      pwBg.css("display", "none");
    }
  });

  //스크롤 금지
  pwBg.on("wheel", function(e) {
    e.preventDefault();
  });
}

//문의 작성 창 이벤트 추가
function addQnaModalEvent() {
  const qnaBg = $(".modal-qna-bg");
  const chkQna = $("#chk-qna-write");

  //배경 클릭 시 닫기
  qnaBg.on("click", function(e) {
    if (e.target === e.currentTarget) {
      chkQna.prop("checked", false);
    }
  });

  //스크롤 금지
  qnaBg.on("wheel", function(e) {
    e.preventDefault();
  });
}
function dropdownChangeTxtEvent(dropdown) {
  const dropdownList = dropdown.find(".dropdown-menu li");

  dropdownList.on("click", function() {
    let selectText = $(this).text();

    //선택 메뉴 표시
    dropdown.children("p").text(selectText);
  });
}