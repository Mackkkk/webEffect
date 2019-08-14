import _ from 'lodash'
import Observer from './observer'
import Watcher from './watcher'
import Compiler from './compiler'
class Vue {
  constructor(options) {
    this.$options = options
    this.props = options.props
    this.data = options.data || {}
    this.watch = options.watch || {}
    this.computed = options.computed || {}
    this.methods = options.methods || {}
    this.beforeCreated = options.beforeCreated || {}
    this.created = options.created || function() {}
    this.beforeMount = options.beforeMount || function() {}
    this.beforeUpdate = options.beforeUpdate || function() {}
    this.mounted = options.mounted || function() {}
    this.updated = options.updated || function() {}
    this.$el = options.el
    this._init()
  }
  _init(options) {
    const vm = this
    this.initProxy(vm) // 代理vue实例，_renderProxy 
    this.initLifecycle(vm) // 初始化一些生命周期相关的属性，以及为parent,child（非抽象组件）等属性赋值
    this.initEvents(vm) // 初始化存放事件对象，父组件:hook钩子处理
    this.initRender(vm) // vNode、$slots、￥scopedSlots、$createElement函数等初始化，$attrs、$listeners代理
    this.initInjections(vm) // resolve injections before data/props
    this.beforeCreated() // 第一个钩子
    this.initState(vm)
    this.initProvide(vm) // resolve provide after data/props
    this.created()
    if (vm.$el) vm.$mount(vm.$el)
  }
  expectKey(key) { //判断this上的key是否有重复了
    const f = Object.keys(this).includes(key)
    if (f) {
      throw Error(`The property or method {key} already define`)
    }
  }
  initProxy(vm) {
    // vm._renderProxy = vm
  }
  initLifecycle(vm) {
    // vm._watcher = null
    // vm._inactive = null
    // vm._directInactive = false
  }
  initEvents(vm) {}
  initRender(vm) {
    vm.$vnode = null
    vm._isMounted = false
    // vm.$createElement = createElement
  }
  initInjections(vm) {}
  initState(vm) {
    if (this.props) this.initProps(vm, this.props)
    this.initMethods(vm, this.methods)
    this.initData(vm)
    this.initComputed(vm, this.computed)
    this.initWatch(vm, this.watch)
  }
  initProvide(vm) {}
  initProps(vm, props) {}
  initMethods(vm, methods) {
    Object.keys(methods).forEach(key => {
      this.expectKey(key)
      Object.defineProperty(vm, key, {
        get: () => methods[key]
      })
    })
  }
  initData(vm) { //代理data
    let data = vm.data
    data = vm._data = typeof data === 'function' ?
      vm.data() :
      data || {}
    Object.keys(data).forEach(key => { //将data上的key代理到this身上，即 this._data[key] === this[key]
      this.expectKey(key)
      Object.defineProperty(vm, key, {
        enumerable: true,
        configurable: true,
        get: () => data[key],
        set: (newVal) => {
          data[key] = newVal
        }
      })
    })
    new Observer(vm)
  }
  initComputed(vm, computed) {
    Object.keys(computed).forEach(key => {
      this.expectKey(key)
      const get = typeof computed[key] === 'function' ? computed[key] : computed[key].get
      Object.defineProperty(vm, key, {
        get
      })
    })
  }
  initWatch(vm, watch = {}) {
    for (const key in watch) {
      const handler = watch[key]
      this.createWatcher(vm, key, handler)
    }
  }
  createWatcher(vm, expOrFn, handler) {
    if (typeof handler === 'string') {
      handler = vm[handler]
    }
    if (typeof handler !== 'function') console.error(`{key} of watch should be function`)
    if (typeof handler === 'function') {
      new Watcher(vm, expOrFn, handler)
    }
  }
  $mount(el) {
    // if (!this.$options.render) this.$options.render = createEmptyVNode
    this.beforeMount()
    // let updateComponent = function() {
    //   vm._update(vm._render(), hydrating);
    // };
    // new Watcher(vm, updateComponent, noop, {
    //   before: function before() {
    //     if (vm._isMounted && !vm._isDestroyed) {
    //       callHook(vm, 'beforeUpdate');
    //     }
    //   }
    // }, true /* isRenderWatcher */ );
    if (this.$vnode == null) {
      this._isMounted = true
      new Compiler(el, this)
      this.mounted()
    }
    return this
  }
  _update(vnode) {
    const vm = this
    // const prevVnode = vm._vnode
    // vm._vnode = _.cloneDeep(vnode)
    // if (!prevVnode) {
    //   vm.$el = vm.__patch__(vm.$el, vnode)
    // } else {
    //   vm.$el = vm.__patch__(prevVnode, vnode)
    // }
  }
  _render() {
    const vm = this
    // const { render } = vm.$options
    // let vnode
    // try {
    //   vnode = render.call(vm._renderProxy, vm.$createElement)
    // } catch (e) {
    //   vnode = vm._vnode
    // }
    // if (Array.isArray(vnode) && vnode.length === 1) {
    //   vnode = vnode[0]
    // }
    // if (!(vnode instanceof VNode)) {
    //   vnode = createEmptyVNode()
    // }
    // return vnode
  }
}

export default Vue