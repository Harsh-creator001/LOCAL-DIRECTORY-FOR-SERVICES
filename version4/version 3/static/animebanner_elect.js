// Create floating light bulbs effect
const banner = document.querySelector('.banner');
const createBulbs = () => {
    for (let i = 0; i < 15; i++) {
        const bulb = document.createElement('div');
        bulb.classList.add('bulb');
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        bulb.style.left = `${posX}%`;
        bulb.style.top = `${posY}%`;
        
        // Random size
        const size = Math.random() * 10 + 5;
        bulb.style.width = `${size}px`;
        bulb.style.height = `${size}px`;
        
        // Random animation
        const duration = Math.random() * 10 + 5;
        bulb.style.animation = `pulse ${duration}s infinite`;
        bulb.style.animationDelay = `${Math.random() * 5}s`;
        
        banner.appendChild(bulb);
    }
};

// Slider functionality
const slider = document.getElementById('slider');
const dots = document.querySelectorAll('.slider-dot');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentSlide = 0;
const totalSlides = 3;

// Function to update slider position
function updateSlider() {
    slider.style.transform = `translateX(-${currentSlide * 33.333}%)`;
    
    // Update active dot
    dots.forEach((dot, index) => {
        if (index === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Next slide function
function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
}

// Previous slide function
function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
}

// Event listeners for navigation
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Event listeners for dots
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        updateSlider();
    });
});

// Auto slide every 5 seconds
let slideInterval = setInterval(nextSlide, 5000);

// Pause auto slide on hover
banner.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
});

// Resume auto slide when mouse leaves
banner.addEventListener('mouseleave', () => {
    slideInterval = setInterval(nextSlide, 5000);
});

// Add click event to CTA buttons
const ctaButtons = document.querySelectorAll('.cta-button');
ctaButtons.forEach(button => {
    button.addEventListener('click', function() {
        const provider = this.getAttribute('data-provider');
        alert(`Thank you for your interest in ${provider}! Our team will contact you shortly.`);
    });
});

// Initialize bulbs
createBulbs();