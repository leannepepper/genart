function rotatePoint (angle) {
  return function ({ x, y }) {
    const rad = angle // * Math.PI / 180;
    return {
      x: x * Math.cos(rad) - y * Math.sin(rad),
      y: x * Math.sin(rad) + y * Math.cos(rad)
    }
  }
}

function moveOrigin (origin) {
  return function movePoint (point) {
    return {
      x: point.x - origin.x,
      y: point.y - origin.y
    }
  }
}

function restoreOrigin (origin) {
  return function movePoint (point) {
    return {
      x: point.x + origin.x,
      y: point.y + origin.y
    }
  }
}
const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x)

export function draw_leaf (context, { start, end }, config = {}) {
  const movePointOrigin = moveOrigin(start)
  const restorePointOrigin = restoreOrigin(start)
  const angle = Math.atan2(start.x - end.x, start.y - end.y)

  const leftLeverage = compose(
    restorePointOrigin,
    rotatePoint(angle),
    movePointOrigin
  )({ x: start.x, y: start.y + 25 })
  const rightLeverage = compose(
    restorePointOrigin,
    rotatePoint(angle),
    movePointOrigin
  )({ x: start.x, y: start.y - 25 })

  //   console.log({ start, end, leftLeverage, rightLeverage })

  context.fillStyle = 'rgba(0,200,50,0.6)'
  context.beginPath()
  context.moveTo(start.x, start.y)
  context.quadraticCurveTo(leftLeverage.x, leftLeverage.y, end.x, end.y)
  context.moveTo(start.x, start.y)
  context.quadraticCurveTo(rightLeverage.x, rightLeverage.y, end.x, end.y)
  context.fill()
  context.moveTo(start.x, start.y)
  context.lineTo(end.x, end.y)
  context.stroke()
}
