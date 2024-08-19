let activeFilters = [];
let allListingsObject = document.querySelectorAll(".cardsContainer .card");
let allListings = [];
for (let listing of allListingsObject) {
	allListings.push(listing);
}
let noResult = document.querySelector(".no-results");

let input = document.querySelector("#all-listing-searchbar");

let handleChange = () => {
	refine(activeFilters, input.value);
};

let submitForm = (event, el) => {
	event.preventDefault();
	refine(activeFilters, input.value);
};

let refine = (activeFilters, searchPrompt) => {
	let allListings = [];
	for (let listing of allListingsObject) {
		allListings.push(listing);
	}
	allListings = allListings.filter((el) =>
		getListingName(el).includes(searchPrompt)
	);
	let temp = [];
	for (listing of allListings) {
		let currFilters = listing.getAttribute("filters").split("/");
		let show = true;
		for (let activeFilter of activeFilters) {
			if (!currFilters.includes(activeFilter)) {
				show = false;
				break;
			}
		}
		if (show) {
			temp.push(listing);
		}
	}
	for (let listing of allListingsObject) {
		if (temp.includes(listing)) {
			listing.style.display = "inline";
		} else {
			listing.style.display = "none";
		}
	}
	for (let listing of allListingsObject) {
		if (listing.style.display == "inline") {
			noResult.style.display = "none";
			return;
		}
	}
	noResult.style.display = "flex";
};

let clicked = (filter) => {
	if (allListings.length == 0) {
		noResult.style.display = "flex";
		return;
	}
	if (activeFilters.includes(getFilterName(filter))) {
		remove(filter);
	} else {
		add(filter);
	}
	refine(activeFilters, input.value);
};

function remove(el) {
	activeFilters.splice(activeFilters.indexOf(getFilterName(el)), 1);
	el.classList.remove("active");
}
function add(el) {
	activeFilters.push(getFilterName(el));
	el.classList.add("active");
}
function getFilterName(filter) {
	return filter.lastChild.innerText;
}
function getListingName(listing) {
	return listing.querySelector(".listing-name").innerText;
}
