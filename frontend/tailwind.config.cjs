/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
		height: {
			'1/8': '12.5%',
			'3/8': '37.5%',
			'5/8': '62.5%',
			'7/8': '87.5%',
		},
	},
  },
  plugins: [],
}
