# data-storage-system
Store data easily to json files in Node.js. Every necessary file will be created and it is super easy to store and load data values. 

### Installing

```
npm install JAAKKQ/data-storage-system
```

### Creating a store
The store module is a function that takes a single parameter: the path to the location on the file system where you want to store your objects. 

```javascript
var store = require('data-storage-system')('./path/to/storage/location');
```

If you omit the storage location the 'store' directory in your current working directory will be used.

```javascript
// the store directory will be created in the current working directory
var store = require('data-storage-system')();
```

### Storing data

A stored object must have an `id`, `name` and `value` attributes. The object
will be written to the storage location. 

```javascript
store.add(id, name, value, function(err, object){
  if(err) throw err;
});
```

### Retrieving data

To retrieve data, you must know its `id` and `name` attributes and use them as parameters for the `load()` function.
If the data does not exist the request will return the data value as 0.

```javascript
store.load(id, name, function(err, object){
  const Value = object; //Store the value to a variable.
  if(err) throw err;
});
```

### Example code

```javascript
var store = require('data-storage-system')('./data');

const keypress = async () => {
    process.stdin.setRawMode(true)
    return new Promise(resolve => process.stdin.once('data', () => {
      process.stdin.setRawMode(false)
      resolve()
    }))
  }

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })
  
  readline.question(`Write data to save:`, data => {
    store.add('FileName', 'InputedData', data, function(err, object){
        if(err) throw err;
        console.log(`Added ${data} to /data/FileName`)
        store.load('FileName', 'InputedData', function(err, object){
            const Value = object; //Store the value to a variable.
            console.log(`Loaded InputedData from /data/FileName with value "${Value}"`);
            console.log('Closing console in 10 seconds')
            if(err) throw err;
            (async () => {

                console.log('Press any key to exit!')
                await keypress()
                console.log('Hello world!')
              
              })().then(process.exit)
            });
        });
    })
  
```

### If you want to try encrypting:
**First of all you should not try this since this can corrupt all your data.**
If you really want to try this do this:

1. Create `config.json` file to your project root folder and add this:
    ```json
    {
      "token": "Your-very-long-secret-key"
    }
    ```
2. Add `/WithEnc` to your store
    Example:
     ```javascript
     var store = require('data-storage-system/WithEnc')('./path/to/storage/location');
      ``` 

### Credits

Big credits to [alexkwolfe](https://github.com/alexkwolfe/json-fs-store) he made most of the code.
