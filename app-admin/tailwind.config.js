const { colors } = require('tailwindcss/defaultTheme')
module.exports = {
  theme: {
    extend: {
      colors: {
        green: {
          50: "#ECFDF5",
          ...colors.green
        },
        red: {
          50: "#FEF2F2",
          ...colors.red
        },
        blue: {
          50: "#EFF6FF",
          ...colors.blue
        }
      }
    }
  }
}