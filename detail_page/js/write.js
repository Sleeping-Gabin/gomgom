const reviewSection = document.querySelector(".product-review-section");
const allReviews = await getReviews();
let reviews = Array.from(allReviews);
let reviewGroup = [];
let sortingIdx = 0;
let curReviewPage = 1;

const qnaSection = document.querySelector(".product-qna-section");
const qnas = await getQnas();
let qnaGroup = [];
let curQnaPage = 1;

const productId = 36;
export const order = {
  orderNum: "abc01036",
  buyer: {
    userId: "green1234"
  },
  order: [
    {
      productId: 36,
      option: "슈퍼싱글 SS/잇템 독립매트/화이트(+130,000원)",
      num: 2,
      price: 658000
    }
  ],
  totalPrice: 658000
}

init();

function init() {
  updateReview();
  sortingReview();
  changeReviewPage(1);

  updateQna();
  changeQnaPage(1);
}

async function getReviews() {
  const response = await fetch("../data/reviews.json");
  const allReviews = await response.json();

  return allReviews;
}

async function getQnas() {
  const response = await fetch("../data/qnas.json");
  const qnas = await response.json();

  return qnas;
}

//페이지네이션 화면에 표시
//section: 페이지네이션이 있는 섹션
//pageCnt: 총 페이지 수
//page: 현재 페이지
function displayPagination(section, pageCnt, page) {
  const pagination = section.querySelector(".pagination");
  const pageUl = pagination.querySelector(".page");
  const firstPageArrow = pagination.querySelector(".first-page-arrow");
  const lastPageArrow = pagination.querySelector(".last-page-arrow");
  const prevPageArrow = pagination.querySelector(".prev-page-arrow");
  const nextPageArrow = pagination.querySelector(".next-page-arrow");

  for (let i=1; i<=pageCnt; i++) {
    const pageLi = document.createElement("li");
    pageLi.textContent = i;

    addPageEvent(pageLi, i);

    pageUl.appendChild(pageLi);
  }

  pageUl.children[page-1].classList.add("selected-page");

  //페이지에 따라 페이지 화살표가 보이거나 안보이게 하고 이벤트 추가
  if (page == 1) {
    firstPageArrow.style.display = "none";
    prevPageArrow.style.display = "none";
  }
  else {
    firstPageArrow.style.display = "block";
    prevPageArrow.style.display = "block";
    addPageEvent(firstPageArrow, 1);
    addPageEvent(prevPageArrow, page-1);
  }

  if (page == pageCnt) {
    lastPageArrow.style.display = "none";
    nextPageArrow.style.display = "none";
  }
  else {
    lastPageArrow.style.display = "block";
    nextPageArrow.style.display = "block";
    addPageEvent(lastPageArrow, pageCnt);
    addPageEvent(nextPageArrow, page+1);
  }


  //페이지 이벤트 추가
  function addPageEvent(pageEl, idx) {
    if (section === reviewSection) {
      pageEl.addEventListener("click", () => {
        // let y = reviewSection.querySelector(".review-list-container").offsetTop - 35;

        changeReviewPage(idx);
        // window.scrollTo(0, y);
      });
    }
    else if (section === qnaSection) {
      pageEl.addEventListener("click", () => {
        // let y = qnaSection.offsetTop - 35;

        changeQnaPage(idx);
        // window.scrollTo(0, y);
      });
    }
  }
}

//리뷰 정렬 후 페이지별 분류
export function sortingReview(methodIdx = sortingIdx) {
  switch (methodIdx) {
    case(0): //최신순
      reviews = reviews.sort((r1, r2) => {
        if (r1.date > r2.date)
          return -1;
        else if (r1.date < r2.date)
          return 1;
        else 
          return 0;
      });
      break;

    case(1): //높은 별점순
      reviews = reviews.sort((r1, r2) => {
        if (r1.star == r2.star) {
          if (r1.date > r2.date)
            return -1;
          else if (r1.date < r2.date)
            return 1;
          else 
            return 0;
        }
        else {
          return r2.star - r1.star;
        }
      });
      break;

    case(2): //낮은 별점순
      reviews = reviews.sort((r1, r2) => {
        if (r1.star == r2.star) {
          if (r1.date > r2.date)
            return -1;
          else if (r1.date < r2.date)
            return 1;
          else 
            return 0;
        }
        else {
          return r1.star - r2.star;
        }
      });
      break;
  }

  sortingIdx = methodIdx;

  reviewGroup = [];
  let idx = 0;
  while (idx < reviews.length) {
    reviewGroup.push(reviews.slice(idx, idx+3));
    idx += 3;
  }
}

