const id = document.querySelector('#id'),
    psword = document.querySelector('#psword'),
    loginBtn = document.querySelector('#button'),
    logoutBtn = document.querySelector('#btn_logout');

loginBtn.addEventListener('click', login);

logoutBtn.addEventListener('click', logout);

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