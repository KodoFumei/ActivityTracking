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

        /* Sort activities by date in ascending order (oldest to newest) */
        activities.sort((a, b) => new Date(a.date) - new Date(b.date));

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

        if (activitySelect.value === "choose") {
            showErrorAlert("Please choose activity.");
        } else if (activitySelect.value === "custom" && customActivityInput.value === "") {
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

    /* Define the getWeekNumber function */
    function getWeekNumber(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    }
    showHoursButton.addEventListener("click", function () {
        const selectedCategory = categorySelect.value;
        const selectedCategoryActivities = activities.filter(activity =>
            selectedCategory === "" || activity.activity === selectedCategory
        );

        const groupedActivities = groupActivitiesByWeek(selectedCategoryActivities);

        let categoryTotalMinutes = 0;
        let message = `Hours spent in ${selectedCategory}:\n`;

        /* Iterate through the grouped activities */
        groupedActivities.forEach((group, weekNumber) => {
            const weekTotalMinutes = group.reduce((total, activity) => total + parseInt(activity.duration), 0);
            categoryTotalMinutes += weekTotalMinutes;

            const weekHours = Math.floor(weekTotalMinutes / 60);
            const weekMinutes = weekTotalMinutes % 60;

            message += `Week ${weekNumber}: ${weekHours} hours ${weekMinutes} minutes\n`;
        });

        const categoryHours = Math.floor(categoryTotalMinutes / 60);
        const categoryMinutes = categoryTotalMinutes % 60;

        message += `\nTotal: ${categoryHours} hours ${categoryMinutes} minutes`;

        hoursSpent.innerText = message;

        categorySelect.scrollIntoView({ behavior: "smooth" });
        categorySelect.value = "";

    });

    /* Helper function to group activities by week */
    function groupActivitiesByWeek(activities) {
        const groupedActivities = new Map();

        activities.forEach((activity) => {
            const weekNumber = getWeekNumber(new Date(activity.date));

            if (!groupedActivities.has(weekNumber)) {
                groupedActivities.set(weekNumber, []);
            }

            groupedActivities.get(weekNumber).push(activity);
        });

        return groupedActivities;
    }

});

