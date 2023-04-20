const epxress = require('express')
const router = epxress.Router()

router.use('/transaction', require('./movement.routes'))

router.get('*', (req, res) => {
    res.status(404)
    res.send({ error: 'Not found' })
})

module.exports = router