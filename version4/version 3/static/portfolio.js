// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Navigation menu toggle for mobile
    const hamburger = document.querySelector(".hamburger")
    const navLinks = document.querySelector(".nav-links")
  
    if (hamburger && navLinks) {
      hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active")
        navLinks.classList.toggle("active")
      })
  
      // Close menu when clicking on a nav link
      const navItems = document.querySelectorAll(".nav-links a")
      navItems.forEach((item) => {
        item.addEventListener("click", () => {
          hamburger.classList.remove("active")
          navLinks.classList.remove("active")
        })
      })
    }
  
    // Header scroll effect
    const header = document.querySelector("header")
  
    if (header) {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
          header.classList.add("scrolled")
        } else {
          header.classList.remove("scrolled")
        }
      })
    }
  
    // Project filtering
    const filterButtons = document.querySelectorAll(".filter-btn")
    const projectItems = document.querySelectorAll(".project-item")
  
    if (filterButtons.length && projectItems.length) {
      filterButtons.forEach((button) => {
        button.addEventListener("click", function () {
          // Remove active class from all buttons
          filterButtons.forEach((btn) => btn.classList.remove("active"))
  
          // Add active class to clicked button
          this.classList.add("active")
  
          const filterValue = this.getAttribute("data-filter")
  
          // Filter projects
          projectItems.forEach((item) => {
            if (filterValue === "all") {
              item.style.display = "block"
            } else {
              if (item.getAttribute("data-category") === filterValue) {
                item.style.display = "block"
              } else {
                item.style.display = "none"
              }
            }
          })
        })
      })
    }
  
    // Form submission
    const contactForm = document.getElementById("contactForm")
  
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        // Get form values
        const name = document.getElementById("name").value
        const email = document.getElementById("email").value
        const subject = document.getElementById("subject").value
        const message = document.getElementById("message").value
  
        // Basic form validation
        if (!name || !email || !subject || !message) {
          alert("Please fill in all fields")
          return
        }
  
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          alert("Please enter a valid email address")
          return
        }
  
        // Here you would typically send the form data to a server
        // For this example, we'll just show a success message
        alert("Thank you for your message! I will get back to you soon.")
        contactForm.reset()
      })
    }
  
    // Add smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault()
  
        const targetId = this.getAttribute("href")
        const targetElement = document.querySelector(targetId)
  
        if (targetElement) {
          // Calculate header height for offset
          const headerHeight = document.querySelector("header").offsetHeight
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight
  
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          })
        }
      })
    })
  
    // Add animation on scroll
    const animateOnScroll = () => {
      const sections = document.querySelectorAll("section")
  
      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top
        const windowHeight = window.innerHeight
  
        if (sectionTop < windowHeight * 0.75) {
          section.classList.add("animate")
        }
      })
    }
  
    // Initial check for elements in view
    animateOnScroll()
  
    // Check on scroll
    window.addEventListener("scroll", animateOnScroll)
  
    // Skill bar animation
    const animateSkillBars = () => {
      const skillSection = document.querySelector(".skills")
  
      if (skillSection) {
        const sectionTop = skillSection.getBoundingClientRect().top
        const windowHeight = window.innerHeight
  
        if (sectionTop < windowHeight * 0.75) {
          const skillBars = document.querySelectorAll(".skill-progress")
  
          skillBars.forEach((bar) => {
            const width = bar.style.width
            bar.style.width = "0"
  
            setTimeout(() => {
              bar.style.transition = "width 1s ease-in-out"
              bar.style.width = width
            }, 100)
          })
  
          // Remove the event listener once animation is triggered
          window.removeEventListener("scroll", animateSkillBars)
        }
      }
    }
  
    // Check on scroll for skill bars
    window.addEventListener("scroll", animateSkillBars)
  
    // Trigger once on load in case section is already in view
    animateSkillBars()
  })
  
  