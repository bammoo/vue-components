<style scoped>
.divideLine {
  border-left: 1px solid #eee;
  display: inline-block;
  text-indent: -500em;
  margin-right: 10px;
  margin-left: 10px;
  height: 13px;
  line-height: 13px;
}
</style>

<template>
<span :style='{"border-left-color": color}' class='divideLine'>|</span>
</template>

<script>
export default {
  props: ['color']
}
</script>
