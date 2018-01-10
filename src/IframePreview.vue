<script>
export default {
  name: 'iframe-preview',
  props: [
    'src', 
    'show'
  ],
  data() {
    return {
      device: 'phone'
    }
  },
  computed: {
    deviceCls() {
      return 'is-' + this.device
    }
  },
  methods: {
    close() {
      this.$emit('update:show', false)
    }
  }
}
</script>

<template>
<div class="web-preview is-visible" v-if='show'>
   <div class="web-preview__backdrop"></div>
   <div class="web-preview__content">
      <div class="web-preview__inner is-visible is-loaded" :class='deviceCls'>
         <div class="web-preview__toolbar">
            <ul class="select-dropdown__options" role="menu" aria-labelledby="select-dropdown-5" aria-expanded="true">
               <li>
                  <a class="select-dropdown__item has-icon" :class='{active: device=="desktop"}' @click="device='desktop'" role="menuitem" tabindex="0" aria-selected="false">
                     <span class="select-dropdown__item-text">
                        <svg class="gridicon gridicons-computer" height="18" width="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g><path d="M20 2H4c-1.104 0-2 .896-2 2v12c0 1.104.896 2 2 2h6v2H7v2h10v-2h-3v-2h6c1.104 0 2-.896 2-2V4c0-1.104-.896-2-2-2zm0 14H4V4h16v12z"></path></g></svg>
                        Desktop
                     </span>
                  </a>
               </li>
               <li class="select-dropdown__option">
                  <a class="select-dropdown__item is-selected has-icon" :class='{active: device=="tablet"}' @click="device='tablet'" role="menuitem" tabindex="0" aria-selected="true">
                     <span class="select-dropdown__item-text">
                        <svg class="gridicon gridicons-tablet" height="18" width="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g><path d="M18 2H6c-1.104 0-2 .896-2 2v16c0 1.104.896 2 2 2h12c1.104 0 2-.896 2-2V4c0-1.104-.896-2-2-2zm-5 19h-2v-1h2v1zm5-2H6V5h12v14z"></path></g></svg>
                        Tablet
                     </span>
                  </a>
               </li>
               <li class="select-dropdown__option">
                  <a class="select-dropdown__item has-icon" :class='{active: device=="phone"}' @click="device='phone'" role="menuitem" tabindex="0" aria-selected="false">
                     <span class="select-dropdown__item-text">
                        <svg class="gridicon gridicons-phone" height="18" width="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g><path d="M16 2H8c-1.104 0-2 .896-2 2v16c0 1.104.896 2 2 2h8c1.104 0 2-.896 2-2V4c0-1.104-.896-2-2-2zm-3 19h-2v-1h2v1zm3-2H8V5h8v14z"></path></g></svg>
                        Phone
                     </span>
                  </a>
               </li>
            </ul>
            <button aria-label="Close preview" class="web-preview__close is-borderless" @click="close" type="button">关闭</button>
         </div>
         <div class="web-preview__placeholder">
            <div class="web-preview__frame-wrapper" style="display: inherit;">
              <iframe class="web-preview__frame" :src="src" title="Preview"></iframe>
            </div>
         </div>
      </div>
   </div>
</div>
</template>

<style scoped>

.web-preview {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  margin: 0 auto;
  overflow: hidden;
  opacity: 0;
  z-index: 100200;
  transition: opacity 0.3s ease-in-out
}
.web-preview.is-visible {
  opacity: 1;
  bottom: 0;
  visibility: visible;
}

.web-preview.is-visible .web-preview__content {
  opacity: 1;
  -webkit-transform: translateY(0);
  transform: translateY(0);
}

.web-preview__backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: block;
  background: rgba(243,246,248,0.8)
}
.web-preview__content {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  box-shadow: 0 0 0 1px rgba(135,166,188,0.5);
  background: #f3f6f8;
  border-radius: 4px 4px 0 0;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 auto;
  opacity: 0;
  -webkit-transform: translateY(80vh);
  transform: translateY(80vh);
  transition: opacity 0.1s ease-in-out, -webkit-transform 0.2s ease-out;
  transition: transform 0.2s ease-out, opacity 0.1s ease-in-out;
  transition: transform 0.2s ease-out, opacity 0.1s ease-in-out, -webkit-transform 0.2s ease-out;
}

@media (min-width: 961px) {
  .web-preview__content {
    top:24px;
    left: 24px;
    right: 24px;
    width: calc( 100% - 46px)
  }
}

.web-preview__inner {
  height: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  position: relative;
}

.web-preview__toolbar {
  position: relative;
  height: 46px;
  background: #fff;
  border-bottom: 1px solid #c8d7e1;
  border-radius: 4px 4px 0 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: center;
}

.select-dropdown__options {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
.select-dropdown__options li {
  display: inline-block;
}
.select-dropdown__item {
  display: block;
  position: relative;
  height: 46px;
  line-height: 46px;
  padding: 0 16px 0 16px;
  color: #aaa;
  font-size: 14px;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer
}
.select-dropdown__item:focus {
  -webkit-appearance: none;
  outline: none;
}
.select-dropdown__item.active {
  color: #2e4453;
}
.select-dropdown__item-text {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: inherit;
  display: inline-block;
  max-width: 100%;
}
.gridicon {
  fill: currentColor;
}
.select-dropdown__item .gridicon {
  margin-right: 8px;
  vertical-align: text-bottom;
}

.is-borderless {
  border: none;
  background: none;
  cursor: pointer;
}
.web-preview__close {
  position: absolute;
  right: 0;
  border-left: 1px solid #d9e3ea;
  padding:6px 32px;
  min-width: 80px;
  height: 46px;
  color: var(--global-link-color);
  border-radius: 0;
}
.web-preview__placeholder {
  position: relative;
  width: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
}
.web-preview__frame-wrapper {
  position: absolute;
  top: 0;
  left: 0; 
  height: 100%;
  width: 100%;
}
.web-preview__frame {
  display: block;
  width: 100%;
  max-width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.2s ease-in-out, max-width 0.2s ease-out;
  margin: 0 auto;
  pointer-events: none;

  border: none;
  background: #fff;
}
.is-loaded .web-preview__frame {
  opacity: 1;
  pointer-events: all
}

.is-tablet .web-preview__frame {
  max-width: 783px
}

.is-phone .web-preview__frame {
  max-width: 460px
}

.is-desktop .web-preview__frame {
  max-width: 100%;
}
</style>
