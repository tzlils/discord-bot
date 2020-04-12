const vm = require('vm')
const Discord = require('discord.js');

module.exports.config = {
    name: "calc",
    description: "Calculates an equation",
    format: [],
    privilegeLevel: 0,
    category: "utility"
}

module.exports.run = async (client, message, args, stdin, stdout) => {
    let res = calc(args._);
    stdout.end(JSON.stringify({data: res.toString(), type: "text/plain"}));
}

function calc(fn) {
    try {
      let res = safeEval(fn);
      return res;
    } catch(e) {
      return "Invalid Expression";
    }
  }

function safeEval(code, context, opts) {
    var sandbox = {}
    var resultKey = 'TERRADICE_SAFEEVAL';
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
    code = clearContext + resultKey + '=' + code
    if (context) {
      Object.keys(context).forEach(function (key) {
        sandbox[key] = context[key]
      })
    }
    vm.runInNewContext(code, sandbox, opts)
    return sandbox[resultKey]
  }

// let calculate = (equation) => {
//     let P = equation.match(/\((.*)\)/gm);
//     console.log(equation);
    
//     if(P) {
//         equation = equation.replace(P[1], calculate(P[1]));
//     } else {
//         let E = equation.match('([0-9]*)\^([0-9]*)');
//         if(E) {
//             equation = equation.replace(E.input, Math.pow(E[0], E[2]));
//         }
//     }
//     return 0;
// }