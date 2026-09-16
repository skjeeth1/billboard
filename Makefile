all: 
	npm run build
	npx wrangler pages dev .svelte-kit/cloudflare
