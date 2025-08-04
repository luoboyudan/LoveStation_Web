const authToken = localStorage.getItem('authToken');
const API_BASE_URL = 'http://43.136.23.194:8080';
const WS_BASE_URL = 'ws://43.136.23.194:8080';
let ws;
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
        if (ws.readyState === WebSocket.OPEN) {
            closeWebSocket();
        }
    });

    userProfileBtn.addEventListener('click', () => {
        showSection(userProfileSection);
        if (ws.readyState === WebSocket.OPEN) {
            closeWebSocket();
        }
    });

    chatBtn.addEventListener('click', () => {
        showSection(chatSection);
        fetchMessages();
        connectWebSocket();
    });

    // 聊天功能基础实现
    sendBtn.addEventListener('click', async () => {
        if (ws.readyState !== WebSocket.OPEN) {
            alert('稍等一下,还没准备好呢o(>_<)o');
            return;
        }
        const message = messageInput.value.trim();
        if (message) {
            try {
                const response = await fetch(API_BASE_URL+'/api/messages/send',{
                    method: 'POST',
                    headers: {
                        'token': authToken
                    },
                    body: JSON.stringify({
                        content: message
                    })
                });
                if(!response.ok) {
                    throw new Error('发送消息失败');
                }
                appendMessage(message,true);
                messageInput.value = '';
            } catch (error) {
                console.error('发送消息失败');
                alert('消息发送失败了T_T');
            }
        }
    });

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });

    function appendMessage(message,isOwn) {
        const messageElement = document.createElement('div');
        messageElement.className ='chat-message '+(isOwn?"own":"other");
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 从API获取消息列表
    async function fetchMessages() {
        try {
            const response = await fetch(API_BASE_URL+'/api/messages/get',{
                headers: {
                    'token': authToken
                }
            });
            if(!response.ok) {
                throw new Error('获取消息失败');
            }
            const responseData = await response.json();
            const messages = responseData.data;
            // 清空现有消息
            chatMessages.innerHTML = '';
            messages.forEach(message => {
                appendMessage(message.content,message.is_own);
            });
        } catch (error) {
            console.error('获取消息失败:', error);
        }
    }
    function connectWebSocket() {
        // 关闭之前的连接
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.close();
        }
        ws = new WebSocket(WS_BASE_URL+'/ws/messages?token='+authToken);
        ws.onopen = () => {
            console.log('连接成功');
        };
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            appendMessage(message.content, false);
        };
        ws.onerror = (event) => {
            console.error('连接错误:', event);
        };
        ws.onclose = (event) => {
            console.log('连接关闭:', event);
        };
    }
    function closeWebSocket() {
        if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
            ws.close(1000, '客户端主动关闭'); // 显式指定正常关闭状态码
        }
    }
    // 关闭WebSocket连接
    window.addEventListener('beforeunload', () => {
        closeWebSocket();
    });
});