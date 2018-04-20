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
  }
}
</script>

<template>
<a href="javascript:void(0);" @click='onClickAdd' @mouseover='showComponentAddText = true' @mouseleave='showComponentAddText = false'>
  <div class="ui-svgicon" :class='{"is-hover": showComponentAddText}' style="margin-right: 4px;">
    <svg width="16" height="16" aria-hidden="true" data-role="icon_add" viewBox="0 0 32 32" fill="currentColor"><path class="Icon_new__path-3gR-j" d="M14 14H4v4h10v10h4V18h10v-4H18V4h-4v10z"></path></svg>
  </div>
  <transition name="slide-fade">
    <span class='component-add-text' v-show="showComponentAddText">{{addText}}</span>
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
.ui-svgicon {
  color: #aaa;
  transition: all 0.3s;
}
.ui-svgicon.is-hover {
  color: #44b549;
  -ms-transform: translateX(-30px);
  transform: translateX(-30px);
}
.component-add-text {
  position: absolute;
  -ms-transform: translateX(-30px);
  transform: translateX(-30px);
  color: #44b549;
  display: inline-block;
  transition: all 0.3s;
}
.slide-fade-enter, 
.slide-fade-leave-to {
  -ms-transform: translateX(10px);
  transform: translateX(10px);
  opacity: 0;
  color: #aaa;
}

</style>
