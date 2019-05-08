var response = (res, code, msg) => {
    if(msg){
        res.status(code).json({ "message": msg });
    }else{
        res.sendStatus(code);
    }
}

module.exports = {
    response: response,
}