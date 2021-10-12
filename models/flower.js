const random = require('canvas-sketch-util/random')
const { getPalettes } = require('@openpalette/core')
const { draw_leaf } = require('./leaf')

const palettes = getPalettes()
const palette = random.pick(palettes).colors
const rgbColors = palette.map(hexToRgb)

function hexToRgb (hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ]
    : null
}

let frame = 0
//polar to linear coordinate transform
function P2L (r, angle) {
  var ret = {
    x: 0,
    y: 0
  }
  ret.x = Math.cos((angle * Math.PI) / 180) * r
  ret.y = Math.sin((angle * Math.PI) / 180) * r
  return ret
}

function cb (r, g, b, o) {
  return 'rgba(' + r + ',' + g + ',' + b + ',' + o + ')'
}

export function draw_flower (
  context,
  _rad,
  _num_pts,
  init_angle,
  spin_vel,
  color,
  _x,
  _y,
  cluster
) {
  context.shadowBlur = 50
  context.lineWidth = 1
  const start = {
    x: _x - 10,
    y: _y
  }

  const end = {
    x: _x + 10,
    y: _y - 20
  }
  if (cluster && Math.random() > 0.6) {
    draw_leaf(context, {
      start,
      end
    })
  }

  context.fillStyle = cb(rgbColors[0][0], rgbColors[0][1], rgbColors[0][2], 0.8)
  let c2 = [
    Math.floor(color[0] / 1.6),
    Math.floor(color[1] / 1.6),
    Math.floor(color[2] / 1.6)
  ]

  context.strokeStyle = cb(c2[0], c2[1], c2[2], 1)

  var pts = []
  for (var i = 0; i <= _num_pts; i++) {
    var angle = (360 / _num_pts) * i + init_angle + frame * spin_vel

    pts.push({
      x: P2L(_rad, angle).x,
      y: P2L(_rad, angle).y
    })
  }

  for (var i = 1; i <= _num_pts; i += 2) {
    let idx = i % _num_pts
    context.save()
    context.beginPath()
    context.moveTo(_x, _y)
    context.bezierCurveTo(
      _x + pts[i - 1].x,
      _y + pts[i - 1].y,
      _x + pts[idx + 1].x,
      _y + pts[idx + 1].y,
      _x,
      _y
    )
    context.stroke()
    context.fill()
    context.restore()
  }
}
