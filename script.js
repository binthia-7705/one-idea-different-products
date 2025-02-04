document.getElementById("study-form").addEventListener("submit", function(event) {
    event.preventDefault();

    // Get inputs from form
    const subject = document.getElementById("subject").value;
    const examDate = new Date(document.getElementById("exam-date").value);
    const syllabus = document.getElementById("syllabus").value.split(",").map(item => item.trim());
    const studyTimePerDay = parseInt(document.getElementById("study-time").value);

    // Get current date
    const currentDate = new Date();
    const totalDaysLeft = Math.ceil((examDate - currentDate) / (1000 * 60 * 60 * 24)); // Days left until the exam

    // Calculate how many portions to cover each day
    const portionsPerDay = Math.ceil(syllabus.length / totalDaysLeft);

    // Create a study plan
    const planList = document.getElementById("plan-list");
    planList.innerHTML = "";  // Clear any existing plans

    let currentDay = currentDate;
    for (let i = 0; i < totalDaysLeft; i++) {
        const dayStart = currentDay.toLocaleDateString();
        const dayEnd = new Date(currentDay.getTime() + (studyTimePerDay * 60 * 60 * 1000));
        const dayEndFormatted = dayEnd.toLocaleTimeString();

        const planItem = document.createElement("li");
        planItem.innerHTML = `
            <input type="checkbox" id="day${i+1}" onclick="markComplete(${i}, this)">
            Day ${i + 1} - ${subject}: Study ${portionsPerDay} portions from ${dayStart} to ${dayEndFormatted}
        `;
        planList.appendChild(planItem);

        // Update the current day for the next iteration
        currentDay = new Date(dayEnd.getTime() + (1000 * 60 * 60 * 24)); // Move to the next day
    }

    // Update countdown timer
    updateCountdownTimer(examDate);
});

// Countdown Timer
function updateCountdownTimer(examDate) {
    const countdownElement = document.getElementById("countdown");

    const interval = setInterval(() => {
        const currentDate = new Date();
        const timeDiff = examDate - currentDate;
        
        if (timeDiff <= 0) {
            clearInterval(interval);
            countdownElement.textContent = "Exam Day!";
        } else {
            const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hoursLeft = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const secondsLeft = Math.floor((timeDiff % (1000 * 60)) / 1000);
            
            countdownElement.textContent = `${daysLeft}d ${hoursLeft}h ${minutesLeft}m ${secondsLeft}s remaining until the exam.`;
        }
    }, 1000);
}

// Mark the task as complete
function markComplete(index, checkbox) {
    const planList = document.getElementById("plan-list");
    const listItem = planList.children[index];
    
    if (checkbox.checked) {
        listItem.classList.add("complete");
        showPopup("Great job! You've completed this section! 🎉");
        updateProgressBar();  // Update progress bar when a section is completed
    } else {
        listItem.classList.remove("complete");
        hidePopup();
        updateProgressBar();  // Update progress bar when a section is unchecked
    }
}

// Show the popup when a section is completed
function showPopup(message) {
    const popup = document.getElementById("popup");
    const popupMessage = popup.querySelector("h2");
    popupMessage.textContent = message;
    popup.style.display = "flex";

    // Close the popup when the close button is clicked
    document.getElementById("popup-close").addEventListener("click", function() {
        popup.style.display = "none";
    });

    // Automatically hide the popup after 3 seconds
    setTimeout(() => {
        popup.style.display = "none";
    }, 3000);
}

// Hide the popup
function hidePopup() {
    const popup = document.getElementById("popup");
    popup.style.display = "none";
}

// Update progress bar based on completed tasks
function updateProgressBar() {
    const totalItems = document.getElementById("plan-list").children.length;
    const completedItems = document.querySelectorAll("#plan-list .complete").length;
    
    const progress = (completedItems / totalItems) * 100;
    const progressBar = document.getElementById("progress-bar");

    progressBar.style.width = `${progress}%`;
}
