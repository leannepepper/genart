const canvasSketch = require('canvas-sketch')
const { lerp } = require('canvas-sketch-util/math')
const random = require('canvas-sketch-util/random')
const { getPalettes } = require('@openpalette/core')
const { draw_flower } = require('./models/flower')
const { draw_leaf } = require('./models/leaf')

const settings = {
  dimensions: 'A2'
}
const palettes = getPalettes()
const palette = random.pick(palettes).colors
export const rgbColors = palette.map(hexToRgb)

export function hexToRgb (hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ]
    : null
}

const sketch = () => {
  const createGrid = () => {
    const points = []
    const count = 30
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1)
        const v = count <= 1 ? 0.5 : y / (count - 1)
        const radius = Math.abs(random.noise2D(u, v)) * 100
        const cluster = radius <= 30.0 ? true : false

        points.push({
          position: [u, v],
          radius,
          rotation: random.noise2D(u, v),
          color: random.pick(rgbColors),
          cluster
        })
      }
    }
    return points
  }

  function rand (min, max) {
    return Math.round(Math.random() * (max - min) + min)
  }

  const points = createGrid()
  const margin = 200

  return ({ context, width, height }) => {
    context.fillStyle = 'white'
    context.fillRect(0, 0, width, height)

    points.forEach((data, index) => {
      const { position, radius, color, cluster, rotation } = data
      // console.log(radius)

      const [u, v] = position
      const x = lerp(margin, width - margin, u)
      const y = lerp(margin, height - margin, v)

      if (radius < 20.0) {
        draw_flower(context, 20.0, 10, 30, 0, color, x, y, cluster)
      } else if (radius < 30.0) {
        draw_flower(context, radius, 10, 15, 0, color, x, y, cluster)
      } else {
        draw_flower(
          context,
          radius * rand(0.3, 0.6),
          12,
          15,
          0,
          color,
          x,
          y,
          cluster
        )
      }
    })
  }
}

canvasSketch(sketch, settings)
