/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		pastel: {
  			pink: '#FFB3BA',
  			peach: '#FFDFBA',
  			yellow: '#FFFFBA',
  			green: '#BAFFC9',
  			blue: '#BAE1FF'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			primary: '#fcd34d',
  			secondary: '#92400e',
  			tertiary: '#C7D2FE',
  			quaternary: '#DBEAFE',
  			alernatebg: '#f9fafb',
  			cream: '#F5F5DC'
  		},
  		fontFamily: {
  			sans: [
  				'Jost',
  			]
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
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
