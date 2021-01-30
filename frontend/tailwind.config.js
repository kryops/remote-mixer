const { tailwindExtractor } = require('tailwindcss/lib/lib/purgeUnusedStyles')
const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    content: ['./**/*.svelte'],
    options: {
      defaultExtractor: content => [
        ...tailwindExtractor(content),
        // Match Svelte class: directives (https://github.com/tailwindlabs/tailwindcss/discussions/1731)
        ...[...content.matchAll(/(?:class:)*([\w\d-/:%.]+)/gm)].map(
          ([_match, group, ..._rest]) => group
        ),
      ],
      keyframes: true,
    },
  },
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.coolGray,
      red: colors.red,
      yellow: colors.amber,
      blue: colors.blue,
      // pink: colors.pink,
      // teal
      // orange
      green: colors.green,
    },
  },
  variants: {},
  corePlugins: {},
  plugins: [],
}
