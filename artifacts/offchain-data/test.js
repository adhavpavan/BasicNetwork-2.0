const express = require('express');
const mongodb = require('mongodb')
var app = express()
require('dotenv').config()

// var MongoClient = require('mongodb').MongoClient;
const {MongoClient} = require('mongodb');
var db;
let uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.gxh9w.mongodb.net/fabric?retryWrites=true&w=majority`
const client = new MongoClient(uri);

const connect =async ()=>{
    let c = await client.connect();
    db = c.db()
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));

    db.collection('mychannel_fabcar').insertOne({_id:111, test:"test data"},()=>{
        console.log("data inserted")
    })
}

connect()



// MongoClient.connect("mongodb+srv://pavan:TbySmEkn9nuysLJz@cluster0.gxh9w.mongodb.net/fabric?retryWrites=true&w=majority", function(err, database) {
//   if(err) return console.error(err);

//   db = database;
//   console.log("database connected", database)
//   addData(database)

//   db.listCollections().toArray(function(err, collInfos) {
//       if (err) return `error --------------------------${err}`
//       console.log(collInfos, "aaaaaaaaaaaaaaaaaaaaaaaaa")
//     // collInfos is an array of collection info objects that look like:
//     // { name: 'test', options: {} }
// });

//   // the Mongo driver recommends starting the server here because most apps *should* fail to start if they have no DB.  If yours is the exception, move the server startup elsewhere. 
// });

const addData= (database)=>{

    // database.collection('mychannel_fabcar').insertOne({test:"test data"},()=>{
    //     console.log("data inserted")
    // })
}
