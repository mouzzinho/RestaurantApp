import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
    webpack(config) {
        // Grab the existing rule that handles SVG imports
        config.externals = [...config.externals, { canvas: 'canvas' }];

        const fileLoaderRule = config.module.rules.find((rule: { test: RegExp }) => rule.test?.test?.('.svg'));
        config.module.rules.push(
            // Reapply the existing rule, but only for svg imports ending in ?url
            {
                ...fileLoaderRule,
                test: /\.svg$/i,
                resourceQuery: /url/, // *.svg?url
            },
            // Convert all other *.svg imports to React components
            {
                test: /\.svg$/i,
                issuer: fileLoaderRule.issuer,
                resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
                use: ['@svgr/webpack'],
            },
        );

        // Modify the file loader rule to ignore *.svg, since we have it handled now.
        fileLoaderRule.exclude = /\.svg$/i;

        return config;
    },
    experimental: {
        turbo: {
            rules: {
                '*.svg': {
                    loaders: ['@svgr/webpack'],
                    as: '*.js',
                },
            },
        },
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'app')],
        silenceDeprecations: ['legacy-js-api'],
        additionalData: `@use '@/styles/mixins' as *;`,
    },
};

export default nextConfig;
