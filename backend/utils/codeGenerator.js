const generateCode = () => {
    return (Math.floor(Math.random() * 900000) + 100000).toString();
}

module.exports = { generateCode };