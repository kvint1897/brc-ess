<template>
  <div id="app">
    <nav>
        <router-link :to="{name: 'home'}">Сканирование</router-link> |
        <router-link :to="{name: 'archive'}">Архив</router-link>
    </nav>
    <transition name="slide-fade" mode="out-in">
        <router-view/>
    </transition>
  </div>
</template>

<style>
    .router-link-exact-active {
        text-decoration: none;
        font-weight: bold;
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
