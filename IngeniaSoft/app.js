(() => {
	const introSection = document.querySelector(".intro-section");

	if (!introSection) {
		return;
	}

	const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

	const updateIntroFade = () => {
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
			isTicking = false;
		});
	};

	window.addEventListener("scroll", onScrollOrResize, { passive: true });
	window.addEventListener("resize", onScrollOrResize);
	updateIntroFade();
})();
