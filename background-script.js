// test extention: about:debugging

// reset the prev theme
browser.theme.reset()

// watch for changes & update the theme
browser.tabs.onActivated.addListener(event => update(event.tabId)) // when new tab is activated
browser.tabs.onUpdated.addListener(tabId => update(tabId))         // when tab changes state
async function update(tabId) {

  // get the meta theme color
  browser.tabs.executeScript(null, { 
    code: `document.querySelector('meta[name="theme-color"]').content`}, 

    // execute the function when the injected executeScript is finished
    function(result) {
      console.log('result: ', result); 

      // extract the color
      var colorTheme = result[0] //"rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")"

      // create a custom theme
      // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/theme
      const customTheme = {
        "colors": {

          // default colors
          "toolbar":                  "white", // the part with the active tab, toolbar, url bar, ...
          "toolbar_bottom_separator": "white", // the bottom line of the toolbar
          "tab_background_text": "black",  // most of the text
          "popup_highlight_text":     "white", 
          "sidebar_highlight_text":   "white",
          "tab_background_separator": "white",
          
          // theme colors
          "frame":                      colorTheme, // overall color
          "popup_highlight":            colorTheme, 
          "sidebar_highlight":          colorTheme,
          "tab_line":                   colorTheme, // top line on the active tab
          "tab_loading":                colorTheme, // the loading animation on the tab
          "toolbar_field_border_focus": colorTheme, // url bar focus
          "icons_attention":            colorTheme,
          "toolbar_field_highlight":    colorTheme, // color when the url text is selected

          // other stuff
          // "icons_attention":   colorTheme,
          // "icons": colorTheme, // icons
          // "bookmark_text": colorTheme, // also icons?
          // "button_background_hover": colorTheme, // back button
          // toolbar_field // the color of the url bar
          // "toolbar_field_highlight_text": "rgb(0, 80, 0)"
        }
      }

      // apply the theme
      browser.theme.update(customTheme)
  })
}