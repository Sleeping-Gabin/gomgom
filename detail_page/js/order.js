const productId = "bd10036";
const product = await getProductData();
const optionPrices = await getOptPriceData();

const orders = [];

async function getProductData() {
  const response = await fetch("../data/products.json");
  const allProducts = await response.json();

  return allProducts.find(product => product.id === productId);
}

async function getOptPriceData() {
  const response = await fetch("../data/option_price.json");
  const allOptionPrices = await response.json();

  return allOptionPrices.filter(optPrice => optPrice.productId === productId);
}

//Order 객체 생성자 함수
function Order(select) {
  this.id = select.join("");
  this.select = select;
  this.orderEl = null;
  this.addPrice = calcAddPrice(select);
  this.price = product.price.price + this.addPrice;
  this.num = 1;

  this.allPrice = () => this.price * this.num;

  this.plus = () => {
    this.num += 1;
    this.updatePrice();
  }

  this.minus = () => {
    this.num = Math.max(1, this.num - 1);
    this.updatePrice();
  }

  this.changeNum = (num) => {
    this.num = num;
    this.updatePrice();
  }

  this.updatePrice = () => {
    const orderNumInput = this.orderEl.querySelector(".order-num");
    const orderPrice = this.orderEl.querySelector(".order-price");

    orderNumInput.value = this.num;
    orderPrice.textContent = makePriceStr(this.allPrice());
  }
}

//선택한 옵션에 따라 주문 추가
//select: 선택한 옵션의 인덱스 배열
export function addOrder(select) {
  const orderUl = document.querySelector(".purchase-detail-container .product-order");

  //Order 객체와 element 생성
  const order = new Order(select);
  const orderEl = createOrderEl(order);
  order.orderEl = orderEl;

  let sameOrder = orders.find(o => o.id === order.id);
  if (sameOrder) { //이전과 동일한 주문일 시 개수 증가
    sameOrder.plus();
    updateTotalPrice();
  }
  else {
    orderUl.appendChild(orderEl);
    orders.push(order);
  }

  //이벤트 추가
  addOrderEvent(order);
  updateTotalPrice();
}

//orderEl 이벤트 추가
function addOrderEvent(order) {
  const orderUl = document.querySelector(".purchase-detail-container .product-order");
  const  orderEl = order.orderEl

  //삭제
  const deleteBtn = orderEl.querySelector(".order-delete-btn");

  deleteBtn.addEventListener("click", () => {
    orderUl.removeChild(orderEl);
    orders.splice(orders.indexOf(order), 1);
    updateTotalPrice();
  });
  
  //order-num 이벤트
  const orderNumInput = orderEl.querySelector(".order-num");
  const plusIcon = orderEl.querySelector(".order-num-control .fa-plus");
  const minusIcon = orderEl.querySelector(".order-num-control .fa-minus");

  limitInputNum(orderNumInput);
  orderNumInput.addEventListener("change", () => {
    if (!orderNumInput.value || orderNumInput.value < 1)
      orderNumInput.value = 1;

    order.changeNum(parseInt(orderNumInput.value));
    updateTotalPrice();
  });

  plusIcon.addEventListener("click", () => {
    order.plus();
    updateTotalPrice();
  });

  minusIcon.addEventListener("click", () => {
    order.minus();
    updateTotalPrice();
  });
}

//order 객체로 element를 만듦
//order: Order 객체
//return: 만들어진 element
function createOrderEl(order) {
  const orderEl = document.createElement("li");
  
  //order-info
  const orderInfo = document.createElement("p");
  orderInfo.setAttribute("class", "order-info");
  orderInfo.textContent = product.option.map((opt, idx) => opt.option[order.select[idx]]).join("/");

  if (order.addPrice > 0) {
    const addPriceSpan = document.createElement("span");
    addPriceSpan.setAttribute("class", "add-price");
    addPriceSpan.textContent = `(+${makePriceStr(order.addPrice)})`;

    orderInfo.appendChild(addPriceSpan);
  }

  orderEl.appendChild(orderInfo);

  //order-num
  const orderNumInput = document.createElement("input");
  orderNumInput.setAttribute("type", "text");
  orderNumInput.setAttribute("value", "1");
  orderNumInput.setAttribute("class", "order-num");

  const orderNumControl = document.createElement("div");
  orderNumControl.setAttribute("class", "order-num-control");

  const plusIcon = document.createElement("i");
  const minusIcon = document.createElement("i");

  plusIcon.setAttribute("class", "fa-solid fa-plus");
  minusIcon.setAttribute("class", "fa-solid fa-minus");

  orderNumControl.appendChild(plusIcon);
  orderNumControl.appendChild(minusIcon);

  orderEl.appendChild(orderNumInput);
  orderEl.appendChild(orderNumControl);

  //order-price
  const orderPrice = document.createElement("p");
  orderPrice.setAttribute("class", "order-price");
  orderPrice.textContent = makePriceStr(order.price);

  orderEl.appendChild(orderPrice);

  //delete-btn
  const deleteBtn = document.createElement("div");
  deleteBtn.setAttribute("class", "order-delete-btn");

  const deleteIcon = document.createElement("i");
  deleteIcon.setAttribute("class", "fa-solid fa-xmark");

  deleteBtn.appendChild(deleteIcon);

  orderEl.appendChild(deleteBtn);

  return orderEl;
}

//총 상품 금액 변경
function updateTotalPrice() {
  const totalPriceEl = document.querySelector(".purchase-detail-container .product-price .total-price");

  let totalPrice = orders.reduce((prev, cur) =>
    prev += cur.price * cur.num
  , 0);

  totalPriceEl.textContent = makePriceStr(totalPrice);
}

//선택한 옵션에 해당하는 추가 금액 계산
//select: 선택한 옵션의 인덱스 배열
//return: 추가 금액
export function calcAddPrice(select) {
  let addPrice = 0;

  optionPrices.forEach(optPrice => {
    let fulfill = optPrice.condition.every(cond =>
      cond.optionIdx.includes(select[cond.idx])
    );
  
    if (fulfill) {
      addPrice += optPrice.addPrice;
    }
  });

  return addPrice;
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

//input에 숫자 입력만 허용
function limitInputNum(input) {
  input.addEventListener("keydown", () => {
    input.value = input.value.replaceAll(/\D/g, "");
  });

  input.addEventListener("keyup", () => {
    input.value = input.value.replaceAll(/\D/g, "");
  });
}