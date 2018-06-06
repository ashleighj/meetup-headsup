let config = require('./config/config');
let express = require('express');
let bodyParser = require('body-parser');
let deliveries = require('./deliveries/deliveries');
let routes = require('./routes/routes');
let auth = require('./auth/auth');

const port = config.PORT;
let app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(routes);
app.use(auth);

app.listen(port, function () {
    console.log("Meetup Heads-up listening on port " + port);
});

deliveries.scheduleDeliveries();





