# RDP GUI
This repository contains the web frontend for the rdp project, written in vue.js.

## source code
All source code files are under *src/* in appropriately named folders.

### App.vue
The main part of the vue app.

When mounting, it gets values and value_types from the backend.
```js
mounted() {
    this.get_types()
    this.get_values().then((data) => {
        this.values = data
    })
},
```

If search or update_type get emitted, it updates the displayed values/types.
```js
<InputBar @search="update_search" />
<TypesDisplay :value_types="value_types" @update_type="get_types" />
```

update_search also processes the data stored in the InputBar and updates the current filters accordingly.

In the get_values function, all values get returned from the backend, and then filtered.

The filtering looks as such:
```js
// use flags to sort the data
if (this.flags.includes("high-to-low")) {
    data.sort((a,b) => (b.value - a.value))
}
else if (this.flags.includes("low-to-high")) {
    data.sort((a,b) => (a.value - b.value))
}

// use filters to sort the data
if (this.filters.has("biggerthanvalue")) {
    data = data.filter((a) => (a.value > Number(this.filters.get("biggerthanvalue"))))
}
if (this.filters.has("smallerthanvalue")) {
    data = data.filter((a) => (a.value < Number(this.filters.get("smallerthanvalue"))))
}
```

#### events listened to
* search: gets called every second while typing, updates elements shown
* update_type: gets called if a type_name or type_unit has been changed in the type editor

### InputBar.vue
Contains the search bar.

Also emits *search* every second if the user is typing.
```ts
// emit "search" event once every second while typing
async search_update() {
    if(this.typing) {
        return
    }
    this.typing=true
    await sleep(1000)
    console.log("Search update ", this.search_string)
    this.$emit("search", this.search_string.split(' '))
    this.typing=false
}
```

### TypesDisplay.vue
Handles the visibility of the type editor, and loads its contents.

Initiates a SingleTypeDisplay for every value_type:
```js
<span v-if="!editor_hidden">
<!-- create a SingleTypeDisplay for every value_type in value_types
    :key is needed for v-for to work
    the "update_type" event gets forwarded -->
<SingleTypeDisplay :type_prop="value_type" v-for="value_type in value_types" :key="value_type" @update_type="$emit('update_type')"/>
</span>
```

Also forwards the *update_type* event from SingleTypeDisplay.

### SingleTypeDisplay.vue
Handles one type in the type editor.

Updates backend and emits *update_type* if a type_name or type_unit has been changed.

```js
// push changed type to backend and emit "update_type"
update_type() {
    axios.put("/api/type/" + this.edit_type.id + "/", this.edit_type)
        .then((result) => {
            console.log(result)
            this.$emit("update_type")
        })
}
```

### ValuesDisplay.vue
Displays the "time", "type", "value" headers and all values received from the backend.

Also, the timestamp received from the backend gets converted to a readable format using this function:
```js
    // convert a timestamp to a readable format
    convertToUTC(value: Value) {
      return new Date(value.time * 1000).toUTCString()
    }
```

## filters
Filters are key:value pairs limiting what data is displayed.

All available filters are listed below.

### bigger than number
Show all values that are bigger than a certain number

#### syntax
value>{some_number}

e.g. value>94

### smaler than number
Show all values that are smaler than a certain number

#### syntax
value<{some_number}

e.g. value<94

### is of type
Show all values that are of a certain type

#### syntax
type:{some_type}

e.g. type:pressure

### after time
Show all values that were recorded after a given time

#### syntax
start:{some_timestamp}

e.g. start:513143224

### before time
Show all values that were recorded before a given time

#### syntax
end:{some_timestamp}

e.g. end:3223222344

## flags
Flags are keywords which sort the data.

All available flags are listed below

### sort from high
Sort all values from high to low

#### syntax
high-to-low

### sort from low
Sort all values from low to high

#### syntax
low-to-high
