
<script>
  import shareStore from './shareStore'

  export default {
    name: 'tree-node', // 递归组件需指明 name
    props: {
      node: Object, // 节点数据，形如 { name: 'xxx', children: [] }
      idx: Number // v-for 的索引，用于相邻节点的判别
    },
    data: function () {
      return {
        hideChildren: false,
        unwatchRootNode: () => {}
      }
    },
    beforeDestroy () {
      if (typeof this.idx === 'undefined') {
        this.unwatchRootNode()
      }
    },
    computed: {
      children () { // 为每个子节点前后都生成空节点，便于实现兄弟节点间的“插入排序”
        // 举例：原本是 [N1, N2, N3]
        let { children } = this.node
        if (!children || !children.length) return []

        let _children = []
        children.forEach(child => _children.push({}, child))
        _children.push({})

        // 最后生成 [E1, N1, E2, N2, E3, N3, E4]（其中 N 表示节点，E 表示空节点）
        return _children
      },
      isParent () { // 拖放限制 1：判断“我”是否为被拖动节点的父节点
        if(!shareStore.draggingNode)
          return false
        console.log(shareStore.draggingNode.node.name, shareStore.draggingNode.$parent.node.name)
        return this === shareStore.draggingNode.$parent
      },
      isNextToMe () { // 拖放限制 2：判断“我”是否为被拖动节点的相邻节点
        return this.$parent === shareStore.draggingNode && shareStore.draggingNode.$parent && Math.abs(this.idx - shareStore.draggingNode.idx) === 1
      },
      isMeOrMyAncestor () { // 拖放限制 3：判断被拖动节点是否为“我”自身或“我”的祖先
        var p = this
        while (p) {
          if (shareStore.draggingNode === p) return true
          p = p.$parent
        }
      },
      isAllowToDrop () { // 上述拖放限制条件的综合
        return !(
          this.isParent 
          || this.isNextToMe 
          || this.isMeOrMyAncestor 
          || this.node.isArticle
        )
      }
    },
    methods: {
      handleDragStart () {
        this.bubbleEvent('on-dragstart')
        // console.log('handleDragStart')
        // 设置本组件为当前正在拖动的实例，此举将同步 sync 到所有 TreeNode 实例
        shareStore.draggingNode = this
        this.$el.classList.add('dragstart')
      },
      handleDragEnd () {
        // console.log('handleDragEnd')

        this.bubbleEvent('on-node-change')
        this.$el.classList.remove('dragstart')
      },
      bubbleEvent (eventName) {
        // console.log(this.idx)
        if (typeof this.idx === 'undefined') {
          this.$emit(eventName, this.node)
        } else {
          this.$parent && this.$parent.bubbleEvent(eventName)
        }
      },
      handleDragEnter () { // 允许拖放才会显示样式
        // console.log('handleDragEnter', this.node.name)
        if (!this.isAllowToDrop || this.isArticle) return
        this.$el.classList.add('dragenter')
      },
      handleDragLeave () {
        // console.log('handleDragLeave', this.node.name)
        this.$el.classList.remove('dragenter')
      },
      handleDrop () {
        this.bubbleEvent('on-dragstop')

        console.log('handleDrop', this.node.name, this.node.isArticle)
        this.$el.classList.remove('dragenter')

        // 此时 this 为目的地节点，vm 才是被拖动节点
        if (!this.isAllowToDrop) return

        if (!shareStore.draggingNode) return
        // 无论如何都直接删除被拖动节点
        let index = shareStore.draggingNode.$parent.node.children.indexOf(shareStore.draggingNode.node)
        shareStore.draggingNode.$parent.node.children.splice(index, 1)

        // 情况 1：拖入空节点，成其兄弟（使用 splice 插入节点）
        if (!this.node.name) {
          return this.$parent.node.children.splice(this.idx / 2, 0, shareStore.draggingNode.node)
        }

        // 情况2：拖入普通节点，成为其子
        if (!this.node.children) Vue.set(this.node, 'children', []) // 须用 $set 引入双向绑定
        this.node.children.push(shareStore.draggingNode.node)
      },
      showDialog (type, node) {
        switch (type) {
          case 'add':
            this.$prompt(`请输入部门名称`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then(({ value }) => {
              if (!this.node.children) Vue.set(this.node, 'children', []) // 须用 $set 引入双向绑定
              this.node.children.push({name: value})
              this.$message({
                type: 'success',
                message: `新增了部门【${value}】`
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '取消输入'
              })
            })
            break
          case 'edit':
            let oldName = this.node.name
            this.$prompt(`请输入部门【${oldName}】的新名称`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then(({ value }) => {
              this.node.name = value
              this.$message({
                type: 'success',
                message: `部门【${oldName}】改为了: 【${value}】`
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '取消输入'
              })
            })
            break
          case 'delete':
            this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let index = this.$parent.node.children.indexOf(this.node)
              this.$parent.node.children.splice(index, 1)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
            break
        }
      }
    }
  }
</script>


<template>
  <!-- [解析]
  [:draggable="{Boolean}"] 空节点不能被拖动，判断依据是是否存在 node.name
  [@dragover.prevent] 必须设置，否则浏览器默认是禁用拖动的 -->
  <div class="tree-node" 
    :class="{ 'empty-node': !node.name }"
    :draggable="!!node.name"
    @dragstart.stop="handleDragStart"
    @dragend.prevent="handleDragEnd"
    @dragenter.stop="handleDragEnter"
    @dragover.prevent
    @dragleave.stop="handleDragLeave"
    @drop.stop="handleDrop"
  >
    <div class="tree-node-name" :class="{ 'has-name': node.name }">
      <span class='tree-node-expander' @click.stop.parent="hideChildren = !hideChildren">
        <span v-if="node.name && node.children && node.children.length > 0" class="el-tree-node__expand-icon el-icon-caret-right" :class="{ expanded: !hideChildren }"></span>
        <span class="el-tree-node__label"><span v-if='node.isArticle'>(文章)</span>{{ node.name }}</span>
      </span>
      <span class="tree-node-action" v-if="node.name && !node.disabledEdit">
        <el-button-group>
          <el-button size="mini" icon="el-icon-plus" @click="showDialog('add')"></el-button>
          <el-button size="mini" icon="el-icon-edit" @click="showDialog('edit')"></el-button>
          <el-button size="mini" icon="el-icon-delete" @click="showDialog('delete')"></el-button>
        </el-button-group>
      </span>
    </div>
    <div class="tree-node-children">
      <tree-node 
        v-for="(child, index) in children" 
        v-show="!hideChildren"
        :node="child" 
        :key='index'
        :idx="index">
      </tree-node>
    </div>
  </div>
</template>

<style>
  .tree-node { /* 普通节点 */
  }
  .tree-node.dragstart {
    background: #ddd;
    opacity: 0.7;
  }
  .tree-node.dragenter {
    background: #aaa;
  }
  .tree-node.empty-node { /* 空节点 */
    height: 5px;
    list-style-type: none;
    padding: 0;
    border: none;
    border-radius: 0;
  }
  .tree-node-children { /* 层次缩进 */
    margin-left: 1.5em;
  }
  .tree-node-name .tree-node-action{
    margin-left: 12px;
    font-size: 12px;
    display: none;
  }
  .tree-node-name.has-name{
    min-height: 22px;
    line-height: 22px;
  }
  .tree-node-name:hover .tree-node-action{
    display: inline-block;
    height: 14px;
  }
  .tree-node.dragstart .tree-node-action{
    display: none;
  }
  .el-tree-node__label{
    margin-left: 5px;
  }
</style>