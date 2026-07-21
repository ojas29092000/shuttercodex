// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import rehypeExternalLinks from 'rehype-external-links';

// https://astro.build/config
export default defineConfig({
	site: 'https://shuttercodex.com',
	integrations: [mdx(), sitemap()],
	markdown: {
		rehypePlugins: [
			[
				rehypeExternalLinks,
				{
					// Outbound citations open in a new tab so readers never lose their place.
					target: '_blank',
					// noopener blocks window.opener access. Deliberately NOT noreferrer:
					// sources should see the traffic we send them in their analytics.
					rel: ['noopener'],
				},
			],
		],
	},
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Fraunces',
			cssVariable: '--font-display',
			fallbacks: ['Georgia', 'serif'],
			weights: [700],
		},
		{
			provider: fontProviders.google(),
			name: 'Inter',
			cssVariable: '--font-body',
			fallbacks: ['system-ui', 'sans-serif'],
			weights: [400, 500, 600],
		},
		{
			provider: fontProviders.google(),
			name: 'JetBrains Mono',
			cssVariable: '--font-mono',
			fallbacks: ['monospace'],
			weights: [400],
		},
	],
});
