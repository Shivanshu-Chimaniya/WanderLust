const specialDates = allBookings; // Define your special dates here
const currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth(); // April (0-indexed)

document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("current-year").textContent = currentYear;
	generateCalendar(currentYear, currentMonth);

	// Add event listeners to month buttons
	document.querySelectorAll(".month-selector span").forEach((span, index) => {
		span.addEventListener("click", () => {
			currentMonth = index;
			document
				.querySelector(".month-selector .active")
				?.classList.remove("active");
			span.classList.add("active");
			generateCalendar(currentYear, currentMonth);
		});
	});

	// Set the active month on load
	document
		.querySelector(`.month-selector span[data-month="${currentMonth}"]`)
		.classList.add("active");
});

function changeYear(direction) {
	currentYear += direction;
	document.getElementById("current-year").textContent = currentYear;
	generateCalendar(currentYear, currentMonth);
}

function generateCalendar(year, month) {
	const daysElement = document.getElementById("days");
	daysElement.innerHTML = "";

	const date = new Date(year, month, 1);
	const firstDayIndex = date.getDay();
	const lastDay = new Date(year, month + 1, 0).getDate();

	// Add empty days for alignment
	for (let i = 0; i < firstDayIndex; i++) {
		const emptyDiv = document.createElement("div");
		emptyDiv.classList.add("day");
		daysElement.appendChild(emptyDiv);
	}

	for (let i = 1; i <= lastDay; i++) {
		const dayDiv = document.createElement("div");
		dayDiv.classList.add("day");
		const fullDate = `${year}-${String(month + 1).padStart(
			2,
			"0"
		)}-${String(i).padStart(2, "0")}`;
		if (specialDates.includes(fullDate)) {
			dayDiv.classList.add("highlight");
		}
		dayDiv.textContent = i;
		daysElement.appendChild(dayDiv);
	}
}
