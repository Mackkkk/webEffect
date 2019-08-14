// @ts-nocheck
import Dep from './dep'
const def = (obj, key, val, enumerable = false) => {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}

const arrayProto = Array.prototype  // 拷贝原型防止污染Array
const arrayMethods = Object.create(arrayProto)
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
methodsToPatch.forEach((method) => {
  def(arrayMethods, method, function(...args) {
    // console.log(this)   
    const ob = this.__ob__
    let inserted
    switch (
      method // 也许添加了数组或者对象，需要重新Observer
    ) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2) 
        break
    }
    if (inserted) ob.observeArray(inserted)
    const result = arrayProto[method].apply(this, args)
    // notify change
    ob.dep.notify()   // 数组变化通知更新
    return result
  })
})
//  数组修复
const arrayKeys = Object.getOwnPropertyNames(arrayMethods) //获取数组劫持的方法

export default class Observer {
  constructor(data = {}) {
    this.data = data
    this.dep = new Dep() // 以备不时之需
    def(data, '__ob__', this)   // 上面数组要用
    if (Array.isArray(data)) {
      const augment = data.__proto__ ? this.protoAugment : this.copyAugment
      // 获取替换原型的方法
      //此处的 arrayMethods 就是上面使用Object.defineProperty处理过
      augment(data, arrayMethods, arrayKeys) //将传进来的数组替换原型，以后当前data使用push什么的，就是arrayMethods的劫持了
      this.observeArray(data) //数组的订阅器添加
    }
    this.walk(this.data)
  }
  walk(obj) {  // 为所有可枚举的key走包装
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      this.defineReactive(obj, keys[i])
    }
  }
  observeArray(arr) {  // 数组的包装
    for (let i = 0, l = arr.length; i < l; i++) {
      this.observe(arr[i])
    }
  }
  // 数据劫持/包装
  defineReactive(obj, key, shallow = true) {   // 默认浅包装
    const _this = this
    const dep = new Dep()
    const property = Object.getOwnPropertyDescriptor(obj, key) //不包括Symbol值的所有属性的描述,即enumerabel、configurabel等
    if (property ?.configurable === false) return // 处理不可修改属性
    const getter = property ?.get // get方法是否被修改
    const setter = property ?.set // set方法是否被修改
    let val = obj[key]
    let childObj = !shallow && this.observe(val) // 处理值是对象的情况
    Object.defineProperty(obj, key, {
      enumerabel: true,
      configurabel: true,
      get() {
        const value = getter ?.call(obj) ?? val
        dep.depend()
        if (childObj) {
          childObj.dep.depend() // 这里的dep就是从【以为不时之需】来的
          if (Array.isArray(value)) {
              _this.dependArray(value)   // 新设置的是数据，走数组包装
          }  
        }
        return value
      },
      set(newVal) {
        const value = getter ?.call(obj) ?? val  // 从被修改的get拿值， computed中的get？
        if (newVal === value) return
        if (setter) {
          setter.call(obj, newVal)
        } else {
          val = newVal
        }
        childObj = !shallow && _this.observe(newVal) // 处理新值是对象的情况
        dep.notify()   // 数据变化通知更新
      }
    })
  }
  observe(value) {
    if (!value || typeof value !== 'object') return
    let ob
    if ( Object.prototype.hasOwnProperty.call(value, '__ob__') && 
    value.__ob__ instanceof Observer ) {
      ob = value.__ob__
    } else {
      ob = new Observer(value)
    }
    return ob //只对object进行劫持
  }
  protoAugment(target, src) {
    target.__proto__ = src //支持隐式原型直接赋值
  }
  copyAugment(target, src, keys) { //不支持的set key
    for (let i = 0, l = keys.length; i < l; i++) {
      const key = keys[i]
      this.def(target, key, src[key]) //将key值设置到target来源对象上去
    }
  }
  dependArray(value) {  // 对数组的每个下标都处理
    for (let e, i = 0, l = value.length; i < l; i++) {
      e = value[i]
      e ?.__ob__ ?.__ob__.dep.depend()
      if (Array.isArray(e)) {
        dependArray(e)
      }
    }
  }
}