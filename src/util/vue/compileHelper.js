import Watcher from './watcher'
import _ from 'lodash'
export const CompileUtil = {
  text(node, vm, exp) { //编译文本
    this._bind(node, vm, exp, 'text')
  },
  eventHandler(node, vm, eventType, exp) {
    node.addEventListener(eventType, function(e) {
      // with(vm) {
      // 	eval(exp)        //执行事件里的函数
      // }
      _with(exp, vm, /^\$event$/, () => {
        const o = {}
        for (let i in e) {
          try {
            o[i] = JSON.stringify(e[i])
          } catch (err) {}
        }
        return JSON.stringify(o)
      }, (expOrFn, $1) => {
        if (/^this\.(\w+)$/.test(expOrFn) && $1 in vm.methods) {
          expOrFn += '()'
        }
        return expOrFn
      })
    })
  },
  model(node, vm, exp) {
    if (node.nodeName == 'INPUT') {
      this._bind(node, vm, exp, 'model')
      node.addEventListener('input', (e) => {
        const val = e.target.value
        vm[exp] = val
      })
    }
  },
  class(node, vm, exp) {
    this._bind(node, vm, exp, 'class')
  },
  style(node, vm, exp) {
    this._bind(node, vm, exp, 'style')
  },
  _bind(node, vm, exp, dir) {
    const updaterFn = Updater[`${dir}Updater`] //根据指令来的是什么的更新？
    updaterFn && updaterFn(node, vm, exp) //存在并更新到fragment上去
    // new Watcher(vm, '_data', (val, oldVal) => {
    //   updaterFn(node, vm, exp)
    // })
    const variable = this._keyOfExp(exp, dir) //获取表达式里的变量，添加订阅者，变化后自动更新
    if (!variable || !variable in vm) return
    // console.log(variable)
    variable.forEach(key => {
      new Watcher(vm, key, () => {
        updaterFn(node, vm, exp)
      })
    })
  },
  _keyOfExp(exp, temp = 'text') { //从一个表达式(string)里拿变量(vm的属性) 
    const variaArr = [exp].reduce((result, item) => {
      let variaStr = ''
      if (temp === 'text') { // 来自模板引擎，也许多个{{}}情况
        item.match(/\{\{((?:.|\r?\n)+?)\}\}/g).forEach(v => {
          const mv = /^(?:\{\{)((?:\s|\S)*)(?:\}\})$/.exec(v)[1] + '+'
          variaStr += mv
        })
      } else if (temp === 'class') {
        variaStr = item.replace(/^\[([\s\S]+?)\]$/, '$1')
      } else {
        variaStr = item
      }
      if (/JSON\.(?:stringify|parse)\(([a-zA-Z_\$]\w*)\)/g.test(variaStr)) {
        result.push(RegExp.$1)
      }
      if (/eval\((['"])([\s\S]*)\1\)/g.test(variaStr)) {
        variaStr = RegExp.$2
      }
      variaStr.replace(/[\s\r\n]/g, '').split(/[\+\-\*\/\|\&,\?]/).forEach(str => {
        const nExp = str.match(/^\w+(?:\.\w*)*$/g)
        if (nExp) result.push(...nExp)
      })
      return result
    }, [])
    return [...new Set(variaArr)]
  }
}

let classI = 0,
  proClass

export const Updater = {
  textUpdater(node, vm, exp) {
    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
    const text = _.template(exp)(vm)
    node['textContent'] = text
  },
  modelUpdater(node, vm, exp) {
    const value = vm[exp]
    node.value = typeof value == 'undefined' ? '' : value;
  },
  classUpdater(node, vm, exp) {
    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
    const nExp = `{{${exp}}}`
    const classNames = _.template(nExp)(vm).split(',') 
    !classI && (proClass = [...node.classList])
    node.className = [...proClass, ...classNames].join(' ')
    classI++
  },
  styleUpdater(node, vm, exp) {
    const value = _with(exp,vm)
    node.style = Object.keys(value).reduce((sty,key) => {
      const style = `${key}:${value[key]};`
      sty += style
      return sty
    },'')
  }
}

function _with(exp, vm, extraRule, extraFn, otherFn) {
  let expOrFn, rule = /([a-zA-Z\$]+\w*)/g
  if(/^{[\s\S]+?}$/.test(exp)) {
    rule = /\:\s*([a-zA-Z\$]+\w*)/g
    exp = exp.replace(/\s/g,'')
  }
  expOrFn =  exp.replace(rule, (a, b) => {
    let nb, i = a.indexOf(b)
    const f = extraRule instanceof RegExp && extraRule.test(b)
    if (!f) nb = `this.${b}`
    else {
      nb = typeof extraFn === 'function' && extraFn(b)
    }
    a = a.split(b)
    a.splice(i,0,nb)
    return a.join('')
  })
  if(typeof otherFn === 'function') expOrFn = otherFn(expOrFn, RegExp.$1)
  return new Function('return ' + expOrFn).call(vm)
}