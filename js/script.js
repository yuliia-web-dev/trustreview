"use strict"

document.addEventListener("click", documentActions);

function documentActions(e) {
	const targetElement = e.target;

	// Toggle the menu open/close when clicking on the menu icon
	if (targetElement.closest('.icon-menu')) {
		document.body.classList.toggle('menu-open');
		targetElement.closest('.icon-menu').classList.toggle('open');
	}
}

// Handle menu link clicks
document.querySelectorAll('.menu__link').forEach(link => {
	link.addEventListener('click', function () {
		// Close the menu when clicking on a navigation link
		document.querySelector('.menu__body').classList.remove('open');
		document.body.classList.remove('menu-open');

		// Remove the open class from all icons
		document.querySelectorAll('.icon-menu').forEach(icon =>
			icon.classList.remove('open')
		);
	});
});


//Move header button

document.addEventListener("DOMContentLoaded", function () {
	function moveElements() {
		const screenWidth = window.innerWidth;
		const elementsToMove = document.querySelectorAll("[data-da]");

		elementsToMove.forEach(function (element) {
			const data = element.getAttribute("data-da").split(",");
			if (data.length === 3) {
				const destinationSelector = data[0].trim();
				const order = parseInt(data[1].trim());
				const requiredScreenWidth = parseInt(data[2].trim());

				const destination = document.querySelector(destinationSelector);
				if (!destination) return;

				// Збереження початкового контейнера
				if (!element.dataset.originalParent) {
					const parent = element.parentNode;
					const index = Array.from(parent.children).indexOf(element);
					element.dataset.originalParent = parent.tagName.toLowerCase() + (parent.id ? `#${parent.id}` : '') + (parent.className ? `.${parent.className.replace(/\s+/g, '.')}` : '');
					element.dataset.originalIndex = index;
				}

				if (screenWidth <= requiredScreenWidth && !element.classList.contains("moved")) {
					// Переміщення в нове місце
					if (order === 1) {
						destination.insertBefore(element, destination.firstChild);
					} else {
						const previousElement = destination.children[order - 2];
						if (previousElement) {
							destination.insertBefore(element, previousElement.nextSibling);
						} else {
							destination.appendChild(element);
						}
					}
					element.classList.add("moved");
				} else if (screenWidth > requiredScreenWidth && element.classList.contains("moved")) {
					// Повернення на початкове місце
					const originalParentSelector = element.dataset.originalParent;
					const originalIndex = parseInt(element.dataset.originalIndex, 10);
					const originalParent = document.querySelector(originalParentSelector);

					if (originalParent) {
						const children = Array.from(originalParent.children);
						if (originalIndex < children.length) {
							originalParent.insertBefore(element, children[originalIndex]);
						} else {
							originalParent.appendChild(element);
						}
						element.classList.remove("moved");
					}
				}
			}
		});
	}

	moveElements();

	window.addEventListener("resize", function () {
		moveElements();
	});
});


//scrolled header
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
	const scrolled = window.scrollY > 10;

	if (scrolled && !header.classList.contains('scrolled')) {
		header.classList.add('scrolled');
	} else if (!scrolled && header.classList.contains('scrolled')) {
		header.classList.remove('scrolled');
	}
});

//===================Placeholder=========
function updatePlaceholder() {
	const searchInput = document.getElementById("search");

	if (!searchInput) return;

	if (window.innerWidth <= 495) {
		searchInput.placeholder = "Enter the website domain";
	} else {
		searchInput.placeholder = "Enter the website domain or company name";
	}
}

document.addEventListener("DOMContentLoaded", updatePlaceholder);

window.addEventListener("resize", updatePlaceholder);

//======================OpenPopup======================

