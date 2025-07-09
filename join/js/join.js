$(function() {
  const emailSelect = $(".join-form .email-item .email-select")
  const emailList = $(".join-form .email-item .email-select ul");
  const emailSelectBtns = $(".join-form .email-item .email-select .selected-email i");

  emailSelect.on("click", function() {
    emailList.slideToggle(200);
    emailSelectBtns.toggle();
  });
});

checkId();
checkPw();
checkPwRe();
checkCall();
checkEmail();
findAddress();
checkResidentNum();
checkJoin();

//아이디 오류 확인 이벤트 등록
async function checkId() {
  const response = await fetch("../data/users.json");
  const users = await response.json();
  const idList = users.map(user => user.id);

  const idItem = document.querySelector(".join-form .id-item");
  const errorTxt = idItem.querySelector(".error-txt");
  const idInput = idItem.querySelector("#user-id");

  //공백 입력 금지
  idInput.addEventListener("keyup", () => {
    idInput.value = idInput.value.replaceAll(" ", "");
  });

  idInput.addEventListener("change", () => {
    let userId = idInput.value;
    let errorMsg = "";

    if (userId.length < 4) { //4글자 미만
      errorMsg = "4글자 이상 입력해 주세요.";
    }
    else if (userId.length > 20) { //20글자 초과
      errorMsg = "20글자 이하로 입력해 주세요.";
    }
    else if (!/^[a-z0-9]+$/.test(userId)) { //알파벳 소문자, 숫자 외 다른 문자
      errorMsg = "알파벳 소문자, 숫자만 사용 가능합니다.";
    }
    else if (idList.includes(userId)) { //사용 중인 아이디
      errorMsg = "이미 존재하는 아이디입니다.";
    }

    if (errorMsg) {
      errorTxt.innerHTML = errorMsg;
      idInput.classList.add("error");
      idInput.select();
    }
    else {
      errorTxt.innerHTML = "";
      idInput.classList.remove("error");
    }
  });
}

