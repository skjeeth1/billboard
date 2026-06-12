export function reveal(node, { delay = 0 } = {}) {
  node.style.opacity = '0';
  node.style.transform = 'translateY(24px)';

  node.offsetHeight;

  node.style.transition = `
    opacity 0.6s ease ${delay}ms,
    transform 0.6s ease ${delay}ms
`;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      node.style.opacity = '1';
      node.style.transform = 'translateY(0)';
      observer.disconnect();
    },
    { threshold: 0.15 }
  );

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    }
  };
}
