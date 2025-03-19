// DOM Elements
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const quoteContainer = document.getElementById('quote-container');
const quoteContent = document.getElementById('quote-content');

// Unsplash API for random background images
const unsplashURL = 'https://source.unsplash.com/1600x900/?abstract,texture';

// Function to animate content change
async function animateContentChange(newQuote, newAuthor) {
    // Add slide-out animation
    quoteContent.classList.add('slide-out');
    
    // Wait for slide-out animation to complete
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update content
    quoteText.textContent = newQuote;
    quoteAuthor.textContent = `- ${newAuthor || 'Unknown'}`;
    
    // Remove slide-out and add slide-in animation
    quoteContent.classList.remove('slide-out');
    quoteContent.classList.add('slide-in');
    
    // Remove slide-in class after animation completes
    setTimeout(() => {
        quoteContent.classList.remove('slide-in');
    }, 500);
}

// Function to fetch a new quote
async function fetchNewQuote() {
    try {
        const response = await fetch('https://api.freeapi.app/api/v1/public/quotes/quote/random');
        const data = await response.json();
        
        if (data.success && data.data) {
            const { content, author } = data.data;
            
            // Animate content change
            await animateContentChange(content, author);
            
            // Update background pattern with fade effect
            const newBackground = `
                linear-gradient(to right, rgba(30, 64, 175, 0.95), rgba(147, 51, 234, 0.95)),
                url(${unsplashURL}?${new Date().getTime()})
            `;
            document.body.style.backgroundImage = newBackground;
            
            // Add subtle scale animation to container
            quoteContainer.style.transform = 'scale(1.02)';
            setTimeout(() => {
                quoteContainer.style.transform = 'scale(1)';
            }, 200);
            
        } else {
            throw new Error('Failed to fetch quote');
        }
    } catch (error) {
        console.error('Error fetching quote:', error);
        quoteText.textContent = 'Failed to fetch quote. Please try again.';
        quoteAuthor.textContent = '';
    }
}

// Function to copy quote to clipboard
async function copyToClipboard() {
    const textToCopy = `${quoteText.textContent} ${quoteAuthor.textContent}`;
    try {
        await navigator.clipboard.writeText(textToCopy);
        // Show success message
        const button = document.querySelector('button[onclick="copyToClipboard()"]');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i><span>Copied!</span>';
        button.classList.add('bg-green-500');
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('bg-green-500');
        }, 2000);
    } catch (error) {
        console.error('Failed to copy:', error);
        alert('Failed to copy quote');
    }
}

// Function to share on Twitter
function shareOnTwitter() {
    const text = encodeURIComponent(`${quoteText.textContent} ${quoteAuthor.textContent}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
}

// Function to export quote as image
async function exportQuote() {
    try {
        // Create a temporary container for the export
        const tempContainer = document.createElement('div');
        tempContainer.className = quoteContainer.className;
        tempContainer.style.padding = '2rem';
        tempContainer.style.width = '600px';
        
        // Clone the quote content
        const contentClone = quoteContent.cloneNode(true);
        tempContainer.appendChild(contentClone);
        
        // Temporarily add to document (off-screen)
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        document.body.appendChild(tempContainer);
        
        // Generate image
        const canvas = await html2canvas(tempContainer);
        const link = document.createElement('a');
        link.download = 'quote.png';
        link.href = canvas.toDataURL();
        link.click();
        
        // Clean up
        document.body.removeChild(tempContainer);
    } catch (error) {
        console.error('Error exporting quote:', error);
        alert('Failed to export quote');
    }
}

// Fetch initial quote when page loads
document.addEventListener('DOMContentLoaded', fetchNewQuote);