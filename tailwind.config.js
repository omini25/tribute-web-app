/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		'pastel': {
  			'pink': '#FFB3BA',
  			'peach': '#FFDFBA',
  			'yellow': '#FFFFBA',
  			'green': '#BAFFC9',
  			'blue': '#BAE1FF'
  		},

  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		colors: {
			'primary': '#125500',
			'secondary': '#BFB313',
			'tertiary': '#C7D2FE',
			'quaternary': '#DBEAFE',

		},
		fontFamily: {
		  sans: ['Jost', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'],
		},
  	}
  },
	plugins: [
		'@tailwindcss/typography',
		'@tailwindcss/forms',
		'@tailwindcss/aspect-ratio',
		// '@tailwindcss/container-queries',  // If using, ensure proper setup for container queries
		'tailwindcss-bg-patterns',
	],
}

