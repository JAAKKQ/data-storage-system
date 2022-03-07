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
Here is an example how I used this in my project.

```javascript
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
var store = require('data-storage-system')('./data/member'); //Creating store here
const isEmptyObject = (obj) => Object.keys(obj).length === 0;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bal')
		.setDescription('Returns your USD balance!'),
	async execute(interaction) {
		if (!interaction.isCommand()) return;
        await interaction.deferReply();
        const target = interaction.options.getUser('user') ?? interaction.user;
		store.load(`${target.id}`, "USD", function(err, object, Name){ //Requesting data value here if data does not exist it will return the value as 0.
			if(err) throw err;
			const Bal = object; //Storing the given value to a variable.
			const exampleEmbed = new MessageEmbed()
				.setColor('#F1C40F')
				.setTitle(`Your balance`)
				.setDescription(`$${Bal}`)
				.setTimestamp();
			interaction.editReply({ embeds: [exampleEmbed] });
		  });
	},
};
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
