// components
export { default as ElectricCard } from '$lib/components/ElectricCard.svelte';
export { default as Section } from '$lib/components/Section.svelte';
export { default as GalleryCarousel } from '$lib/components/GalleryCarousel.svelte';
export { default as AchievementCard } from '$lib/components/AchievementCard.svelte';
export { default as NewsCard } from '$lib/components/NewsCard.svelte';

// utils
export { reveal } from '$lib/utils/animations.js';
export { getImageUrl } from '$lib/utils/images.js';

// data
export { default as achievementsData } from '$lib/data/achievements.json';
export { default as newsData } from '$lib/data/newsroom.json';
export { default as epochData } from '$lib/data/epoch.json';
export { default as galleryData } from '$lib/data/gallery.json';
export { default as associationData } from '$lib/data/association.json';
export { default as oppamData } from '$lib/data/oppam.json';