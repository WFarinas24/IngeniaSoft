(() => {
	const introSection = document.querySelector(".intro-section");
	const pageBg = document.querySelector(".page-bg");
	const header = document.querySelector(".topbar");
	const navLinks = Array.from(document.querySelectorAll(".nav-pill .nav-link[href^='#']"));
	const sectionLinks = navLinks
		.map((link) => {
			const targetId = link.getAttribute("href")?.slice(1);
			const section = targetId ? document.getElementById(targetId) : null;

			return section ? { link, section } : null;
		})
		.filter(Boolean);

	const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

	const shuffle = (items) => {
		const values = [...items];
		for (let index = values.length - 1; index > 0; index -= 1) {
			const randomIndex = Math.floor(Math.random() * (index + 1));
			[values[index], values[randomIndex]] = [values[randomIndex], values[index]];
		}
		return values;
	};

	const updateStarColors = () => {
		if (!pageBg) {
			return;
		}

		const palette = shuffle([
			"rgba(246, 248, 255, 0.92)",
			"rgba(255, 227, 136, 0.9)",
			"rgba(255, 173, 217, 0.9)"
		]);

		pageBg.style.setProperty("--star-a", palette[0]);
		pageBg.style.setProperty("--star-b", palette[1]);
		pageBg.style.setProperty("--star-c", palette[2]);
	};

	const scheduleStarColors = () => {
		const nextMs = 1600 + Math.random() * 3000;

		window.setTimeout(() => {
			updateStarColors();
			scheduleStarColors();
		}, nextMs);
	};

	const spawnRareComet = () => {
		if (!pageBg || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			return;
		}

		const comet = document.createElement("span");
		comet.className = "comet";

		const startX = -8 + Math.random() * 82;
		const startY = 2 + Math.random() * 42;
		const travelX = 260 + Math.random() * 260;
		const travelY = 120 + Math.random() * 170;
		const angle = (Math.atan2(travelY, travelX) * 180) / Math.PI;
		const duration = 1.15 + Math.random() * 0.95;
		const width = 120 + Math.random() * 100;

		comet.style.left = `${startX}%`;
		comet.style.top = `${startY}%`;
		comet.style.setProperty("--comet-angle", `${angle}deg`);
		comet.style.setProperty("--comet-x", `${travelX}px`);
		comet.style.setProperty("--comet-y", `${travelY}px`);
		comet.style.setProperty("--comet-duration", `${duration}s`);
		comet.style.width = `${width}px`;

		pageBg.appendChild(comet);

		window.setTimeout(() => {
			comet.remove();
		}, (duration + 0.3) * 1000);
	};

	const scheduleComet = () => {
		const nextMs = 200 + Math.random() * 1000;

		window.setTimeout(() => {
			spawnRareComet();
			scheduleComet();
		}, nextMs);
	};

	const setActiveLink = (activeLink) => {
		navLinks.forEach((link) => {
			link.classList.toggle("active", link === activeLink);
		});
	};

	const updateActiveSection = () => {
		if (!sectionLinks.length) {
			return;
		}

		const headerOffset = (header?.offsetHeight ?? 88) + 20;
		const probeLine = headerOffset + window.innerHeight * 0.18;

		let active = sectionLinks[0].link;

		for (const item of sectionLinks) {
			const rect = item.section.getBoundingClientRect();

			if (rect.top <= probeLine && rect.bottom > probeLine) {
				active = item.link;
				break;
			}

			if (rect.top <= probeLine) {
				active = item.link;
			}
		}

		setActiveLink(active);
	};

	const updateIntroFade = () => {
		if (!introSection) {
			return;
		}

		const rect = introSection.getBoundingClientRect();
		const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
		const fadeStart = 0;
		const fadeRange = Math.max(viewportHeight * 0.12, 1);
		const scrolledInsideIntro = clamp(-rect.top - fadeStart, 0, fadeRange);
		const progress = scrolledInsideIntro / fadeRange;
		const opacity = (1 - progress).toFixed(4);

		introSection.style.setProperty("--intro-fade", opacity);
	};

	let isTicking = false;

	const onScrollOrResize = () => {
		if (isTicking) {
			return;
		}

		isTicking = true;
		window.requestAnimationFrame(() => {
			updateIntroFade();
			updateActiveSection();
			isTicking = false;
		});
	};

	window.addEventListener("scroll", onScrollOrResize, { passive: true });
	window.addEventListener("resize", onScrollOrResize);
	updateIntroFade();
	updateActiveSection();
	updateStarColors();
	scheduleStarColors();
	scheduleComet();
})();
