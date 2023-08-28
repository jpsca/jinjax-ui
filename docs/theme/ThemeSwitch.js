(function(){

const SEL_TARGET = '.ThemeSwitch'
const STORAGE_KEY = 'theme'
const DARK = 'dark'
const LIGHT = 'light'
const PREFERS_DARK_MEDIA = '(prefers-color-scheme: dark)'
const DISABLED = "disabled"

const theme = {
  value: getColorPreference(),
}

reflectPreference()
on(SEL_TARGET, 'click', onClick)

// sync with system changes
window
  .matchMedia(PREFERS_DARK_MEDIA)
  .addEventListener('change', ({matches:isDark}) => {
    theme.value = isDark ? DARK : LIGHT
    setPreference()
  })

function onClick (event, target) {
  if (target.getAttribute(DISABLED)) return
  theme.value = theme.value === LIGHT ? DARK : LIGHT
  setPreference()
}

function setPreference () {
  localStorage.setItem(STORAGE_KEY, theme.value)
  reflectPreference()
}

function reflectPreference () {
  const value = getColorPreference ()
  if (value === DARK) {
    document.documentElement.classList.add(DARK)
    document.documentElement.classList.remove(LIGHT)
  } else {
    document.documentElement.classList.add(LIGHT)
    document.documentElement.classList.remove(DARK)
  }
}

function getColorPreference () {
  return localStorage.getItem(STORAGE_KEY)
}

})()
