/**
 * Theming.
 *
 * Supports the preferred color scheme of the operation system as well as
 * the theme choice of the user.
 *
 */
const themeToggle = document.querySelector(".theme-toggle");
const chosenTheme = window.localStorage && window.localStorage.getItem("theme");
const chosenThemeIsDark = chosenTheme == "dark";
const chosenThemeIsLight = chosenTheme == "light";

function copyOnClick(id) {
  var copyText = document.getElementById(id);
  navigator.clipboard.writeText(copyText.innerText);
  var btn = document.getElementById(id + "Btn");
  btn.textContent = "Copied!"

  var otherBtn;
  if (id === "fishCmd") {
    otherBtn = "bashCmdBtn";
  } else if (id === "bashCmd") {
    otherBtn = "fishCmdBtn";
  }
  var otherBtn = document.getElementById(otherBtn);
  otherBtn.textContent = "Copy"
}

// Detect the color scheme the operating system prefers.
function detectOSColorTheme() {
  if (chosenThemeIsDark) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else if (chosenThemeIsLight) {
    document.documentElement.setAttribute("data-theme", "light");
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }
}

// Switch the theme.
function switchTheme(e) {
  if (chosenThemeIsDark) {
    localStorage.setItem("theme", "light");
  } else {
    localStorage.setItem("theme", "dark");
  }

  detectOSColorTheme();
  window.location.reload();
}

// Event listener
if (themeToggle) {
  themeToggle.addEventListener("click", switchTheme, false);
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => e.matches && detectOSColorTheme());
  window
    .matchMedia("(prefers-color-scheme: light)")
    .addEventListener("change", (e) => e.matches && detectOSColorTheme());

  detectOSColorTheme();
} else {
  localStorage.removeItem("theme");
}
