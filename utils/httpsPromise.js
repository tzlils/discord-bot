const https = require('https');

module.exports =  (params, postData) => {
    return new Promise(function(resolve, reject) {
        var req = https.request(params, async (r) => {
            if(r.statusCode == 200) {
                resolve(r);
            } else {
                reject(`Error code ${r.statusCode}`);
            }
            // on bad status, reject
            // on response data, cumulate it
            // on end, parse and resolve
        }).end();
        // on request error, reject
        // if there's post data, write it to the request
        // important: end the request req.end()
    });
}