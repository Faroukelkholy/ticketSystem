const passport = require("passport");
const oauth2orize = require("oauth2orize");
const strategies = require("./strategies");
const server = oauth2orize.createServer();
passport.use(strategies.clientPasswordStrategy);
passport.use(strategies.clientBasicStrategy);
passport.use(strategies.bearerStrategy);

server.exchange(oauth2orize.exchange.password(strategies.passwordTokenExchange));


function authenticate(req, res, next) {
    console.log("authenticate permission:",scope);
    return passport.authenticate(["bearer"], {
        session: false
    })(req, res, function() {
        if (!req.user) {
            return res.status(401).send();
        }
        next();
    });
}

function needsPermission(scope) {
    console.log("needsPermission permission:",req.user.permissions);
    console.log("needsPermission scopes:",scope);

    return function(req, res, next) {
        if (req.user) { //check if user is authenticated first
            if (scope.hasPermission(req.user.permissions, scope)) {
                return next();
            }
            return res.status(403);
        } 
    };
}


module.exports = {
token: [
    passport.authenticate(["basic", "oauth2-client-password"],
    {
     session:false
   }),
    server.token(),
    server.errorHandler()
],
needsPermission: needsPermission,
authenticate: authenticate
};
