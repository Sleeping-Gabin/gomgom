import { calcAddPrice, addOrder } from "./order.js";
import { addQna, addReview, changeReviewPage, clearQnaWrite, clearReviewWrite, filteringPhotoReview, sortingReview } from "./write.js";

$(function() {
  controlDetailImg();

  controlOption();

  addDetailBarEvent();

  addProductEvent();

  writeReview();
  addReviewEvent();
  
  writeQna();
  addQnaModalEvent();

  addFixBtnEvent();

  addPasswordEvent();
});

//상세 이미지의 이벤트 추가
function controlDetailImg() {
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

//상품 옵션 선택 이벤트 추가
function controlOption() {
  const optionUl = $(".product-detail-section .purchase-detail-container .detail-option");
  const options = optionUl.find(".dropdown");
  const optionItems = options.find(".dropdown-menu li");

  let selectOption = new Array(options.length).fill(null);

  //선택 가능한 옵션 메뉴 클릭시 메뉴를 보이거나 닫음
  optionUl.on("click", ".dropdown.selectable", function() {
    let currentHeight = $(this).children(".dropdown-menu").innerHeight();

    if (currentHeight == 0) {
      closeMenu(options);
      openMenu($(this));
    }
    else {
      closeMenu($(this));
    }
  });

  //메뉴 아이템 선택 시 다른 옵션의 선택 가능 여부 변경
  optionItems.on("click", function() {
    const optionMenu = $(this).parents(".dropdown");
    let optionIdx = options.index(optionMenu);

    //선택 메뉴 표시
    let selectText = $(this).html();
    optionMenu.children("p").html(selectText);

    //선택 인덱스 저장
    let selectIdx = $(this).index();
    selectOption[optionIdx] = selectIdx;

    if (optionIdx === options.length-2) {
      displayAddPrice();
    }

    if (optionIdx < options.length-1) { //마지막 옵션이 아닐 때
      //다음 옵션을 선택 가능하게 하고, 이후 옵션들을 초기화
      options.eq(optionIdx+1).addClass("selectable");
      options.slice(optionIdx+2).removeClass("selectable");
      clearMenuText(options.slice(optionIdx+1));
    }
    else { //마지막 옵션
      addOrder(selectOption);
      clearOptions(options);
    }
  });

  //메뉴 이름 초기화
  function clearMenuText(menus) {
    menus.each((i, menu) => {
      let optionIdx = options.index(menu);
      let defaultText = $(menu).siblings("p").text();

      $(menu).children("p").text("--- " + defaultText + " 선택 ---");
      selectOption[optionIdx] = null;
    });
  }

  //전체 메뉴 초기화
  function clearOptions(menus) {
    closeMenu($(menus));

    menus.removeClass("selectable");
    menus.first().addClass("selectable");

    clearMenuText(menus);
  }

  //추가 금액 표시
  function displayAddPrice() {
    const lastOptionItems = options.last().find(".dropdown-menu li");
    
    lastOptionItems.each((i, item) => {
      const addPriceSpan = $(item).find(".add-price");
    
      let select = Array.from(selectOption);
      select[select.length-1] = i;

      let addPrice = calcAddPrice(select);
      if (addPrice > 0) {
        let addPriceTxt = makePriceStr(addPrice);
        addPriceSpan.text(`(+${addPriceTxt})`);
      }
      else {
        addPriceSpan.text("");
      }
    });
  }
}

//상세 페이지 탭 바 이벤트 추가
function addDetailBarEvent() {
  const detailBarLink = $(".detail-bar a");

  //상세 페이지 마이크로 링크 이동
  detailBarLink.on("click", function(e) {
    e.preventDefault();
    
    $(window).scrollTo(this.hash, 300);
  });
}

//관련 상품 이벤트 추가
function addProductEvent() {
  const product = $(".product");

  //상품 클릭 시 상세페이지로
  product.on("click", function() {
    window.open("./detail_page.html", "_blank").focus();
  });
}

//후기 작성
function writeReview() {
  const writeContainer = $(".product-review-section .review-write-container");
  const reviewStar = writeContainer.find(".star-dropdown");
  const reviewStarItems = reviewStar.find(".dropdown-menu li");
  const writerInput = writeContainer.find("#review-writer");
  const pwInput = writeContainer.find("#review-pw");
  const reviewTxtArea = writeContainer.find(".review-txt");
  const policyChkbox = writeContainer.find("#chk-review-policy");

  const writeBtnBox = writeContainer.find(".review-write-btn-box");

  reviewStar.on("click", function() {
    let currentHeight = $(this).children(".dropdown-menu").innerHeight();

    if (currentHeight == 0) {
      openMenu($(this));
    }
    else {
      closeMenu($(this));
    }
  });

  reviewStarItems.on("click", function() {
    let selectText = $(this).html();

    //선택 메뉴 표시
    reviewStar.children("p").html(selectText);
  });

  writeBtnBox.on("click", ".review-register-btn", () => {
    let star = reviewStar.find("p i").filter(".fa-solid").length;
    let writer = writerInput.val();
    let pw = pwInput.val();
    let reviewTxt = reviewTxtArea.val();
    let policyChecked = policyChkbox.prop("checked");

    if (!writer) {
      alert("작성자를 입력해주세요.");
      writerInput.focus();
      return;
    }
    else if (!pw) {
      alert("비밀번호를 입력해주세요.");
      pwInput.focus();
      return;
    }
    else if (!policyChecked) {
      alert("개인 정보 이용에 동의하셔야 리뷰를 등록할 수 있습니다.");
      return;
    }
    else if (!reviewTxt) {
      alert("등록할 내용이 없습니다.");
      reviewTxtArea.focus();
      return;
    }

    addReview(star, writer, pw, null, reviewTxt);
    alert("리뷰 등록이 완료되었습니다.\n입력한 비밀번호로 수정/삭제할 수 있습니다.");
    clearReviewWrite();
  });
}

//상품 후기 섹션 이벤트 추가
function addReviewEvent() {
  //후기 정렬메뉴
  const reviewSorting = $(".product-review-section .review-list-container .review-list-info .review-sorting");
  const sortingItems = reviewSorting.find(".dropdown-menu li");

  reviewSorting.on("click", function() {
    let currentHeight = $(this).children(".dropdown-menu").innerHeight();

    if (currentHeight == 0) {
      openMenu($(this));
    }
    else {
      closeMenu($(this));
    }
  });

  sortingItems.on("click", function() {
    let selectText = $(this).html();
    let selectIdx = $(this).index();

    //선택 메뉴 표시
    reviewSorting.children("p").html(selectText);
    
    sortingReview(selectIdx);
    changeReviewPage(1);
  });

  //포토리뷰만 보기
  const photoChkBox = $(".product-review-section .review-list-container .review-list-info #chk-only-photo");

  photoChkBox.on("change", () => {
    filteringPhotoReview();
    changeReviewPage(1);
  });


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

//비밀번호 입력 창 이벤트 추가
function addPasswordEvent() {
  const pwBg = $(".modal-pw-bg");

  //닫기 버튼 클릭 시 닫음
  pwBg.on("click", ".modal-pw .modal-close-btn", function() {
    $(this).parents(".modal-pw").remove();
    pwBg.css("display", "none");
  });

  //배경 클릭 시 닫기
  pwBg.on("click", function(e) {
    if (e.target === e.currentTarget) {
      $(this).find(".modal-pw").remove();
      pwBg.css("display", "none");
    }
  });

  //스크롤 금지
  pwBg.on("wheel", function(e) {
    e.preventDefault();
  });
}

//문의 작성
function writeQna() {
  const writeContainer = $(".modal-qna .qna-write-container");
  const writerInput = writeContainer.find("#qna-writer");
  const pwInput = writeContainer.find("#qna-pw");
  const titleInput = writeContainer.find("#qna-title");
  const qnaTxtArea = writeContainer.find(".qna-txt textarea");
  const secretChkbox = writeContainer.find("#chk-qna-secret");
  const policyChkbox = writeContainer.find("#chk-qna-policy");

  const writeBtnBox = writeContainer.find(".qna-write-btn-box");

  //문의 작성
  writeBtnBox.on("click", ".qna-register-btn", function() {
    let writer = writerInput.val();
    let pw = pwInput.val();
    let title = titleInput.val();
    let qnaTxt = qnaTxtArea.val();
    let isSecret = secretChkbox.prop("checked");
    let policyChecked = policyChkbox.prop("checked");

    if (!writer) {
      alert("작성자를 입력해주세요.");
      writerInput.focus();
      return;
    }
    else if (!pw) {
      alert("비밀번호를 입력해주세요.");
      pwInput.focus();
      return;
    }
    else if (!policyChecked) {
      alert("개인 정보 이용에 동의하셔야 리뷰를 등록할 수 있습니다.");
      return;
    }
    else if (!title) {
      alert("제목을 입력해주세요.");
      titleInput.focus();
      return;
    }
    else if (!qnaTxt) {
      alert("등록할 내용이 없습니다.");
      qnaTxtArea.focus();
      return;
    }

    addQna(writer, pw, title, null, qnaTxt, isSecret);
    alert("문의 등록이 완료되었습니다.\n입력한 비밀번호로 수정/삭제할 수 있습니다.");
    clearQnaWrite();
    $(".modal-qna-bg").css("display", "none");
  });
}

//문의 작성 창 이벤트 추가
function addQnaModalEvent() {
  const qnaBtn = $(".product-qna-section .qna-btn");
  const qnaBg = $(".modal-qna-bg");
  const closeBtn = $(".modal-qna .modal-title .modal-close-btn");

  //문의 작성 창 열기
  qnaBtn.on("click", function() {
    qnaBg.css("display", "flex");
  });

  //닫기 버튼 클릭 시 닫기
  closeBtn.on("click", function() {
    clearQnaWrite();
    qnaBg.css("display", "none");
  });

  //배경 클릭 시 닫기
  qnaBg.on("click", function(e) {
    if (e.target === e.currentTarget) {
      clearQnaWrite();
      $(this).css("display", "none");
    }
  });

  //스크롤 금지
  qnaBg.on("wheel", function(e) {
    e.preventDefault();
  });
}

//드롭다운 메뉴를 엶
function openMenu(dropdown, speed=100) {
  let menuHeight = dropdown.find(".dropdown-menu ul").outerHeight();

  dropdown.children(".dropdown-close-btn").show();
  dropdown.children(".dropdown-open-btn").hide();
  dropdown.children(".dropdown-menu").animate({ 
    height: menuHeight 
  }, speed);
}

//드롭다운 메뉴를 닫음
function closeMenu(dropdown, speed=100) {
  dropdown.children(".dropdown-close-btn").hide();
  dropdown.children(".dropdown-open-btn").show();
  dropdown.children(".dropdown-menu").animate({ 
    height: 0 
  }, speed);
}

//가격을 화면에 표시할 문자열로 변경
//price: 가격(Number)
//return: ,과 '원'이 포함된 가격 문자열
function makePriceStr(price) {
  let priceArr = new Array(...price.toString());
  let length = priceArr.length;

  let priceStr = priceArr.reduce((prev, cur, idx) => {
    if ((length-idx)%3 === 0)
      prev += ",";
    return prev += cur;
  });
  
  return priceStr + "원";
}