global.TextEncoder = require("util").TextEncoder
global.TextDecoder = require("util").TextDecoder
const MongoClient = require('mongodb').MongoClient

const movementRepository = {
    getTransactionsByInvoiceId: async (invoiceId) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(process.env.DB_MONGO_URI, function (err, db) {
                if (err) throw err
                const query = { id_invoice: invoiceId }
                db.db(process.env.DB_MONGO_DATABASE_TRANSACTION).collection("transaction").find(query).toArray(function (err, result) {
                    if (err) throw err
                    db.close()
                    resolve(result)
                })
            })
        })
    }
}

module.exports = movementRepository;