//리뷰 목록 페이지 변경
export function changeReviewPage(page = curReviewPage) {
  //페이지 초기화
  const reviewEls = reviewSection.querySelectorAll(".review-list-container .review-list .review");
  reviewEls.forEach(reviewEl => reviewEl.remove());
  
  const pageLis = reviewSection.querySelectorAll(".pagination .page li");
  const pageArrows = reviewSection.querySelectorAll(".pagination .page-arrow");
  pageLis.forEach(pageLi => pageLi.remove());
  pageArrows.forEach(arrow => arrow.style.display = "none");

  //화면에 표시
  if (reviews.length > 0) {
    displayReview(page);
    displayPagination(reviewSection, reviewGroup.length, page);
  }

  curReviewPage = page;
}

//페이지에 리뷰 표시
function displayReview(page) {
  const reviewUl = reviewSection.querySelector(".review-list-container .review-list");

  reviewGroup[page-1].forEach((review, idx) => {
    const reviewEl = createReviewEl(review);
    reviewUl.appendChild(reviewEl);
    addReviewBtn(reviewEl);
    addReviewEvent(reviewEl, idx);
  });
}

//리뷰가 길면 더보기-닫기 버튼 추가
function addReviewBtn(reviewEl) {
  const reviewTxt = reviewEl.querySelector(".review-txt");

  if (reviewTxt.clientHeight >= reviewTxt.scrollHeight) {
    return;
  }

  const reduceBtn = document.createElement("div");
  reduceBtn.setAttribute("class", "review-reduce-btn review-btn");

  const reduceTxt = document.createTextNode("닫기");
  const closeIcon = document.createElement("i");
  closeIcon.setAttribute("class", "fa-solid fa-chevron-up");

  reduceBtn.appendChild(closeIcon);
  reduceBtn.appendChild(reduceTxt);

  const expandBtn = document.createElement("div");
  expandBtn.setAttribute("class", "review-expand-btn review-btn");

  const expandTxt = document.createTextNode("더보기");
  const openIcon = document.createElement("i");
  openIcon.setAttribute("class", "fa-solid fa-chevron-down");

  expandBtn.appendChild(openIcon);
  expandBtn.appendChild(expandTxt);

  reviewTxt.insertAdjacentElement("afterend", reduceBtn);
  reviewTxt.insertAdjacentElement("afterend", expandBtn);
}

//수정 삭제 이벤트 추가
function addReviewEvent(reviewEl, idx) {
  const deleteBtn = reviewEl.querySelector(".review-delete-btn");
  const modifyBtn = reviewEl.querySelector(".review-modify-btn");

  //삭제 버튼
  deleteBtn.addEventListener("click", () => {
    clearReviewWrite();

    const pwBg = document.querySelector(".modal-pw-bg");

    const modalPwEl = createModalPwEl();
    pwBg.appendChild(modalPwEl);
    pwBg.style.display = "flex";

    const okBtn = modalPwEl.querySelector(".pw-ok-btn");
    const pwInput = modalPwEl.querySelector("input[type='password']");

    pwInput.focus();

    okBtn.addEventListener("click", () => {
      let result = deleteReview(idx, pwInput.value);
      if (result < 0) {
        alert("비밀번호가 일치하지 않습니다.");
        pwInput.select();
      }
      else {
        alert("리뷰가 삭제되었습니다.");
        pwBg.removeChild(modalPwEl);
        pwBg.style.display = "none";
      }
    });
  });

  //수정 버튼
  modifyBtn.addEventListener("click", () => {
    const pwBg = document.querySelector(".modal-pw-bg");

    const modalPwEl = createModalPwEl();
    pwBg.appendChild(modalPwEl);
    pwBg.style.display = "flex";

    const okBtn = modalPwEl.querySelector(".pw-ok-btn");
    const pwInput = modalPwEl.querySelector("input[type='password']");
    
    pwInput.focus();

    okBtn.addEventListener("click", () => {
      let result = modifyReview(idx, pwInput.value);
      if (result < 0) {
        alert("비밀번호가 일치하지 않습니다.");
        pwInput.select();
      }
      else {
        pwBg.removeChild(modalPwEl);
        pwBg.style.display = "none";
      }
    });
  });
}

