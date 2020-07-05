const rpcClient = require('bitcoind-rpc');

const RPCRequest = require('./schema/RPCRequest');

/**
 * This system is designed to only allow 16 outstanding RPC requests,
 * but to eventually process the entire queue.
 * This is accomplished using _both_ a changestream and
 * pulling from the DB upon completing a previous request,
 * so that the queue is always at max capacity under load,
 * but executes requests immediately when there is capacity.
 */

const MAX_QUEUE_SIZE = 16;

class RPCRequestManager {
    constructor() {
        this.rpcClient = new rpcClient(process.env.RPCSTRING);
        this.threshold = 0; // In-memory means single-process. Put in DB to make process non-stateful & allow multiple workers
    }

    start() {
        this.initializeRequestStream();
    }

    initializeRequestStream() {
        this.requestStream = RPCRequest.watch(null, {
            fullDocument: 'updateLookup'
        }).on('change', (change) => {
            if (change.operationType === 'insert') {
                this.handleChange(change.fullDocument);
            }
        }).on('error', (err) => {
            console.error(err);
        }).on('close', (err) => {
            this.initializeRequestStream();
        }).on('open', () => {
            console.log('RPC Request Stream initialized')
        });
    }


    handleChange(request) {
        // Only run for new insertions
        // Enqueue if there is room in the queue,
        // otherwise skip and it will get picked up when a request finishes
        if (this.threshold <= MAX_QUEUE_SIZE) {
            // Changestream documents are mongo documents, not mongoose documents
            RPCRequest.findOneAndUpdate({
                _id: request._id,
                status: 'new'
            }, {
                status: 'processing'
            }, (err, fullRequest) => {
                if (err) {
                    return console.error(err);
                }
                if (fullRequest) {
                    this.enqueueRequest(fullRequest);
                }
            });
        }
    }

    enqueueRequest(request) {
        this.threshold += 1;
        request.execute(this.rpcClient, (err, result) => {
            this.threshold -= 1;
            if (err) {
                console.error(err);
            }
            request.handleResponse(result, (err) => {
                if (err) {
                    console.error(err);
                }
                // If the queue was full then we want to let the next request run here.
                // It doesn't matter whether the queue was full or not before,
                // we just want to fill it now.
                if (this.threshold <= MAX_QUEUE_SIZE) {
                    RPCRequest.findOneAndUpdate({
                        status: 'new'
                    }, {
                        status: 'processing'
                    }).sort({
                        _id: 1
                    }).exec((err, request) => {
                        if (err) {
                            return console.error(err);
                        }
                        if (!request) {
                            // Nothing in the queue, now we idle
                            return;
                        }
                        this.enqueueRequest(request);
                    });
                }
            });
        });
    }
};

let rpcRequestManager = new RPCRequestManager();
module.exports = rpcRequestManager;