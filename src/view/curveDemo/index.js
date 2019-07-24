import curvejs from 'curvejs'
import util from '../../util/util.js'

import './demo.scss'
import Word from '../../lib/curve/word.js'
const { Stage, motion } = curvejs

var randomColor = util.randomColor,
  stage = new Stage(800, 450, '#myCanvas')

function tick() {
  stage.update()
  window.requestAnimationFrame(tick)
}
;(function main() {
  const words = ['Summary', 'Of', 'Work']
  const space = 100
  let instance = 0
  words.forEach(w => {
    w.split('').forEach(item => {
      const x = instance + 65
      // stage.add(new Word('a',{
      //     color: randomColor(),
      //     x,
      //     motion: motion.dance,
      //     data: {angle: 0, r:4 ,step:Math.PI / 40 }
      // }))
      instance = x
    })
    instance += space
  })
  stage.add(new Word('S',{
    color: randomColor(),
      x: 0,
      motion: motion.dance,
      data: {angle: 0, r:4 ,step:Math.PI / 40 }
  }))
  stage.add(new Word('u',{
    color: randomColor(),
      x: 78,
      y: 5,
      motion: motion.dance,
      data: {angle: 188, r:4 ,step:Math.PI / 40 }
  }))
  stage.add(new Word('m',{
    color: randomColor(),
      x: 92*2,
      y: 5,
      motion: motion.dance,
      data: {angle: 0, r:3 ,step:Math.PI / 40 }
  }))
  stage.add(new Word('m',{
    color: randomColor(),
      x: 92*3,
      y: 5,
      motion: motion.dance,
      data: {angle: 0, r:5 ,step:Math.PI / 40 }
  }))
  stage.add(new Word('a',{
    color: randomColor(),
      x: 83*4,
      y: 5,
      motion: motion.dance,
      data: {angle: 0, r:4 ,step:Math.PI / 40 }
  }))
  stage.add(new Word('r',{
    color: randomColor(),
      x: 83*5,
      y: 5,
      motion: motion.dance,
      data: {angle: 0, r:4 ,step:Math.PI / 40 }
  }))
  stage.add(new Word('y',{
    color: randomColor(),
      x: 78*6,
      motion: motion.dance,
      data: {angle: 0, r:4 ,step:Math.PI / 40 }
  }))
  tick()
})()
