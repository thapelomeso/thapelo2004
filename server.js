    const apiExperienceUrl = "http://localhost:5000/api/experience";  // Adjust if deployed
    let experience = [];  // Array to store the experience data
    let currentEditIndex = -1;  // Track if we're editing an experience

    // Function to fetch experience data from the server
    async function fetchExperience() {
        const response = await fetch(apiExperienceUrl);
        experience = await response.json();
        displayExperience(experience);
    }

    // Function to display experience data in the HTML
    function displayExperience(experienceList) {
        const experienceSection = document.getElementById("experience-section");
        experienceSection.innerHTML = "";

        experienceList.forEach((item, index) => {
            const experienceBox = document.createElement("div");
            experienceBox.classList.add("resume_box");

            experienceBox.innerHTML = `
                <span class="resume_date">${item.startDate} - ${item.endDate}</span>
                <p class="resume_box_title">${item.title}</p>
                <p class="resume_conpany">${item.company}</p>
                <p class="resume_text">${item.description}</p>
                <button onclick="editExperience(${index})">Edit</button>
                <button onclick="deleteExperience(${index})">Delete</button>
            `;

            experienceSection.appendChild(experienceBox);
        });
    }

    // Function to handle form submission for adding/updating experience
    document.getElementById("experience-form").addEventListener("submit", async function (event) {
        event.preventDefault();

        // Get the values from the form inputs
        const startDate = document.getElementById("startDate").value;
        const endDate = document.getElementById("endDate").value;
        const title = document.getElementById("title").value;
        const company = document.getElementById("company").value;
        const description = document.getElementById("description").value;

        const newExperience = { startDate, endDate, title, company, description };

        if (currentEditIndex === -1) {
            // POST request to add new experience
            await fetch(apiExperienceUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newExperience)
            });
        } else {
            // PUT request to update existing experience
            await fetch(`${apiExperienceUrl}/${experience[currentEditIndex]._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newExperience)
            });
            currentEditIndex = -1;  // Reset after editing
        }

        // Fetch and display updated experience data
        fetchExperience();
        document.getElementById("experience-form").reset();  // Clear the form
    });

    // Function to populate the form for editing an existing experience
    function editExperience(index) {
        currentEditIndex = index;  // Store the index of the item being edited

        // Populate the form with the existing data
        document.getElementById("startDate").value = experience[index].startDate;
        document.getElementById("endDate").value = experience[index].endDate;
        document.getElementById("title").value = experience[index].title;
        document.getElementById("company").value = experience[index].company;
        document.getElementById("description").value = experience[index].description;
    }

    // Function to delete an experience
    async function deleteExperience(index) {
        await fetch(`${apiExperienceUrl}/${experience[index]._id}`, {
            method: "DELETE"
        });
        fetchExperience();  // Refresh the experience list
    }

    // Initial load
    fetchExperience();

