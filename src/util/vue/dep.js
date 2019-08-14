export default class Dep {
  //订阅器  ==>  收集订阅者
  static target = null
  constructor() {
    this.subs = [] //收集watcher数组
  }
  addSub(sub) {
    //添加watcher的方法
    this.subs.push(sub)
  }
  removeSub(sub) {  // 移除watcher
    if (this.subs.length) {
      const index = this.subs.indexOf(sub)
      if (index > -1) {
        return this.subs.splice(index, 1)
      }
    }
  }
  depend() {
    //传入订阅器，然后添加订阅者
    if (Dep.target) Dep.target.addDep(this)
  }
  notify() {
    // console.log('notify', this.subs)
    //通知订阅者更新
    this.subs.forEach((sub) => {
      sub.update()
    })
  }
}
const targetStack = [] // 存放target的数组
export const pushTarget = (target) => {
  targetStack.push(target)
  Dep.target = target
}
export const popTarget = () => {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}