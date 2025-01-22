/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
     "./src/**/*.js",
  ],
  theme: {
    extend: {
      fontSize: {
        'xxs': '.6rem',
      },
      textColor: {
        'thirst-blue': '#252a69',
        'thirst-grey': '#cacaca',
        'thirst-dark-grey': '#767171',
        'thirst-darker-grey': '#50555c',
      },
      ringColor: {
        'thirst-blue': '#252a69',
        'thirst-gray': '#acb3bf'
      },
      backgroundColor: {
        'thirst-blue': '#252a69',
        'thirst-light-grey': '#acb3bf',
        'thirst-grey': '#50555d',
        'light-grey-hover': '#80848c',
        'grey-hover': '#2f3135',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

