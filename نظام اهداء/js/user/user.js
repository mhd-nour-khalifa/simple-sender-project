// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    // Get important elements from the page
    const form = document.getElementById('giftForm');
    const recipientsContainer = document.getElementById('recipientsContainer');
    const addRecipientBtn = document.getElementById('addRecipient');
    let recipientCount = 0;

    // Add first recipient when page loads
    addRecipient();

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Check if form is valid
        if (formIsValid()) {
            // Save data and show thank you message
            saveDataAndShowThanks();
        }
    });

    // "Add recipient" button
    addRecipientBtn.addEventListener('click', function() {
        addRecipient();
    });

    // Function to check if form is valid
    function formIsValid() {
        let isValid = true;
        
        // Check sender information
        const senderName = document.getElementById('senderName');
        const senderPhone = document.getElementById('senderPhone');
        
        // Name validation
        if (!senderName.value.trim()) {
            showError(senderName, 'الرجاء إدخال اسمك');
            isValid = false;
        } else {
            removeError(senderName);
        }
        
        // Phone validation
        if (!senderPhone.value.trim()) {
            showError(senderPhone, 'الرجاء إدخال رقم جوالك');
            isValid = false;
        } else if (!senderPhone.value.match(/^\+966[0-9]{9}$/)) {
            showError(senderPhone, 'الرجاء إدخال رقم جوال صحيح يبدأ بـ +966');
            isValid = false;
        } else {
            removeError(senderPhone);
        }
        
        // Check all recipients
        const entries = document.querySelectorAll('.recipient-entry');
        
        entries.forEach(entry => {
            const nameField = entry.querySelector('.recipient-name');
            const phoneField = entry.querySelector('.recipient-phone');
            
            // Recipient name validation
            if (!nameField.value.trim()) {
                showError(nameField, 'الرجاء إدخال اسم المستلم');
                isValid = false;
            } else {
                removeError(nameField);
            }
            
            // Recipient phone validation
            if (!phoneField.value.trim()) {
                showError(phoneField, 'الرجاء إدخال رقم جوال المستلم');
                isValid = false;
            } else if (!phoneField.value.match(/^\+966[0-9]{9}$/)) {
                showError(phoneField, 'الرجاء إدخال رقم جوال صحيح يبدأ بـ +966');
                isValid = false;
            } else {
                removeError(phoneField);
            }
        });
        
        return isValid;
    }

    // Save data and show thank you message
    function saveDataAndShowThanks() {
        // Get sender info
        const senderName = document.getElementById('senderName').value;
        const senderPhone = document.getElementById('senderPhone').value;
        
        // Get recipients info
        const recipients = [];
        const entries = document.querySelectorAll('.recipient-entry');
        
        entries.forEach(entry => {
            recipients.push({
                name: entry.querySelector('.recipient-name').value,
                phone: entry.querySelector('.recipient-phone').value,
                senderName: senderName,
                senderPhone: senderPhone,
                status: 'معلق',
                date: new Date().toISOString().split('T')[0] // Today's date
            });
        });

        // Save to storage
        const existing = JSON.parse(localStorage.getItem('messages') || '[]');
        const updated = [...existing, ...recipients];
        localStorage.setItem('messages', JSON.stringify(updated));

        // Show thank you message
        const mainContent = document.querySelector('main');
        mainContent.innerHTML = `
            <div class="thank-you-message">
                <h2>شكراً لك!</h2>
                <p>تم إرسال الهدايا بنجاح. سيتم إرسال الهدايا للمستلمين قريباً.</p>
                <button onclick="window.location.reload()" class="btn-primary">إرسال هدايا أخرى</button>
            </div>
        `;
    }

    // Function to add a new recipient
    function addRecipient() {
        recipientCount++;
        
        // Create recipient container
        const recipientEntry = document.createElement('div');
        recipientEntry.className = 'recipient-entry';
        
        // Add recipient fields
        recipientEntry.innerHTML = `
            <button type="button" class="remove-recipient">×</button>
            <div class="input-group">
                <label for="recipientName${recipientCount}">اسم المستلم:</label>
                <input type="text" class="recipient-name" id="recipientName${recipientCount}">
                <div class="error-message"></div>
            </div>
            <div class="input-group">
                <label for="recipientPhone${recipientCount}">رقم جوال المستلم:</label>
                <input type="tel" class="recipient-phone" id="recipientPhone${recipientCount}" placeholder="+966XXXXXXXXX">
                <div class="error-message"></div>
            </div>
        `;
        
        // Add to page
        recipientsContainer.appendChild(recipientEntry);
        
        // Make remove button work
        const removeBtn = recipientEntry.querySelector('.remove-recipient');
        removeBtn.addEventListener('click', function() {
            recipientEntry.remove();
        });
    }
    
    // Show error message
    function showError(input, message) {
        const parent = input.parentElement;
        const errorBox = parent.querySelector('.error-message');
        errorBox.textContent = message;
        errorBox.style.display = 'block';
        input.classList.add('error-input');
    }
    
    // Hide error message
    function removeError(input) {
        const parent = input.parentElement;
        const errorBox = parent.querySelector('.error-message');
        errorBox.textContent = '';
        errorBox.style.display = 'none';
        input.classList.remove('error-input');
    }
}); 