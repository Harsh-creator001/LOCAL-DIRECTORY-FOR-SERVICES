document.getElementById("serviceForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let formData = {
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        service_category: document.getElementById("service_category").value,
        description: document.getElementById("description").value,
        locations: document.getElementById("locations").value,
        working_hours: document.getElementById("working_hours").value,
        experience: document.getElementById("experience").value,
        projects_completed: document.getElementById("projects_completed").value,
        pricing: document.getElementById("pricing").value
    };

    fetch('/register-service-provider', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error("Error:", error));
});
