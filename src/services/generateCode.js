const generateCode = () => {
    var result = [];
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < 8; i++) {
        result.push(
            characters.charAt(Math.floor(Math.random() * charactersLength))
        );
    }
    return result.join("");
};

module.exports = generateCode;