//별점, 후기 개수를 업데이트
function updateReview() {
  //후기 개수 업데이트
  const reviewCountSpan = document.querySelector(".detail-bar .product-review-tab .count");
  let reviewNum = allReviews.length;
  reviewCountSpan.textContent = reviewNum;

  //별점 업데이트
  const starRatingContainer = reviewSection.querySelector(".star-rating-container");
  const starScore = starRatingContainer.querySelector(".star-score p");
  const starDistributions = starRatingContainer.querySelectorAll(".star-distribution li");

  starDistributions.forEach((li, idx) => {
    const starNum = li.querySelector(".star-num");
    const colorLine = li.querySelector(".star-color-line");

    let num = allReviews.filter(review => review.star === 5-idx).length;
    let w = 695 * num / reviewNum;

    starNum.textContent = num;
    colorLine.style.width = reviewNum>0 ? w+"px" : 0;
  });

  let starRate = allReviews.reduce((prev, cur) => prev += cur.star, 0) / reviewNum;
  starScore.textContent = reviewNum>0 ? `${starRate.toFixed(1)} / 5` : "아직 후기가 없습니다.";
}

//포토리뷰만 보기의 체크에 따라 필터링
export function filteringPhotoReview() {
  let filtering = document.getElementById("chk-only-photo").checked;

  if (filtering) {
    reviews = allReviews.filter(review => review.photo);
  }
  else {
    reviews = Array.from(allReviews);
  }

  sortingReview();
}

//리뷰 추가 이후 1페이지로 변경
export function addReview(star, writer, pw, photos, text, date, id) {
  let maxId = Math.max(...allReviews.map(rev => rev.id));

  const review = {
    id: id ? id : maxId + 1,
    star: star,
    option: order.order.find(product => 
      product.productId === productId).option,
    photo: photos,
    text: text,
    date: date ? date : new Date().toISOString().slice(0, 10),
    userId: order.buyer.userId ? order.buyer.userId : null,
    writer: writer,
    pw: pw
  }

  allReviews.push(review);

  updateReview();
  filteringPhotoReview();
  changeReviewPage(1);
}

//리뷰 삭제 이후 1페이지로 변경
//idx: 현재 페이지에서의 리뷰 인덱스
//return: -1 비밀번호 불일치 / 0 삭제 완료
function deleteReview(idx, pw) {
  const review = reviewGroup[curReviewPage-1][idx];

  if (review.pw !== pw) {
    return -1;
  }

  let allReviewIdx = allReviews.findIndex(rev => rev.id === review.id);
  allReviews.splice(allReviewIdx, 1);

  updateReview();
  filteringPhotoReview();
  changeReviewPage(1);

  return 0;
}

