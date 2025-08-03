const API_BASE_URL = 'http://43.136.23.194:1314';
const rememberMeCheckbox = document.getElementById('rememberMe');
const accountInput = document.getElementById('account');
const passwordInput = document.getElementById('password');
// 读取本地存储的账号信息
function loadRememberedAccount() {
    const rememberedAccount = localStorage.getItem('rememberedAccount');
    const rememberedPassword = localStorage.getItem('rememberedPassword');
    if (rememberedAccount && rememberedPassword) {
        accountInput.value = rememberedAccount;
        passwordInput.value = rememberedPassword;
        rememberMeCheckbox.checked = true;
    }
}
// 登录功能
function initLogin() {
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        const loginBtn = document.querySelector('.login-btn');
        // 添加输入框焦点效果
        accountInput.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        accountInput.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        passwordInput.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        passwordInput.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // 表单提交处理
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const account = accountInput.value.trim();
            const password = passwordInput.value.trim();
            
            // 简单的表单验证
            if (!account) {
                showError(accountInput, '请输入账号');
                return;
            }
            
            if (!password) {
                showError(passwordInput, '请输入密码');
                return;
            }
            
            // 清除错误提示
            clearError(accountInput);
            clearError(passwordInput);
            
            // 模拟登录加载状态
            loginBtn.disabled = true;
            loginBtn.textContent = '登录中...';
            
            // 发送请求到服务器
            fetch(API_BASE_URL + '/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ account, password }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('登录失败');
                }
                return response.json();
            })
            .then(data => {
                // 登录成功处理
                loginBtn.disabled = false;
                loginBtn.textContent = 'BinGo!';
                alert('登录成功!OvO');
                if (rememberMeCheckbox && rememberMeCheckbox.checked) {
                    const account = accountInput.value.trim();
                    const password = passwordInput.value.trim();
                    localStorage.setItem('rememberedAccount', account);
                    localStorage.setItem('rememberedPassword', password);
                } else {
                    localStorage.removeItem('rememberedAccount');
                    localStorage.removeItem('rememberedPassword');
                }
                // 拿取服务器响应token
                if (data.token) {
                    localStorage.setItem('authToken', data.token);
                }
                // 跳转到主页
                window.location.href = 'home.html';
            })
            .catch(error => {
                // 登录失败处理
                loginBtn.disabled = false;
                loginBtn.textContent = '登录';
                showError(accountInput, '密码不对！不许过来!o(>_<)o');
            });
        });
    }
}

// 显示错误提示
function showError(input, message) {
    const formGroup = input.parentElement;
    // 移除之前的错误提示
    clearError(input);
    
    // 添加错误样式
    formGroup.classList.add('error');
    
    // 创建错误提示元素
    const errorMsg = document.createElement('small');
    errorMsg.classList.add('error-message');
    errorMsg.textContent = message;
    
    // 添加到表单组
    formGroup.appendChild(errorMsg);
}

// 清除错误提示
function clearError(input) {
    const formGroup = input.parentElement;
    formGroup.classList.remove('error');
    
    const errorMsg = formGroup.querySelector('.error-message');
    if (errorMsg) {
        formGroup.removeChild(errorMsg);
    }
}

// 页面加载完成后初始化登录功能
window.addEventListener('DOMContentLoaded', initLogin);