<style scoped>
.table {
    display: table;
    width: 100%;
    height: 100%;
}
.tableCell {
    display: table-cell;
    text-align: center;
    vertical-align: middle;
}
.inlineBlock {
    display: inline-block;
    text-align: left;
}
</style>

<template>
<div class='table'>
    <div class='tableCell'>
        <div class='inlineBlock' :style='innerStyle'>
            <slot></slot>
        </div>
    </div>
</div>
</template>

<script>
export default {
    props: ['innerStyle']
}
</script>
