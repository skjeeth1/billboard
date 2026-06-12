
<script>
	import HomeSection from './sections/Home.svelte'
	import AboutSection from './sections/About.svelte'
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=JetBrains+Mono:wght@400;600;700&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="page-wrapper">
	<HomeSection/>
	<AboutSection/>
	
</div>

<style>
	.page-wrapper {
		font-family: 'JetBrains Mono', monospace;
		background-color: #1a1b26;
		color: #c0caf5;
		margin: 0;
		padding: 0;
		overflow-x: hidden;
		overflow-y: hidden;
	}

	
</style>
