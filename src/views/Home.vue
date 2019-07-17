<template>
    <main>
            <div class="title">
                <button class="send" title="Отправить на сервер" @click="send">{{ count }}</button>
                <div v-if="total>0" class="total">∑{{ total }}</div>
            </div>
            <input ref="code" class="new-code"
                   v-model="newCode"
                   v-on:keyup.enter="addCode"
                   placeholder="Просканируйте акцизную марку" autofocus>
            <ul class="code-list">
                <li v-for="(code, index) in filteredCodes"
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
    </main>
</template>

<script>
const STORAGE_KEY = 'excise-codes'
const API_URL = 'http://web.kvint.md/brc/api.php'
const START_CODE = 'Digit4'
const END_CODE = 'Enter'
import axios from 'axios'
export default {
    name: 'home',
    data() {
        return {
            newCode: '',
            codes: [],
            total: 111,
            buffer: '',
            isTrace: false,
            editedCode: null,
            visibility: 'all'
        }
    },
    created() {
        let self = this;
        window.addEventListener('keydown', function (e) {
            self.scanKeyboard(e);
            // self.$nextTick(() => {
            //     self.$refs.code.focus()
            // })
        }, true);
        this.codes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    },
    computed: {
        count() {
            return this.codes.length;
        },
        filteredCodes() {
            if (this.visibility === 'all') {
                return this.codes;
            } else if (this.visibility === 'active') {
                return this.codes.filter(function (code) {
                    return !code.completed;
                });
            } else {
                //completed
                return this.codes.filter(function (code) {
                    return code.completed;
                })

            }
        }

    },
    methods: {
        scanKeyboard(e) {
            // console.log(this.isTrace, this.buffer, e)
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
            if(this.count === 0){
                return
            }
            axios.post(API_URL, {
                codes: this.codes
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then(response => {
                if (response.data.status == 'ok') {
                    this.codes = []
                    this.total = response.data.total
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.codes))
                }
            })
            .catch(e => {
                /* eslint-disable no-console */
                console.log(e)
            });
        },
        addCode() {
            var test = this.newCode.match(/[^-]{3}-([0-9]{11})[0-9]+?/);
            this.newCode = '';
            if (!test) {
                return;
            }
            var val = test[1].trim(), uniq = true;
            for (var i = 0, l = this.codes.length; i < l; i++) {
                if (this.codes[i].title == val) {
                    uniq = false;
                    break;
                }
            }
            if (!uniq) {
                return;
            }
            this.codes.unshift({title: val, id: this.codes.length});
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.codes));

        },
        removeCode(code) {
            this.codes.splice(this.codes.indexOf(code), 1);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.codes));
        },
        editCode(code) {
            this.editedCode = code;

        },
        doneEdit(code) {
            if (!this.editedCode) {
                return
            }
            this.editedCode = null;
            code.title = code.title.trim();
            if (!code.title) {
                this.removeCode(code);
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.codes));
        }
    }
}
</script>

<style lang="less">
html,
body {
  margin: 0;
  padding: 0;
}

nav {
    margin: 20px auto;
    text-align: center;
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

body {
  font: 14px 'Helvetica Neue', Helvetica, Arial, sans-serif;
  background: #f5f5f5;
  color: #4d4d4d;
  margin: 0 auto;
  font-smoothing: antialiased;
  font-weight: 300;
}


.title {
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
.new-code,
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

.new-code {
  background: #fff;
  padding: 16px 16px 16px 60px;
  border: none;
  border-bottom: 2px solid #aaa;
  /*background: rgba(0, 0, 0, 0.003);*/
  box-shadow: inset 0 -2px 1px rgba(0,0,0,0.03);
  &::-webkit-input-placeholder {
    font-style: italic;
    font-weight: 300;
    color: #e6e6e6;
  }
}

main {
    margin: 100px auto 40px auto;
    min-width: 230px;
    max-width: 640px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2),
              0 25px 50px 0 rgba(0, 0, 0, 0.1);
}

.code-list {
    background: #fff;
    margin: 0;
    padding: 0;
    list-style: none;
}

.code-list li {
  position: relative;
  font-size: 24px;
  border-bottom: 1px solid #ededed;
}

.code-list li:last-child {
  border-bottom: none;
}

.code-list li.editing {
  border-bottom: none;
  padding: 0;
}

.code-list li.editing .edit {
  display: block;
  width: 506px;
  padding: 13px 17px 12px 17px;
  margin: 0 0 0 43px;
}

.code-list li.editing .view {
  display: none;
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

.code-list li label {
  white-space: pre-line;
  word-break: break-all;
  padding: 15px 60px 15px 15px;
  margin-left: 45px;
  display: block;
  line-height: 1.2;
  transition: color 0.4s;
}

.code-list li.completed label {
  color: #d9d9d9;
  text-decoration: line-through;
}

.code-list li .destroy {
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

.code-list li .destroy:hover {
  color: #af5b5e;
}

.code-list li .destroy:after {
  content:  '\d7';
}

.code-list li:hover .destroy {
  display: block;
}

.code-list li .edit {
  display: none;
}

.code-list li.editing:last-child {
  margin-bottom: -1px;
}

.footer {
  color: #777;
  padding: 10px 15px;
  height: 20px;
  text-align: center;
  border-top: 1px solid #e6e6e6;
}

.footer:before {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 50px;
  overflow: hidden;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2),
              0 8px 0 -3px #f6f6f6,
              0 9px 1px -3px rgba(0, 0, 0, 0.2),
              0 16px 0 -6px #f6f6f6,
              0 17px 2px -6px rgba(0, 0, 0, 0.2);
}

.filters {
  margin: 0;
  padding: 0;
  list-style: none;
  position: absolute;
  right: 0;
  left: 0;
}

.filters li {
  display: inline;
}

.filters li a {
  color: inherit;
  margin: 3px;
  padding: 3px 7px;
  text-decoration: none;
  border: 1px solid transparent;
  border-radius: 3px;
}

.filters li a.selected,
.filters li a:hover {
  border-color: rgba(175, 47, 47, 0.1);
}

.filters li a.selected {
  border-color: rgba(175, 47, 47, 0.2);
}
</style>
