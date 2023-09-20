const bodyParser = require('body-parser');
const User = require('../../models/User');
const process = {
    login : async (req, res) => {
        const user = new User(req.body);
        const response = await user.login();
        return res.json(response);
    }
}

module.exports = {
    process,
};