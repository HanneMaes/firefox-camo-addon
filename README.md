![Camo logo](design/logo-github-1000x245.jpg)

![Camo screenshots](design/screenshots-github-1000x657.jpg)

# Camo dynamic theme
A dynamic Firefox theme that changes color based on the website.<br>
Get the add-on: https://addons.mozilla.org/nl/firefox/addon/coma-dynamic-theme/

**If a website you use a lot doesn't have a theme color, let me know at [GitHub](https://github.com/HanneMaes/firefox-camo-addon) or maes.hanne@gmail.com and I'll update the add-on for you.**

The color is based on the websites `meta[name="theme-color"]` tag.<br>
Because not every website has a `meta[name="theme-color"]` tag, I defined the color myself for a lot of website. 

If you like the add-on, show some love by leaving a [review](https://addons.mozilla.org/nl/firefox/addon/coma-dynamic-theme/) or star the project on [GitHub](https://github.com/HanneMaes/firefox-camo-addon).

**You can test the add-on with one of these sites:**
- [Facebook](https://www.facebook.com/)
- [Twitter](https://twitter.com/)
- [Netflix](https://www.netflix.com/)
- [GitHub](https://github.com/)
- [Medium](https://medium.com/)
- [Arduino](https://www.arduino.cc/)

![Facebook screenshot](design/screenshots/screenshot-facebook-github-1000x599.jpg)
![Netflix screenshot](design/screenshots/screenshot-netflix-github-1000x599.jpg)
![Arduino screenshot](design/screenshots/screenshot-arduino-github-1000x599.jpg)
![Github screenshot](design/screenshots/screenshot-github-github-1000x599.jpg)

# Todo
- When a website doesn't have a theme-color meta tag, pick the background-color of the <header> tag and if that does not exist the color of the <nav> tag to create a seamless experience.
- Sometimes the frame flashes to white before updating to color
- When you open FireFox it has the theme color of the website you last visited
- Add an onboard, upboard & offboard page: https://extensionworkshop.com/documentation/develop/onboard-upboard-offboard-users/
- Port to Firefox Mobile: https://extensionworkshop.com/documentation/develop/developing-extensions-for-firefox-for-android/

<!--
# Build with
- Chroma.js a javaScript library for all kinds of color manipulations: https://github.com/gka/chroma.js
-->

# Info
- Theme colors: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/theme

# Testing
1. about:debugging
2. This Firefox
3. Load temporary Add-on
3. Select: background-script.js

# Packaging
- Build: `web-ext build`
  - Installation: `npm install --global web-ext`
  - Docs: https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/
