require('dotenv').config()
const { Kafka } = require('kafkajs')
const MongoClient = require('mongodb').MongoClient;

require('dotenv').config()
const express = require('express')
const app = express()
const appPromise = require('./src/app/middlewares/configprovider').appPromise




appPromise.then(function(app) {
    const PORT = process.env.SERVER_PORT_TRANSACTION || 3005
    app.use('/api', require('./src/app/routes'))
    app.listen(PORT, () => {

        const kafka = new Kafka({
            clientId: 'transaction-client',
            brokers: [process.env.KAFKA_SERVER],
        })
        const DB_MONGO_URI = process.env.DB_MONGO_URI
        
        kafka_consumer()
        
        async function kafka_consumer() {
            const consumer = kafka.consumer({ groupId: 'transaction-subscription', allowAutoTopicCreation: true })
            await consumer.connect()
            await consumer.subscribe({ topic: 'transaction-topic', fromBeginning: true })
            await consumer.run({
                autoCommit: false,
                eachMessage: async ({ topic, partition, message }) => {
                    console.log({ value: message.value.toString() })
                    var jsonObj = JSON.parse(message.value.toString())
                    var amountNew = 0
                    if (jsonObj.type === 'pay') {
                        amountNew = jsonObj.amount
                    } else {
                        console.log("error de tipo en kafka");
                    }
        
                    MongoClient.connect(DB_MONGO_URI, function (err, db) {
                        if (err) throw err;
                        var dbo = db.db(process.env.DB_MONGO_DATABASE_TRANSACTION);
                        var myobj = { 
                            id_transaccion: jsonObj.transactionId, 
                            //type: jsonObj.type, 
                            id_invoice: jsonObj.invoiceId, 
                            amount: amountNew, 
                            date: jsonObj.creationDate 
                        };
        
                        dbo.collection("transaction").insertOne(myobj, async function (err, res) {
                            if (err) throw err;
                            console.log(`1 document inserted in transactions amount ${myobj.amount}`, new Date());
        
                            await consumer.commitOffsets([{ topic, partition, offset: (Number(message.offset) + 1).toString() }])
                            console.log(`Commit message with accountId: 1`, new Date());
        
                            db.close();
                        });
                    });
                },
            })
        }





        console.log('Application running on port ', PORT)





    })
});

