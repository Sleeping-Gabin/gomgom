const response = await fetch("../data/products.json");
const allProducts = await response.json();

let products = new Array(...allProducts);
let productsGroup = [];
let sortingIdx = 0;
let curPage = 1;

init();

function init() {
  sorting();
  changePage(1);
}

//product 객체로 화면에 나타낼 element를 만듦
function createProductEl(product) {
  const productEl = document.createElement("div");
  productEl.setAttribute("class", "product");

  ////product-img
  const productImgEl = document.createElement("div");
  productImgEl.setAttribute("class", "product-img");

  const productImg = document.createElement("img");
  let baseUrl = "images/"
  productImg.setAttribute("src", baseUrl+product.img);
  productImg.setAttribute("alt", "상품"+product.id);

  productImgEl.appendChild(productImg);

  //product-icon
  const productIconUl = document.createElement("ul");
  productIconUl.setAttribute("class", "product-icon");

  const iconList = ["관심", "옵션", "장바구니"];
  for (let i=0; i<3; i++) {
    const iconLi = document.createElement("li");

    const iconImgEl = document.createElement("div");
    iconImgEl.setAttribute("class", "product-icon-img");

    const iconTitle = document.createElement("p");
    iconTitle.setAttribute("class", "product-icon-title");
    iconTitle.textContent = iconList[i];

    iconLi.appendChild(iconImgEl);
    iconLi.appendChild(iconTitle);

    productIconUl.appendChild(iconLi);
  }
  productImgEl.appendChild(productIconUl);

  //product-option
  const productOptionEl = document.createElement("div");
  productOptionEl.setAttribute("class", "product-option");

  product.option.forEach(option => {
    let optionTxt = option.option.reduce((prev, cur) => prev + "/" + cur);

    const productOptionTxt = document.createElement("p");
    productOptionTxt.setAttribute("class", "product-option-txt");
    productOptionTxt.textContent = option.name + ": " + optionTxt;

    productOptionEl.appendChild(productOptionTxt);
  });
  
  productImgEl.appendChild(productOptionEl);

  productEl.appendChild(productImgEl);

  ////product-txt
  const productTxtEl = document.createElement("div");
  productTxtEl.setAttribute("class", "product-txt");

  //product-color
  if (product.color) {
    const productColorUl = document.createElement("ul");
    productColorUl.setAttribute("class", "product-color");

    product.color.forEach(color => {
      const colorLi = document.createElement("li");
      colorLi.setAttribute("class", color);

      productColorUl.appendChild(colorLi);
    });

    productTxtEl.appendChild(productColorUl);
  }

  //product-title
  const productTitle = document.createElement("p");
  productTitle.setAttribute("class", "product-title");
  productTitle.textContent = product.title;

  productTxtEl.appendChild(productTitle);

  //product-price
  let origin = product.price.origin;
  let price = product.price.price;

  const productPrice = document.createElement("p");
  productPrice.setAttribute("class", "product-price");
  productPrice.textContent = makePriceStr(price);

  if (origin !== price) {
    const productOriginPrice = document.createElement("p");
    productOriginPrice.setAttribute("class", "product-origin-price");
    productOriginPrice.textContent = makePriceStr(origin);

    let sale = Math.round((1 - price/origin) * 100);
    const productSale = document.createElement("span");
    productSale.setAttribute("class", "product-sale");
    productSale.textContent = sale + "%";

    productPrice.insertBefore(productSale, productPrice.childNodes[0]);

    productTxtEl.appendChild(productOriginPrice);
  }
  
  productTxtEl.appendChild(productPrice);

  productEl.appendChild(productTxtEl);

  return productEl;
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

//products 정렬 및 페이지별 분류
//methodIdx: 정렬 방법 드롭 다운에서 선택된 인덱스
export function sorting(methodIdx = sortingIdx) {
  switch(methodIdx) {
    case(0): //최신순
      products.sort((p1, p2) => {
        if (p1.regDate > p2.regDate)
          return -1;
        else if (p1.regDate < p2.regDate)
          return 1;
        else
          return p1.id - p2.id;
      });
      break;

    case(1): //인기순
      products.sort((p1, p2) => {
        if (p1.purchase == p2.purchase)
          return p1.id - p2.id;
        else
          return p2.purchase - p1.purchase;
        });
      break;

    case(2): //낮은 가격순 
      products.sort((p1, p2) => {
        if (p1.price.price == p2.price.price)
          return p1.id - p2.id;
        else
          return p1.price.price - p2.price.price;
      });
      break;

    case(3): //높은 가격순
      products.sort((p1, p2) => {
        if (p1.price.price == p2.price.price)
          return p1.id - p2.id;
        else
          return p2.price.price - p1.price.price;
      });
      break;
  }

  sortingIdx = methodIdx;
  
  productsGroup = [];
  let idx = 0;
  while (idx < products.length) {
    productsGroup.push(products.slice(idx, idx+16));
    idx += 16;
  }
}

//페이지 변경
export function changePage(page = curPage) {
  //페이지 초기화
  const productEls = document.querySelectorAll(".product-section .product");
  productEls.forEach(productEl => productEl.remove());

  const pageLis = document.querySelectorAll(".pagination .page li");
  const pageArrows = document.querySelectorAll(".pagination .page-arrow");
  pageLis.forEach(pageLi => pageLi.remove());
  pageArrows.forEach(arrow => arrow.style.display = "none");

  //상품 개수 업데이트
  const itemCount = document.querySelector(".page-info .item-count");
  itemCount.textContent = products.length + "개의 상품";

  //화면에 표시
  if (products.length > 0) {
    displayProduts(page);
    displayPagination(page);
  }
}

//현재 페이지의 상품 화면에 표시
function displayProduts(page = curPage) {
  const productSection = document.querySelector(".product-section");

  productsGroup[page-1].forEach(product => {
    let productEl = createProductEl(product);
    addProductEvent(productEl);

    productSection.appendChild(productEl);
  });
}

//상품 이벤트 추가
function addProductEvent(productEl) {
  productEl = $(productEl);
  const productIcons = productEl.find(".product-icon li");

  //상품 클릭 시 상세페이지로
  productEl.on("click", function() {
    window.open("../detail_page/detail_page.html", "_blank").focus();
  });

  //관심 아이콘 클릭 시 이동하지 않음
  productIcons.eq(0).on("click", function() {
    return false;
  });

  //옵션 아이콘 클릭 시 옵션 표시
  productIcons.eq(1).on("click", function() {
    $(this).parent().siblings(".product-option").toggle();
    return false;
  });

  //상품에서 마우스가 나가면 옵션 비표시
  productEl.on("mouseleave blur", function() {
    $(this).find(".product-option").hide();
  });
  
  //장바구니 아이콘 클릭 시 장바구니 모달창 표시
  productIcons.eq(2).on("click", function() {
    $(".modal-cart-bg").css("display", "flex");
    return false;
  });
}

//페이지네이션 화면에 표시
function displayPagination(page = curPage) {
  const pagination = document.querySelector(".pagination");
  const pageUl = pagination.querySelector(".page");
  const firstPageArrow = pagination.querySelector(".first-page-arrow");
  const lastPageArrow = pagination.querySelector(".last-page-arrow");
  const prevPageArrow = pagination.querySelector(".prev-page-arrow");
  const nextPageArrow = pagination.querySelector(".next-page-arrow");

  let pageCnt = productsGroup.length

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
    pageEl.addEventListener("click", () => {
      changePage(idx);
      window.scrollTo(0, 0);
    });
  }
}

//가격으로 필터링
export function filteringByPrice(minPrice, maxPrice) {
  products = allProducts.filter(product => {
    let min = minPrice ? product.price.price >= minPrice : true;
    let max = maxPrice ? product.price.price <= maxPrice : true;
    return min && max;
  });

  sorting();
}