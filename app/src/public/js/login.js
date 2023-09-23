const id = document.querySelector('#id'),
    psword = document.querySelector('#psword'),
    loginBtn = document.querySelector('#button'),
    logoutBtn = document.querySelector('#btn_logout');
const accessTokenBtn = document.querySelector('#btn_accessToken');
const refreshTokenbtn = document.querySelector('#btn_refreshToken');

loginBtn.addEventListener('click', login);

logoutBtn.addEventListener('click', logout);
accessTokenBtn.addEventListener('click',access);
refreshTokenbtn.addEventListener('click',refresh);
function login(){
    const req = {
        id : id.value,
        psword : psword.value,
    };

    fetch('/login',{
        method:"POST",
        headers : {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify(req),
    })
    .then((res) => res.json())
    .then((res) => {
        if(res.success) {
            location.href = '/';
        }else{
            alert(res.msg);
        }
    }).catch((err)=>{
        console.error(new Error('로그인 중 에러 발생'));
    });
}

function logout() {
  fetch('/logout', {
    method: "GET",
    credential : true,
  })
  .then(res => {
    if (res.status === 200) {
      // 로그아웃 성공
      console.log("Logout Success");
    } else {
      // 로그아웃 실패 또는 에러
      console.error("Logout Failed");
    }
  })
  .catch(error => {
    console.error("An error occurred:", error);
  });
}

function access(){
  fetch('/accesstoken', {
    method: "GET",
    credential : include,
  })
  .then(res => {
    if (res.status === 200) {
      console.log("인증성공");
    } else {
      console.error("만료 되어 refresh");
    }
  })
  .catch(error => {
    console.error("An error occurred:", error);
  });
}

function refresh (){
  fetch('/refreshtoken', {
    method: "GET",
    credential : true,
  })
  .then(res => {
    if (res.status === 200) {
      console.log("인증성공");
    } else {
      console.error("만료 되어 refresh");
    }
  })
  .catch(error => {
    console.error("An error occurred:", error);
  });
}