"use strict"

document.addEventListener('click', documentActions);

function documentActions(e) {
	const targetElement = e.target;
	const iconMenu = document.querySelector('.icon-menu');
	const menuBody = document.querySelector('.menu__body');
	const isMenuOpen = document.body.classList.contains('menu-open');

	// Клік по бургер-іконці
	if (targetElement.closest('.icon-menu')) {
		iconMenu.classList.toggle('active');
		document.body.classList.toggle('menu-open');

		if (document.body.classList.contains('menu-open')) {
			menuOpen();
		} else {
			menuClose();
		}
		return;
	}

	// Клік по пункту меню
	if (targetElement.closest('.menu__link')) {
		document.querySelectorAll('.menu__link').forEach(link => link.classList.remove('active'));
		targetElement.closest('.menu__link').classList.add('active'); // Додаємо активний клас

		menuClose();
		return;
	}

	// Закриття меню при кліку поза ним
	if (isMenuOpen && !targetElement.closest('.menu__body')) {
		menuClose();
	}
}

function menuOpen() {
	const menuBody = document.querySelector('.menu__body');
	const maxMenuHeight = Math.min(window.innerHeight * 0.8, menuBody.scrollHeight);
	menuBody.style.maxHeight = `${maxMenuHeight}px`;

	bodyLock();
}

function menuClose() {
	const menuBody = document.querySelector('.menu__body');
	menuBody.style.maxHeight = '0px';

	bodyUnlock();
	document.body.classList.remove('menu-open');
	document.querySelector('.icon-menu').classList.remove('active');
}

// Функції блокування прокрутки без стрибка контенту
function bodyLock() {
	const scrollWidth = window.innerWidth - document.documentElement.clientWidth;
	document.body.style.overflow = 'hidden';
	document.body.style.paddingRight = `${scrollWidth}px`;
}

function bodyUnlock() {
	document.body.style.overflow = '';
	document.body.style.paddingRight = '';
}


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
