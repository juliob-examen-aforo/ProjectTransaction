const express = require('express')
const router = express.Router()

const { getTransactionsByInvoiceId } = require('../controllers/movement.controller')

router.get('/getTransactionsByInvoiceId/:invoiceId', getTransactionsByInvoiceId)

module.exports = router