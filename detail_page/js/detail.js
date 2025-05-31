$(function() {
  detailImgEvent();
  
  productEvent();
  
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