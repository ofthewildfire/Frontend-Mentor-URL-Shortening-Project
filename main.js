import "./src/styles/index.scss";

// Global variables
const hamburgerMenu = document.querySelector(".hamburger-menu");
const shortenLinkBtn = document.querySelector(".shorten-link-btn");
const linkInput = document.querySelector(".link-input"); // added variable for link input to append an event listener too (see below)
const container = document.querySelector(".shortend-urls-container");
container.innerHTML = getHTML();

// Event listeners
shortenLinkBtn.addEventListener("click", callAPI);
linkInput.addEventListener("keyup", function (e) {
	// added an event listener for when the user presses 'enter' on their keyboard - a common UX feature. This listens for the respective key value for the enter button, then calls the function callAPI
	e.keyCode === 13 && (e.preventDefault(), callAPI());
});
hamburgerMenu.addEventListener("click", function () {
	const navList = document.querySelector(".nav-list");
	navList.classList.toggle("hidden");
	// A much cleaner way is to use the toggle() function to toggle the "hidden" class of the ".nav-list". If the class is present,it will be removed. if it isn't present, it will be added.
});

// The API.
async function callAPI() {
	const inputURL = document.querySelector("#url-input").value;
	// const container = document.querySelector(".shortend-urls-container"); omitted as this is declared globally above

	// This if statement checks if the url being entered is valid, by using the function declared below and passing in the urlLink (aka input) as the parameter which is used to test against the condition in the function below
	try {
		const response = await fetch(
			`https://api.shrtco.de/v2/shorten?url=${inputURL}/`
		);
		const data = await response.json();
		const urlLink = `https://www.${data.result.short_link}`; // replaced concatenated string value with template literals for ES6 consistency
		const urlPackage = { original: inputURL, short: urlLink };

		//
		document.querySelector(".error").style.display = "none";
		document.querySelector("#url-input").style.border = "2px solid green";

		container.innerHTML += `
			<div class="shortend-url">
        <div class="shortend-left-section">
				  <a class="input">${inputURL}</a>
        </div>
        <div class="shortend-right-section">
          <a class="url">${urlLink}</a>
          <button class="btn copy-btn">
          Copy It
          </button>
        </div>
			</div>
				`; // updated this to match the template in the getHTML() function below (so both stored links and new generated ones follow the same styling)

		// changed the h2 content to a tags to make them more semantically correct - should avoid multiple h2 tags and use them for subheadings

		linksInStorage(urlPackage);
	} catch (err) {
		console.log(err); // added logging the error to console - will also help with debugging
		// err = "Sorry, not sure what happened there!"; // omitted as doesn't show in the console log
		document.querySelector(".error").style.display = "block";
		document.querySelector("#url-input").style.border = "2px solid red";
		document
			.querySelector("#url-input")
			.style.setProperty("--color", "#f46262");
		// when the catch is run, the --color variable is passed red for the placeholder text
		// Oh, I have never seen this before. Very cool.
	} // temporarily removed if-else as code inside wasn't running. Will review this - this function is therefore likely to change in future commits

	// Clear the input box
	document.querySelector("#url-input").value = "";
	getHTML();
}

/// Clipboard API
// Text copying.
const urlBoxContainer = document.querySelector(".shortend-urls-container");

urlBoxContainer.addEventListener("click", (event) => {
	const clicked = event.target;
	const urlToCopy = clicked.previousElementSibling.innerText;

	if (clicked.classList.contains("copy-btn")) {
		navigator.clipboard
			.writeText(urlToCopy)
			.then(() => {
				// Temp styling and changed on copy, its 6-am and my brain is just not having this "sleep deprivation" anymore. But, I am happy it works. Will work on it more.
				clicked.innerText = "Copied!"; // slight modification to this just to reflect mockups active state - addition of !
				clicked.style.backgroundColor = "#3b3054";
				clicked.style.transition = " background-color .5s ease-in-out";
				//
			})
			.catch((err) => {
				console.error(`Error copying text to clipboard: ${err}`);
			});
	}
});

// Function to test for validity of the url using URL constructor.

function checkURL(string) {
	/* let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:"; */

	const urlPattern = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/i;
	return urlPattern.test(string);

	// when checking the validity of an entry, in this case a URL, it is standard practice to use regular expressions to check if the entry matches a defined pattern which deems it 'acceptable' or not. This uses the test() method and returns a boolean value (true or false) indicating whether the string is a valid URL according to the pattern.

	// regex is difficult to understand at first - I'll send you notes about it in detail, which should (hopefully) help with the side studying in it (if you haven't started regex yet, I can send you a good freeCodeCamp tutorial)

	// I literally cannot even understand that url pattern. I dont know what I am looking at there. So, that info will be helpful, I will begin the process just as soon as I finish typing this pointless sentence of course.
}

//
function linksInStorage(link) {
	let linkHistory = JSON.parse(localStorage.getItem("linkies")) || [];
	linkHistory.push(link);
	localStorage.setItem("linkies", JSON.stringify(linkHistory));
	return linkHistory;
}

function getHTML() {
	let content = linksInStorage();
	let html = "";
	content.forEach((item) => {
		if (item) {
			html += `
        <div class="shortend-url">
          <div class="shortend-left-section">
			      <a class="input">${item.original}</a>
          </div>
          <div class="shortend-right-section">
			      <a class="url">${item.short}</a>
			      <button class="btn copy-btn"> 
              Copy It 
            </button>
          </div>
		    </div>
			`;
		}
	});
	return html;
}

// I've modified the html content above for the getHTML() function to match the mockup better. The respective styling is in the index.scss file (this will likely change location as I move things around).

// changed the h2 content to a tags to make them more semantically correct - should avoid multiple h2 tags and use them for subheadings
