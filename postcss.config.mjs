/**
 * PostCSS Configuration
 * 
 * Converts modern CSS color functions to RGB format for better compatibility.
 * 
 * TailwindCSS v4 generates modern color functions (lab, lch, oklab, oklch, color())
 * which some tools don't support. These plugins convert them to RGB during build.
 * 
 * Note: Works best with webpack mode (npm run dev:webpack)
 * Turbopack has limited PostCSS plugin support.
 */
import postcssOklabFunction from '@csstools/postcss-oklab-function';
import postcssColorFunction from '@csstools/postcss-color-function';

const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    '@csstools/postcss-oklab-function': {
      preserve: false,
    },
    '@csstools/postcss-color-function': {
      preserve: false,
    },
  },
};

export default config;
