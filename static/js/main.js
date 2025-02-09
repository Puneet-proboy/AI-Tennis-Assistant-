document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    
    // Tennis ball animation
    const createTennisBall = () => {
        const ball = document.querySelector('.tennis-ball');
        const container = document.querySelector('.tennis-ball-animation');
        const containerRect = container.getBoundingClientRect();
        
        // Randomize starting position
        const startX = Math.random() * (containerRect.width - 20);
        const startY = Math.random() * (containerRect.height - 20);
        
        ball.style.left = `${startX}px`;
        ball.style.top = `${startY}px`;
    };
    
    createTennisBall();
    
    // Typing animation
    const addTypingAnimation = () => {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message assistant-message typing-animation';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        return typingDiv;
    };

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const message = userInput.value.trim();
        if (!message) return;

        // Add user message
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'message user-message';
        userMessageDiv.innerHTML = `
            <div class="message-content">
                ${message}
            </div>
        `;
        chatMessages.appendChild(userMessageDiv);
        userInput.value = '';

        // Add typing animation
        const typingAnimation = addTypingAnimation();

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            const data = await response.json();
            
            // Remove typing animation
            typingAnimation.remove();
            
            // Add assistant response
            const assistantMessageDiv = document.createElement('div');
            assistantMessageDiv.className = 'message assistant-message';
            assistantMessageDiv.innerHTML = `
                <div class="message-content">
                    ${data.response}
                </div>
            `;
            chatMessages.appendChild(assistantMessageDiv);
        } catch (error) {
            console.error('Error:', error);
            typingAnimation.remove();
            
            // Add error message
            const errorMessageDiv = document.createElement('div');
            errorMessageDiv.className = 'message assistant-message error';
            errorMessageDiv.innerHTML = `
                <div class="message-content">
                    Sorry, something went wrong. Please try again.
                </div>
            `;
            chatMessages.appendChild(errorMessageDiv);
        }

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    // Focus input on page load
    userInput.focus();
});
