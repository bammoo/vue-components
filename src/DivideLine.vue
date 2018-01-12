<script>
export default {
  name: 'divide-line',
  props: ['color']
}
</script>

<template>
<span :style='{"border-left-color": color}' class='divideLine'>|</span>
</template>

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
