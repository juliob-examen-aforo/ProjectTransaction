const movementService = require('../services/movement.service')

const getTransactionsByInvoiceId = async (req, res) => {
    const invoiceId = parseInt(req.params.invoiceId)
    return res.send(await movementService.getTransactionsByInvoiceId(invoiceId))
}

module.exports = { getTransactionsByInvoiceId }