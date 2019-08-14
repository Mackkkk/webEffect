import _ from 'lodash'
import Dep, {
  pushTarget,
  popTarget
} from './dep'
export default class Watcher {
  constructor(vm, expOrFn, cb, options) {
    this.vm = vm
    this.exp = expOrFn  
    this.cb = cb
    this.initGetter(expOrFn)  
    this.value = this.get()
  }
  initGetter(expOrFn) {
    Object.prototype.toString.call(expOrFn) === '[object Function]' && (this.getter = expOrFn)
    if (typeof expOrFn === 'string') this.getter = this.parsePath(expOrFn)  // 处理a.b等情况
  }
  get() {
    pushTarget(this)
    const vm = this.vm
    let value
    try {
      value = this.getter.call(vm, vm) // call，apply，bind能改变箭头函数this指向吗？
    } catch (error) {} finally {
      if(typeof value === 'object') {
        value = _.cloneDeep( value ) // 简单替代源码中的traverse解决引用类型问题
      }
    }
    popTarget()
    return value
  }
  addDep(dep) {
    dep.addSub(this)  // 添加到dep
  }
  update() {   // dep的update
    // 什么
    this.run()
  }
  parsePath(path) {
    const segments = path.split('.')
    return function(obj) {
      for (let i = 0; i < segments.length; i++) {
        if (!obj) return
        obj = obj[segments[i]]
      }
      return obj
    }
  }
  run() {
    const vm = this.vm
    let value = this.getter.call(vm, vm)
    typeof value === 'object' && (value = _.cloneDeep( value ))
    if (value !== this.value) {
      const oldValue = this.value
      this.value = value
      this.cb.call(this.vm, value, oldValue)  // 回调
    }
    const fn = this.vm?.updated?? null  
    // console.log(this.vm)
    if(typeof fn === 'function') fn() // vue的updated生命周期钩子
  }
}