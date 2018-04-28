<script>
export default {
  name: 'divide-line',
  props: {
    onClickAdd: Function,
    addText: {
      type: String,
      default: '添加组件'
    }
  },
  data() {
    return {
      showComponentAddText: false
    }
  },
  computed: {
    transformStyle() {
      const value = `-${this.addTextLength + 2}em`
      return {
        '-ms-transform': `translateX(${value})`,
        'transform': `translateX(${value})`,
      }
    },
    addTextLength() {
      const tLength = this.addText.length
      return (tLength - 4) / 2
    },
    spanStyle() {
      let value = `-${this.addTextLength}em`
      return {
        width: this.addText.length + 'em',
        '-ms-transform': `translateX(${value})`,
        'transform': `translateX(${value})`,
      }
    }
  }
}
</script>

<template>
<a href="javascript:void(0);" @click='onClickAdd' @mouseover='showComponentAddText = true' @mouseleave='showComponentAddText = false'>
  <div class="ui-svgicon plus-icon" :class='{"is-hover": showComponentAddText}' :style="this.showComponentAddText ? transformStyle : null">
    <svg width="16" height="16" aria-hidden="true" data-role="icon_add" viewBox="0 0 32 32" fill="currentColor"><path class="Icon_new__path-3gR-j" d="M14 14H4v4h10v10h4V18h10v-4H18V4h-4v10z"></path></svg>
  </div>
  <transition name="slide-fade">
    <span class='component-add-text2s' v-show="showComponentAddText"><span class='component-add-text' :style='spanStyle'>{{addText}}</span></span>
  </transition>
</a>
</template>

<style scoped>
a {
  position: relative;
  text-align: center;
  padding: 5px 0;
  display: block;
  line-height: 36px;
  color: #44b549;
  font-size: 16px;
}
a:hover {
  text-decoration: none;
  color: #3e9c55;
  background: #f9f9f9;
}
.plus-icon {
  margin-right: 4px;
  color: #aaa;
  transition: all 0.3s;
}
.plus-icon.is-hover {
  color: #44b549;
  -ms-transform: translateX(-30px);
  transform: translateX(-30px);
}
.component-add-text {
  color: #44b549;
  display: inline-block;
  transition: all 0.3s;
}
.component-add-text2s {
  position: absolute;
  -ms-transform: translateX(-30px);
  transform: translateX(-30px);
  transition: all 0.3s;
}
.slide-fade-enter, 
.slide-fade-leave-to {
  -ms-transform: translateX(-8px);
  transform: translateX(-8px);
  opacity: 0;
  color: #aaa;
}

</style>
