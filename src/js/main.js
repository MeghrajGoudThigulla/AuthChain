document.addEventListener('DOMContentLoaded', () => {
	"use strict";

	const dropdowns = document.querySelectorAll('nav .dropdown');

	dropdowns.forEach(dropdown => {
		dropdown.addEventListener('mouseenter', function () {
			this.classList.add('show');
			const toggle = this.querySelector('> a');
			if (toggle) toggle.setAttribute('aria-expanded', 'true');
			const menu = this.querySelector('.dropdown-menu');
			if (menu) menu.classList.add('show');
		});

		dropdown.addEventListener('mouseleave', function () {
			this.classList.remove('show');
			const toggle = this.querySelector('> a');
			if (toggle) toggle.setAttribute('aria-expanded', 'false');
			const menu = this.querySelector('.dropdown-menu');
			if (menu) menu.classList.remove('show');
		});
	});
});
