<template>
  <main>
    <h1>Инструкции</h1>
    <h2>Режим: сканирование</h2>
    <ol>
      <li><img class="img" src="@/assets/img/s_1.jpg"></li>
      <li><img class="img" src="@/assets/img/s_2.jpg"></li>
      <li><img class="img" src="@/assets/img/s_3.jpg"></li>
      <li><img class="img" src="@/assets/img/s_4.jpg"></li>
    </ol>
    <h2>Режим: архив</h2>
    <ol>
      <li><img class="img" src="@/assets/img/a_1.jpg"></li>
      <li><img class="img" src="@/assets/img/a_2.jpg"></li>
      <li><img class="img" src="@/assets/img/a_3.jpg"></li>
    </ol>
  </main>
</template>

<style lang="less" scoped>
main {
  max-width: 100%;
  padding: 10px;
  background: #fff;
}
.img {
  max-width: 100%;
  height: auto;
  vertical-align: middle;
}
ol {
  counter-reset: custom-counter;
  list-style: none;
  li {
    padding-left: 64px;
    position: relative;
    margin-bottom: 30px;
    &:before {
      position: absolute;
      top: 0;
      left: 0;
      content: counter(custom-counter);
      counter-increment: custom-counter;
      font-weight: 700;
      background: #ccc;
      border-radius: 50%;
      border-style: solid;
      border-width: 2px;
      min-width: 26px;
      padding: 6px 2px;
      text-align: center;
    }
  }
}
</style>
