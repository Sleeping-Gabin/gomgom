init();

async function init() {
  const response = await fetch("../data/users.json");
  const users = await response.json();

  const idPwMap = new Map(); //아이디: 비밀번호
  const idNameMap = new Map(); //아이디: 이름

  users.forEach(user => {
    idPwMap.set(user.id, user.pw);
    idNameMap.set(user.id, user.name);
  });

  login(idPwMap, idNameMap);
}

function login(idPwMap, idNameMap) {
  const loginBtn = document.querySelector(".login-form .login-btn");
  const idInput = document.querySelector(".login-form .user-id");
  const pwInput = document.querySelector(".login-form .user-pw");
  
  loginBtn.addEventListener("click", () => {
    let id = idInput.value;
    let pw = pwInput.value;

    if (!id) { //아이디 미입력
      alert("아이디를 입력해주세요.");
      idInput.focus();
      return;
    }
    else if (!pw) { //비밀번호 미입력
      alert("비밀번호를 입력해주세요.");
      pwInput.focus();
      return;
    }
  
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