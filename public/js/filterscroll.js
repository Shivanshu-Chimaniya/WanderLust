let filterBar = document.getElementById("navbar-filterbar");
let rightBtn = document.getElementById("navbar-filter-right-btn");
let leftBtn = document.getElementById("navbar-filter-left-btn");
const scrollValue = (filterBar.clientWidth / 3) * 2;
const scrollLimits = 300;
const wheelMultiplier = 3;

const interval = 100;
var lastCall = 0;

let handleScroll = (evt) => {
	var now = Date.now();
	evt.preventDefault();
	if (lastCall + interval < now) {
		lastCall = now;
		let newVal = filterBar.scrollLeft + evt.deltaY * wheelMultiplier;
		leftBtn.style.display = "inline";
		rightBtn.style.display = "inline";
		if (newVal < scrollLimits) {
			leftBtn.style.display = "none";
			newVal = 0;
		} else if (
			filterBar.scrollLeft -
				filterBar.scrollWidth +
				filterBar.offsetWidth >
			-scrollLimits
		) {
			newVal = filterBar.scrollWidth - filterBar.offsetWidth;
			rightBtn.style.display = "none";
		}
		filterBar.style.display.scrollBehavior = "smooth";
		filterBar.scrollLeft = newVal;
	}
};

filterBar.addEventListener("wheel", (evt) => handleScroll(evt), {
	passive: false,
});

rightBtn.addEventListener("click", () => {
	filterBar.style.display.scrollBehavior = "smooth";
	let newVal = filterBar.scrollLeft + scrollValue;
	filterBar.scrollLeft = newVal;
	leftBtn.style.display = "inline";
	if (
		newVal - filterBar.scrollWidth + filterBar.offsetWidth >
		-scrollLimits
	) {
		filterBar.scrollLeft = filterBar.scrollWidth - filterBar.offsetWidth;
		rightBtn.style.display = "none";
	}
});
leftBtn.addEventListener("click", () => {
	filterBar.style.display.scrollBehavior = "smooth";
	let newVal = filterBar.scrollLeft - scrollValue;
	filterBar.scrollLeft = newVal;
	rightBtn.style.display = "inline";
	if (newVal < scrollLimits) {
		filterBar.scrollLeft = 0;
		leftBtn.style.display = "none";
	}
});

window.addEventListener("resize", function (event) {
	if (filterBar.scrollWidth <= filterBar.clientWidth) {
		leftBtn.style.display = "none";
		rightBtn.style.display = "none";
	} else {
		leftBtn.style.display = "inline";
		rightBtn.style.display = "inline";
		if (
			filterBar.scrollLeft -
				filterBar.scrollWidth +
				filterBar.offsetWidth >
			-scrollLimits
		) {
			filterBar.scrollLeft =
				filterBar.scrollWidth - filterBar.offsetWidth;
			rightBtn.style.display = "none";
		} else if (filterBar.scrollLeft < scrollLimits) {
			filterBar.scrollLeft = 0;
			leftBtn.style.display = "none";
		}
	}
});

if (filterBar.scrollWidth > filterBar.clientWidth) {
	rightBtn.style.display = "inline";
}
