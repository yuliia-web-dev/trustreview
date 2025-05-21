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

const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll('.lock-padding');

let unlock = true;

const timeout = 500;

if (popupLinks.length > 0) {
	for (let index = 0; index < popupLinks.length; index++) {
		const popupLink = popupLinks[index];
		popupLink.addEventListener("click", function (e) {
			const popupName = popupLink.getAttribute('href').replace('#', '');
			const curentPopup = document.getElementById(popupName);
			popupOpen(curentPopup);
			e.preventDefault();
		})
	}
}
const popupCloseIcon = document.querySelectorAll('.close-popup');
if (popupCloseIcon.length > 0) {
	for (let index = 0; index < popupCloseIcon.length; index++) {
		const el = popupCloseIcon[index];
		el.addEventListener('click', function (e) {
			const popup = el.closest('.popup');
			if (popup) {
				popupClose(popup);
			}
			e.preventDefault();
		});
	}
}


function popupOpen(curentPopup) {
	if (curentPopup && unlock) {
		const popupActive = document.querySelector('.popup.open');
		if (popupActive) {
			popupClose(popupActive, false);
		}
		else {
			bodyLock();
		}
	}

	curentPopup.classList.add('open');
	curentPopup.addEventListener("click", function (e) {
		if (!e.target.closest('.popup__content')) {
			popupClose(e.target.closest('.popup'));
		}
	});
}

function popupClose(popupActive, doUnlock = true) {
	if (unlock) {
		popupActive.classList.remove('open');
		if (doUnlock) {
			bodyUnLock();
		}
	}
}




function bodyLock() {
	const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';


	body.style.paddingRight = lockPaddingValue;
	body.classList.add('lock');

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}

function bodyUnLock() {
	setTimeout(function () {
		for (let index = 0; index < lockPadding.length; index++) {
			const el = lockPadding[index];
			el.style.paddingRight = '0px';
		}
		body.style.paddingRight = '0px';
		body.classList.remove('lock');
	}, timeout);
}

document.addEventListener('keydown', function (e) {
	if (e.key === 'Escape') {
		const popupActive = document.querySelector('.popup.open');
		if (popupActive) {
			popupClose(popupActive);
		}
	}
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

document.addEventListener('DOMContentLoaded', function () {
	const form = document.getElementById('claimForm');
	if (!form) return; 

	form.addEventListener('submit', function (e) {
		const nameInput = document.getElementById('name');
		const emailInput = document.getElementById('email');

		const name = nameInput.value.trim();
		const email = emailInput.value.trim();
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		let isValid = true;

		if (name === '') {
			isValid = false;
		}

		if (!emailPattern.test(email)) {
			isValid = false;
		}

		if (!isValid) {
			e.preventDefault();
			alert('Please fill out all fields correctly.');
		}
	});
});
