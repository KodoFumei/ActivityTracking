document.addEventListener("DOMContentLoaded", function () {
    const activityList = document.getElementById("activity-list");
    const totalDuration = document.getElementById("total-duration");
    const addActivityButton = document.getElementById("add-activity");
    const activitySelect = document.getElementById("activity-select");
    const customActivityInput = document.getElementById("custom-activity");
    const content = document.getElementById("content");
    const categorySelect = document.getElementById("category-select");
    const showHoursButton = document.getElementById("show-hours-button");
    const hoursSpent = document.getElementById("hours-spent");

    /* Load activities from local storage */
    const activities = JSON.parse(localStorage.getItem("activities")) || [];

    function updateActivityList() {
        activityList.innerHTML = "";
        let totalMinutes = 0;

        activities.forEach((activity, index) => {
            const li = document.createElement("li");
            li.innerHTML = `${activity.date} - ${activity.activity} - ${activity.duration} minutes`;
            li.innerHTML = `${formatDate(activity.date)} - ${activity.activity} - ${activity.duration} minutes`;

            const deleteButton = document.createElement("button");
            deleteButton.innerText = "Delete";
            deleteButton.addEventListener("click", () => {
                activities.splice(index, 1);
                updateActivityList();
                saveActivitiesToLocalStorage();
            });

            li.appendChild(deleteButton);
            activityList.appendChild(li);

            totalMinutes += parseInt(activity.duration);
        });

        /* Convert total minutes to hours and minutes */
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        totalDuration.innerText = `${hours} hours ${minutes} minutes`;

        /* Date format */
        function formatDate(dateString) {
            const date = new Date(dateString);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }

    }

    function saveActivitiesToLocalStorage() {
        localStorage.setItem("activities", JSON.stringify(activities));
    }

    function showErrorAlert(message) {
        alert(message);
    }

    updateActivityList(); /*change1. */

    activitySelect.addEventListener("change", function () {
        if (activitySelect.value === "custom") {
            customActivityInput.style.display = "block";
        } else {
            customActivityInput.style.display = "none";
        }

        
    });

    addActivityButton.addEventListener("click", function () {
        const activityInput = customActivityInput.style.display === "none" ? activitySelect.value : customActivityInput.value;
        const dateInput = document.getElementById("date");
        const durationInput = document.getElementById("duration");

        const date = dateInput.value;
        const duration = durationInput.value;

        if (activitySelect.value === "custom" && customActivityInput.value === "") {
            showErrorAlert("Please enter a custom activity.");
            customActivityInput.classList.add("error-highlight");
        } else if (!date) {
            showErrorAlert("Please select a date.");
            dateInput.classList.add("error-highlight");
        } else if (!duration) {
            showErrorAlert("Please enter a duration.");
            durationInput.classList.add("error-highlight");
        } else {
            /* (activityInput && date && duration) */
            activities.push({ activity: activityInput, date, duration });
            saveActivitiesToLocalStorage();
            updateActivityList();

            /* Clear input fields */
            if (customActivityInput.style.display === "none") {
                activitySelect.value = "custom";
            } else {
                customActivityInput.value = "";
            }
            dateInput.value = "";
            durationInput.value = "";
            durationInput.classList.remove("error-highlight");
            dateInput.classList.remove("error-highlight");
            customActivityInput.classList.remove("error-highlight");
        }
    });

    showHoursButton.addEventListener("click", function () {
        const selectedCategory = categorySelect.value;
        let categoryTotalMinutes = 0;

        activities.forEach((activity) => {
            if (selectedCategory === "" || activity.activity === selectedCategory) {
                categoryTotalMinutes += parseInt(activity.duration);
            }
        });

        const categoryHours = Math.floor(categoryTotalMinutes / 60);
        const categoryMinutes = categoryTotalMinutes % 60;

        hoursSpent.innerText = `Hours spent in ${selectedCategory}: ${categoryHours} hours ${categoryMinutes} minutes`;
    });

    updateActivityList();
});

