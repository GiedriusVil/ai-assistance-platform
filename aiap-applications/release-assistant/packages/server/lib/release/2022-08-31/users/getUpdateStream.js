const MODULE_ID = 'release-assistant-update-users-stream';

const { Writable } = require('stream');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

let processed = 0;

const getUpdateStream = (db, params) => {
  const TOTAL = params.total;
  const CONFIG = params.config;
  return new Writable({
    objectMode: true,
    async write(record, encoding, done) {
      try {
        const OPERATIONS = [];

        for (const [CONVERSATION_ID, DATA] of Object.entries(record.conversations)) {
          const UPDATE_OPERATION = {
            updateOne: {
              filter: {
                _id: CONVERSATION_ID
              },
              update: { 
                $set: { 
                  userId: DATA.userId,
                  channelMeta: DATA.channelMeta,
                  _processed_2022_08_31: true
                } 
              },
            }
          };

          OPERATIONS.push(UPDATE_OPERATION);
          processed++;
        }

        if (OPERATIONS.length > 0) {
          await db.collection(CONFIG.app.collections.conversations).bulkWrite(OPERATIONS, { ordered: false });
        }

        console.log(`Processed ${processed}/${TOTAL} ${Math.round(processed / TOTAL * 1000) / 10}%`);
        done();
      } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        console.error('->', { ACA_ERROR });
        done(ACA_ERROR);
      }
    }
  });
};

module.exports = {
  getUpdateStream,
};
