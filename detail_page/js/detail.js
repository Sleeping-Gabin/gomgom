$(function() {
  detailImgEvent();

  controlOption();
  
  productEvent();

  //리뷰 정렬 드롭다운 선택 시 텍스트 변경
  dropdownChangeTxtEvent($(".product-review-section .review-list-container .review-list-info .review-sorting"));
  
  reviewEvent();

  fixBtnEvent();

  passwordModal();
});

function detailImgEvent() {
  const bigImg = $(".product-detail-section .detail-img-container .detail-img-big");
  const smallImgs = $(".product-detail-section .detail-img-container .detial-img-small-box .detail-img-small");

  //작은 이미지 선택 시 큰 이미지로 보여줌
  smallImgs.on("click", function() {
    let imgUrl = $(this).children("img").attr("src");
    bigImg.css("background-image", `url("${imgUrl}")`);
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

function productEvent() {
  const product = $(".product");

  //상품 클릭 시 상세페이지로
  product.on("click", function() {
    window.open("../detail_page/detail_page.html", "_blank").focus();
  });
}

function reviewEvent() {
  const reviews = $(".product-review-section .review-list-container .review-list .review");
  const reviewExpandBtns = reviews.find(".review-expand-btn");
  const reviewReduceBtns = reviews.find(".review-reduce-btn");
  const reviewControlBtns = reviews.find(".review-control-btn");

  //더보기 버튼 클릭 시
  reviewExpandBtns.on("click", function() {
    $(this).parents(".review").addClass("expand-review");
    $(this).siblings(".review-reduce-btn").show();
    $(this).hide();
  });

  //접기 버튼 클릭 시
  reviewReduceBtns.on("click", function() {
    $(this).parents(".review").removeClass("expand-review");
    $(this).siblings(".review-expand-btn").show();
    $(this).hide();
  });

  reviewControlBtns.on("click", function() {
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
  const closeBtn = $(".modal-pw .modal-close-btn");

  //닫기 버튼 클릭 시 닫음
  closeBtn.on("click", function() {
    $(".modal-pw-bg").css("display", "none");
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