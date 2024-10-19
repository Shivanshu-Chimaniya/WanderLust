const URL = `/listings/${listingId}/`;
if (isSignedIn) {
	document.addEventListener("DOMContentLoaded", async (event) => {
		let result = await fetch(URL + "issaved");
		let response = await result.json();
		if (response.isSaved) {
			let saveButton = document.getElementsByClassName("saveButton");
			let unsaveButton = document.getElementsByClassName("unsaveButton");
			hide(saveButton);
			show(unsaveButton);
		}
	});
}

function hide(elements) {
	for (let element of elements) {
		element.style.display = "none";
	}
}
function show(elements) {
	for (let element of elements) {
		element.style.display = "inline";
	}
}
function disable(elements) {
	for (let element of elements) {
		element.disabled = true;
	}
}
function enable(elements) {
	for (let element of elements) {
		element.disabled = false;
	}
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
	let saveButton = document.getElementsByClassName("saveButton");
	let unsaveButton = document.getElementsByClassName("unsaveButton");
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
	let saveButton = document.getElementsByClassName("saveButton");
	let unsaveButton = document.getElementsByClassName("unsaveButton");
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
