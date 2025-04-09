// Main elements
const messagesTable = document.getElementById('messagesTable');
const messagesBody = document.getElementById('messagesBody');
const selectAllCheckbox = document.getElementById('selectAll');
const sendAllBtn = document.getElementById('sendAllBtn');
const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');

// Show messages when page loads
document.addEventListener('DOMContentLoaded', showMessages);

// Select all checkbox
selectAllCheckbox.addEventListener('change', function() {
    // Select or deselect all checkboxes
    const checkboxes = document.querySelectorAll('.message-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
    });
});

// Send to all button
sendAllBtn.addEventListener('click', function() {
    const selected = document.querySelectorAll('.message-checkbox:checked');
    
    // Make sure at least one message is selected
    if (selected.length === 0) {
        alert('الرجاء تحديد رسالة واحدة على الأقل');
        return;
    }

    // Send each selected message
    selected.forEach(checkbox => {
        const messageId = parseInt(checkbox.dataset.id);
        sendMessage(messageId);
    });
});

// Delete selected button
deleteSelectedBtn.addEventListener('click', function() {
    const selected = document.querySelectorAll('.message-checkbox:checked');
    
    // Make sure at least one message is selected
    if (selected.length === 0) {
        alert('الرجاء تحديد رسالة واحدة على الأقل');
        return;
    }

    // Confirm deletion
    if (confirm('هل أنت متأكد من حذف الرسائل المحددة؟')) {
        deleteSelected(selected);
    }
});

// Show all messages in the table
function showMessages() {
    // Get messages from storage
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    messagesBody.innerHTML = '';
    
    // Add each message to the table
    messages.forEach((message, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="message-checkbox" data-id="${index}"></td>
            <td>${message.name}</td>
            <td>${message.phone}</td>
            <td>${message.senderName}</td>
            <td>${message.senderPhone}</td>
            <td><span class="status status-${getStatusClass(message.status)}">${message.status}</span></td>
            <td>${message.date}</td>
            <td class="actions-cell">
                <button class="btn-primary" onclick="sendMessage(${index})">
                    <i class="icon">➤</i> إرسال
                </button>
                <button class="btn-danger" onclick="deleteMessage(${index})">
                    <i class="icon">✕</i> حذف
                </button>
            </td>
        `;
        messagesBody.appendChild(row);
    });
}

// Get CSS class for status
function getStatusClass(status) {
    switch(status) {
        case 'معلق': return 'pending';
        case 'جاري الإرسال': return 'sending';
        case 'تم الإرسال': return 'sent';
        default: return 'pending';
    }
}

// Send a single message
function sendMessage(messageId) {
    // Get messages
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    if (!messages[messageId]) return;
    
    // Update status to sending
    messages[messageId].status = 'جاري الإرسال';
    localStorage.setItem('messages', JSON.stringify(messages));
    showMessages();
    
    // Simulate sending process (2 seconds)
    setTimeout(() => {
        messages[messageId].status = 'تم الإرسال';
        localStorage.setItem('messages', JSON.stringify(messages));
        showMessages();
    }, 2000);
}

// Delete a single message
function deleteMessage(messageId) {
    if (confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
        // Get messages
        const messages = JSON.parse(localStorage.getItem('messages') || '[]');
        
        // Remove message
        messages.splice(messageId, 1);
        
        // Save and refresh
        localStorage.setItem('messages', JSON.stringify(messages));
        showMessages();
    }
}

// Delete multiple selected messages
function deleteSelected(selectedCheckboxes) {
    // Get messages
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    
    // Get indices in reverse order (to avoid index shifting)
    const indices = Array.from(selectedCheckboxes)
        .map(checkbox => parseInt(checkbox.dataset.id))
        .sort((a, b) => b - a);
    
    // Remove selected messages
    indices.forEach(index => {
        messages.splice(index, 1);
    });
    
    // Save and refresh
    localStorage.setItem('messages', JSON.stringify(messages));
    showMessages();
} 