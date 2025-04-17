document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('itemForm');
  const message = document.getElementById('message');
  const submitButton = form.querySelector('button[type="submit"]');
  const fileInput = document.getElementById('image');
  const fileNameDisplay = document.getElementById('fileName');

  // Add animation to form elements on focus
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.style.transform = 'translateY(-2px)';
      input.parentElement.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
    });
    
    input.addEventListener('blur', () => {
      input.parentElement.style.transform = 'translateY(0)';
      input.parentElement.style.boxShadow = 'none';
    });
  });

  // Show selected file name with animation
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      fileNameDisplay.textContent = fileInput.files[0].name;
      fileNameDisplay.style.opacity = '0';
      fileNameDisplay.style.transform = 'translateY(10px)';
      
      // Animate file name appearance
      setTimeout(() => {
        fileNameDisplay.style.transition = 'all 0.3s ease';
        fileNameDisplay.style.opacity = '1';
        fileNameDisplay.style.transform = 'translateY(0)';
      }, 100);
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Reset message styles
    message.textContent = '';
    message.style.opacity = '0';
    message.style.transform = 'translateY(10px)';
    message.style.transition = 'none';
    
    // Button loading state with animation
    submitButton.disabled = true;
    submitButton.innerHTML = `
      <span class="spinner"></span>
      <span class="button-text">Submitting...</span>
    `;
    
    // Add pulse animation to button
    submitButton.style.animation = 'pulse 1.5s infinite';

    try {
      const formData = new FormData(form);
      
      // Show uploading progress animation
      const progressBar = document.createElement('div');
      progressBar.className = 'progress-bar';
      message.parentNode.insertBefore(progressBar, message);
      progressBar.style.width = '0%';
      progressBar.style.transition = 'width 0.3s ease';
      
      setTimeout(() => { progressBar.style.width = '30%' }, 300);
      setTimeout(() => { progressBar.style.width = '70%' }, 600);

      const response = await fetch('http://localhost:5000/api/items', {
        method: 'POST',
        body: formData
      });

      // Complete progress bar
      progressBar.style.width = '100%';
      
      const result = await response.json();

      // Remove progress bar
      setTimeout(() => {
        progressBar.style.opacity = '0';
        setTimeout(() => progressBar.remove(), 300);
      }, 500);

      if (response.ok) {
        // Success animation
        message.innerHTML = `
          <i class="fas fa-check-circle"></i>
          ${result.message || 'Item submitted successfully!'}
        `;
        message.className = 'message success';
        
        // Confetti effect
        setTimeout(() => {
          createConfetti();
        }, 300);
        
        form.reset();
        fileNameDisplay.textContent = '';
      } else {
        // Error animation
        message.innerHTML = `
          <i class="fas fa-exclamation-circle"></i>
          ${result.message || 'Failed to submit item.'}
        `;
        message.className = 'message error';
      }
    } catch (error) {
      console.error('Error:', error);
      message.innerHTML = `
        <i class="fas fa-times-circle"></i>
        Server error. Please try again later.
      `;
      message.className = 'message error';
    } finally {
      // Show message with animation
      setTimeout(() => {
        message.style.opacity = '1';
        message.style.transform = 'translateY(0)';
        message.style.transition = 'all 0.3s ease';
      }, 100);
      
      // Reset button state
      submitButton.disabled = false;
      submitButton.innerHTML = `
        <i class="fas fa-paper-plane"></i>
        <span class="button-text">Submit</span>
      `;
      submitButton.style.animation = 'none';
    }
  });

  // Helper function for confetti effect
  function createConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);
    
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
      confettiContainer.appendChild(confetti);
    }
    
    setTimeout(() => {
      confettiContainer.style.opacity = '0';
      setTimeout(() => confettiContainer.remove(), 1000);
    }, 3000);
  }
});