//리뷰 수정
function modifyReview(idx, pw) {
  const review = reviewGroup[curReviewPage-1][idx];

  if (review.pw !== pw) {
    return -1;
  }
  
  //리뷰 내용 복사
  const writeContainer = document.querySelector(".product-review-section .review-write-container");
  const reviewStar = writeContainer.querySelector(".star-dropdown");
  const reviewStarItems = reviewStar.querySelectorAll(".dropdown-menu li");
  const writerInput = writeContainer.querySelector("#review-writer");
  const pwInput = writeContainer.querySelector("#review-pw");
  const reviewTxtArea = writeContainer.querySelector(".review-txt");
  const policyChkbox = writeContainer.querySelector("#chk-review-policy");

  reviewStar.querySelector("p").innerHTML = reviewStarItems[5-review.star].innerHTML;
  writerInput.value = review.writer;
  pwInput.value = review.pw;
  reviewTxtArea.value = review.text;
  policyChkbox.checked = true;

  //등록 버튼 변경
  const reviewWriteBtnBox = reviewSection.querySelector(".review-write-container .review-write-btn-box");
  const loginBtn = reviewWriteBtnBox.querySelector(".review-login-btn");
  const registerBtn = reviewWriteBtnBox.querySelector(".review-register-btn");

  const modifyBtn = document.createElement("a");
  modifyBtn.setAttribute("href", "#!");
  modifyBtn.setAttribute("class", "modify-ok-btn review-write-btn");
  modifyBtn.textContent = "리뷰 수정";

  const cancelBtn = document.createElement("a");
  cancelBtn.setAttribute("href", "#!");
  cancelBtn.setAttribute("class", "review-write-btn modify-cancel-btn");
  cancelBtn.textContent = "취소";

  reviewWriteBtnBox.removeChild(registerBtn);
  reviewWriteBtnBox.removeChild(loginBtn);
  reviewWriteBtnBox.appendChild(cancelBtn);
  reviewWriteBtnBox.appendChild(modifyBtn);

  writerInput.disabled = true;

  //리뷰 수정
  modifyBtn.addEventListener("click", () => {
    let star = reviewStar.querySelectorAll("p i.fa-solid").length;
    let pw = pwInput.value;
    let reviewTxt = reviewTxtArea.value;
    let policyChecked = policyChkbox.checked;

    if (!pw) {
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

    deleteReview(idx, pw);
    addReview(star, review.writer, pw, review.photo, reviewTxt, review.date, review.id);

    alert("수정이 완료되었습니다.");
    clearReviewWrite();    
  });

  //수정 취소
  cancelBtn.addEventListener("click", () => {
    clearReviewWrite();
  });
  
  reviewTxtArea.focus();
  return 0;
}

//리뷰 입력란 초기화
export function clearReviewWrite() {
  //입력창 초기화
  const writeContainer = document.querySelector(".product-review-section .review-write-container");
  const reviewStar = writeContainer.querySelector(".star-dropdown");
  const reviewStarItems = reviewStar.querySelectorAll(".dropdown-menu li");
  const writerInput = writeContainer.querySelector("#review-writer");
  const pwInput = writeContainer.querySelector("#review-pw");
  const reviewTxtArea = writeContainer.querySelector(".review-txt");
  const policyChkbox = writeContainer.querySelector("#chk-review-policy");
  
  writerInput.disabled = false;

  writerInput.value = "";
  pwInput.value = "";
  reviewTxtArea.value = "";
  policyChkbox.checked = false;
  reviewStar.querySelector("p").innerHTML = reviewStarItems[0].innerHTML;

  //버튼 초기화
  const reviewWriteBtnBox = reviewSection.querySelector(".review-write-container .review-write-btn-box");
  const writeBtns = reviewWriteBtnBox.querySelectorAll(".review-write-btn");
  
  // const modifyBtn = reviewWriteBtnBox.querySelector(".modify-ok-btn");
  // if (modifyBtn) {
  //   alert("수정이 취소되었습니다.");
  // }

  const loginBtn = document.createElement("a");
  loginBtn.setAttribute("href", "../login/login.html");
  loginBtn.setAttribute("class", "review-login-btn review-write-btn");
  loginBtn.textContent = "로그인";

  const registerBtn = document.createElement("a");
  registerBtn.setAttribute("href", "#!");
  registerBtn.setAttribute("class", "review-register-btn review-write-btn");
  registerBtn.textContent = "리뷰 등록";

  writeBtns.forEach(btn => btn.remove());
  reviewWriteBtnBox.appendChild(loginBtn);
  reviewWriteBtnBox.appendChild(registerBtn);
}

//review 객체로 화면에 나타낼 element를 생성
function createReviewEl(review) {
  const reviewEl = document.createElement("li");
  reviewEl.setAttribute("class", "review");

  ////review-top
  const reviewTop = document.createElement("div");
  reviewTop.setAttribute("class", "review-top");

  //review-star
  const reviewStar = document.createElement("p");
  reviewStar.setAttribute("class", "review-star");

  for (let i=0; i<5; i++) {
    const starIcon = document.createElement("i");

    if (i < review.star) {
      starIcon.setAttribute("class", "fa-solid fa-star");
    }
    else {
      starIcon.setAttribute("class", "fa-regular fa-star");
    }

    reviewStar.appendChild(starIcon);
  }

  reviewTop.appendChild(reviewStar);

  //review-option
  const reviewOption = document.createElement("p");
  reviewOption.setAttribute("class", "review-option");
  reviewOption.textContent = review.option;

  reviewTop.appendChild(reviewOption);

  reviewEl.appendChild(reviewTop);

  ////review-txt
  const reviewTxt = document.createElement("p");
  reviewTxt.setAttribute("class", "review-txt");
  reviewTxt.innerHTML = review.text.replaceAll("\n", "<br/>");

  reviewEl.appendChild(reviewTxt);

  ////review-photo
  if (review.photo) {
    const photoUl = document.createElement("ul");
    photoUl.setAttribute("class", "review-photo");
  
    review.photo.forEach(src => {
      const photoLi = document.createElement("li");

      const photoImg = document.createElement("img");
      photoImg.setAttribute("src", "./images/review/"+src);
      photoImg.setAttribute("alt", `리뷰${review.id} 사진`);

      photoLi.appendChild(photoImg);
      photoUl.appendChild(photoLi);
    });

    reviewEl.appendChild(photoUl);
  }

  ////review-bottom
  const reviewBottom = document.createElement("div");
  reviewBottom.setAttribute("class", "review-bottom");

  //writer-info
  const writerInfo = document.createElement("p");
  writerInfo.setAttribute("class", "writer-info");

  const divideLine = document.createTextNode(" | ");
  const dateSpan = document.createElement("span");
  const writerSpan = document.createElement("span");
  dateSpan.textContent = review.date;
  writerSpan.textContent = review.writer.slice(0, -2) + "**";

  writerInfo.appendChild(dateSpan);
  writerInfo.appendChild(divideLine);
  writerInfo.appendChild(writerSpan);

  reviewBottom.appendChild(writerInfo);

  //review-control-box
  const reviewControlBox = document.createElement("div");
  reviewControlBox.setAttribute("class", "review-control-box");

  const modifyBtn = document.createElement("a");
  modifyBtn.setAttribute("href" , "#!");
  modifyBtn.setAttribute("class", "review-modify-btn review-control-btn");
  modifyBtn.textContent = "수정";

  const deleteBtn = document.createElement("a");
  deleteBtn.setAttribute("href" , "#!");
  deleteBtn.setAttribute("class", "review-delete-btn review-control-btn");
  deleteBtn.textContent = "삭제";

  reviewControlBox.appendChild(modifyBtn);
  reviewControlBox.appendChild(deleteBtn);

  reviewBottom.appendChild(reviewControlBox);

  reviewEl.appendChild(reviewBottom);

  return reviewEl;
}

//문의 페이지 변경
export function changeQnaPage(page = curQnaPage) {
  //페이지 초기화
  const qnaEls = qnaSection.querySelectorAll(".qna-list .qna");
  qnaEls.forEach(qnaEl => qnaEl.remove());
  
  const pageLis = qnaSection.querySelectorAll(".pagination .page li");
  const pageArrows = qnaSection.querySelectorAll(".pagination .page-arrow");
  pageLis.forEach(pageLi => pageLi.remove());
  pageArrows.forEach(arrow => arrow.style.display = "none");

  //화면에 표시
  if (qnas.length > 0) {
    displayQna(page);
    displayPagination(qnaSection, qnaGroup.length, page);
  }

  curQnaPage = page;
}

//페이지에 문의 표시
function displayQna(page) {
  const qnaUl = qnaSection.querySelector(".qna-list");

  qnaGroup[page-1].forEach((qna, idx) => {
    const qnaEl = createQnaEl(qna);
    const qnaInfo = qnaEl.querySelector(".qna-info");
    qnaInfo.addEventListener("click", () => toggleQnaContent(qnaEl, qna));

    qnaUl.appendChild(qnaEl);
    addQnaEvent(qnaEl, idx);
  });
}

//문의 내용을 여닫음
function toggleQnaContent(qnaEl, qna) {
  const qnaSecret = qnaEl.querySelector(".qna-secret");
  const qnaContent = qnaEl.querySelector(".qna-content");
  
  let lock = qnaSecret.children.length > 0;

  if (lock) {
    const pwBg = document.querySelector(".modal-pw-bg");

    const modalPwEl = createModalPwEl();
    pwBg.appendChild(modalPwEl);
    pwBg.style.display = "flex";

    const closeBtn = modalPwEl.querySelector(".pw-ok-btn");
    const pwInput = modalPwEl.querySelector("input[type='password']");
    
    pwInput.focus();

    closeBtn.addEventListener("click", () => {
      if (pwInput.value !== qna.pw) {
        alert("비밀번호가 일치하지 않습니다.");
        pwInput.select();
      }
      else {
        const qnaTitle = qnaEl.querySelector(".qna-title");

        qnaSecret.children[0].remove();
        qnaTitle.textContent = qna.title;
        
        pwBg.removeChild(modalPwEl);
        pwBg.style.display = "none";

        qnaContent.style.height = qnaContent.scrollHeight + "px";
      }
    });
  }
  else {
    let isOpen = qnaContent.clientHeight > 0;

    if (isOpen) { //열린 상태
      qnaContent.style.height = "0";
    }
    else {
      qnaContent.style.height = qnaContent.scrollHeight + "px";
    }
  }
}

//수정, 삭제 버튼 이벤트
function addQnaEvent(qnaEl, idx) {
  const deleteBtn = qnaEl.querySelector(".qna-control-box .qna-delete-btn");
  const modifyBtn = qnaEl.querySelector(".qna-control-box .qna-modify-btn");

  //삭제 버튼
  deleteBtn.addEventListener("click", (e) => {
    const pwBg = document.querySelector(".modal-pw-bg");

    const modalPwEl = createModalPwEl();
    pwBg.appendChild(modalPwEl);
    pwBg.style.display = "flex";

    const okBtn = modalPwEl.querySelector(".pw-ok-btn");
    const pwInput = modalPwEl.querySelector("input[type='password']");
    
    pwInput.focus();

    okBtn.addEventListener("click", () => {
      let result = deleteQna(idx, pwInput.value);
      if (result < 0) {
        alert("비밀번호가 일치하지 않습니다.");
        pwInput.select();
      }
      else {
        alert("문의가 삭제되었습니다.");
        pwBg.removeChild(modalPwEl);
        pwBg.style.display = "none";
      }
    });
  });

  //수정 버튼
  modifyBtn.addEventListener("click", () => {
    const pwBg = document.querySelector(".modal-pw-bg");

    const modalPwEl = createModalPwEl();
    pwBg.appendChild(modalPwEl);
    pwBg.style.display = "flex";

    const okBtn = modalPwEl.querySelector(".pw-ok-btn");
    const pwInput = modalPwEl.querySelector("input[type='password']");
    
    pwInput.focus();

    okBtn.addEventListener("click", () => {
      let result = modifyQna(idx, pwInput.value);
      if (result < 0) {
        alert("비밀번호가 일치하지 않습니다.");
        pwInput.select();
      }
      else {
        pwBg.removeChild(modalPwEl);
        pwBg.style.display = "none";
      }
    });
  });
}

//문의 재정렬, 개수 업데이트
function updateQna() {
  //최신순으로 정렬
  qnas.sort((q1, q2) => {
    if (q1.date > q2.date)
      return -1;
    else if (q1.date < q2.date)
      return 1;
    else
      return q2.id - q1.id;
  });

  //페이지별 분류
  qnaGroup = [];
  let idx = 0;
  while (idx < qnas.length) {
    qnaGroup.push(qnas.slice(idx, idx+10));
    idx += 10;
  }

  //문의 개수 업데이트
  const QnaCountSpan = document.querySelector(".detail-bar .product-qna-tab .count");
  QnaCountSpan.textContent = qnas.length;
}

//문의 추가 후 1페이지로
export function addQna(writer, pw, title, files, text, isSecret, date, id) {
  let maxId = Math.max(...qnas.map(qna => qna.id));

  const qna = {
    id: id ? id : maxId + 1,
    title: title,
    question: text,
    answer: null,
    file: files,
    isSecret: isSecret,
    date: date ? date : new Date().toISOString().slice(0, 10),
    userId: order.buyer.userId ? order.buyer.userId : null,
    writer: writer,
    pw: pw
  };

  qnas.push(qna);

  updateQna();
  changeQnaPage(1);
}

//문의 삭제 후 1페이지로
function deleteQna(idx, pw) {
  const qna = qnaGroup[curQnaPage-1][idx];

  if (qna.pw !== pw) {
    return -1;
  }

  let qnaIdx = qnas.findIndex(q => q.id === qna.id);
  qnas.splice(qnaIdx, 1);

  updateQna();
  changeQnaPage(1);

  return 0;
}

//문의 수정
function modifyQna(idx, pw) {
  const qnaBg = document.querySelector(".modal-qna-bg");
  const qna = qnaGroup[curQnaPage-1][idx];

  if (qna.pw !== pw) {
    return -1;
  }
  
  qnaBg.style.display = "flex";
  
  //문의 내용 복사
  const writeContainer = document.querySelector(".modal-qna .qna-write-container");
  const writerInput = writeContainer.querySelector("#qna-writer");
  const pwInput = writeContainer.querySelector("#qna-pw");
  const titleInput = writeContainer.querySelector("#qna-title");
  const qnaTxtArea = writeContainer.querySelector(".qna-txt textarea");
  const secretChkbox = writeContainer.querySelector("#chk-qna-secret");
  const policyChkbox = writeContainer.querySelector("#chk-qna-policy");

  writerInput.value = qna.writer;
  pwInput.value = qna.pw;
  titleInput.value = qna.title;
  qnaTxtArea.value = qna.question;
  secretChkbox.checked = qna.isSecret
  policyChkbox.checked = true;

  //등록 버튼 변경
  const registerBtnBox = writeContainer.querySelector(".qna-write-btn-box");
  const registerBtn = registerBtnBox.querySelector(".qna-register-btn");

  const modifyBtn = document.createElement("a");
  modifyBtn.setAttribute("href", "#!");
  modifyBtn.setAttribute("class", "modify-ok-btn qna-write-btn");
  modifyBtn.textContent = "문의 수정";

  const cancelBtn = document.createElement("a");
  cancelBtn.setAttribute("href", "#!");
  cancelBtn.setAttribute("class", "modify-cancel-btn qna-write-btn");
  cancelBtn.textContent = "취소";

  registerBtnBox.removeChild(registerBtn);
  registerBtnBox.appendChild(cancelBtn);
  registerBtnBox.appendChild(modifyBtn);

  writerInput.disabled = true;

  //리뷰 수정
  modifyBtn.addEventListener("click", () => {
    let pw = pwInput.value;
    let title = titleInput.value;
    let qnaTxt = qnaTxtArea.value;
    let isSecret = secretChkbox.checked;
    let policyChecked = policyChkbox.checked;

    if (!pw) {
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
      reviewTxtArea.focus();
      return;
    }

    deleteQna(idx, pw);
    addQna(qna.writer, pw, title, qna.file, qnaTxt, isSecret, qna.date, qna.id);

    alert("수정이 완료되었습니다.");
    clearQnaWrite();
    qnaBg.style.display = "none";
  });

  //수정 취소
  cancelBtn.addEventListener("click", () => {
    clearQnaWrite();
    qnaBg.style.display = "none";
  });

  return 0;
}

//문의 작성란 초기화
export function clearQnaWrite() {
  //입력창 초기화
  const writeContainer = document.querySelector(".modal-qna .qna-write-container");
  const writerInput = writeContainer.querySelector("#qna-writer");
  const pwInput = writeContainer.querySelector("#qna-pw");
  const titleInput = writeContainer.querySelector("#qna-title");
  const qnaTxtArea = writeContainer.querySelector(".qna-txt textarea");
  const secretChkbox = writeContainer.querySelector("#chk-qna-secret");
  const policyChkbox = writeContainer.querySelector("#chk-qna-policy");

  writerInput.disabled = false;

  writerInput.value = "";
  pwInput.value = "";
  titleInput.value = "";
  qnaTxtArea.value = "";
  policyChkbox.checked = false;
  secretChkbox.checked = false;

  //버튼 초기화
  const writeBtnBox = writeContainer.querySelector(".qna-write-btn-box");
  const writeBtns = writeBtnBox.querySelectorAll(".qna-write-btn");

  // const modifyBtn = writeBtnBox.querySelector(".modify-ok-btn");
  // if (modifyBtn) {
  //   alert("수정이 취소되었습니다.");
  // }

  const registerBtn = document.createElement("a");
  registerBtn.setAttribute("href", "#!");
  registerBtn.setAttribute("class", "qna-register-btn qna-write-btn");
  registerBtn.textContent = "등록하기";

  writeBtns.forEach(btn => btn.remove());
  writeBtnBox.appendChild(registerBtn);
}

//qna 객체로 화면에 나타낼 element를 생성
function createQnaEl(qna) {
  const qnaEl = document.createElement("li");
  qnaEl.setAttribute("class", "qna");
  
  ////qna-info
  const qnaInfoEl = document.createElement("div");
  qnaInfoEl.setAttribute("class", "qna-info");

  const qnaNum = document.createElement("p");
  qnaNum.setAttribute("class", "qna-num");
  qnaNum.textContent = qnas.length - qnas.findIndex(q => q.id === qna.id);

  const qnaSecret = document.createElement("p");
  qnaSecret.setAttribute("class", "qna-secret");
  if (qna.isSecret) {
    const secretIcon = document.createElement("i");
    secretIcon.setAttribute("class", "fa-solid fa-lock");
    qnaSecret.appendChild(secretIcon);
  }

  const qnaTitle = document.createElement("p");
  qnaTitle.setAttribute("class", "qna-title");
  if (qna.isSecret) {
    qnaTitle.textContent = "비밀 문의 입니다.";
  }
  else {
    qnaTitle.textContent = qna.title;
  }

  const qnaWriter = document.createElement("p");
  qnaWriter.setAttribute("class", "qna-writer");
  qnaWriter.textContent = qna.writer.slice(0, -2) + "**";;

  const qnaDate = document.createElement("p");
  qnaDate.setAttribute("class", "qna-date");
  qnaDate.textContent = qna.date;

  const qnaAnswer = document.createElement("p");
  qnaAnswer.setAttribute("class", "qna-answer");
  if (qna.answer) {
    qnaAnswer.textContent = "답변 완료";
  }
  else {
    qnaAnswer.textContent = "미답변";
  }

  qnaInfoEl.appendChild(qnaNum);
  qnaInfoEl.appendChild(qnaSecret);
  qnaInfoEl.appendChild(qnaTitle);
  qnaInfoEl.appendChild(qnaWriter);
  qnaInfoEl.appendChild(qnaDate);
  qnaInfoEl.appendChild(qnaAnswer);

  qnaEl.appendChild(qnaInfoEl);

  /////qna-content
  const qnaContent = document.createElement("div");
  qnaContent.setAttribute("class", "qna-content");

  //qna-txt
  const qnaTxtEl = document.createElement("div");
  qnaTxtEl.setAttribute("class", "qna-txt");

  //q
  const qIcon = document.createElement("i");
  qIcon.setAttribute("class", "fa-solid fa-q");

  const qTxt = document.createElement("p");
  qTxt.setAttribute("class", "qna-q");
  qTxt.innerHTML = qna.question.replaceAll("\n", "<br/>");

  qnaTxtEl.appendChild(qIcon);
  qnaTxtEl.appendChild(qTxt);

  //a
  if (qna.answer) {
    const aIcon = document.createElement("i");
    aIcon.setAttribute("class", "fa-solid fa-a");

    const aTxt = document.createElement("p");
    aTxt.setAttribute("class", "qna-a");
    aTxt.innerHTML = qna.answer.replaceAll("\n", "<br/>");

    qnaTxtEl.appendChild(aIcon);
    qnaTxtEl.appendChild(aTxt);
  }

  qnaContent.appendChild(qnaTxtEl);

  //qna-control-box
  const qnaControlBox = document.createElement("div");
  qnaControlBox.setAttribute("class", "qna-control-box");

  const modifyBtn = document.createElement("a");
  modifyBtn.setAttribute("href" , "#!");
  modifyBtn.setAttribute("class", "qna-modify-btn qna-control-btn");
  modifyBtn.textContent = "수정";

  const deleteBtn = document.createElement("a");
  deleteBtn.setAttribute("href" , "#!");
  deleteBtn.setAttribute("class", "qna-delete-btn qna-control-btn");
  deleteBtn.textContent = "삭제";

  qnaControlBox.appendChild(modifyBtn);
  qnaControlBox.appendChild(deleteBtn);
  
  qnaContent.appendChild(qnaControlBox);
  qnaEl.appendChild(qnaContent);

  return qnaEl;
}

//비밀번호를 입력하는 모달창의 element를 생성
function createModalPwEl() {
  const pwEl = document.createElement("div");
  pwEl.setAttribute("class", "modal-pw");

  const title = document.createElement("p");
  title.setAttribute("class", "modal-title");
  title.textContent = "비밀번호";

  const closeIcon = document.createElement("i");
  closeIcon.setAttribute("class", "fa-solid fa-xmark modal-close-btn");

  const pwInput = document.createElement("input");
  pwInput.setAttribute("type", "password");

  const okBtn = document.createElement("div");
  okBtn.setAttribute("class", "pw-ok-btn");
  okBtn.textContent = "확인";

  pwEl.appendChild(title);
  pwEl.appendChild(closeIcon);
  pwEl.appendChild(pwInput);
  pwEl.appendChild(okBtn);

  return pwEl;
}