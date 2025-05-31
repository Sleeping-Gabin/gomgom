$(function() {
  productEvent();
});

function productEvent() {
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
}