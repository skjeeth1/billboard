<script>
    import { reveal } from '$lib/animation.js'
</script>

<section class="about-section" id="about" use:reveal>
    <h3 class="section-title">ABOUT</h3>

    <p class="description">
        Driven by a mission of academic excellence, research innovation, and strong industry-alumni
        networking.
    </p>

    <p class="dummy-text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin elementum tincidunt massa, vel
        facilisis ex eleifend vitae. Sed non lectus id libero dapibus scelerisque. Nulla facilisi.
        Cras congue, sapien eu eleifend sollicitudin, felis quam cursus mauris, id semper arcu nunc
        eget est. Phasellus id venenatis ex.
    </p>
</section>

<style>
	/* --- About Section --- */
	.about-section {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		text-align: left;
		padding: 6rem 2rem;
		box-sizing: border-box;
		max-width: 800px;
		margin: 0 auto;
	}
	.section-title {
		font-family: 'Atkinson Hyperlegible', sans-serif;
		font-size: 1.5rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		color: #bb9af7;
		margin-bottom: 2rem;
	}

	.description {
		font-size: 1.1rem;
		line-height: 1.6;
		color: #a9b1d6;
		margin-bottom: 2.5rem;
	}

	.dummy-text {
		font-size: 0.95rem;
		line-height: 1.7;
		color: #565f89;
		max-width: 600px;
	}

	/* --- Responsive --- */
	@media (max-width: 768px) {
		.about-section {
			padding: 4rem 3rem;
		}
	}
</style>