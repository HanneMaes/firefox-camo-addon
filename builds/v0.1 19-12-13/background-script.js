// test extention: about:debugging
// building the addon: https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/
// theme colors: // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/theme

//****************************************************************************************************************************************************

// watch for changes & update the theme
browser.tabs.onActivated.addListener(event => update(event.tabId)) // when new tab is activated
browser.tabs.onUpdated.addListener(tabId => update(tabId))         // when tab changes state
async function update(tabId) {

  // get the meta theme color
  try {
    browser.tabs.executeScript(null, { 
      code: `document.querySelector('meta[name="theme-color"]').content`}, 

      // execute the function when the injected executeScript is finished
      function(result) {  
        console.log('theme color: ', result); 

        // extract the color
        var colorTheme = result[0] //"rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")"

        // calculate other color
        var colorThemeText, colorThemeSubtle

        var colorText = changeBrightness(colorTheme, -50)
        var colorBackBg = changeBrightness(colorTheme, 50)
    
        var darkOrLightTheme = lightOrDark(colorTheme); console.log("darkOrLightTheme:", darkOrLightTheme);
        if(darkOrLightTheme == 'light') {
          // light theme color
          colorThemeText = changeBrightness(colorTheme, -40)
          colorThemeSubtle = changeBrightness(colorTheme, 50)
        } else {     
          // dark theme color                       
          colorThemeText = changeBrightness(colorTheme, 40)
          colorThemeSubtle  = changeBrightness(colorTheme, -50)
        }

        colorThemeText += ""
        colorThemeSubtle += ""
        colorText += ""
        colorBackBg += ""

        // create a custom theme
        const customTheme = {
          "colors": {

            // toolbar with the active tab, toolbar, url bar, ...
            "bookmark_text": colorThemeText, // color of text and icons in the bookmark and find bar
            "tab_text": colorThemeText,      // active tab text
            "icons_attention": colorTheme,
            "tab_loading": colorTheme,
            "toolbar": "white", 
            "toolbar_bottom_separator": "rgb(240, 240, 240)", // the bottom line of the toolbar
            "button_background_hover": "rgb(240, 240, 240)",  // bg when you hover over the icons
            "toolbar_top_separator": colorThemeText,          // the line between de toolbar and the inactive tabs
            "toolbar_vertical_separator": "white",            // the vertical lines in the toolbar

            // url bar
            "toolbar_field_text": colorThemeText,
            "toolbar_field_border": colorTheme,
            "toolbar_field_border_focus": colorTheme,
            "toolbar_field_highlight": colorTheme,
            "toolbar_field_highlight_text": "white",
            "toolbar_field_separator": "white",

            // inactive tabs
            "frame": colorTheme,                           // overall color
            "tab_background_text": colorThemeText,         
            "tab_background_separator": colorThemeSubtle,  // the small line between de inactive bookmarks 

            // popups
            "popup_highlight": colorTheme,
            "popup_highlight_text": colorThemeText,
            "popup_highlight": colorTheme,
            "popup_highlight_text": colorThemeText,
            "sidebar_highlight": colorTheme,
            "sidebar_highlight_text": colorThemeText,
          }
        }

        // apply the theme
        browser.theme.update(customTheme)

      } // function(result)
    ) // execute script

  // there was no theme color found
  } catch(error) {

    // reset the theme
    browser.theme.reset()
  }

} // async function

//****************************************************************************************************************************************************

// https://awik.io/determine-color-bright-dark-using-javascript/
function lightOrDark(color) {

  // Variables for red, green, blue values
  var r, g, b, hsp;
  
  // Check the format of the color, HEX or RGB?
  if (color.match(/^rgb/)) {

      // If HEX --> store the red, green, blue values in separate variables
      color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
      
      r = color[1];
      g = color[2];
      b = color[3];
  } 
  else {
      
      // If RGB --> Convert it to HEX: http://gist.github.com/983661
      color = +("0x" + color.slice(1).replace( 
      color.length < 5 && /./g, '$&$&'));

      r = color >> 16;
      g = color >> 8 & 255;
      b = color & 255;
  }
  
  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  hsp = Math.sqrt(
  0.299 * (r * r) +
  0.587 * (g * g) +
  0.114 * (b * b)
  );

  // Using the HSP value, determine whether the color is light or dark
  if (hsp>127.5) {

      return 'light';
  } 
  else {

      return 'dark';
  }
}

//****************************************************************************************************************************************************

function changeBrightness(color, percent) {
  var num = parseInt(color.replace("#",""),16),
  amt = Math.round(2.55 * percent),
  R = (num >> 16) + amt,
  B = (num >> 8 & 0x00FF) + amt,
  G = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
};

//****************************************************************************************************************************************************