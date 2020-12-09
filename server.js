const app = require('./app.js');
const port = process.env.PORT || 8070;
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

/* Clustering */
if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', function(deadWorker, code, signal) {
        // Restart the worker
        var worker = cluster.fork();

        // Note the process IDs
        var newPID = worker.process.pid;
        var oldPID = deadWorker.process.pid;

        // Log the event
        console.log('worker '+oldPID+' died.');
        console.log('worker '+newPID+' born.');
    });
} else {
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        let user = req.session.user;
        res.render('404', {
            member: (req.session.user && req.cookies.user_sid) ? true : false,
            user: (user==null) ? null : user,
            title: '404 Not Found',
        });
    });

    app.listen(port, () => console.log('Server listening on port '+port));
}
