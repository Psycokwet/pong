/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
		height: {
			'1/8': '12.5vh',
			'3/8': '37.5vh',
			'5/8': '62.5vh',
			'7/8': '87.5vh',
		},
	},
  },
  plugins: [],
}
