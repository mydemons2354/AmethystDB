<div align="center">

![repository-open-graph-template(3)(1)](https://github.com/mydemons2354/AmethystDB/blob/main/images/20260405_163412_0000.png)

</div>

## About

AmethystDB is a minecraft bedrock database designed to feel similar to something like [mongoose](https://npmjs.com/package/mongoose). Instead of being a key-value database like most MCBE databases, it uses documents like what MongoDB does.

## Usage

### Creating a table

```js
let table = amethystDB.table("table")
```

### Inserting a document

```js
table.insertDocument({
  key1: "test"
})
```

### Finding a document

1. Find all documents matching a query
```js
let document = table.findDocuments({
  key: "value"
})
```

2. Find first document matching a query
```js
let document = table.findFirst({
  key: "value"
})
```

> [!NOTE]
> This project is not in any way related to [PrismarineDB](https://github.com/Azalea-Essentials/PrismarineDB). It just has a similar coding thing.
> 
