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
  ["google.com/spreadsheets","#2A8947"],
  [".netflix.","#E50914"],
  [".spotify.","#1ED760"],
  [".notion.","#ffffff"],
  [".figma.","#000"],
  [".gravit.","#D72E63"],
  [".tinkercad.","#2E6DA4"],
  ["giphy.","#6A61FF"],
  [".behance.","#0057FF"],
  [".die2nite.","#7E4D2A"],
]

var prevUrl, prevColorTheme = false // save these settings so we can see if they changes

// watch when a window is closed to reset the theme
// this is to prevent when opening the browser it has the colors on the last opened website
browser.windows.onRemoved.addListener(browser.theme.reset) // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/onRemoved

// watch for changes & update the theme
browser.windows.onFocusChanged.addListener(event => update(event.tabId))                // fires when the active window changes
browser.tabs.onActivated.addListener(event => update(event.tabId))                      // fires when the active tab in a window changes
browser.tabs.onUpdated.addListener(tabId => update(tabId)/*, {properties: ["title"]}*/) // fires when a tab is updates
async function update(tabId) {

  console.log('')

  // A tab is updaten when the user navigates to a new URL in a tab, this will typically generate several onUpdated events as various properties of the tabs. Tab object are updated. 
  // This includes the url, but also potentially the title and favIconUrl properties. The status property will cycle through "loading" and "complete".
  // This event will also be fired for changes to a tab's properties that don't involve navigation, like pinning and unpinning (which updates the pinned property) and muting or unmuting (which updates the audible and mutedInfo properties).
  
  // The second parameter is the filter. This function is only fired when the filer is true
  //https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/onUpdated
  
  // get the meta theme color
  browser.tabs.executeScript(null, { 
    code: `document.querySelector('meta[name="theme-color"]').content`}, 

    // execute the function when the injected executeScript is finished
    function(result) {  

      // get he current window id
      var getting = browser.windows.getCurrent({populate: true});
      getting.then(windowFound, windowNotFound)
      function windowFound(windowInfo) {

        console.log("windowInfo:", windowInfo)
        windowId = windowInfo.id

        // if there is a theme color
        if(result) {
          console.log('theme color found: ', result)

          // extract the color
          var colorTheme = result[0] //"rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")"
          themeThisBrowser(windowId, colorTheme)
          
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
                themeThisBrowser(windowId, colorTheme)
                break // stop looping
              }

              // if not custom defined color was found, use the default theme
              browser.theme.reset()

            }
          }, console.error) 
        
        } // else

      } // getting.then

      // show an error when there was no window found
      function windowNotFound(error) {
        console.log(`Window not found error: ${error}`);
      }
    } // function(result)
  ) // execute script
    
  // there was no theme color found

} // async function

//****************************************************************************************************************************************************

// give the browser a color
async function themeThisBrowser(windowId, colorTheme) {
console.log("windowId:", windowId);
  // make theme
  var customTheme
  customTheme = brightTheme(customTheme, colorTheme)

  // apply the theme to the current window
  browser.theme.update(windowId, customTheme)
}

//****************************************************************************************************************************************************

function brightTheme(theme, colorTheme) {

  // other color
  var colorText, colorAttention, colorHover
  var colorInactiveTabs = changeBrightness(colorTheme, -40)
  var colorInactiveTabsText = "rgb(150, 150, 150)"
  var colorInactiveTabsSeparators = 'rgb(150, 150, 150)' // the small line between de inactive bookmarks 

  var darkOrLightTheme = lightOrDark(colorTheme); console.log("darkOrLightTheme:", darkOrLightTheme)
  if(darkOrLightTheme == 'light') {
    // light theme color
    colorText = changeBrightness(colorTheme, -70)
    colorHover = changeBrightness(colorTheme, -10)
    colorAttention = "black"
  } else {     
    // dark theme color                       
    colorText = changeBrightness(colorTheme, 70)
    colorHover = changeBrightness(colorTheme, 10)
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
      "toolbar_bottom_separator": colorTheme, //colorHover, // the bottom line of the toolbar

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