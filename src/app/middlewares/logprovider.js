const winston = require('winston');
const { SeqTransport } = require('@datalust/winston-seq');
 
const logger = winston.createLogger({
    transports: [
      new SeqTransport({
        serverUrl: process.env.SEQ_URL,
        apiKey: process.env.SEQ_TOKEN,
        onError: (e => { console.error(e) }),
      })
    ]
  });
 
const logProvider = {
    info: (message) => {
        logger.info(message, {aplication: "app-transaction"});
    }
}
 
module.exports = logProvider;