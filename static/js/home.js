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
        fetchUserInfo();
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
    // 说说相关元素
    const viewSaysBtn = document.getElementById('viewSaysBtn');
    const postSaysBtn = document.getElementById('postSaysBtn');
    const postSaysSection = document.getElementById('postSaysSection');
    const viewSaysSection = document.getElementById('viewSaysSection');
    const saysList = document.getElementById('saysList');
    const backToPostBtn = document.getElementById('backToPostBtn');
    
    // 编辑个人信息相关元素
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editProfileModal = document.getElementById('editProfileModal');
    const closeModalBtn = document.querySelector('.close');
    const saveProfileBtn = document.getElementById('saveProfileBtn');

    fetchUserInfo();
    // 切换到显示说说界面
    viewSaysBtn.addEventListener('click', () => {
        postSaysSection.style.display = 'none';
        viewSaysSection.style.display = 'block';
        fetchSays();
    });

    // 切换回发布说说界面
    backToPostBtn.addEventListener('click', () => {
        viewSaysSection.style.display = 'none';
        postSaysSection.style.display = 'block';
    });

    // 从API获取说说列表
    async function fetchSays() {
        try {
            const response = await fetch(API_BASE_URL+'/api/says/get',{
                method: 'GET',
                headers: {
                    'token': authToken
                }
            });
            if(!response.ok) {
                throw new Error('获取说说列表失败');
            }
            const responseData = await response.json();
            const says = responseData.says;
            // 清空现有说说
            saysList.innerHTML = '';
            says.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.content} - ${item.time}`;
                saysList.appendChild(li);
            });
        } catch (error) {
            console.error('获取说说列表失败:', error);
        }
    }

    // 发布说说逻辑
    postSaysBtn.addEventListener('click', async () => {
        const saysInput = document.getElementById('saysInput');
        const content = saysInput.value.trim();
        if(content) {
            try {
                const response = await fetch(API_BASE_URL+'/api/says/post',{
                    method: 'POST',
                    headers: {
                        'token': authToken
                    },
                    body: JSON.stringify({
                        content: content
                    })
                });
                if(!response.ok) {
                    throw new Error('发布说说失败');
                }
                const responseData = await response.json();
                if(responseData.code === 200) {
                    // 发布成功
                    saysInput.value = '';
                    // 刷新说说列表
                    fetchSays();
                }
            } catch (error) {
                console.error('发布说说失败:', error);
                alert('发布说说失败了T_T');
            }
        }
    });

    //从API获取用户信息
    async function fetchUserInfo() {
        try {
            const response = await fetch(API_BASE_URL+'/api/profile/get',{
                method: 'GET',
                headers: {
                    'token': authToken
                }
            });
            if(!response.ok) {
                throw new Error('获取用户信息失败');
            }
            const responseData = await response.json();
            const userInfo = responseData.profile;
            // 填充用户信息到span
            document.getElementById('username').innerText = userInfo.name;
            document.getElementById('signature').innerText = userInfo.signature;
        } catch (error) {
            console.error('获取用户信息失败:', error);
        }
    }
    // 点击编辑按钮显示弹窗
    editProfileBtn.addEventListener('click', () => {
        editProfileModal.style.display = 'block';
        // 填充当前资料到输入框
        const username = document.getElementById('username').textContent;
        const signature = document.getElementById('signature').textContent;
        document.getElementById('newUsername').value = username;
        document.getElementById('newSignature').value = signature;
    });

    // 点击关闭按钮隐藏弹窗
    closeModalBtn.addEventListener('click', () => {
        editProfileModal.style.display = 'none';
    });

    // 点击保存按钮更新资料
    saveProfileBtn.addEventListener('click', () => {
        const newUsername = document.getElementById('newUsername').value;
        const newSignature = document.getElementById('newSignature').value;
        document.getElementById('username').textContent = newUsername;
        document.getElementById('signature').textContent = newSignature;
        editProfileModal.style.display = 'none';
        // 这里可添加调用 API 更新资料的逻辑(保存时显示保存中)
        try {
            // 显示保存中
            saveProfileBtn.disabled = true;
            saveProfileBtn.textContent = '保存中...';
            const response = fetch(API_BASE_URL+'/api/profile/update',{
                method: 'POST',
                headers: {
                    'token': authToken
                },
                body: JSON.stringify({
                    name: newUsername,
                    signature: newSignature
                })
            });
            if(!response.ok) {
                throw new Error('更新用户信息失败');
            }
            const responseData = response.json();
            if(responseData.code === 0) {
                // 刷新用户信息
                fetchUserInfo();
                //关闭弹窗
                editProfileModal.style.display = 'none';
            }
        } catch (error) {
            console.error('更新用户信息失败:', error);
        } finally {
            // 恢复保存按钮
            saveProfileBtn.disabled = false;
            saveProfileBtn.textContent = '保存';
        }
    });

    // 点击弹窗外部区域隐藏弹窗
    window.addEventListener('click', (event) => {
        if (event.target === editProfileModal) {
            editProfileModal.style.display = 'none';
        }
    });
});