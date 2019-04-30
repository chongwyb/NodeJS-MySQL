var equals = (value1, value2) => {
    if(value1 != value2) {
        throw new Error('Assert failed, ' + value1 + ' is not equal to ' + value2 + '.');
    }
}

module.exports = {
    equals: equals,
}