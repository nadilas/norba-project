import gpio from 'rpi-gpio'

/**
 * The windows which are live
 * @type {Array}
 */
const windowArray = []

function getWindow (windowName) {
  for (var i = 0; i < windowArray.length; i++) {
    if (windowArray[i].name === windowName) {
      return windowArray[i].window
    }
  }
  return null
}

gpio.on('change', function (channel, value) {
  const message = `Channel ${channel} value is now ${value}`
  console.log(`broadcasting to all windows: ${message}`)
  windowArray.forEach(wnd => wnd.webContents.send('info', { msg: message }))
  console.log(`broadcasting to window named: 'main': ${message}`)
  getWindow('main').webContents.send('info', { msg: message })
})

export default {
  initalize () {
    gpio.setup(7, gpio.DIR_IN, gpio.EDGE_BOTH)
  },
  registerWindow (wnd) {
    if (typeof wnd !== 'undefined') windowArray.push(wnd)
  }
}
