$(function() {
  const cartBg = $(".modal-cart-bg");
  const closeBtn = $(".modal-cart .modal-close-btn");

  //닫기 버튼 클릭시 닫기
  closeBtn.on("click", function() {
    cartBg.css("display", "none");
  });
});
