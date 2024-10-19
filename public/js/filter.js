let activeFilters = [];
let allListingsObject = document.querySelectorAll(".cardsContainer .card");
let activeFiltersBar = document.querySelector("#active-filters-bar");
let noResult = document.querySelector(".no-results");
let input = document.querySelector("#all-listing-searchbar");

let allListings = [];
for (let listing of allListingsObject) {
	allListings.push(listing);
}

let handleChange = () => {
	refine(activeFilters, input.value.toLowerCase());
};
let submitForm = (event, el) => {
	event.preventDefault();
	refine(activeFilters, input.value.toLowerCase());
};

let handleRemoveFilter = (e) => {
	if (e.target.tagName == "SPAN") {
		let filterName = e.target.innerHTML;
		activeFilters.splice(activeFilters.indexOf(filterName), 1);

		let allActives = document.querySelectorAll(
			`.filters-and-btns .filters .active`
		);
		for (let filterEl of allActives) {
			if (filterEl.innerText == filterName) {
				filterEl.classList.remove("active");
				break;
			}
		}
		refine(activeFilters, input.value.toLowerCase());
	}
};

input.addEventListener("keyup", handleChange);
activeFiltersBar.addEventListener("click", (e) => handleRemoveFilter(e));

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
	if (activeFilters.length != 0) {
		let str = "Active Filters :";
		for (let af of activeFilters) {
			str += `<span class="badge rounded-pill text-bg-red m-1">${af}</span>`;
		}
		activeFiltersBar.innerHTML = str;
	} else {
		activeFiltersBar.innerHTML = "";
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
	refine(activeFilters, input.value.toLowerCase());
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
	return listing.querySelector(".listing-name").innerText.toLowerCase();
}
