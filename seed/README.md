# Database SEED initialisation

## Setup
Documentation for migration can be found [here](http://docs.sequelizejs.com/manual/migrations.html)

## Usage

### Creating Seed
```
$ npx sequelize-cli seed:generate --name demo-<table seed> 
```

Generates:
```
module.exports = {
  up: (queryInterface, Sequelize) => {
    // logic for transforming into the new state
    // use queryInterface to manipulate data
    // typically for adding records to table
  },

  down: (queryInterface, Sequelize) => {
    // logic for reverting the changes
    // removes data to database
    // typically for removing records from table
  }
}
```

### Running Seed
```
$ npx sequelize-cli db:seed:all

$ npx sequelize-cli db:seed --seed <specified file w/o .js from seeders>
```

### Reverting Seed
```
$ npx sequelize-cli db:seed:undo:all

$ npx sequelize-cli db:seed:undo --seed <specified file w/o .js from seeders>
```