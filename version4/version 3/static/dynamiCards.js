document.addEventListener("DOMContentLoaded", function () {
    loadServices("/get_services", "cardContainer"); // Load electrical services
    loadServices("/get_home_services", "homeServiceContainer"); // Load home services
    loadServices("/get_catering_services", "cateringServiceContainer"); // Load catering services
});

function loadServices(apiUrl, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    fetch(apiUrl)
        .then(response => response.json()) 
        .then(services => {
            container.innerHTML = "";

            services.forEach(service => {
                const card = document.createElement("div");
                card.classList.add("card");

                let stars = "";
                let fullStars = Math.floor(service.ratings || 5);
                let hasHalfStar = service.ratings % 1 !== 0;

                for (let i = 0; i < fullStars; i++) {
                    stars += '<i class="fa-solid fa-star" style="color: gold; margin-right: 2px;"></i>';
                }
                if (hasHalfStar) {
                    stars += '<i class="fa-solid fa-star-half-alt" style="color: gold; margin-right: 2px;"></i>';
                }

                card.innerHTML = `
                    <img src="${service.profile_image || '../static/default_service.jpg'}" alt="Service Image">
                    <div class="card-content">
                        <div class="flexible">
                            <div class="profile"> 
                                <img src="${service.profile_image || '../static/default_profile.jpg'}" alt="Profile Image">
                            </div>
                            <div class="align">
                                <div class="name">${service.username}</div>
                                <div class="service_type">${service.service_category}</div>
                            </div>
                        </div>
                        <div class="address">${service.email}</div>
                        <div class="flexible">
                            <div class="ratings">${stars}</div>
                            <div class="reachout">
                                <button class="reach" onclick="callNow('${service.phone}')">
                                    <i class="fa-solid fa-phone" style="color: #5876d0; font-size: 20px;"></i> Let's Talk
                                </button>
                                <button class="reach" onclick="openWhatsApp('${service.phone}')">
                                    <i class="fa-brands fa-whatsapp" style="color: #3bde92; font-size: 20px;"></i> Let's Chat
                                </button>
                            </div>
                        </div>
                        <div class="View-Listing">
                            <button class="view-more" data-id="${service.id}">View More</button>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });

            document.querySelectorAll(".view-more").forEach(button => {
                button.addEventListener("click", function () {
                    const serviceId = this.getAttribute("data-id");
                   window.location.href = `/view-more?id=${serviceId}`;
                });
            });
        })
        .catch(error => console.error("Error fetching data:", error));
}

function openWhatsApp(phone) {
    let url = `https://wa.me/${phone}?text=${encodeURIComponent("Hello, I found your service!")}`;
    window.open(url, "_blank");
}

function callNow(phone) {
    window.location.href = `tel:${phone}`;
}
