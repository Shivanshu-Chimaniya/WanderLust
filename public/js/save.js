const saveButton = document.getElementById("saveButton");
const unsaveButton = document.getElementById("unsaveButton");
const URL = `/listings/${listingId}/`;
if (isSignedIn) {
	document.addEventListener("DOMContentLoaded", async (event) => {
		let result = await fetch(URL + "issaved");
		let response = await result.json();
		// console.log(response.isSaved);
		if (response.isSaved) {
			hide(saveButton);
			show(unsaveButton);
		}
	});
}

function hide(element) {
	element.style.display = "none";
}
function show(element) {
	element.style.display = "inline";
}
function disable(element) {
	element.disabled = true;
}
function enable(element) {
	element.disabled = false;
}
function flashSignIn() {
	alert("sign in");
}
function flash(msg) {
	alert(msg);
}
async function saveListing() {
	if (!isSignedIn) {
		flashSignIn();
		return;
	}
	hide(saveButton);
	show(unsaveButton);
	disable(unsaveButton);
	let result = await fetch(URL + `save`, {
		method: "put",
	});
	let response = await result.json();
	if (response.success) {
		enable(unsaveButton);
	} else {
		hide(unsaveButton);
		show(saveButton);
	}
}
async function unsaveListing() {
	if (!isSignedIn) {
		flashSignIn();
		return;
	}
	hide(unsaveButton);
	show(saveButton);
	disable(saveButton);
	let result = await fetch(URL + `unsave`, {
		method: "put",
	});
	let response = await result.json();
	if (response.success) {
		enable(saveButton);
	} else {
		hide(saveButton);
		show(unsaveButton);
	}
}
