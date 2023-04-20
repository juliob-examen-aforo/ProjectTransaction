const logProvider = require("../middlewares/logprovider");
const movementService = require('../services/movement.service')

const getTransactionsByInvoiceId = async (req, res) => {
    const invoiceId = parseInt(req.params.invoiceId);
    const transactionsByInvoice =  await movementService.getTransactionsByInvoiceId(invoiceId);
    logProvider.info("Invoice data:", transactionsByInvoice);
    return res.send(transactionsByInvoice)
}

module.exports = { getTransactionsByInvoiceId }