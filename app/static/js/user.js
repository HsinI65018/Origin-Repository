//check login status
const member = document.querySelector('.member');
const checkLoginStatus =  async() => {
    const response = await fetch('/api/user');
    const data = await response.json();
    const status = data['data'];
    status === 'null'? '' : member.textContent = '登出系統';
}
//start point
checkLoginStatus();

//clear login/register input field
const registerName = document.querySelector('.register-form>input[type=text]');
const registerEmail = document.querySelector('.register-form>input[type=email]');
const registerPassword = document.querySelector('.register-form>input[type=password]');
const registerMsg = document.querySelector('.register-form>div');
const loginEmail = document.querySelector('.login-form>input[type=email]');
const loginPassword = document.querySelector('.login-form>input[type=password]');
const loginError = document.querySelector('.login-form>div');
const clearForm = () => {
    registerName.value = '';
    registerEmail.value = '';
    registerPassword.value = '';
    registerMsg.textContent = '';
    loginEmail.value = '';
    loginPassword.value = '';
    loginError.textContent = '';
}

//login/register/logout controller
const register = document.querySelector('.register');
const login = document.querySelector('.login');
const handleButton = async (e) => {
    clearForm();
    register.className.includes('show')? '':login.classList.add('show');

    if(e.target.textContent === '登出系統'){
        login.classList.remove('show');
        await fetch('/api/user', {method:"DELETE"});
        window.location = window.location.href;
    }
}
member.addEventListener('click', handleButton);

//switch to login form or register form
const loginBtn = document.querySelector('.login-btn');
const registerBtn = document.querySelector('.register-btn');
const switchForm = (e) => {
    clearForm();
    const target = e.target.className;
    if(target === 'login-btn'){
        register.classList.remove('show');
        login.classList.add('show');
    }else{
        login.classList.remove('show');
        register.classList.add('show');
    }
}
loginBtn.addEventListener('click', switchForm);
registerBtn.addEventListener('click', switchForm);

//close login/register from
const loginClose = document.querySelector('.login-close');
const registerClose = document.querySelector('.register-close');
const closeForm = (e) => {
    const target = e.target.className;
    target === 'register-close'? register.classList.remove('show'):login.classList.remove('show');
}
loginClose.addEventListener('click', closeForm);
registerClose.addEventListener('click', closeForm);

//refister controller
const registerForm = document.querySelector('.register-form');
const fetchRegisterAPI = async (e) => {
    e.preventDefault();
    requestBody = {
        "name": registerName.value,
        "email": registerEmail.value,
        "password": registerPassword.value
    }
    try{
        const response = await fetch('/api/user',{
            method: "POST",
            body: JSON.stringify({
                content: requestBody
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await response.json();
        registerMsg.setAttribute('class', 'showMsg');
        if(data['error']){
            registerMsg.textContent = data['message'];
        }else{
            clearForm();
            registerMsg.textContent = '註冊成功！';
        }
        registerForm.appendChild(registerMsg)
    }catch(error){
        console.log(error);
    }
}
registerForm.addEventListener('submit',fetchRegisterAPI);

//login controller
const loginForm = document.querySelector('.login-form');
const fetchLoginAPI = async (e) => {
    e.preventDefault();
    requestBody = {
        "email": loginEmail.value,
        "password": loginPassword.value
    }
    try{
        const response = await fetch('/api/user',{
            method: "PATCH",
            body: JSON.stringify({
                content: requestBody
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        if(data['error']){
            loginError.textContent = data['message'];
            loginError.setAttribute('class', 'showMsg');
            loginForm.appendChild(loginError)
        }else{
            clearForm();
            login.classList.remove('show');
            window.location = window.location.href;
        }
    }catch(error){
        console.log(error)
    }
}
loginForm.addEventListener('submit', fetchLoginAPI);