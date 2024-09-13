// build-index.js

const Fuse = require('fuse.js')
const fs = require('fs')
const data = require('./searchdata.json')

// Create the Fuse index
const myIndex = Fuse.createIndex(['tags', 'title', 'content'], data)

// Serialize and save it
fs.writeFileSync('fuse-index.json', JSON.stringify(myIndex.toJSON()))
