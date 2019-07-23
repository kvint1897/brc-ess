<template>
  <main>
    <scan-keyboard @keydown="filterKeyboard" />
    <div class="spec">
      <input class="textbox"
        placeholder="Введите № спецификации"
        v-model.trim.lazy="spec"
        :readonly="isWork"
        :class="{ readonly: isWork }"
        @dblclick="spec = ''"
        autofocus />
    </div>
    <div v-if="isWork" class="counters">
      <button class="send" title="Отправить на сервер" @click="send">{{ count }}</button>
      <div v-if="total>0" class="total">∑{{ total }}</div>
    </div>
    <div v-if="isWork">
      <input ref="code" class="textbox"
        v-model="newCode"
        v-on:keyup.enter="addCode"
        placeholder="Просканируйте акцизную марку" />
      <ul class="code-list">
        <li v-for="(code, index) in codes"
          :key="index"
          :class="{ completed: code.completed, editing: code == editedCode}">
          <div class="view">
            <label @dblclick="editCode(code)">{{ code.title }}</label>
            <button class="destroy" @click="removeCode(code)"></button>
          </div>
          <input class="edit" type="text"
            v-model="code.title"
            @blur="doneEdit(code)"
            @keyup.enter="doneEdit(code)" />
        </li>
      </ul>
      <ul class="code-list"></ul>
    </div>
  </main>
</template>

<script>
import axios from 'axios'
import ScanKeyboard from '@/components/ScanKeyboard'

const STORAGE_KEY = 'excise-codes'
const START_CODE = 'Digit4'
const END_CODE = 'Enter'

export default {
  name: 'home',
  components: {
    ScanKeyboard,
  },
  data() {
    return {
      newCode: '',
      codes: [],
      total: 0,
      buffer: '',
      isTrace: false,
      spec: '',
      editedCode: null,
    }
  },
  created() {
    this.codes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  },
  computed: {
    isWork() {
      return this.spec !== ''
    },
    count() {
      return this.codes.length
    }
  },
  methods: {
    filterKeyboard(e) {
      if (!this.isWork) {
        return
      }
      if(e.code === START_CODE && e.shiftKey && !this.isTrace) {
        this.isTrace = true
        return
      }
      if(!this.isTrace) {
        return
      }
      if(e.code === END_CODE) {
        this.newCode = this.buffer
        this.addCode()
        this.buffer = ''
        this.isTrace = false
        return
      } else {
        this.buffer += e.key
      }
    },
    send() {
      this.$refs.code.focus()
      if(this.count === 0) {
        return
      }
      axios
        .post(this.$store.state.config.apiUrl, {
          action: 'addCodes',
          codes: this.codes,
          spec: this.spec
        })
        .then(response => {
          if (response.data.status == 'ok') {
            this.codes = []
            this.total = response.data.total
            this.saveCodes()
          }
        })
        .catch(e => {
          /* eslint-disable no-console */
          console.log(e)
        })
    },
    addCode() {
      let test = this.newCode.match(/[^-]{3}-([0-9]{11})[0-9]+?/)
      this.newCode = ''
      if (!test) {
        return
      }
      let val = test[1].trim()
      let uniq = true
      for (let i = 0, l = this.codes.length; i < l; i++) {
        if (this.codes[i].title == val) {
          uniq = false
          break
        }
      }
      if (!uniq) {
        return
      }
      this.codes.unshift({title: val, id: this.codes.length})
      this.saveCodes()
    },
    removeCode(code) {
      this.codes.splice(this.codes.indexOf(code), 1)
      this.saveCodes()
    },
    editCode(code) {
      this.editedCode = code

    },
    doneEdit(code) {
      if (!this.editedCode) {
        return
      }
      this.editedCode = null
      code.title = code.title.trim()
      if (!code.title) {
        this.removeCode(code)
      }
      this.saveCodes()
    },
    saveCodes() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.codes))
    }
  }
}
</script>

<style lang="less">
html,
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font: 14px 'Helvetica Neue', Helvetica, Arial, sans-serif;
  background: #f5f5f5;
  color: #4d4d4d;
  margin: 0 auto;
  font-smoothing: antialiased;
  font-weight: 300;
}

nav {
  margin: 20px auto;
  text-align: center;
}

main {
  margin: 40px auto;
  min-width: 230px;
  max-width: 640px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2),
              0 25px 50px 0 rgba(0, 0, 0, 0.1);
}

.destroy {
  border: 0;
  background: none;
  font-size: 100%;
  vertical-align: baseline;
  font-family: inherit;
  font-weight: inherit;
  color: inherit;
  appearance: none;
  font-smoothing: antialiased;
  outline: none;
}

.counters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 90px;
  font-weight: 100;
  text-align: center;
  color: #000;
  text-rendering: optimizeLegibility;
}

.send {
  font-size: inherit;
  margin: 20px;
  padding: 0 40px;
  background: #ccc;
  outline: none;
  cursor: pointer;
}

.total {
    color: green;
}

.textbox,
.edit {
  margin: 0;
  width: 100%;
  font-size: 24px;
  font-family: inherit;
  font-weight: inherit;
  line-height: 1.4em;
  border: 0;
  outline: none;
  color: inherit;
  padding: 6px;
  border: 1px solid #999;
  box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  font-smoothing: antialiased;
}

.textbox {
  padding: 16px;
  border: none;
  border-bottom: 2px solid #aaa;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: inset 0 -2px 1px rgba(0,0,0,0.03);
  &::-webkit-input-placeholder {
    font-style: italic;
    font-weight: 300;
    color: #e6e6e6;
  }
}

.readonly {
  background-color: #aaa;
  text-align: center;
}

.code-list {
  margin: 0;
  padding: 0;
  list-style: none;
  li {
    position: relative;
    font-size: 24px;
    border-bottom: 1px solid #ededed;
  }

  li:last-child {
    border-bottom: none;
  }

  li.editing {
    border-bottom: none;
    padding: 0;
  }

  li.editing .edit {
    display: block;
    width: 506px;
    padding: 13px 17px 12px 17px;
    margin: 0 0 0 43px;
  }

  li.editing .view {
    display: none;
  }
  li label {
    white-space: pre-line;
    word-break: break-all;
    padding: 15px 60px 15px 15px;
    margin-left: 45px;
    display: block;
    line-height: 1.2;
    transition: color 0.4s;
  }

  li.completed label {
    color: #d9d9d9;
    text-decoration: line-through;
  }

  li .destroy {
    display: none;
    position: absolute;
    top: 0;
    right: 10px;
    bottom: 0;
    width: 40px;
    height: 40px;
    margin: auto 0;
    font-size: 30px;
    color: #cc9a9a;
    margin-bottom: 11px;
    transition: color 0.2s ease-out;
  }

  li .destroy:hover {
    color: #af5b5e;
  }

  li .destroy:after {
    content:  '\d7';
  }

  li:hover .destroy {
    display: block;
  }

  li .edit {
    display: none;
  }

  li.editing:last-child {
    margin-bottom: -1px;
  }
}

/*.code-list li .toggle {
  text-align: center;
  width: 40px;
  height: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto 0;
  border: none;
  -webkit-appearance: none;
  appearance: none;
}

.code-list li .toggle:after {
  content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="%23ededed" stroke-width="3"/></svg>');
}

.code-list li .toggle:checked:after {
  content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="%23bddad5" stroke-width="3"/><path fill="%235dc2af" d="M72 25L42 71 27 56l-4 4 20 20 34-52z"/></svg>');
}*/
</style>
