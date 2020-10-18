const vm = require('vm')
const readStream = require('../../utils/readStream.js');

module.exports.config = {
    name: "calc",
    description: "Calculates a javascript expression.",
    format: [],
    privilegeLevel: 0,
    category: "utility"
}

module.exports.run = async (message, stdin, stdout) => {
  stdout.write("text/plain")
  let { data, type } = await readStream.stdin(stdin);
  let res = calc(message.content.replace('-', data));
  
  res.then((data) => {
    stdout.end(""+data);
  })
}

async function calc(fn) {
    try {
      let res = safeEval(fn, null, {timeout: 5});  
      return res;
    } catch(e) {
      return e.toString();
    }
}

function safeEval(code, context, opts) {
    var sandbox = {}
    var resultKey = 'SAFEEVAL';
    sandbox[resultKey] = {}
    var clearContext = `
      (function(){
        Function = undefined;
        const keys = Object.getOwnPropertyNames(this).concat(['constructor']);
        keys.forEach((key) => {
          const item = this[key];
          if(!item || typeof item.constructor !== 'function') return;
          this[key].constructor = undefined;
        });
      })();
    `
    code = clearContext + resultKey + '=(async ()=>{' + code + "})()";    
    if (context) {
      Object.keys(context).forEach(function (key) {
        sandbox[key] = context[key]
      })
    }
    vm.runInNewContext(code, sandbox, opts);
    return sandbox[resultKey]
}