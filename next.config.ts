import type { NextConfig } from 'next';

const isGhPages = process.env.DEPLOY_TARGET === 'gh-pages';
const repoBase = '/ippinkyo';

const config: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: isGhPages ? repoBase : undefined,
  assetPrefix: isGhPages ? `${repoBase}/` : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: isGhPages ? repoBase : '',
  },
};

export default config;
