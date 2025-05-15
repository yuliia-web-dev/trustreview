"use strict"

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

	// Закриття меню при кліку поза ним
	if (isMenuOpen && !targetElement.closest('.menu__body')) {
		menuClose();
	}
}