//비밀번호 오류 확인 이벤트 등록
function checkPw() {
  const pwItem = document.querySelector(".join-form .pw-item");
  const errorTxt = pwItem.querySelector(".error-txt");
  const pwInput = pwItem.querySelector("#user-pw");

  //공백 입력 금지
  pwInput.addEventListener("keyup", () => {
    pwInput.value = pwInput.value.replaceAll(" ", "");
  });

  pwInput.addEventListener("change", () => {
    let userPW = pwInput.value;
    let errorMsg = "";

    if (userPW.length < 8) { //8글자 미만
      errorMsg = "8글자 이상 입력해 주세요.";
    }
    else if (userPW.length > 16) { //16글자 초과
      errorMsg = "16글자 이하로 입력해 주세요.";
    }
    else if (!/^[a-zA-Z0-9|~!@#$%^&*()_\-+=]+$/.test(userPW)) { //알파벳 대소문자, 숫자, 특수기호 외 다른 문자
      errorMsg = "알파벳 대소문자, 숫자, 특수기호(~!@#$%^&*()_-+=)만 사용 가능합니다.";
    }
    else { //알파벳 대소문자, 숫자, 특수기호 2가지 포함 안됨
      let contain = 0;
      contain += /[a-zA-Z]+/.test(userPW);
      contain += /\d+/.test(userPW);
      contain += /[~!@#$%^&*()_\-+=]/.test(userPW);

      if (contain < 2) {
        errorMsg = "알파벳 대소문자, 숫자, 특수기호(~!@#$%^&*()_-+=) 중 2가지 이상이 포함되어야 합니다.";
      }
    }

    if (errorMsg) {
      errorTxt.innerHTML = errorMsg;
      pwInput.classList.add("error");
      pwInput.select();
    }
    else {
      errorTxt.innerHTML = "";
      pwInput.classList.remove("error");
    }
  });
}

//비밀번호 재입력 오류 확인 이벤트 등록
function checkPwRe() {
  const pwReItem = document.querySelector(".join-form .pw-re-item");
  const errorTxt = pwReItem.querySelector(".error-txt");
  const pwReInput = pwReItem.querySelector("#pw-re");
  const pwInput = document.getElementById("user-pw");

  //공백 입력 금지
  pwReInput.addEventListener("keyup", () => {
    pwReInput.value = pwReInput.value.replaceAll(" ", "");
  });

  pwReInput.addEventListener("change", () => {
    let pwRe = pwReInput.value;
    let pw = pwInput.value;

    if (pwRe !== pw) { //비밀번호 불일치
      errorTxt.innerHTML = "비밀번호가 일치하지 않습니다.";
      pwReInput.classList.add("error");
      pwReInput.select();
    }
    else {
      errorTxt.innerHTML = "";
      pwReInput.classList.remove("error");
    }
  });
}

//휴대폰 번호 입력 이벤트 등록
function checkCall() {
  const calls = document.querySelectorAll(".join-form .call-item input");

  calls.forEach((call, idx) => {
    //숫자 입력 제한
    limitInputNum(call);

    //지정된 만큼 입력 시 다음 입력 칸으로 이동
    call.addEventListener("keyup", () => {
      if ((call.value.length >= call.maxLength) && (idx < calls.length-1)) {
        calls[idx+1].focus();
      }
    });
  });
}

//이메일 입력 이벤트 등록
function checkEmail() {
  const emailItem = document.querySelector(".join-form .email-item");
  const errorTxt = emailItem.querySelector(".error-txt");
  const email01 = emailItem.querySelector("#email-01");
  const email02 = emailItem.querySelector("#email-02");

  const selectedEmail = emailItem.querySelector(".email-select .selected-email");
  const emailListItems = emailItem.querySelectorAll(".email-select ul li");

  email01.addEventListener("change", () => {
    let email = email01.value;

    //알파벳 대소문자, 숫자, %_-만 사용
    if (!/^[a-zA-Z0-9|%_-]+$/.test(email)) {
      errorTxt.innerHTML = "유효하지 않는 이메일 주소입니다.";
      email01.classList.add("error");
      email01.select();
    }
    else {
      errorTxt.innerHTML = "";
      email01.classList.remove("error");
    }
  });

  email02.addEventListener("change", () => {
    let email = email02.value;

    //알파벳 대소문자, 숫자, -만 사용
    //.으로 나뉜 블럭은 2글자 이상
    //-는 블럭은 시작과 끝에 올 수 없음
    //적어도 2개의 블럭을 가져야 함
    if (!/^([a-zA-Z0-9]+[a-zA-Z0-9-]*[a-zA-Z0-9]+\.)+([a-zA-Z0-9]+[a-zA-Z0-9-]*[a-zA-Z0-9]+)$/.test(email)) {
      errorTxt.innerHTML = "유효하지 않는 이메일 주소입니다.";
      email02.classList.add("error");
      email02.select();
    }
    else {
      errorTxt.innerHTML = "";
      email02.classList.remove("error");
    }
  });

  //이메일 뒷 주소 선택 시 표시
  emailListItems.forEach(item => {
    let email = item.innerHTML;

    item.addEventListener("click", () => {
      let emailTextNode = document.createTextNode(email);
      selectedEmail.removeChild(selectedEmail.childNodes[0]);
      selectedEmail.insertBefore(emailTextNode, selectedEmail.children[0]);      

      if (email !== "직접 입력") {
        email02.value = email;
        email02.disabled = true;
        errorTxt.innerHTML = "";
        email02.classList.remove("error");
      }
      else {
        email02.value = "";
        email02.disabled = false;
        email02.focus();
      }
    });
  });
}

//우편 번호 찾기 - 카카오 우편 번호 찾기 API 이용
function findAddress() {
  const addrItem = document.querySelector(".join-form .address-item");
  const postBtn = addrItem.querySelector(".post-btn");
  const postCodeInput = document.querySelector("#address-01");
  const baseAddrInput = document.querySelector("#address-02");
  const detailAddrInput = document.querySelector("#address-03");

  postBtn.addEventListener("click", () => {
    new daum.Postcode({
      oncomplete: data => {
        let postCode = data.zonecode;
        let roadAddr = data.roadAddress;
        let extraRoadAddr = "";

        if (data.bname && /[동|로|가]$/g.test(data.bname)) {
          extraRoadAddr += data.bname;
        }

        if (data.buildingName && data.apartment === 'Y') {
          extraRoadAddr += extraRoadAddr!=="" ? ", " : "";
          extraRoadAddr += data.buildingName;
        }

        if (extraRoadAddr){
          extraRoadAddr = ' (' + extraRoadAddr + ')';
        }

        postCodeInput.value = postCode;
        baseAddrInput.value = roadAddr + extraRoadAddr;
        detailAddrInput.focus();
      }
    }).open();
  })
}

//생년월일/성별 입력 이벤트 등록
function checkResidentNum() {
  const residentItem = document.querySelector(".join-form .resident-num-item");
  const residentNums = residentItem.querySelectorAll("input:not(:disabled)");
  const errorTxt = residentItem.querySelector(".error-txt");
  
  //숫자 입력 제한
  residentNums.forEach((residentNum) => limitInputNum(residentNum));

  //6글자 입력 시 다음 입력 칸으로 이동
  residentNums[0].addEventListener("keyup", function() {
    if (this.value.length >= this.maxLength) {
      residentNums[1].focus();
    }
  });

  residentNums[0].addEventListener("change", function() {
    let birth = this.value;

    if (birthToDate(birth) === "") { //존재하지 않는 날짜
      errorTxt.textContent = "생년월일 입력이 잘못되었습니다.";
      this.classList.add("error");
      this.select();
    }
    else {
      errorTxt.innerHTML = "";
      this.classList.remove("error");
    }
  });

  residentNums[1].addEventListener("change", function() {
    let gender = this.value;

    if (!(gender==="1" || gender==="2" || gender==="3" || gender==="4")) { //성별 입력 오류
      errorTxt.textContent = "성별 입력이 잘못되었습니다.";
      this.classList.add("error");
      this.select();
    }
    else {
      errorTxt.innerHTML = "";
      this.classList.remove("error");
    }
  });
}

//회원가입 양식 확인
function checkJoin() {
  const joinBtn = document.querySelector(".join-form .join-btn");
  const formItems = document.querySelectorAll(".join-form .form-item");

  joinBtn.addEventListener("click", () => {
    let success = true;

    for (let item of formItems) {
      const itemName = item.querySelector("label").innerText.replace("*", "");
      const inputs = item.querySelectorAll("input");
      const values = Array(...inputs).map(input => input.value);
  
      let required = inputs[0].required;
      let filled = values.every(val => val!==null && val!=="");
      let error = Array(...inputs).find(input => input.classList.contains("error"));
  
      //오류 확인
      if (error && required) {
        alert(`${itemName}을(를) 정확히 입력해주세요.`);
        error.focus();
        error.select();

        success = false;
        break;
      }
      else if (error && !required) {
        let answer = confirm(`${itemName}에 오류가 있습니다. 계속 진행하면 ${itemName}의 값은 저장되지 않습니다. 진행하시겠습니까?`);

        if (answer) {
          error.value = "";
          continue;
        }
        else {
          error.focus();
          error.select();
  
          success = false;
          break;
        }
      }
  
      //필수 요소 확인
      if (required && !filled) {
        alert(`${itemName}은(는) 반드시 입력해야 합니다.`);
        inputs[0].focus();
        
        success = false;
        break;
      }
    }

    //문제 없으면 회원가입
    if (success) {
      alert("회원 가입이 완료되었습니다.");
      window.location.href = "../login/login.html";
    }
  });

  //회원 정보 생성
  function createNewUser() {
    let id = document.getElementById("user-id").value;
    let pw = document.getElementById("user-pw").value;
    let name = document.getElementById("name").value;
    let call = document.getElementById("call-01").value
      + document.getElementById("call-02").value
      + document.getElementById("call-03").value;
    let email = document.getElementById("email-01").value
      + "@"
      + document.getElementById("email-02").value;

    let postCode = document.getElementById("address-01").value;
    let baseAddr = document.getElementById("address-02").value;
    let detailAddr = document.getElementById("address-03").value;
    
    let birth = document.getElementById("resident-01").value;
    let gender = document.getElementById("resident-02").value;

    birth = birthToDate(birth);
    gender = gender==="1"||gender==="3" ? "M" : "F";

    const newUser = {
      id: id,
      pw: pw,
      name: name,
      call: call,
      email: email,
      address: postCode ? {
        post: postCode,
        base: baseAddr,
        detail: detailAddr
      } : null,
      birth: birth ? birth : null,
      gender: gender ? gender : null
    }

    return newUser;
  }
}

function limitInputNum(input) {
  input.addEventListener("keydown", () => {
    input.value = input.value.replaceAll(/\D/g, "");
  });

  input.addEventListener("keyup", () => {
    input.value = input.value.replaceAll(/\D/g, "");
  });
}

function birthToDate(birth) {
  let year = parseInt(birth.substr(0, 2));
  let month = parseInt(birth.substr(2, 2));
  let date = parseInt(birth.substr(4, 2));

  let thisYear = new Date().getFullYear();
  if (year > thisYear%100) {
    year += 1900;
  }
  else if (year > thisYear%100 - 14) {
    year += 1900;
  }
  else {
    year += 2000;
  }

  if (month <= 0 || month > 12) {
    return "";
  }

  let lastDate = new Date(2025, 7, 0).getDate();
  if (date <= 0 || date > lastDate) {
    return "";
  }

  return `${year}-${String(month).padStart(2, "0")}-${String(date).padStart(2, "0")}`
}