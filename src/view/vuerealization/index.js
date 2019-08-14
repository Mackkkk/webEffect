import Vue from '../../util/vue'
window.vm = new Vue({
  el: '#app',
  data() {
    return {
      num: 1,
      text: 'hello',
      child: {
        text: 'world',
        child: {
          text: '2018'
        }
      },
      isRed: true,
      list: [1, 2, 3],
      strHtml: '<p class="red">我是来自data的html</p>',
      style: {
        color: '#00bbcc'
      },
      blueColor: 'blue'
    }
  },
  computed: {
    computeText: function() {
      return this.text + ' ' + this.child.text + ' form computed'
    },
    getText: {
      get() {
        return this.text + ' form get '
      }
    }
  },
  methods: {
    numAdd(...args) {
      // console.log(args)
      this.num ++
    },
    addList() {
      this.list.push(this.text)
      // console.log(this.list)
    }
  },
  beforeCreated() {
    // console.log('beforeCreated')
  },
  created() {
    // console.log('created')
  },
  beforeMount() {
    // console.log('beforeMount')
  },
  mounted() {
    // console.log('mounted')
  },
  updated() {
    // console.log('updated')
  },
  watch: {
    // text: function(newVal, old) {
    //   console.log(newVal,old)
    // },
    // 'child.text': function(newVal, old) {
    //   console.log('child.text => ' + newVal)
    // },
    // list: function(newVal,oldVal) {
    //     console.log(newVal,oldVal)
    // }
  }
})
