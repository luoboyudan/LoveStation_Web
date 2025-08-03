document.addEventListener('DOMContentLoaded', () => {
    const homeBtn = document.getElementById('homeBtn');
    const userProfileBtn = document.getElementById('userProfileBtn');
    const chatBtn = document.getElementById('chatBtn');
    
    const homeSection = document.getElementById('homeSection');
    const userProfileSection = document.getElementById('userProfileSection');
    const chatSection = document.getElementById('chatSection');
    
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatMessages = document.getElementById('chatMessages');

    // 切换显示的页面
    function showSection(section) {
        homeSection.style.display = 'none';
        userProfileSection.style.display = 'none';
        chatSection.style.display = 'none';
        section.style.display = 'block';
    }

    // 添加触摸事件支持
    const touchElements = [homeBtn, userProfileBtn, chatBtn, sendBtn];
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.opacity = '0.8';
        });
        element.addEventListener('touchend', function() {
            this.style.opacity = '1';
        });
    });

    homeBtn.addEventListener('click', () => {
        showSection(homeSection);
    });

    userProfileBtn.addEventListener('click', () => {
        showSection(userProfileSection);
    });

    chatBtn.addEventListener('click', () => {
        showSection(chatSection);
    });

    // 聊天功能基础实现
    sendBtn.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message) {
            appendMessage('你: ' + message);
            messageInput.value = '';
        }
    });

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });

    function appendMessage(message) {
        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});