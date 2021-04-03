const bcrypt = require("bcrypt");

const password = {
    hash(password) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        return hashedPassword;
    },
    validate(password, hashPassword) {
        const result = bcrypt.compareSync(password, hashPassword);
        return result;
    },
};

module.exports = password;
