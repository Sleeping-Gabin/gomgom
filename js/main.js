$(function() {
  viewMiniLogo();

  productEvent();

  interiorEvent();

  newEvent();

  mdEvent();
  
  fixBtnEvent();
});

//스크롤 시 gnb에 로고를 보임
function viewMiniLogo() {
  const miniLogo = document.querySelector(".gnb .mini-logo");
  const header = document.querySelector(".header");
  const gnbOuter = document.querySelector(".gnb-outer");

  window.addEventListener("scroll", function() {
    let currentTop = this.window.scrollY;
    let headerHeight = header.clientHeight + gnbOuter.clientHeight;

    if (currentTop > headerHeight) { //헤더 이상으로 스크롤 시 로고 표시
      miniLogo.style.width = "120px";
    }
    else {
      miniLogo.style.width = "0px";
    }
  });
}

function productEvent() {
  //상품 클릭 시 상세페이지로
  $(document).on("click", ".product", function() {
    window.open("./detail_page/detail_page.html", "_blank").focus();
  });

  //관심 아이콘 클릭 시 이동하지 않음
  $(document).on("click", ".product .product-icon li:nth-of-type(1)", function() {
    return false;
  });

  //옵션 아이콘 클릭 시 옵션 표시/비표시
  $(document).on("click", ".product .product-icon li:nth-of-type(2)", function() {
    $(this).parent().siblings(".product-option").toggle();
    return false;
  });

  //상품에서 마우스가 나가면 옵션 비표시
  $(document).on("mouseleave blur", ".product", function() {
    $(this).find(".product-option").hide();
  });
  
  //장바구니 아이콘 클릭 시 장바구니 모달창 표시
  $(document).on("click", ".product .product-icon li:nth-of-type(3)", function() {
    $(".modal-cart-bg").css("display", "flex");
    return false;
  });
}

function newEvent() {
  const newList = $(".new-section .new-frame > ul");

  //왼쪽 화살표 클릭 시 오른쪽으로 슬라이드
  $(".new-section .new-left-arrow").on("click", function() {
    newList.stop().animate(
      { left: "0" },
      300,
      function() {
        let lastNew = newList.children().slice(-5);
        $(this).prepend(lastNew).css("left", "-1050px");
      }
    );
  });

  //오른쪽 화살표 클릭 시 왼쪽으로 슬라이드
  $(".new-section .new-right-arrow").on("click", function() {
    newList.stop().animate(
      { left: "-2100px" },
      300,
      function() {
        let firstNew = newList.children().slice(0, 5);
        $(this).append(firstNew).css("left", "-1050px");
      }
    );
  });
}

function mdEvent() {
  const mdList = $(".md-section .md-frame > ul");

  //비활성화 상태의 상품 클릭 시 이동하지 않음
  $(".md-section").on("click", ".md-on", function() {
    return false;
  });

  //왼쪽 화살표 클릭 시
  $(".md-section .md-left-arrow").on("click", function() {
    let mdListItem = mdList.children();

    //왼쪽 상품으로 포커스 이동
    mdListItem.removeClass("md-focus");
    mdListItem.eq(2).addClass("md-focus");

    //오른쪽으로 슬라이드
    mdList.stop().animate(
      { left: "-640px" },
      300,
      function() {
        mdListItem.last().remove();

        let prependMd = mdListItem.eq(4).clone();
        mdList.prepend(prependMd);

        mdList.css("left", "-955px");
      }
    );
  });

  $(".md-section .md-right-arrow").on("click", function() {
    let mdListItem = mdList.children();

    //오른쪽 상품으로 포커스 이동
    mdListItem.removeClass("md-focus");
    mdListItem.eq(4).addClass("md-focus");

    //왼쪽으로 슬라이드
    mdList.stop().animate(
      { left: "-1270px"},
      300,
      function() {
        mdListItem.first().remove();

        let appendMd = mdListItem.eq(2).clone();
        mdList.append(appendMd);

        mdList.css("left", "-955px");
      }
    );
  });
}

function interiorEvent() {
  const interiorInfos = $(".interior .interior-info");
  let idx = 0;

  //인테리어 포인트 마우스 호버 시 해당 상품에 포커스
  interiorInfos.on("mouseenter", function() {
    idx = interiorInfos.index($(this));

    interiorInfos.removeClass("interior-focus");
    interiorInfos.eq(idx).addClass("interior-focus");
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