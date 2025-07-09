$(function() {
  const emailSelect = $(".find-form .email-item .email-select")
  const emailList = $(".find-form .email-item .email-select ul");
  const emailSelectBtns = $(".find-form .email-item .email-select .selected-email i");

  emailSelect.on("click", function() {
    emailList.slideToggle(200);
    emailSelectBtns.toggle();
  });
});

checkEmail();
checkCall();
findId();

//이메일 입력 이벤트 등록
function checkEmail() {
  const emailItem = document.querySelector(".find-form .email-item");
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

//휴대폰 번호 입력 이벤트 등록
function checkCall() {
  const calls = document.querySelectorAll(".find-form .call-item input");

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

//아이디 찾기
async function findId() {
  const response = await fetch("../data/users.json");
  const users = await response.json();

  const findBtn = document.querySelector(".find-form .find-btn");
  const radFinds = document.getElementsByName("rad-find");

  
  const nameInput = document.querySelector(".find-form #name");
  const emailInputs = document.querySelectorAll(".find-form .email-item input.email");
  const callInputs = document.querySelectorAll(".find-form .call-item input.call");

  findBtn.addEventListener("click", () => {
    let checkedIdx = Array(...radFinds).findIndex(rad => rad.checked);
    
    let name = nameInput.value;

    //이름 미입력
    if (!name) {
      alert("이름을 입력해주세요.");
      nameInput.focus();
      return;
    }

    switch (checkedIdx) {
      case(0): 
        findIdWithEmail(name);
        break;
      case(1): 
        findIdWithCall(name);
        break;
      default:
        break;
    }
  });

  //이메일로 찾기
  function findIdWithEmail(name) {
    let email = emailInputs[0].value + "@" + emailInputs[1].value;

    for (let input of emailInputs) {
      if (input.classList.contains("error")) { //이메일 오류
        alert("이메일을 정확히 입력해주세요.");
        input.select();
        return;
      }
      else if (!input.value) { //이메일 미입력
        alert("이메일을 입력해주세요.");
        input.focus();
        return;
      }
    }

    //일치하는 회원 찾기
    let user = users.find(user => {
      return user.name === name && user.email === email;
    });

    if (user) {
      displayId(user.id);
    }
    else {
      alert("일치하는 회원 정보가 없습니다.");
      nameInput.value = "";
      emailInputs.forEach(input => input.value = "");
    }
  }

  //휴대폰 번호로 찾기
  function findIdWithCall(name) {
    let call = callInputs[0].value + callInputs[1].value + callInputs[2].value;

    for (let input of callInputs) {
      if (!input.value) { //휴대폰 번호 미입력
        alert("휴대폰 번호를 입력해주세요.");
        input.focus();
        return;
      }
    }

    //일치하는 회원 찾기
    let user = users.find(user => {
      return user.name === name && user.call === call;
    });

    if (user) {
      displayId(user.id);
    }
    else {
      alert("일치하는 회원 정보가 없습니다.");
      nameInput.value = "";
      callInputs.forEach(input => input.value = "");
    }
  }
}

//찾은 아이디 표시
function displayId(id) {
  const findForm = document.querySelector(".find-form");
  const resultBox = document.querySelector(".result-box");
  const idTxt = resultBox.querySelector(".result-txt span");

  findForm.style.display = "none";
  resultBox.style.display = "block";

  idTxt.textContent = id;
}

//숫자 입력 제한
function limitInputNum(input) {
  input.addEventListener("keydown", () => {
    input.value = input.value.replaceAll(/\D/g, "");
  });

  input.addEventListener("keyup", () => {
    input.value = input.value.replaceAll(/\D/g, "");
  });
}