<template>
    <main>
        <div class="left">
            <h1>Спецификации</h1>
            <select class="speclist" size="10">
                <option
                    v-for="(spec, index) in specs"
                    :key="index"
                    @click="getSpec(spec)"
                >
                    {{ spec }}
                </option>
            </select>
        </div>
        <div v-if="specCodes.length > 0" class="right">
            <div style="text-align: center;">
                <table class="spec-codes" title="Click To Copy"
                    v-clipboard="() => paddedSpecCodes.join('\n')"
                    v-clipboard:success="clipboardSuccessHandler"
                    v-clipboard:error="clipboardErrorHandler"
                >
                    <tr>
                        <th>№</th>
                        <th>Марка</th>
                    </tr>
                    <tr v-for="(item, index) in paddedSpecCodes"
                        :key="index"
                    >
                        <td>{{ pad(index + 1, 4) }}</td>
                        <td>{{ item }}</td>
                    </tr>
                </table>
            </div>
            <div class="fs-list">
                <fieldset class="fs" title="Click To Copy"
                    v-clipboard="() => filterBySerie(serie)"
                    v-clipboard:success="clipboardSuccessHandler"
                    v-clipboard:error="clipboardErrorHandler"
                    v-for="serie in series"
                    :key="serie"
                >
                    <legend>Серия #<b>{{ serie }}</b></legend>
                    <div>{{ filterBySerie(serie) }}</div>
                </fieldset>
            </div>
        </div>
    </main>
</template>

<script>
    import Vue from 'vue'
    import { API_URL, CODES_LENGTH, SERIES_LENGTH } from '@/const'
    import axios from 'axios'
    import Clipboard from 'v-clipboard'
    import CxltToastr from 'cxlt-vue2-toastr'

    Vue.use(Clipboard)

    var toastrConfigs = {
        position: 'top right',
        showDuration: 2000,
        progressBar: true,
    }
    Vue.use(CxltToastr, toastrConfigs)

    export default {
        name: 'archive',
        data () {
            return {
                specs: [],
                specCodes: [],
            }
        },
        created() {
            axios
                .post(API_URL, { action: 'getSpecList' })
                .then(r => this.specs = r.data.specs)
                .catch(e => /* eslint-disable no-console */console.log(e))
        },
        computed: {
            paddedSpecCodes () {
              return this.specCodes.map(i => this.pad(i, SERIES_LENGTH + CODES_LENGTH))
            },
            series () {
                return [...new Set(this.paddedSpecCodes.map(i => i.substring(0, SERIES_LENGTH)))]
            }
        },
        methods: {
            filterBySerie (serie) {
                let list = this.paddedSpecCodes.reduce((list, i) => {
                    if(i.startsWith(serie)) {
                        list.push(+i.substring(serie.length))
                    }
                    return list
                }, [])
                return this.compressArr(list)
            },
            getSpec(spec) {
                axios
                    .post(API_URL, { action: 'getSpecItems', spec: spec })
                    .then(r => this.specCodes = r.data.list)
                    .catch(e => /* eslint-disable no-console */console.log(e))
            },
            clipboardSuccessHandler (/*{ value, event }*/) {
                this.$toast.success({
                    title:'Success',
                    message:'Copied'
                })
            },
            clipboardErrorHandler (/*{ value, event }*/) {
                this.$toast.success({
                    title:'Error',
                    message:'Couldn\'t copy'
                })
            },
            pad(num, size) {
                let s = num+"";
                while (s.length < size) s = "0" + s;
                return s;
            },
            compressArr(arr) {
                var start = arr[0];
                var stop = start;
                var arrLength = arr.length;
                var result = '';

                for (var i = 1; i < arrLength; i++) {
                    if (arr[i] === stop+1) {
                        stop = arr[i];
                    } else {
                        if (start === stop) {
                            result += `(${start})`;
                        } else {
                            result += `(${start}-${stop})`;
                        }
                        // reset the start and stop pointers
                        start = arr[i];
                        stop = start;
                    }
                }

                if (start === stop) {
                    result += `(${start})`;
                } else {
                    result += `(${start}-${stop})`;
                }

                return result;
            }
        }
    }
</script>

<style lang="less" scoped>
@import '~cxlt-vue2-toastr/dist/css/cxlt-vue2-toastr.css';
main {
    max-width: 100%;
    padding: 0;
    display: flex;
    justify-content: stretch;
    background: #fff;
}
.fs-list {
    flex: 1;
}
.fs {
    width: 100%;
    margin: 0 10px;
    box-sizing: border-box;
    min-width: 0;
    cursor: pointer;
}
.left {
    padding: 20px;
    border-right: 2px solid #aaa;
}
.right {
    padding: 20px;
    max-width: 100%;
    display: flex;
    flex: 1;
    justify-content: stretch;

}
.speclist {
    width: 100%;
    outline: none;
}
.spec-codes {
    cursor: pointer;
    width: 100%;
    display: block;
    border-collapse: collapse;
    th, td {
        padding: 4px;
    }
    tr:nth-child(even) {
        background-color: #f2f2f2;
    }
    overflow-y: scroll;
    height: 100vh - 25%;
    border: 1px solid #aaa;
    padding: 0;
    margin: 5px 0;
    th {
        background: #aaa;
    }
    box-sizing: border-box;
}
</style>
