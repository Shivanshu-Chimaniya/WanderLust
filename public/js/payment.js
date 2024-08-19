function makeModal(modal) {
	console.log("hi");
	const myModal = new bootstrap.Modal(modal, {});
	myModal.toggle();
}
let URL = `/listings/${listingId}/`;
let feedback = document.querySelector("#feedback-text");

function giveAlert(message) {
	showText(message);
}

function showText(message) {
	feedback.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${message}`;
	feedback.style.display = "block";
}
function hideText() {
	feedback.style.display = "none";
}

async function checkAvailability(event) {
	event.preventDefault();
	hideText();
	const date1 = new Date(document.getElementById("date1").value);
	const date2 = new Date(document.getElementById("date2").value);
	if (date1 == "Invalid Date" || date2 == "Invalid Date") {
		giveAlert("fill dates properly");
		return;
	}
	if (date1 > date2) {
		giveAlert("put dates in order");
		return false;
	}
	let result = await fetch(
		URL +
			`canBook?d1=${date1.getDate()}&m1=${date1.getMonth()}&y1=${date1.getFullYear()}&d2=${date2.getDate()}&m2=${date2.getMonth()}&y2=${date2.getFullYear()}`
	);
	let response = await result.json();
	if (!response.success) {
		giveAlert(
			"Bookings overlap! this property is already booked for selected dates."
		);
		document.getElementById("date-form").reset();
		return false;
	} else {
		let fromDate = `${date1.getDate()}/${
			date1.getMonth() + 1
		}/${date1.getFullYear()}`;
		let toDate = `${date2.getDate()}/${
			date2.getMonth() + 1
		}/${date2.getFullYear()}`;
		let totalAmount = response.actualPrice * response.totalDays;
		let discountPercent = parseFloat(
			(
				100 -
				(response.discountedPrice * 100) / response.actualPrice
			).toPrecision(3)
		);
		let discountedAmount = Math.floor(
			(totalAmount * discountPercent) / 100
		);

		document.querySelector("#modal-listing-name").innerHTML =
			response.listingName;
		document.querySelector("#modal-from-date").innerHTML = fromDate;
		document.querySelector("#modal-to-date").innerHTML = toDate;
		document.querySelector(".modal-total-days1").innerHTML =
			response.totalDays;
		document.querySelector(".modal-total-days2").innerHTML =
			response.totalDays;
		document.querySelector("#modal-actual-price").innerHTML =
			response.actualPrice.toLocaleString("en-in");

		document.querySelector("#modal-total-price").innerHTML =
			totalAmount.toLocaleString("en-in");
		document.querySelector("#modal-discount-percent").innerHTML =
			discountPercent;
		document.querySelector("#modal-total-discount").innerHTML =
			discountedAmount.toLocaleString("en-in");
		document.querySelector("#modal-grand-total").innerHTML = (
			totalAmount - discountedAmount
		).toLocaleString("en-in");
		let modal = document.getElementById("staticBackdrop");
		makeModal(modal);
	}
}
async function confirmBooking() {
	document.getElementById("date-form").submit();
}
