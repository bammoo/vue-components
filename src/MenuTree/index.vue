/**
 * modified from https://github.com/yjj5855/vue2-admin-demo/blob/master/src/components/tree-node.vue
 */

<script>
  import shareStore from './shareStore'
  import TreeNode from './tree-node.vue'

  export default {
    name: 'MenuTree', // 递归组件需指明 name
    props: {
      // 节点数据，形如 { name: 'xxx', children: [] }
      treeData: Object
    },
    components: {
      TreeNode
    },
    methods: {
      onNodeChange (rootNode) {
        this.$emit('on-change', JSON.parse(JSON.stringify(rootNode)))
      },
      onDragStart() {
        this.$el.classList.add('dragging')
      },
      onDragStop() {
        this.$el.classList.remove('dragging')
      }
    }
  }
</script>

<template>
<div class='tree-node-root'>
  <tree-node :node="treeData" 
    @on-node-change="onNodeChange" 
    @on-dragstart='onDragStart'
    @on-dragstop='onDragStop'></tree-node>
</div>
</template>

<style lang='less'>
.tree-node-root.dragging  .tree-node-name {
    pointer-events: none;
}
.tree-node-root .el-tree-node__content .el-tree-node__expand-icon {
  border: transparent;
}

/*label 右边加 箭头*/
.tree-node-root .el-tree-node__content .el-tree-node__label{
  &:after{
    font-family: 'element-icons' !important;
    margin-left: 8px;
    content: "";
  }
}
.tree-node-root .el-tree-node__content .el-tree-node__expand-icon+.el-checkbox+.el-tree-node__label{
  &:after{
    content: "\E600";
  }
}

.tree-node-root .el-tree-node__content .el-tree-node__expand-icon.is-leaf+.el-checkbox+.el-tree-node__label{
  &:after{
    content: "";
  }
}

.tree-node-root .el-tree-node__content .el-tree-node__expand-icon.expanded+.el-checkbox+.el-tree-node__label{
  &:after{
    content: "\E603";
  }
}
</style>