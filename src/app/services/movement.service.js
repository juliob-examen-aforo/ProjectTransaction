const redis = require('redis')
const movementRepository = require('../repositories/movement.repository')

const client = redis.createClient({
    url: process.env.DB_REDIS_URL,
    tls: {
        rejectUnauthorized: false
    },
    legacyMode: true
})
client.connect();
client.on('error', function (err) {
    console.log('Error ' + err)
})

const movementService = {
    getTransactionsByInvoiceId: async (invoiceId) => {
        const key = `key-movement-${invoiceId}`
        return new Promise((resolve, reject) => {
            client.get(key, async function (err, reply) {
                if (err) { return reject(err) }
                if (reply === null) {
                    console.log('Register information in redis')
                    var result = await movementRepository.getTransactionsByInvoiceId(invoiceId)
                    await client.set(key, JSON.stringify(result), 'EX', 30)
                    return resolve(result)
                }
                else {
                    console.log('Showing redis information')
                    return resolve(JSON.parse(reply))
                }
            })
        })
    }
}

module.exports = movementService