var swf = require('../index');

var myDecider = new swf.Decider({
   "domain": "test-domain",
   "taskList": {"name": "my-workflow-tasklist"},
   "identity": "Decider-01",   
   "maximumPageSize": 500,
   "reverseOrder": false // IMPORTANT: must replay events in the right order, ie. from the start
});

myDecider.on('decisionTask', function (decisionTask) {

    console.log("Got a new decision task !");

    if(!decisionTask.eventList.scheduled('step1')) {
        decisionTask.response.schedule({
            name: 'step1',
            activity: 'simple-activity'
        });
    }
    else {
        decisionTask.response.stop({
          result: "some workflow output data"
        });
    }
    
    decisionTask.response.respondCompleted(decisionTask.response.decisions, function(err, result) {

      if(err) {
          console.log(err);
          return;
      }

      console.log("responded with some data !");

      myDecider.poll();
    });

});

myDecider.on('poll', function(d) {
    //console.log(_this.config.identity + ": polling for decision tasks...");
    console.log("polling for tasks...", d);
});

// Start polling
myDecider.start();

