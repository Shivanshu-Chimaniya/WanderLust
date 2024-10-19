let con = document.getElementById("preview-container-container");
document
	.getElementById("image-input")
	.addEventListener("change", function (event) {
		const fileInput = event.target;
		const previewContainer = document.getElementById("preview-container");
		previewContainer.innerHTML = "";
		const files = fileInput.files;
		con.style.display = files.length > 0 ? "block" : "none";

		if (files.length > 5) {
			con.style.display = "none";
			alert("only 5 images can be uploaded.");
			return;
		}
		// preview Code
		Array.from(files).forEach((file) => {
			const reader = new FileReader();
			reader.onload = function (e) {
				const previewItem = document.createElement("div");
				previewItem.className = "preview-item";

				const img = document.createElement("img");
				img.src = e.target.result;

				const deleteButton = document.createElement("button");

				deleteButton.classList.add("delete-button");
				deleteButton.classList.add("btn");
				deleteButton.classList.add("btn-dark");
				deleteButton.textContent = "Delete";
				deleteButton.addEventListener("click", function () {
					alert("Delete to be Implemented, please re-select.");
				});
				previewItem.appendChild(img);
				previewItem.appendChild(deleteButton);
				previewContainer.appendChild(previewItem);
			};
			reader.readAsDataURL(file);
		});
	});
document
	.getElementById("listingForm")
	.addEventListener("submit", function (event) {
		const fileInput = document.getElementById("image-input");
		if (fileInput.files.length > 5) {
			event.preventDefault();
			alert("only 5 images can be uploaded.");
		}
	});
