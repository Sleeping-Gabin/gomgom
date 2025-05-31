$(function() {
  detailImgEvent();
  
  productEvent();

  fixBtnEvent();
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

function productEvent() {
  const product = $(".product");

  //상품 클릭 시 상세페이지로
  product.on("click", function() {
    window.open("../detail_page/detail_page.html", "_blank").focus();
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