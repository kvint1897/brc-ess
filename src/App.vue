<template>
  <div id="app">
    <nav>
      <router-link class="router-link" :to="{name: 'home'}">Сканирование</router-link>
      <router-link class="router-link" :to="{name: 'archive'}">Архив</router-link>
      <router-link class="router-link" :to="{name: 'help'}">Help</router-link>
      <modal-settings />
    </nav>
    <transition name="slide-fade" mode="out-in">
        <router-view/>
    </transition>
  </div>
</template>

<script>
import ModalSettings from './components/ModalSettings'

export default {
    name: 'app',
    components: {
        ModalSettings,
    }
}
</script>

<style>
.router-link {
  border: 2px solid #777;
  background: #ccc;
  color: #000;
  padding: 10px 64px;
  text-decoration: none;
  margin: 0 5px;
}
.router-link-exact-active {
  text-decoration: none;
  background: #777;
  color: #fff;
}
.slide-fade-enter-active {
  transition: all .2s ease;
}
.slide-fade-leave-active {
  transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
