## 소개
가구 쇼핑몰 사이트 제작 프로젝트  
pc / mobile 두 버전의 적응형 웹으로 제작  
<br>

### 배포 주소
[PC 버전 (http://sunggabin.dothome.co.kr/)](http://sunggabin.dothome.co.kr/)  
[모바일 버전](https://sleeping-gabin.github.io/gomgom-mobile/)  
<br>

### 사용 기술
![html](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![css](https://img.shields.io/badge/CSS3-663399?style=for-the-badge&logo=css&logoColor=white)
![js](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white)
![jquery](https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white)  
<br>

### 프로젝트 진행
- 2025.03.31 ~ 2025.04.23 : 기획
- 2025.05.07 ~ 2025.05.21 : pc 사이트 개발
- 2025.07.02 ~ 2025.07.11 : 로그인/회원가입 시스템 추가  
- 2025.07.08 ~ 2025.07.15 : 데이터바인딩

<br><br>

## 페이지
|메인 페이지 |서브 페이지 |상세 페이지 |
|:---:|:---:|:---:|
|![메인](https://github.com/user-attachments/assets/83dd7f7f-78ab-425d-922c-216791bbfe4b)|![서브](https://github.com/user-attachments/assets/6a5faeee-f307-4f30-8955-888517ff44df)|![상세](https://github.com/user-attachments/assets/9381d6c6-5402-4ac1-bf7c-c51b95ac2270)|
|로그인 |회원가입 |아아디/비밀번호 찾기|
![로그인](https://github.com/user-attachments/assets/8aa88fd0-6f38-41b7-ad00-614adc639e68)|![회원가입](https://github.com/user-attachments/assets/a2a5b451-a652-4c5e-bc4e-f7c8a78388f1)|![비밀번호 찾기](https://github.com/user-attachments/assets/d06c8c5d-65a0-4678-9cff-d1c3eaddb8a9)|

<br><br>

## 기능
### 상품 목록 필터링
change 이벤트가 발생하면 입력한 최소/최대 가격 사이의 상품만 필터링한다.  

<details>
<summary>코드 보기</summary>  

```js
// sub_page/js/product.js

export function filteringByPrice(minPrice, maxPrice) {
  products = allProducts.filter(product => {
    let min = minPrice ? product.price.price >= minPrice : true;
    let max = maxPrice ? product.price.price <= maxPrice : true;
    return min && max;
  });

  sorting();
}
```
</details>

![필터링](https://github.com/user-attachments/assets/8ce57aa2-d1ac-4e79-a256-1d4e28a2ed1a)  
<br>

### 상품 목록 정렬
드롭다운 목록에서 선택한 정렬 방법에 따라 상품 목록을 정렬한다.  
비교 대상이 같은 경우 id순으로 정렬되게 하였다.  

<details>
<summary>코드 보기</summary>

```js
// sub_page/js/product.js

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
  // ...
}
```
</details>

![정렬](https://github.com/user-attachments/assets/2398cf1b-bb12-4c12-9d1d-cb3a75b743b1)  
<br>

### 로그인 시스템
저장된 유저 정보와 일치하는 아이디, 비밀번호 입력 시 로그인이 가능하다.  
(로그인 정보는 다른 페이지에서 유지되지 않는다.)  
테스트용 유저 - (박영희) ID: zerohye / PW: 00dudgml00  

<details>
<summary>코드 보기</summary>

```js
// login/js/login.js

async function init() {
  const response = await fetch("../data/users.json");
  const users = await response.json();

  const idPwMap = new Map();
  const idNameMap = new Map();

  users.forEach(user => {
    idPwMap.set(user.id, user.pw);
    idNameMap.set(user.id, user.name);
  });

  login(idPwMap, idNameMap);
}

function login(idPwMap, idNameMap) {
  // ...
  
  loginBtn.addEventListener("click", () => {
    let id = idInput.value;
    let pw = pwInput.value;

    if (!idPwMap.has(id)) {
      alert("존재하지 않는 아이디입니다.");
      idInput.value = "";
      pwInput.value = "";
      return;
    }
    else if (pw !== idPwMap.get(id)) {
      alert("비밀번호가 일치하지 않습니다.");
      idInput.value = "";
      pwInput.value = "";
      return;
    }
    else {
      alert(`로그인에 성공했습니다.\n${idNameMap.get(id)}님 환영합니다.`);
      window.location.href = "../index.html";
    }
  });
}
```
</details>

<div>
  <img src="https://github.com/user-attachments/assets/8aa88fd0-6f38-41b7-ad00-614adc639e68" width="600px">    
</div>
<br>

### 회원가입 시스템
각 입력 항목의 조건을 만족하지 않으면 오류 메시지가 뜬다.  
휴대폰 번호와 생년월일/성별의 경우, 숫자 외의 입력을 제거하고 일정 자릿수 입력 시 자동으로 다음 칸으로 넘어간다.  
(실제로 회원 정보가 저장되진 않는다.)  

<details>
<summary>코드 보기</summary>

```js
// join/js/join.js

function checkPw() {
  // ...

  pwInput.addEventListener("change", () => {
    let userPW = pwInput.value;
    let errorMsg = "";

    if (userPW.length < 8) {
      errorMsg = "8글자 이상 입력해 주세요.";
    }
    else if (userPW.length > 16) {
      errorMsg = "16글자 이하로 입력해 주세요.";
    }
    else if (!/^[a-zA-Z0-9|~!@#$%^&*()_\-+=]+$/.test(userPW)) {
      errorMsg = "알파벳 대소문자, 숫자, 특수기호(~!@#$%^&*()_-+=)만 사용 가능합니다.";
    }
    else {
      let contain = 0;
      contain += /[a-zA-Z]+/.test(userPW);
      contain += /\d+/.test(userPW);
      contain += /[~!@#$%^&*()_\-+=]/.test(userPW);

      if (contain < 2) {
        errorMsg = "알파벳 대소문자, 숫자, 특수기호(~!@#$%^&*()_-+=) 중 2가지 이상이 포함되어야 합니다.";
      }
    }

    // ...
  });
}

function checkCall() {
  const calls = document.querySelectorAll(".join-form .call-item input");

  calls.forEach((call, idx) => {
    limitInputNum(call);

    call.addEventListener("keyup", () => {
      if ((call.value.length >= call.maxLength) && (idx < calls.length-1)) {
        calls[idx+1].focus();
      }
    });
  });
}

function limitInputNum(input) {
  input.addEventListener("keydown", () => {
    input.value = input.value.replaceAll(/\D/g, "");
  });

  input.addEventListener("keyup", () => {
    input.value = input.value.replaceAll(/\D/g, "");
  });
}
```  
</details>

<div>
  <img src="https://github.com/user-attachments/assets/a2a5b451-a652-4c5e-bc4e-f7c8a78388f1" width="600px">    
</div>
<br>

### 아이디 찾기 / 비밀번호 찾기
이메일 또는 전화번호로 아이디/비밀번호를 찾을 수 있다.  
테스트용 유저 - (박영희) 전화번호: 010 9876 0000 / 이메일: youngH @ naver.com  

<div>
  <img src="https://github.com/user-attachments/assets/49348e7f-bf62-407a-bf7a-a302d979f208" width="600px">    
</div>
<br>

### 후기/문의 작성
후기/문의를 입력하고 등록 버튼을 누르면 목록에 생성된다.  
필터링과 정렬을 할 수 있다.  

<details>
<summary>코드 보기</summary>

```js
// detail_page/js/write.js

const allReviews = await getReviews();

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

function displayReview(page) {
  const reviewUl = reviewSection.querySelector(".review-list-container .review-list");

  reviewGroup[page-1].forEach((review, idx) => {
    const reviewEl = createReviewEl(review);
    reviewUl.appendChild(reviewEl);
    addReviewBtn(reviewEl);
    addReviewEvent(reviewEl, idx);
  });
}

function createReviewEl(review) {
  const reviewEl = document.createElement("li");
  reviewEl.setAttribute("class", "review");

  const reviewTop = document.createElement("div");
  reviewTop.setAttribute("class", "review-top");

  const reviewStar = document.createElement("p");
  reviewStar.setAttribute("class", "review-star");

  // ...

  reviewEl.appendChild(reviewBottom);

  return reviewEl;
}
```
</details>

|![후기 작성](https://github.com/user-attachments/assets/d72580d8-f792-466d-a611-eb3204d65118)|![문의 작성](https://github.com/user-attachments/assets/7947b4c9-daa8-4d68-acd1-1737238a9d71)|
|:---:|:---:|

<br>

### 후기/문의 수정, 삭제
비밀번호를 입력하면 수정 또는 삭제가 가능하다.  
수정 시 후기/문의 내용이 입력란에 입력되고, 수정 후 버튼을 눌러 저장할 수 있다.  
(각 비밀번호는 등록 날짜 네자리 수로 설정되어 있다.)  

<details>
<summary>코드 보기</summary>

```js
// detail_page/js/write.js

function modifyReview(idx, pw) {
  const review = reviewGroup[curReviewPage-1][idx];

  if (review.pw !== pw) {
    return -1;
  }
  
  // ... 리뷰 내용 복사 + 버튼 변경

  modifyBtn.addEventListener("click", () => {
    // ... 입력 항목 검사

    deleteReview(idx, pw);
    addReview(star, review.writer, pw, review.photo, reviewTxt, review.date, review.id);

    alert("수정이 완료되었습니다.");
    clearReviewWrite();    
  });
  
  return 0;
}
```

```js
// detail_page/js/write.js

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
```
</details>

|![후기 수정](https://github.com/user-attachments/assets/ae977f96-20a3-4ec7-81ea-6f2a1eeb234b)|![후기 삭제](https://github.com/user-attachments/assets/49668ca0-654e-402d-94b3-38283eca19d7)|
|:-------------:|:--------------:|

<br><br>

## 데이터 구조
### 상품(product)
```js
{
  "id": String, //아이디
  "img": String, //이미지 파일명
  "category": String, //카테고리
  "title": String, //이름
  "price": {
    "origin": Number, //원가
    "price": Number //판매가
  },
  "color": String[]|null, //색상 종류
  "option": [ //옵션 종류
    {
      "id": Number, //아이디
      "name": String, //이름
      "option": String[] //선택 가능한 옵션 아이템
    }
  ],
  "regDate": String, //등록일 YYYY-MM-DD
  "view": Number, //본 횟수
  "purchase": Number //구매 횟수
}
```
<br>

### 유저(user)
```js
{
  "id": String, //아이디
  "pw": String, //비밀번호
  "name": String, //이름
  "call": String, //전화번호(숫자 7자리)
  "email": String, //이메일
  "address": { //주소
    "post": String, //우편번호(숫자 5자리)
    "base": String, //기본 주소
    "detail": String //상세 주소
  }|null,
  "birth": String|null, //생년월일 YYYY-MM-DD
  "gender": "M"|"F"|null //성별
}
```
<br>

### 문의(qna)
```js
{
  "id": Number, //아이디
  "title": String, //제목
  "question": String, //문의 내용
  "answer": String|null, //답변 내용
  "file": String[]|null, //첨부 파일명
  "isSecret": Boolean, //비밀 문의 여부
  "date": String, //등록 날짜 YYYY-MM-DD
  "userId": String|null, //로그인 유저 아이디
  "writer": String, //작성자 이름
  "pw": String //문의 비밀번호
}
```
<br>

### 후기(review)
```js
{
  "id": Number, //아이디
  "star": Number, //별점(0~5)
  "option": String, //구매한 옵션
  "photo": String[]|null, //첨부 사진
  "text": String, //리뷰 내용
  "date": String, //등록 날짜 YYYY-MM-DD
  "userId": String|null, //로그인 유저 아이디
  "writer": String, //작성자 이름
  "pw": String //문의 비밀번호
}
```

<br><br>

## 라이선스
### 상품
<details>
<summary>모든 이미지 및 정보는 포트폴리오 용으로만 사용되었습니다.</summary>

- [동서 가구](https://dongsuhfurniture.co.kr/)
  - 0001 동서가구 에밀레 1500 거실장
  - 0061 바오트 로이 강화 유리 거실테이블 원형 소파테이블 600/800
  - 0002 동서가구 유니스 800폭 멀티 수납행거 옷장
  - 0015 동서가구 심플 원목 수납장 다용도 400 4단서랍장
  - 0021 동서가구 써밋 터쿼이즈 틈새 400수납장(2도어)
  - 0027 케이컴퍼니 LPM 이음 푸시 400도어 선반장
  - 0010 바오트 레테 4인 세라믹 식탁 PP의자 SET
  - 0016 소티디자인_라비에 포세린 세라믹 그레이무광 4인 식탁세트
  - 0005 동서가구 엘피 접이식 암체어(팔걸이형 사무용 의자)
  - 0011 동서가구 코엘 인테리어 1500책상/서재책상
  - 0114 동서가구 스너그 프리미엄 양모 일체형/분리형 매트리스 SS/Q
  - 0024 동서가구 세렌 편백선반 LED Q침대 프레임
  - 0030 인홈 소담 EO등급 친환경 LED 수납 평상형 침대 슈퍼싱글 퀸
  - 0036 프린홈 브릴 LED 리노 평상 침대 SS/Q (매트 선택)
  - 0162 매트리 코코 베이직 패브릭 저상형 침대 데이베드 SS Q
  - 0186 동서가구 레디 가드형 패밀리 침대 모음 (+매트리스 선택)
  - 0192 동서가구 몬스터 빅 수납 SS 벙커침대+3단 수납계단+세이프가드 (매트제외)
  - 0198 동서가구 레몬 수납헤드 2단 SS침대(매트리스포함)
- [레이디 가구](https://www.lady.co.kr/)
  - 0007 슬로우알레 네프 천연 가죽 소파 3인/4인
  - 0008 이안 빅 슬라이딩 커스터마이징 옷장 1200
  - 0014 포더홈 코튼 프리미엄 옷장
  - 0033 모닝 템바보드 높은 2단 거실 수납장 800
  - 0022 슬로우알레 론드 스틸 의자(2개입)
  - 0058 포더홈 반올 테이블 식탁 1000/1200
  - 0017 레이디가구 피트 책상 학생 의자
  - 0120 도담 피에트 화장대
  - 0006 포더홈 피즈 무헤드 3단 통서랍 수납침대 SS/Q
  - 0042 도담 뉴 저상형 패밀리침대
  - 0048 레이디가구 스칸드 로맨틱2 클래식 원목침대 슈퍼싱글 SS 프레임
  - 0204 레이디가구 오트 본넬 일체형침대 S/SS
  - 0210 스칸딕 데일리 원목침대 SS/Q
- [벤티스 가구](https://bentiss.com/)
  - 0013 제든 철제 스틸 미니 사이드 테이블 탁자
  - 0020 레체 원서랍 장롱 틈새 옷장 세트 학생
  - 0039 로덴 고무나무 원목 3단 와이드 서랍장(1200)
  - 0023 레나 H형 책장 책상 세트 1인용 스터디 공부
  - 0054 르젠 원목 서랍형 침대프레임 라지킹 협탁 2개
  - 0060 하든 원목 평상형 침대프레임 슈퍼킹사이즈 SK
- [상도 가구](https://www.sangdogagu.co.kr/)
  - 0019 노리 로렌스 북유럽 리프트테이블 소파테이블
  - 0025 데이앤나잇 1인용 좌식소파
  - 0045 몬스터랙/랙플러스 W600 선반 2~7단
  - 0028 더메종 화이트 2인 4인 6인 식탁세트 (+데이체어)
  - 0029 모두 낮은책장 2단/3단 2colors
  - 0035 포커스데스크 사무용 책상 1200/1400
  - 0041 포커스체어 사무용 의자
- [우아미 가구](https://www.wooamimall.com/)
  - 0031 덴버 4인 최고급 조야원단 소파
  - 0037 엘리트 3인 조야원단 소파
  - 0038 리그 4자/5자 슬라이딩 싱글장
  - 0056 우아미 클레식 800 장롱(원서랍장+거울장)
  - 0051 포이 고무나무 원목 800 5단 서랍장(내추럴)
  - 0034 네이슨 오픈 수납장
  - 0126 미토 화장대세트
  - 0066 리오 LED 조명 퀸침대(고무나무 원목)
  - 0072 벨라 조명 슈퍼싱글 침대 (화이트무광)
  - 0078 케이비 킹 침대세트
  - 0234 우아미가구 데이지 갤럭시 패브릭 센서 조명 침대
  - 0240 우아미가구 로테 LED조명 통서랍 퀸침대
- [피카소 가구](https://www.e-picasso.co.kr/)
  - 0043 빈 소파
- [한샘](https://store.hanssem.com/furnishing)
  - 0049 클린트2 거실장 180cm 북유럽형(3종/택1)
  - 0044 바이엘 채널 옷장 화이트
  - 0050 아임빅 슬라이딩 옷장 100cm 선반형 4종
  - 0046 도노 엣지 세라믹 식탁세트 4인용(위드의자 4포함)
  - 0052 유로503 디아고 이노레더 식탁의자
  - 0047 샘 책장 5단 120cm 수납형 시공(컬러 1택)
  - 0053 유로 501 플랫 서재 5단 장식책장 1000
  - 0132 포시즌 6 마레 매트리스 Q/K/KK
  - 0084 아임빅 수납침대SS 일반헤드형+노뜨 매트릭스
  - 0096 조이S 2 멀티침대
  - 0102 클로즈 침대 Q/K (매트별도)
  - 0216 호텔침대 포에트 침대 SS (헤드 2종, 하부서랍 선택,매트별도)
  - 0228 샘베딩 플레인 침대 SS 서랍형+노뜨 매트리스
- [파로마 가구](https://paroma.com/)
  - 0055 파로마 레아나 천연 면피가죽 3인용 가죽소파
  - 0059 파로마 룬 미니 선반 철제 디와이 책상 1800
- [상도 가구](https://www.sangdogagu.co.kr/)
  - 0026 케렌시아 선반형 튼튼한 행거 1100
  - 0032 모던하임 2000 거울형 행거
- [가구라이즈](https://gagurise.com/)
  - 0003 서랍형 벽선반 600
  - 0009 양문 수납장 세트 2000
  - 0004 서랍형 광파 오븐 렌지대 600
  - 0108 3칸 미니 협탁 450
  - 0012 가구라이즈 무헤드 서랍 침대 발판 세트 Q
  - 0018 가구라이즈 평상형 침대 프레임 SS
- [장인 가구](https://www.jangin.com/)
  - 0040 블레비오 식탁
  - 0090 안젤로 호텔형 침대
- [모던하우스](https://www.mhmall.co.kr/index.html)
  - 0156 어텀 부클레 스툴
  - 0138 ON 글래스코 미드센추리 침대프레임 SS 블랙 우드엣지
  - 0144 닐튼 플러스 수납침대 SS
  - 0222 ON 로이스 패브릭침대 SS 아이보리
- [크랜시아](https://www.krencia.co.kr/)
  - 0150 프린홈 브릴 LED 서랍침대 SS/Q (매트 선택)
  - 0168 RF 로렌 원목 퀸침대
  - 0174 라피스 LED 일반형 침대 SS/Q+방수커버
  - 0180 그레이스 LED 일반형 침대 SS/Q
</details>

### 아이콘
- [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/)
    - [포토후기 배너 아이콘](https://www.iconfinder.com/icons/4038847/buy_discount_gift_shop_shopping_icon)
    - [배송비 이벤트 아이콘](https://www.iconfinder.com/icons/3702392/delivery_shipment_shipping_truck_icon)
- [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
    - [비주얼 메인2 그림](https://www.iconfinder.com/icons/8815764/hanukkah_menorah_sufganiyah_sufganiyot_winter_family_festive_icon)
    - [메타포 아이콘](https://www.iconfinder.com/iconsets/household-62)
- [MIT 라이선스](https://opensource.org/license/MIT)
    - 관심 아이콘
    - 옵션 아이콘
    - 장바구니 아이콘
