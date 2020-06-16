class JsonResponseModel {

    constructor(url, method ,statuscode, message) {
        this.url = url;
        this.method = method;
        this.statuscode = statuscode;
        this.message = message;
    };
}
module.exports = JsonResponseModel;
