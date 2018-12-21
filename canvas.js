let w, width, h, height
let canvas

// this enables me to have many canvases all positioned on top of eachother at 100% width and height of page
function createCanvas (canvasName) {
  canvas = document.createElement('canvas')
  const body = document.querySelector('body')
  canvas.setAttribute('id', canvasName)
  canvas.style.position = 'absolute'
  canvas.style.left = '0px'
  canvas.style.top = '0px'
  body.appendChild(canvas)
  const ctx = canvas.getContext('2d')
  resize()
  window.addEventListener('resize', resize, false)
  return ctx
}

function resize () {
  const c = document.getElementsByTagName('canvas')
  width = w = window.innerWidth
  height = h = window.innerHeight
  for (let i = 0; i < c.length; i++) {
    c[i].width = width
    c[i].height = height
  }
  // console.log("resize: " + w +":" + h);
}

function Grid (numItemsHoriz, numItemsVert, gridW, gridH, startX, startY) {
  if (numItemsHoriz === undefined) {
    numItemsHoriz = 1
  }
  if (numItemsVert === undefined) {
    numItemsVert = 1
  }
  let _horiz = numItemsHoriz || 1
  let _vert = numItemsVert || 1
  this.spacing_x
  this.spacing_y
  this.numItemsHoriz = 0
  this.num_items_vert = 0
  this.start = {x: startX || 0, y: startY || 0}
  this.grid_w = gridW || w
  this.grid_h = gridH || h
  this.x = []
  this.y = []
  this.add = function (_horiz, _vert) {
    // if we don't pass a value just add 1 to the size
    this.numItemsHoriz += _horiz || 1
    this.num_items_vert += _vert || 1
    this.spacing_x = this.grid_w / this.numItemsHoriz
    this.spacing_y = this.grid_h / this.num_itms_vert
    this.createGrid
    return this
  }
  this.setStart = function (_x, _y) {
    this.start = {x: _x || 0, y: _y || 0}
    createGrid()
    return this
  }

  this.createGrid = function () {
    for (var _y = 0; _y < this.grid_h; _y+=this.spacing_y) {
      for (var _x = 0; _x < this.grid_w; _x+=this.spacing_x) {
        this.x.push(this.start.x + this.spacing_x/2 + _x)
        this.y.push(this.start.y + this.spacing_y/2 + _y)
      }
    }
  }
  this.add(_horiz, _vert)
  return this
}
