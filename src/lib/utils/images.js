// Eagerly load all image URLs from the lib/images directory
const images = import.meta.glob('/src/lib/images/**/*', { eager: true, query: '?url', import: 'default' });

export function getImageUrl(imagePath) {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;

  const key = Object.keys(images).find((k) => k.endsWith(`/${imagePath}`));
  return key ? images[key] : imagePath;
}