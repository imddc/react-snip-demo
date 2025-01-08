import { addDynamicIconSelectors } from '@iconify/tailwind'

/** @type {import('tailwindcss').Config} */
export default {
  corePlugins: {
    preflight: true,
    container: true,
  },
  darkMode: 'selector',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    addDynamicIconSelectors({
      prefix: 'icon',
      // Removes redundant rules
      overrideOnly: false,
      // Icon height, 0 to disable size
      scale: 1,
      // Custom icon sets
      iconSets: {},
    }),
  ],
}
