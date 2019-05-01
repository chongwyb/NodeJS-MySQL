var resError = (res, code, msg) => {
    res.statusCode = code;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ "message": msg }));
}

module.exports = {
    resError: resError,
}