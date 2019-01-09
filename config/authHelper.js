const { UnauthorizedError } = require("../errors");
exports.mustBeLoggedIn = user => {
    if (!user) {
        throw new UnauthorizedError();
    }
};
