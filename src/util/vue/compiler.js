import {CompileUtil} from './compileHelper'
export default class Compiler {
  constructor(el, vm) {
    this.$el = el instanceof HTMLDivElement ? el : document.querySelector(el)   // 拿dom
    this.$vm = vm  // 拿vue实例
    this._init()
  }
  _init() {
    if (!this.$el) return
    this.$fragment = this.createFragment(this.$el)   // 创建碎片
    // console.log(this.$fragment)
    this.compileElement(this.$fragment)     //---解析碎片
    this.$el.appendChild(this.$fragment)   //挂载
  }
  createFragment(el) {
    let fragment = document.createDocumentFragment(),
      childNode
    while (childNode = el.firstChild) { //循环拿到所有节点
      // console.log(childNode)
      fragment.appendChild(childNode)
    }
    return fragment
  }
  compileElement(el) {    // 节点编译函数
    // console.log(el.childNodes)
    Array.from(el.childNodes, node => {
			const text = node.textContent
			const	reg = /\{\{((?:.|\r?\n)+?)\}\}/g
      // console.log(node,text)
      if (node.childNodes && node.childNodes.length) {
				this.compileElement(node)      //递归编译所有节点
			}
      if (this.isTextNode(node) && reg.test(text)) {
				this.compileText(node)       //编译文本节点中的模板
			}
      if (this.isElementNode(node)) {     //编译节点
				this.compileNode(node)
			}
		})
  }
  compileText(node) {  // 文本节点编译
    CompileUtil.text(node,this.$vm, node.textContent)   // 渲染到节点
  }
  compileNode(node) {
		Array.from(node.attributes, attr => {
			// console.dir(attr)
			if (this.isDirective(attr.name)) {     //指令的编译
        // console.dir(attr)
				const exp = attr.value,			  //获取节点的属性              
					[dirFont,dirValue] = [RegExp.$1, RegExp.$2]   //获取指令前缀和值
          // console.log([dirFont,dirValue])
				if ( /(v-on:)|@/.test(dirFont) ) {     //是否是事件指令
					// console.log(dirFont,dirValue,exp)
					CompileUtil.eventHandler(node, this.$vm, dirValue, exp)   //处理绑定事件
				} else {
          // console.log(dirValue,exp)
					CompileUtil[dirValue] && CompileUtil[dirValue](node, this.$vm, exp)   //根据获取的指令，执行指令编译
				}
			}
		})
	}
  isElementNode(node) {   // 判断元素节点
		return node.nodeType === 1
	}
  isTextNode(node) {   // 判断文本节点
		return node.nodeType === 3
	}
  isDirective(attr) {  // 判断指令
		return/^((?:v-(?:\w+:)?)|:|@)(\w+)/.test(attr)
	}
}