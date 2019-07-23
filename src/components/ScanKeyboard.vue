<template>
  <div></div>
</template>

<script>
export default {
  mounted() {
    this.handler = event => {
      this.$emit('keydown', event)
    }

    window.addEventListener('keydown', this.handler)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handler)
  }
}
</script>

<style scoped>
div {
  display: none;
}
</style>
