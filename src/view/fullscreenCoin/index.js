import './index.scss'
function Coin(options = {}) {
  this.init(options)
}
Coin.prototype = {
  init(options) {
    const o = {
      style: {
        width: options.width ? `${options.width}px` : `${25}px`,
        height: options.height ? `${options.height}px` : `${25}px`,
        left: `${options.left}px` || 0,
        'background-image': options.url
          ? `url(${options.url})`
          : ' url(/assets/img/11.jpg)',
        'animation-duration': options.duration
          ? `${options.duration}s`
          : `${4}s`
      },
      transformY: `translateY(${options.top}px)` || 0,
      wraper: options.wraper
        ? document.querySelector(options.wraper)
        : document.body,
      startTime: options.startTime || 0,
      aniName: options.aniName || 'top_to_bottomY'
    }
    Object.keys(o).forEach((key) => {
      Object.defineProperty(this, key, {
        writable: false,
        value: o[key]
      })
    })
    this.createEl(this.wraper)
    this.elMove()
    this.elDestory((options.callback = () => {}))
  },
  createEl(father) {
    const $fragment = document.createDocumentFragment()
    this.$el = document.createElement('i')
    Object.entries(this.style).forEach(([key, value]) => {
      this.$el.style.setProperty(key, value)
    })
    this.$el.classList.add('coin', this.aniName)
    $fragment.appendChild(this.$el)
    father.appendChild($fragment)
  },
  elMove() {
    const timer = setTimeout(() => {
      this.$el.style.setProperty('transform', this.transformY)
      this.$el.style.setProperty('animation-play-state', 'running')
      clearTimeout(timer)
    }, this.startTime)
  },
  elDestory(fn) {
    this.$el.addEventListener('animationend', (e) => {
      this.wraper.removeChild(this.$el)
      if (typeof fn === 'function') fn(this.$el)
    })
  }
}
const MaxWidth = document.querySelector('.cube-topCoin').getBoundingClientRect()
    .width,
  aniWay = ['top_to_bottomY', 'top_to_bottomX']
function fullScreenCoinFun() {
  const nameIndex = Math.ceil(Math.random() - 0.5),
    aniName = aniWay[nameIndex],
    duration = parseFloat(Math.random() + 3).toFixed(2),
    startTime = Math.floor(Math.random() * 4000),
    left = Math.floor(Math.random() * MaxWidth),
    top = Math.floor(Math.random() * 400)
  const o = new Coin({
    wraper: '.cube-topCoin',
    left,
    top,
    aniName,
    duration,
    startTime,
    callback: (el) => {
      console.log(el)
    }
  })
}

for (let i = 0; i < 50; i++) {
  fullScreenCoinFun()
}
