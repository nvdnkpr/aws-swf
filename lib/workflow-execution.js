
/**
 * Represents an Amazon WebService Simple Workflow Execution
 * @constructor
 */
var WorkflowExecution = exports.WorkflowExecution = function (swfClient, baseConfig) {
    this.swfClient = swfClient;
    this.baseConfig = baseConfig;
};

WorkflowExecution.prototype = {

    /**
     * Start a worfklow
     */
    start: function (config, cb) {

        var o = {}, k;

        for (k in this.baseConfig) {
            if (this.baseConfig.hasOwnProperty(k)) {
                o[k] = this.baseConfig[k];
            }
        }

        for (k in config) {
            if (config.hasOwnProperty(k)) {
                o[k] = config[k];
            }
        }

        if (!o.workflowId) {
            o.workflowId = String(Math.random()).substr(2);
        }

        this.workflowId = o.workflowId;

        this.swfClient.client.startWorkflowExecution(o, function (err, result) {

            if (err) {
                //console.log("error", err); 
                if (cb) {
                    cb(err, null);
                }
            } else {
                if (cb) {
                    cb(null, result.runId);
                }
            }

        });
    },

    /**
     * Send a signal to the workflow execution
     */
    signal: function (config, cb) {

        var o = {}, k;
        o.domain = this.baseConfig.domain;
        o.workflowId = this.workflowId;

        for (k in config) {
            if (config.hasOwnProperty(k)) {
                o[k] = config[k];
            }
        }

        this.swfClient.client.signalWorkflowExecution(o, cb);
    },

    /**
     * Terminate the workflow execution
     */
    terminate: function (config, cb) {

        var o = {}, k;
        o.domain = this.baseConfig.domain;
        o.workflowId = this.workflowId;

        for (k in config) {
            if (config.hasOwnProperty(k)) {
                o[k] = config[k];
            }
        }

        this.swfClient.client.terminateWorkflowExecution(o, cb);
    },

    /**
     * Get the history for the workflow execution
     */
    getHistory: function (config, cb) {

        var o = {}, k;
        o.domain = this.baseConfig.domain;
        //o.execution = this.workflowId;

        for (k in config) {
            if (config.hasOwnProperty(k)) {
                o[k] = config[k];
            }
        }

        this.swfClient.client.getWorkflowExecutionHistory(o, cb);
    }

};
