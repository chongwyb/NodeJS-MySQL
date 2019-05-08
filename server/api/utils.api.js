let resError = (res, code, msg) => {
    if(msg){
        res.status(code).json({ "message": msg });
    }else{
        res.sendStatus(code);
    }
}

let resValid = (res, code, data) => {
    if(data){
        res.status(code).json(data);
    }else{
        res.sendStatus(code);
    }
}

module.exports = {
    resError: resError,
    resValid: resValid,
}