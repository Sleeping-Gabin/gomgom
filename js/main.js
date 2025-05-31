$(function() {
  productEvent();

  interiorEvent();

  newEvent();

  mdEvent();
  
  fixBtnEvent();
});

function productEvent() {
  const product = $(".product");
  const productIconList = $(".product .product-icon");

  //상품 클릭 시 상세페이지로
  product.on("click", function() {
    window.open("./detail_page/detail_page.html", "_blank").focus();
  });

  //관심 아이콘 클릭 시 이동하지 않음
  productIconList.children("li:nth-of-type(1)").on("click", function() {
    return false;
  });

  //옵션 아이콘 클릭 시 옵션 표시/비표시
  productIconList.children("li:nth-of-type(2)").on("click", function() {
    $(this).parent().siblings(".product-option").toggle();
    return false;
  });

  //상품에서 마우스가 나가면 옵션 비표시
  product.on("mouseleave blur", function() {
    $(this).find(".product-option").hide();
  });
  
  //장바구니 아이콘 클릭 시 장바구니 모달창 띄움
  productIconList.children("li:nth-of-type(3)").on("click", function() {
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
  $(".md-section .md-on").on("click", function() {
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