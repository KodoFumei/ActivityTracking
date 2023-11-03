document.addEventListener("DOMContentLoaded", function () {
    const activityList = document.getElementById("activity-list");
    const totalDuration = document.getElementById("total-duration");
    const addActivityButton = document.getElementById("add-activity");
    const activitySelect = document.getElementById("activity-select");
    const customActivityInput = document.getElementById("custom-activity");

    // Load activities from local storage
    const activities = JSON.parse(localStorage.getItem("activities")) || [];

    function updateActivityList() {
        activityList.innerHTML = "";
        let totalMinutes = 0;

        activities.forEach((activity, index) => {
            const li = document.createElement("li");
            li.innerHTML = `${activity.activity} - ${activity.date} - ${activity.duration} minutes`;

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

        // Convert total minutes to hours and minutes
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        totalDuration.innerText = `${hours} hours ${minutes} minutes`;
    }

    function saveActivitiesToLocalStorage() {
        localStorage.setItem("activities", JSON.stringify(activities));
    }

    updateActivityList();

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

        if (activityInput && date && duration) {
            activities.push({ activity: activityInput, date, duration });
            saveActivitiesToLocalStorage();
            updateActivityList();

            // Clear input fields
            if (customActivityInput.style.display === "none") {
                activitySelect.value = "custom";
            } else {
                customActivityInput.value = "";
            }
            dateInput.value = "";
            durationInput.value = "";
        }
    });
});
