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
}