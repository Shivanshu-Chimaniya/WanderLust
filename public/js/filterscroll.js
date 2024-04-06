let filterBar = document.getElementById("navbar-filterbar");
let rightBtn = document.getElementById("navbar-filter-right-btn");
let leftBtn = document.getElementById("navbar-filter-left-btn");
let allFilters = filterBar.querySelectorAll("div");

for (let filter of allFilters) {
	filter.addEventListener("click", () => {
		if (filter.classList.contains("active")) {
			window.location.href = `/listings`;
		} else {
			clearFilters();
			window.location.href = `/listings?filter=${filter.innerText}`;
		}
	});
}

let clearFilters = () => {
	for (let filter of allFilters) {
		filter.classList.remove("active");
	}
};

filterBar.addEventListener("wheel", (evt) => {
	evt.preventDefault();
	leftBtn.style.display = "inline";
	rightBtn.style.display = "inline";
	if (filterBar.scrollLeft < 10) {
		filterBar.scrollLeft = 0;
		leftBtn.style.display = "none";
	}
	if (
		filterBar.scrollLeft - filterBar.scrollWidth + filterBar.offsetWidth >
		-50
	) {
		rightBtn.style.display = "none";
	}
	filterBar.scrollLeft += evt.deltaY;
});

rightBtn.addEventListener("click", () => {
	filterBar.scrollLeft += 1000;
	filterBar.style.display.scrollBehavior = "smooth";
	leftBtn.style.display = "inline";
	if (
		filterBar.scrollLeft - filterBar.scrollWidth + filterBar.offsetWidth >
		-50
	) {
		filterBar.scrollLeft = filterBar.scrollWidth - filterBar.offsetWidth;
		rightBtn.style.display = "none";
	}
});
leftBtn.addEventListener("click", () => {
	filterBar.style.display.scrollBehavior = "smooth";
	filterBar.scrollLeft -= 1000;
	rightBtn.style.display = "inline";
	if (filterBar.scrollLeft < 10) {
		filterBar.scrollLeft += 0;
		leftBtn.style.display = "none";
	}
});

window.addEventListener("resize", function (event) {
	if (filterBar.scrollWidth <= filterBar.clientWidth) {
		console.log("asdas");
		leftBtn.style.display = "none";
		rightBtn.style.display = "none";
	} else {
		leftBtn.style.display = "inline";
		rightBtn.style.display = "inline";
		if (filterBar.scrollLeft < 10) {
			filterBar.scrollLeft = 0;
			leftBtn.style.display = "none";
		}
		if (
			filterBar.scrollLeft -
				filterBar.scrollWidth +
				filterBar.offsetWidth >
			-50
		) {
			rightBtn.style.display = "none";
		}
	}
});