document.addEventListener('DOMContentLoaded', () => {
	const popupLinks = document.querySelectorAll('.popup-link');
	const body = document.querySelector('body');
	const lockPadding = document.querySelectorAll('.lock-padding');
	const timeout = 500;
	let unlock = true;

	// Open popups
	if (popupLinks.length > 0) {
		popupLinks.forEach(popupLink => {
			popupLink.addEventListener("click", function (e) {
				e.preventDefault();
				const popupName = popupLink.getAttribute('href').replace('#', '');
				const currentPopup = document.getElementById(popupName);
				popupOpen(currentPopup);
			});
		});
	}

	// Close popups by button
	const popupCloseIcon = document.querySelectorAll('.close-popup');
	popupCloseIcon.forEach(el => {
		el.addEventListener('click', function (e) {
			e.preventDefault();
			const popup = el.closest('.popup');
			if (popup) popupClose(popup);
		});
	});

	// Open popup function
	function popupOpen(currentPopup) {
		if (currentPopup && unlock) {
			const popupActive = document.querySelector('.popup.open');
			if (popupActive) {
				popupClose(popupActive, false);
			} else {
				bodyLock();
			}
			currentPopup.classList.add('open');

			currentPopup.addEventListener("click", function (e) {
				if (!e.target.closest('.popup__content')) {
					popupClose(e.target.closest('.popup'));
				}
			});
		}
	}

	// Close popup function
	function popupClose(popupActive, doUnlock = true, callback) {
		if (unlock) {
			popupActive.classList.remove('open');
			if (doUnlock) {
				bodyUnLock();
			}
			if (callback) {
				setTimeout(() => {
					callback();
				}, timeout);
			}
		}
	}

	// Lock body scroll when popup is open
	function bodyLock() {
		const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
		body.style.paddingRight = lockPaddingValue;
		lockPadding.forEach(el => {
			el.style.paddingRight = lockPaddingValue;
		});
		body.classList.add('lock');
		unlock = false;
		setTimeout(() => unlock = true, timeout);
	}

	// Unlock body scroll
	function bodyUnLock() {
		setTimeout(() => {
			lockPadding.forEach(el => el.style.paddingRight = '0px');
			body.style.paddingRight = '0px';
			body.classList.remove('lock');
		}, timeout);
	}

	// Close popup on Escape key press
	document.addEventListener('keydown', e => {
		if (e.key === 'Escape') {
			const popupActive = document.querySelector('.popup.open');
			if (popupActive) popupClose(popupActive);
		}
	});

	// Message popup logic
	const messageSubmit = document.getElementById('messageSubmit');

	function showMessage() {
		if (!messageSubmit) return;
		messageSubmit.classList.add('show');
		// Automatically hide after 3 seconds
		setTimeout(() => {
			messageSubmit.classList.remove('show');
		}, 3000);
	}

	if (messageSubmit) {
		const messageCloseBtn = messageSubmit.querySelector('.close-message');
		if (messageCloseBtn) {
			messageCloseBtn.addEventListener('click', () => {
				messageSubmit.classList.remove('show');
			});
		}
	}

	// Handle form submit inside popup
	const popupForms = document.querySelectorAll('.popup__form');

	popupForms.forEach(form => {
		form.addEventListener('submit', e => {
			e.preventDefault();

			const popup = form.closest('.popup');
			if (popup) {
				popupClose(popup, true, showMessage);
			} else {
				showMessage();
			}
		});
	});
});


//=========ContactForm validation===============

document.addEventListener('DOMContentLoaded', function () {
	const form = document.getElementById('contactForm');
	if (!form) return;

	const name = document.getElementById('name');
	const email = document.getElementById('email');
	const website = document.getElementById('website');
	const question = document.getElementById('question');

	if (!name || !email || !website || !question) return;

	form.addEventListener('submit', function (e) {
		let isValid = true;

		const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
		const urlPattern = /^(https?:\/\/)?([\w\d\-]+\.)+\w{2,}(\/\S*)?$/;


		// Validate Name: at least 2 characters
		if (name.value.trim().length < 2) {
			isValid = false;
		}

		// Validate Email using pattern
		if (!emailPattern.test(email.value.trim())) {
			isValid = false;
		}

		// Validate Website using pattern
		if (!urlPattern.test(website.value.trim())) {
			isValid = false;
		}

		// Validate Question: at least 10 characters
		if (question.value.trim().length < 10) {
			isValid = false;
		}

		if (!isValid) {
			e.preventDefault();
			alert('Please check your input and try again.');
		}
	});
});


//=======ClaimForm validation=============

// document.addEventListener('DOMContentLoaded', function () {
// 	const form = document.getElementById('claimForm');
// 	if (!form) return;

// 	form.addEventListener('submit', function (e) {
// 		const nameInput = document.getElementById('name');
// 		const emailInput = document.getElementById('email');

// 		const name = nameInput.value.trim();
// 		const email = emailInput.value.trim();
// 		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 		let isValid = true;

// 		if (name === '') {
// 			isValid = false;
// 		}

// 		if (!emailPattern.test(email)) {
// 			isValid = false;
// 		}

// 		if (!isValid) {
// 			e.preventDefault();
// 			alert('Please fill out all fields correctly.');
// 		}
// 	});
// });

//==========Rating===============

document.querySelectorAll('[data-rating]').forEach(rating => {
	const value = parseFloat(rating.dataset.rating);
	const items = rating.querySelectorAll('.rating__item');
	const number = rating.querySelector('.rating__number');

	// Determine background color for active stars
	let activeBg = '#ccc'; // default gray
	if (value >= 1 && value < 4) {
		activeBg = '#FF3B30'; // red for ratings between 1 and 3.99
	} else if (value >= 4) {
		activeBg = '#28A745'; // green for ratings 4 and above
	}

	items.forEach((item, index) => {
		// Initially, all stars are gray
		item.style.background = '#DCDBDB';

		// Fully filled stars for the integer part of the rating
		if (index < Math.floor(value)) {
			item.style.background = activeBg;
		}
		// Partially filled star for the decimal part
		else if (index === Math.floor(value) && value % 1 !== 0) {
			const percent = value % 1 * 100;
			item.style.background = `linear-gradient(to right, ${activeBg} ${percent}%, #ccc ${percent}%)`;
		}
	});

	// Display the numeric rating value if the element exists
	if (number) number.textContent = value.toFixed(1);
});
