/*
Format: 
[{name: "verbose", type: "bool"}, {name: "username", type: "string"}]
*/
module.exports = (input, format) => {
    let results = {};
    let text = input.split(' ').slice(1).join(' ');
    format.forEach(element => {
        if(element.pos !== undefined) return;
        switch (element.type) {
            case "bool":                
                res = text.match(`--${element.name}[ |=](.*?)($| )`);                
                if(res) {
                    text = text.replace(res[0], ""); 
                    results[element.name] = (res[1].toLowerCase() == "true");
                } else {
                    res = text.match(`--${element.name}`);
                    if(res) text = text.replace(res[0], "");
                    results[element.name] = (res != null);
                }
                break;
            case "string":
                res = text.match(`--${element.name}[ |=](.*?)($| )`);              
                if(res) text = text.replace(res[0], "");                
                results[element.name] = (res ? res[1].replace('\\','') : null);                
                break;
            case "int":
                res = text.match(`--${element.name}[ |=](.*?)($| )`);
                if(res) text = text.replace(res[0], "");
                results[element.name] = (res ? parseInt(res[1]) : null);
                break;
            case "float":
                res = text.match(`--${element.name}[ |=](.*?)($| )`);
                if(res) text = text.replace(res[0], "");
                results[element.name] = (res ? parseFloat(res[1]) : null);
                break;
            default:
                throw Error("unknown type");
                break;
        }        
    });
    let s = text.split(' ');
    results._ = text;
    format.forEach(element => {        
        if(element.pos === undefined) return;
        if(element.pos <= s.length) {
            results[element.name] = s[element.pos];
        } else {
            results[element.name] = null;
        }
    })
    return results;
}