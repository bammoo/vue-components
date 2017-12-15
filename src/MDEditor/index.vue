<template>
  <div class="markdown-editor">
    <textarea></textarea>
  </div>
</template>

<script>
import SimpleMDE from 'simplemde';
import 'simplemde/dist/simplemde.min.css';
import './font-awesome.css';

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
      },
    },
    highlight: {
      type: Boolean,
      default() {
        return false;
      },
    },
    sanitize: {
      type: Boolean,
      default() {
        return false;
      },
    },
    configs: {
      type: Object,
      default() {
        return {};
      },
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
    initialize() {
      const configs = {
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
        status: ["autosave", "words"]
      };
      Object.assign(configs, this.configs);
      // 判断是否开启代码高亮
      if (this.highlight) {
        configs.renderingConfig.codeSyntaxHighlighting = true
      }
      if (this.toolbar) {
        configs.toolbar = this.toolbar
      }
      // 实例化编辑器
      this.simplemde = new SimpleMDE(configs);
      // 添加自定义 previewClass
      const className = this.previewClass || '';
      this.addPreviewClass(className);
      // 绑定事件
      this.bindingEvents();
    },
    bindingEvents() {
      this.simplemde.codemirror.on('change', () => {
        this.$emit('input', this.simplemde.value());
      });
    },
    addPreviewClass(className) {
      const wrapper = this.simplemde.codemirror.getWrapperElement();
      const preview = document.createElement('div');
      wrapper.nextSibling.className += ` ${className}`;
      preview.className = `editor-preview ${className}`;
      wrapper.appendChild(preview);
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
.markdown-editor .markdown-body {
  padding: 0.5em
}
.markdown-editor .editor-preview-active, .markdown-editor .editor-preview-active-side {
  display: block;
}
.markdown-editor .editor-toolbar.fullscreen, 
.markdown-editor .editor-preview-side.editor-preview-active-side, 
.markdown-editor .CodeMirror-fullscreen { z-index: 201 !important; }
</style>