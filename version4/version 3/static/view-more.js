async function fetchServiceDetails(serviceId, serviceType) {
    try {
        const response = await fetch(`/get_service_details?id=${serviceId}&type=${serviceType}`);
        const service = await response.json();

        if (response.ok) {
            renderServiceDetails(service);
        } else {
            throw new Error(service.error || 'Failed to fetch service details');
        }
    } catch (error) {
        console.error('Error fetching service details:', error);
    }
}

function renderServiceDetails(service) {
    // Update service details dynamically
    // document.getElementById('service-image').src = service.service_image|| 'https://placehold.co/600x400/e2e8f0/1e293b?text=Service+Image';
    document.getElementById('service-title').textContent = service.username || 'Service Provider';
    document.getElementById('provider-name').textContent = service.username || 'Service Provider';
    document.getElementById('service-category').textContent = service.service_category || 'Service';
    document.getElementById('service-location').textContent = service.locations || 'Location not specified';
    document.getElementById('service-experience').textContent = service.experience || 'N/A';
    document.getElementById('projects-completed').textContent = service.projects_completed || 0;
    document.getElementById('service-phone').textContent = service.phone || 'N/A';
    
    // Description and Features
    document.getElementById('service-description').textContent = service.description || 'No description provided.';
    
    // Service Features (This can be dynamic based on your requirements)
    const features = [
        '✔ Fast and reliable',
        '✔ Experienced professionals',
        '✔ Competitive pricing'
    ];
    
    const featuresList = document.getElementById('service-features');
    featuresList.innerHTML = '';
    features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
    });

    // Contact info
    document.getElementById('contact-phone').textContent = service.phone || 'N/A';
    document.getElementById('contact-email').textContent = service.email || 'N/A';
    document.getElementById('contact-location').textContent = service.locations || 'N/A';
}

// Call the function with dynamic serviceId and serviceType based on URL parameters
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('id');
    const serviceType = urlParams.get('type');

    if (serviceId && serviceType) {
        fetchServiceDetails(serviceId, serviceType);
    } else {
        document.getElementById('service-details').innerHTML = `
            <div class="error">
                <p>Service details not found. Please go back and try again.</p>
            </div>
        `;
    }
});
