<template>
  <div class="markdown-editor">
    <textarea></textarea>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it'
import SimpleMDE from 'simplemde'
import 'simplemde/dist/simplemde.min.css'
import './iconfont/iconfont.css'
import {getHeadingFunction, getUploadFunction} from './functions'

export default {
  name: 'md-editor',
  props: {
    toolbar: Array,
    value: String,
    previewClass: String,
    autoinit: {
      type: Boolean,
      default() {
        return true;
      }
    },
    highlight: {
      type: Boolean,
      default() {
        return false;
      }
    },
    sanitize: {
      type: Boolean,
      default() {
        return false;
      }
    },
    configs: {
      type: Object,
      default() {
        return {};
      }
    },
  },
  mounted() {
    if (this.autoinit) this.initialize();
  },
  activated() {
    const editor = this.simplemde;
    if (!editor) return;
    const isActive = editor.isSideBySideActive() || editor.isPreviewActive();
    if (isActive) editor.toggleFullScreen();
  },
  methods: {
    getToolFunction(toolbar) {
      // function updateLineInfo(editor) {
      //   const cm = editor.codemirror
      //   var line = cm.getCursor().line, handle = cm.getLineHandle(line);
      //   console.log('line', line, handle)
      //   if (handle == currentHandle && line == currentLine) return;
      //   if (currentHandle) {
      //     cm.setLineClass(currentHandle, null, null);
      //     cm.clearMarker(currentHandle);
      //   }
      //   currentHandle = handle; currentLine = line;
      //   cm.setLineClass(currentHandle, null, "activeline");
      //   cm.setMarker(currentHandle, String(line + 1));
      // } 
      const functions = [
        {
          name: "bold",
          action: SimpleMDE.toggleBold,
          className: "iconfont icon-bold",
          title: "加粗"
        },{
          name: "gray-color",
          action: function drawRedText(editor) {
            var cm = editor.codemirror;
            var output = '';
            var selectedText = cm.getSelection();
            var text = selectedText || 'placeholder';

            output = '*' + text + '*';
            cm.replaceSelection(output);
          },
          className: "iconfont icon-font",
          title: "灰色"
        },{
          name: "list-ol",
          action: SimpleMDE.toggleOrderedList,
          className: "iconfont icon-list-ol",
          title: "有序列表"
        },{
          name: "list-ul",
          action: SimpleMDE.toggleUnorderedList,
          className: "iconfont icon-list-ul",
          title: "无序列表"
        },{
          name: "table",
          action: SimpleMDE.drawTable,
          className: "iconfont icon-table",
          title: "插入表格"
        },{
          name: "side-by-side",
          action: SimpleMDE.toggleSideBySide,
          className: "iconfont icon-preview",
          title: "预览"
        },{
          name: "heading-1",
          action: SimpleMDE.toggleHeading1,
          className: "iconfont icon-h1", // Look for a suitable icon
          title: "一级标题"
        },{
          name: "heading-2",
          action: SimpleMDE.toggleHeading2,
          className: "iconfont icon-h2", // Look for a suitable icon
          title: "二级标题"
        },{
          name: "heading-3",
          action: SimpleMDE.toggleHeading3,
          className: "iconfont icon-h3", // Look for a suitable icon
          title: "三级标题"
        },{
          name: "heading-4",
          action: getHeadingFunction(4),
          className: "iconfont icon-h4", // Look for a suitable icon
          title: "四级标题"
        },{
          name: "heading-5",
          action: getHeadingFunction(5),
          className: "iconfont icon-h5", // Look for a suitable icon
          title: "五级标题"
        },
        {
          name: 'fullscreen',
          action: this.handleFullScreen,
          className: "iconfont icon-full-screen",
          title: "全屏"
        },
        {
          name: 'link',
          action: SimpleMDE.drawLink,
          className: "iconfont icon-link",
          title: "插入链接"
        }
      ]
      const output = []
      toolbar.forEach((item, idx) => {
        const findOne = functions.find(i => i.name === item)
        if(findOne)
          output[idx] = findOne
        else
          output[idx] = item
      })
      return output
    },
    initialize() {
      const md = new MarkdownIt({
        html: true
      });
      const configs = {
        previewRender: function(plainText) {
          return md.render(plainText);
        },
        element: this.$el.firstElementChild,
        initialValue: this.value,
        renderingConfig: {},
        autoDownloadFontAwesome: false,
        spellChecker: false,
        autosave: {
          enabled: false,
          uniqueId: "md-editor",
          delay: 1000,
        },
        status: false
      };
      Object.assign(configs, this.configs);
      // 判断是否开启代码高亮
      if (this.highlight) {
        configs.renderingConfig.codeSyntaxHighlighting = true
      }
      if (this.toolbar) {
        const toolbar = this.getToolFunction(this.toolbar)
        configs.toolbar = toolbar
      }
      // 实例化编辑器
      this.simplemde = new SimpleMDE(configs);
      // 添加自定义 previewClass
      // this.previewClass && this.addPreviewClass(this.previewClass)
      // 绑定事件
      this.bindingEvents()
    },
    handleFullScreen() {
      if(this.simplemde.isFullscreenActive()) {
        this.simplemde.toggleFullScreen(this.simplemde)
      }
      else {
        // 忽略 simplemde js 报错
        try{
          this.simplemde.toggleSideBySide(this.simplemde)
        }
        catch(e) {}
        this.simplemde.toggleFullScreen(this.simplemde)
      }
    },
    bindingEvents() {
      this.simplemde.codemirror.on('focus', () => {
        this.$emit('focus', this.simplemde);
      });
      this.simplemde.codemirror.on('change', (codemirror, changeObj) => {
        if(changeObj.origin !== "setValue")
          this.$emit('input', this.simplemde.value());
      });
      this.simplemde.codemirror.on('paste', (codemirror, e) => {
        console.log('editor', codemirror)
        // console.log(e.clipboardData)
        if(!(e.clipboardData && e.clipboardData.items)){
          alert("该浏览器不支持操作");
          return;
        }
        for (var i = 0, len = e.clipboardData.items.length; i < len; i++) {
          var item = e.clipboardData.items[i];
         // console.log(item.kind+":"+item.type);
          if (item.kind === "string") {
            item.getAsString(function (str) {
                // str 是获取到的字符串
            })
          } else if (item.kind === "file") {
            var pasteFile = item.getAsFile();
            // pasteFile就是获取到的文件
            // console.log(pasteFile);
            this.$emit('onPasteFile', {codemirror, pasteFile});
          }
        }
      })
    },
    addPreviewClass(className) {
      const wrapper = this.simplemde.codemirror.getWrapperElement();
      const preview = document.createElement('div');
      // 没起作用，每次 fullscreen 后 className 就没了
      wrapper.nextSibling.className += ` ${className}`;
      preview.className = `editor-preview ${className}`;
      // 也没起作用
      wrapper.nextSibling.appendChild(preview);
    }
  },
  destroyed() {
    this.simplemde = null;
  },
  watch: {
    value(val) {
      if (val === this.simplemde.value()) return;
      this.simplemde.value(val);
    },
  },
};
</script>

<style>
/* MDEditor/index.vue */
.markdown-editor {
  border-radius: 2px;
  border: 1px solid #d9d9dd;
}
.markdown-editor .markdown-body {
  padding: 0.5em
}
.markdown-editor .editor-toolbar {
  line-height: initial;
  border: none;
}
.markdown-editor .CodeMirror {
  box-sizing: border-box;
  border: none;
}
.markdown-editor .editor-preview-active, .markdown-editor .editor-preview-active-side {
  display: block;
}
.markdown-editor .CodeMirror, .CodeMirror-scroll {
  min-height: 120px;
}
.markdown-editor .CodeMirror pre {
  line-height: 24px;
}
.markdown-editor .editor-toolbar.fullscreen, 
.markdown-editor .editor-preview-side.editor-preview-active-side, 
.markdown-editor .CodeMirror-fullscreen { z-index: 201 !important; }
</style>
