// Global references for message box
let messageBoxOverlay;
let messageBoxTitle;
let messageBoxMessage;
let messageBoxCloseBtn;

function setupMessageBox() {
  messageBoxOverlay = document.getElementById('messageBoxOverlay');
  messageBoxTitle = document.getElementById('messageBoxTitle');
  messageBoxMessage = document.getElementById('messageBoxMessage');
  messageBoxCloseBtn = document.getElementById('messageBoxCloseBtn');

  if (messageBoxCloseBtn) {
    messageBoxCloseBtn.addEventListener('click', hideMessageBox);
    // Hide on overlay click as well
    messageBoxOverlay.addEventListener('click', function(event) {
      if (event.target === messageBoxOverlay) {
        hideMessageBox();
      }
    });
  } else {
    console.error('Message box elements not found. Ensure messageBoxOverlay, messageBoxTitle, messageBoxMessage, and messageBoxCloseBtn IDs exist in index.html');
  }
}

function showMessageBox(title, message) {
  if (messageBoxTitle && messageBoxMessage && messageBoxOverlay) {
    messageBoxTitle.textContent = title;
    messageBoxMessage.textContent = message;
    messageBoxOverlay.classList.add('visible');
  }
}

function hideMessageBox() {
  if (messageBoxOverlay) {
    messageBoxOverlay.classList.remove('visible');
  }
}

// --- Dynamic Content Loading & Event Handlers ---
const mainContent = document.getElementById("main-content");

// Function to attach image enlargement handler
function setupProfileImageEnlargement() {
  const profileImage = document.getElementById('profileImage');
  if (profileImage) {
    profileImage.addEventListener('click', function() {
      this.classList.toggle('enlarged');
    });
  } else {
    console.warn('Profile image with ID "profileImage" not found after loading content. This is expected if not on the main-content page.');
  }
}

// Function to trigger typing effect
function triggerTypingEffect() {
  const text = "Hi! My name is Lakshya Verma, I'm a passionate web developer with experience in creating beautiful and functional websites. I specialize in front-end development using HTML, CSS & JavaScript and learning backend development.";
  const typingElement = document.getElementById("typing-text");
  let charIndex = 0;

  if (!typingElement) {
    console.warn('Typing text element with ID "typing-text" not found. This is expected if not on the main-content page.');
    return;
  }

  // Clear any pre-existing content and reset for re-typing
  typingElement.textContent = "";
  charIndex = 0; // Reset index for re-typing

  function typeWriter() {
    if (charIndex < text.length) {
      typingElement.innerHTML = text.substring(0, charIndex + 1) + '<span>|</span>';
      charIndex++;
      setTimeout(typeWriter, 50); // Typing speed
    } else {
      typingElement.innerHTML = text; // Ensure text is fully displayed
      // Remove blinking cursor at the end
      const cursorSpan = typingElement.querySelector('span');
      if (cursorSpan) {
        cursorSpan.remove();
      }
    }
  }
  typeWriter();
}

// Function to attach contact form handler
function attachContactFormHandler() {
  const form = document.getElementById("contact-form");
  if (!form) {
    console.warn('Contact form with ID "contact-form" not found after loading content. This is expected if not on the contact page.');
    return;
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (name && email && message) {
      try {
        const response = await fetch('/submit-contact', { // Fetch to Express endpoint
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, message }), // Send data as JSON
        });

        const result = await response.json(); // Parse JSON response from server

        if (response.ok && result.success) {
          showMessageBox("Success!", result.message);
          form.reset();
        } else {
          // Handle server-side errors or non-success responses
          showMessageBox("Error", result.message || "Failed to send message. Please try again.");
        }
      } catch (error) {
        console.error('Error submitting contact form:', error);
        showMessageBox("Error", "Network error or server issue. Please try again later.");
      }
    } else {
      showMessageBox("Error", "Please fill out all fields.");
    }
  });
}

// Main function to load content into the #main-content area
async function loadPage(pageName) {
  try {
    // Show a loading indicator if desired
    mainContent.innerHTML = '<p style="text-align: center; color: #00bcd4;">Loading content...</p>';

    // Fetch HTML file from 'pages/' using the pageName
    // This path is relative to the 'public' folder, which is served by Express
    const response = await fetch(`pages/${pageName}.html`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    mainContent.innerHTML = html;

    // Update URL in browser history without reloading
    const newPath = pageName === 'main-content' ? '/' : `/${pageName}`;
    history.pushState(null, '', newPath);

    // Re-attach specific handlers based on the loaded page
    if (pageName === "main-content") {
      setupProfileImageEnlargement();
      triggerTypingEffect();
    } else if (pageName === "contact") {
      attachContactFormHandler();
    } else if (pageName === "project") { // Added condition for 'project' page
      // No specific JS handlers needed for the project page content currently
      // but you can add them here if you add interactive elements to project.html
    }
    // Add more conditions here for other pages if they need specific JS
  } catch (err) {
    console.error("Error loading content:", err);
    mainContent.innerHTML = `<p style="text-align: center; color: red;">Error loading content: ${err.message}. Please try again.</p>`;
  }
}

// --- Event Listeners for Navigation ---
document.addEventListener("DOMContentLoaded", function () {
  setupMessageBox(); // Initialize message box on DOM load

  // Navigation links
  const navLinks = document.querySelectorAll("header nav ul li a");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const page = this.getAttribute("data-page"); // Get data-page attribute (e.g., "main-content", "about", "project")
      if (page) {
        loadPage(page);
      }
    });
  });

  // Header title click to load main-content
  const siteTitle = document.querySelector(".site-title");
  if (siteTitle) {
    siteTitle.addEventListener("click", function (e) {
      e.preventDefault();
      loadPage('main-content');
    });
  }

  // Handle browser back/forward buttons
  window.addEventListener('popstate', function(event) {
    // Get the current path from the URL
    const currentPath = window.location.pathname;
    // Determine the page name from the path
    let pageToLoad = 'main-content'; // Default to main-content
    if (currentPath !== '/') {
      // Remove leading '/' and handle potential .html extension if accidentally in URL
      pageToLoad = currentPath.substring(1).replace('.html', '');
    }
    loadPage(pageToLoad);
  });

  // Initial page load based on current URL or default to main-content
  const initialPath = window.location.pathname;
  let initialPage = 'main-content';
  if (initialPath !== '/') {
    initialPage = initialPath.substring(1).replace('.html', ''); // Remove leading '/' and handle potential .html extension
  }
  loadPage(initialPage);
});
