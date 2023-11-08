<script setup lang="ts">
import axios from 'axios'
import InputBar from './components/InputBar.vue'
import ValuesDisplay from './components/ValuesDisplay.vue'
import TypesDisplay from './components/TypesDisplay.vue'

import { ValueType } from './scripts/value_type'
import { Value } from './scripts/value'
</script>

<script lang="ts">
export default {
  data() {
    return {
      values: new Array<Value>(),
      value_types: new Array<ValueType>(),
      filters: new Map<string, string>(),
      flags: new Array<string>()
    }
  },
  mounted() {
    this.get_types()
    this.get_values().then((data) => {
      this.values = data
    })
  },
  methods: {
    getTypeId(type_name: string) {
      var return_value = ''
      for (var i = 0; i < this.value_types.length; i++) {
        if (this.value_types[i].type_name.toUpperCase() == type_name.toUpperCase()) {
          return_value = '' + this.value_types[i].id
          console.log('Found matching type', this.value_types[i])
        }
      }
      return return_value
    },
    update_search(args: string[]) {
      console.log('New search arguemnts', args)
      this.filters.clear()
      this.flags.length = 0
      for (var i = 0; i < args.length; i++) {
        const command = args[i]
        console.log('handling command', command)
        const command_and_args = command.split(':')

        // process flags
        if (command_and_args.length == 1) {
          let flag: string = command_and_args[0]
          if (flag == "high-to-low"){
            this.flags.push(flag)
            continue
          }
          else if (flag == "low-to-high"){
            this.flags.push(flag)
            continue
          }
        }
        // process filters
        else if (command_and_args.length == 2) {
          const key = command_and_args[0].trim()
          const value = command_and_args[1].trim()
          if (key == 'type') {
            var type_id = this.getTypeId(value)
            if (type_id != "") {
              this.filters.set("type_id", type_id)
              console.log('Update typeid', type_id)
              continue
            }
          } else if (key == 'start') {
            if (value != "" && !isNaN(+value)) {
              this.filters.set("start", value)
              continue
            }
          } else if (key == 'end') {
            if (value != "" && !isNaN(+value)) {
              this.filters.set("end", value)
              continue
            }
          }
        }
        console.log('Ignoring command', command)
      }
      this.get_values().then((result) => {
        this.values = result
      })
    },
    get_types() {
      axios
        .get('/api/type/')
        .then((result) => {
          this.value_types = result.data
        })
        .catch((error) => {
          console.error(error)
        })
    },
    get_values() {
      const promise = new Promise<Value[]>((accept, reject) => {
        const url = '/api/value/'
        var params : { [key: string]: string } = {}
        if (this.filters.has("type_id")) {
          params['type_id'] = this.filters.get("type_id")!
        }
        if (this.filters.has("start")) {
          params['start']=this.filters.get("start")!
        }
        if (this.filters.has("end")) {
          params['end'] = this.filters.get("end")!
        }
        console.log('Trying to get url', url)
        axios
          .get(url, { params: params })
          .then((result) => {
            let data: Value[] = result.data
            // use flags to sort the data
            if (this.flags.includes("high-to-low")){
              data.sort((a,b) => (b.value - a.value))
            }
            else if (this.flags.includes("low-to-high")){
              data.sort((a,b) => (a.value - b.value))
            }
            accept(data)
          })
          .catch((error) => {
            console.error(error)
            reject(error)
          })
      })
      return promise
    }
  }
}
</script>

<template>
  <div class="container p-1">
    <h1 class="row">RDP</h1>
    <InputBar @search="update_search" />
    <TypesDisplay :value_types="value_types" @update_type="get_types" />
    <ValuesDisplay :values="values" :value_types="value_types" />
  </div>
</template>
./scripts/dictionary./types/dictionary@/scripts/types/dictionary