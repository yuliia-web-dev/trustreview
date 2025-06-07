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

document.addEventListener('DOMContentLoaded', () => {
	const ratings = document.querySelectorAll('.rating');

	if (ratings.length > 0) {
		ratings.forEach(rating => {
			const value = parseInt(rating.dataset.rating, 10);
			const stars = rating.querySelectorAll('.rating__item');

			if (!isNaN(value)) {
				stars.forEach((star, index) => {
					star.classList.toggle('active', index < value);
				});
			}
		});
	}
});

//==============Stepper==================
const stepItems = document.querySelectorAll('.item-step');
const stepContents = document.querySelectorAll('.step-form');

stepItems.forEach((step, index) => {
	step.addEventListener('click', () => {
		if (index === stepItems.length - 1) {
			window.location.href = 'confirm.html';
			return;
		}

		stepItems.forEach((item, i) => {
			const progress = item.querySelector('.item-step__progress');
			const title = item.querySelector('.item-step__title');

			item.classList.remove('active');
			title.classList.remove('active');

			if (i < index) {
				progress.className = 'item-step__progress item-step__progress--filled';
				progress.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <path fill="white" d="M12.53 4.97a.75.75 0 010 1.06L7.03 11.53a.75.75 0 01-1.06 0L3.47 9.03a.75.75 0 111.06-1.06L6.5 9.94l4.97-4.97a.75.75 0 011.06 0z"/>
          </svg>
        `;
			} else if (i === index) {
				progress.className = 'item-step__progress item-step__progress--current';
				progress.textContent = i + 1;
				item.classList.add('active');
				title.classList.add('active');
			} else {
				progress.className = 'item-step__progress item-step__progress--default';
				progress.textContent = i + 1;
			}
		});

		const currentActive = document.querySelector('.step-form.active');
		const nextActive = document.querySelector(`.step-form[data-step-content="${index}"]`);

		if (currentActive !== nextActive) {
			if (currentActive) currentActive.classList.remove('active');
			if (nextActive) nextActive.classList.add('active');
		}
	});
});




//================Select===============

const customSelects = document.querySelectorAll('.custom-select');

customSelects.forEach(select => {
	const trigger = select.querySelector('.custom-select__trigger span');
	const options = select.querySelectorAll('.custom-select__option');

	// Toggle the dropdown on trigger click
	select.querySelector('.custom-select__trigger').addEventListener('click', (e) => {
		e.stopPropagation(); // Prevent immediate closing due to document click
		// Close other open dropdowns
		customSelects.forEach(other => {
			if (other !== select) {
				other.classList.remove('open');
			}
		});
		select.classList.toggle('open');
	});

	// Set selected option and close dropdown
	options.forEach(option => {
		option.addEventListener('click', (e) => {
			trigger.textContent = option.textContent.trim(); // Set selected option text
			select.classList.remove('open');
		});
	});
});

// Close dropdowns when clicking outside
document.addEventListener('click', () => {
	customSelects.forEach(select => {
		select.classList.remove('open');
	});
});


