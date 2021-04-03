const EmailValidator = require("email-validator");

const validateBody = {
    username(username) {
        if (!username) return false;
        const minMaxLength = /^[\s\S]{4,16}$/;
        return minMaxLength.test(username);
    },
    name(name) {
        if (!name) return false;
        const minMaxLength = /^[\s\S]{3,16}$/;
        return minMaxLength.test(name);
    },
    email(email) {
        if (!email) return false;
        return EmailValidator.validate(email);
    },
    password(password) {
        if (!password) return false;
        const minMaxLength = /^[\s\S]{8,16}$/,
            upper = /[A-Z]/,
            lower = /[a-z]/,
            number = /[0-9]/,
            special = /[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/;

        return (
            minMaxLength.test(password) &&
            upper.test(password) &&
            lower.test(password) &&
            number.test(password) &&
            special.test(password)
        );
    },
    checkPassword(password, checkPassword) {
        if (!password || !checkPassword) return false;
        if (password !== checkPassword) return false;
        return true;
    },
};

module.exports = validateBody;
