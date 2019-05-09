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

let regex = {
    // simple_email: /^@.+@.+\..+/mi,
    default_email: /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/mi,
    special_email: /^@(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/mi,
}

module.exports = {
    resError: resError,
    resValid: resValid,
    regex: regex,
}