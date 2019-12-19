// start by resetting the theme, so when you launch the browser you dont see the theme color of the website you visited last session
browser.theme.reset()

// website theme colors I defined myself for when there is no meta[name="theme-color"] tag found
var userDefinedThemeColors = [
  [".smartschool.","#c60450"],
  [".ap.","#B20005"],
  ["stackoverflow.","#F48024"],
  [".messenger.","#0074FF"],
  [".whatsapp.","#1EBEA5"],
  [".facebook.","#4B66A0"],
  ["mail.google","#DC3F34"],
  ["calendar.google","#3765D0"],
  [".netflix.","#E50914"],
  [".spotify.","#1ED760"],
  [".notion.","#ffffff"],
  [".figma.","#000"],
  [".gravit.","#D72E63"],
  [".tinkercad.","#2E6DA4"],
  ["giphy.","#6A61FF"],
  [".behance.","#0057FF"],
]

// watch for changes & update the theme
browser.tabs.onActivated.addListener(event => update(event.tabId)) // when new tab is activated
browser.tabs.onUpdated.addListener(tabId => update(tabId))         // when tab changes state
async function update(tabId, tab) {

  // get the meta theme color
  browser.tabs.executeScript(null, { 
    code: `document.querySelector('meta[name="theme-color"]').content`}, 

    // execute the function when the injected executeScript is finished
    function(result) {  
      
      // if there is a theme color
      if(result) {
        console.log('theme color found: ', result)

        // extract the color
        var colorTheme = result[0] //"rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")"
        themeThisBrowser(colorTheme)
        
      } else {
        
        console.log('no theme color found')

        // if there is no theme color
        // look trough my curstom list of defined colors
        browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {

          // get tab url
          let tab = tabs[0] // Safe to assume there will only be one result
          var url = tab.url; console.log('url:', url)

          // look if I dedined a color for this url
          var colorTheme = false
          for(var i in userDefinedThemeColors) {
            if(url.includes(userDefinedThemeColors[i][0])) {

              // colorTheme found
              colorTheme = userDefinedThemeColors[i][1]
              themeThisBrowser(colorTheme)
              break // stop looping
            }

            // if not custom defined color was found, use the default theme
            browser.theme.reset()
          }

        }, console.error) 
      
      } // else
    } // function(result)
  ) // execute script
    
  // there was no theme color found

} // async function

//****************************************************************************************************************************************************

// give the browser a color
function themeThisBrowser(colorTheme) {

  // make theme
  var customTheme
  customTheme = brightTheme(customTheme, colorTheme)

  // apply the theme
  browser.theme.update(customTheme)
}

//****************************************************************************************************************************************************

function brightTheme(theme, colorTheme) {

  // other color
  var colorText, colorAttention, colorHover
  var colorInactiveTabs = changeBrightness(colorTheme, -60)
  var colorInactiveTabsText = "rgb(150, 150, 150)"
  var colorInactiveTabsSeparators = 'rgb(150, 150, 150)' // the small line between de inactive bookmarks 

  var darkOrLightTheme = lightOrDark(colorTheme); console.log("darkOrLightTheme:", darkOrLightTheme)
  if(darkOrLightTheme == 'light') {
    // light theme color
    colorText = changeBrightness(colorTheme, -40)
    colorHover = changeBrightness(colorTheme, 20)
    colorAttention = "black"
  } else {     
    // dark theme color                       
    colorText = changeBrightness(colorTheme, 40)
    colorHover = changeBrightness(colorTheme, -20)
    colorAttention = "white"
  }

  // create a custom theme
  theme = {
    "colors": {

      // overall color
      "toolbar": colorTheme,

      // toolbar with the active tab, toolbar, url bar, ...
      "bookmark_text": colorText, // color of text and icons in the bookmark and find bar
      "icons_attention": colorAttention,
      "tab_loading": colorAttention,
      "button_background_hover": colorHover,  // bg when you hover over the icons
      "toolbar_bottom_separator": colorHover, // the bottom line of the toolbar

      // url bar
      "toolbar_field": colorHover,
      "toolbar_field_text": colorText,
      "toolbar_field_border": colorHover,
      "toolbar_vertical_separator": colorHover,            // the vertical lines in the toolbar
      "toolbar_field_border_focus": colorText,
      "toolbar_field_highlight": colorTheme,
      "toolbar_field_highlight_text": colorAttention,

      // inactive tabs
      "frame": colorInactiveTabs,
      "tab_background_text": colorInactiveTabsText,         
      "tab_background_separator": colorInactiveTabsSeparators, 

      // popups
      "popup": colorHover,
      "popup_text": colorText,
      "popup_highlight": colorTheme,
      "popup_highlight_text": colorAttention,
    }
  }

  return theme
}

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