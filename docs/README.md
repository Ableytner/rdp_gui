# RDP GUI
This repository contains the web frontend for the rdp project, written in vue.js.

## source code
All source code files are under *src/* in appropriately named folders.

### App.vue
The main part of the vue app.

It contains methods to get data from the backend, as well as starting the other components.

It also binds to the events emitted by the child components.

#### events listened to
* search: gets called every second while typing, updates elements shown
* update_type: gets called if a type_name or type_unit has been changed in the type editor

### InputBar.vue
Contains the search bar, which emits *search* every second if a key is pressed.

### TypesDisplay.vue
Handles the visibility of the type editor, and loads the contents of the type editor.

Also forwards the *update_type* event from SingleTypeDisplay.

### SingleTypeDisplay.vue
Handles the single types in the type editor.

Updates backend and emits *update_type* if a type_name or type_unit has been changed.

### ValuesDisplay.vue
Displays the "time", "type", "value" headers and all values received from the backend.

## filters
All available filters are listed below

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
All available flags are listed below

### sort from high
Sort all values from high to low

#### syntax
high-to-low

### sort from low
Sort all values from low to high

#### syntax
low-to-high
