const authToken = localStorage.getItem('authToken');
const API_BASE_URL = 'http://43.136.23.194:8080';
function connectWebSocket() {
    const ws = new WebSocket(API_BASE_URL+'/ws/messages?token='+authToken);
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
    
    const API_BASE_URL = 'http://43.136.23.194:8080';
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
        fetchMessages();
        connectWebSocket();
    });

    // 聊天功能基础实现
    sendBtn.addEventListener('click', async () => {
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
    
    // 获取元素
    const postSaysSection = document.getElementById('postSaysSection');
    const viewSaysSection = document.getElementById('viewSaysSection');
    const viewSaysBtn = document.getElementById('viewSaysBtn');
    const backToPostBtn = document.getElementById('backToPostBtn');
    const saysList = document.getElementById('saysList');
    
    // 切换到查看说说界面
    viewSaysBtn.addEventListener('click', () => {
        postSaysSection.style.display = 'none';
        viewSaysSection.style.display = 'block';
        // 这里可添加获取说说列表的逻辑，当前模拟数据
        mockFetchSays();
    });
    
    // 切换回发布说说界面
    backToPostBtn.addEventListener('click', () => {
        viewSaysSection.style.display = 'none';
        postSaysSection.style.display = 'block';
    });
    
    // 模拟获取说说列表的函数
    function mockFetchSays() {
        // 清空现有列表
        saysList.innerHTML = '';
        
        // 模拟数据
        const mockData = [
            { id: 1, content: '这是第一条说说内容', time: '2024-07-20' },
            { id: 2, content: '这是第二条说说内容', time: '2024-07-21' }
        ];
        
        mockData.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.content} - ${item.time}`;
            saysList.appendChild(li);
        });
    }
    
    // 发布说说逻辑（可按需对接后端接口）
    document.getElementById('postSaysBtn').addEventListener('click', () => {
        const saysInput = document.getElementById('saysInput');
        const content = saysInput.value.trim();
        if (content) {
            // 这里可添加发布说说的逻辑，如调用 API
            alert('发布成功！');
            saysInput.value = '';
        }
    });
});