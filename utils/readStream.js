module.exports.stdin = function (stream) {
    return new Promise((resolve, reject) => {
        const chunks = []
        let t;
        stream.once('data', (type) => {
          t = type.toString();
          stream.on('data', (chunk) => { chunks.push(chunk) })
          // these are 'once' because they can and do fire multiple times for multiple errors,z
          // but this is a promise so you'll have to deal with them one at a time
        });
        stream.once('end', () => { resolve({data: Buffer.concat(chunks), type: t}) })
    })
}

module.exports.stream = function (stream) {
  return new Promise((resolve, reject) => {
      const chunks = []
      stream.on('data', (chunk) => { chunks.push(chunk) })
        // these are 'once' because they can and do fire multiple times for multiple errors,z
        // but this is a promise so you'll have to deal with them one at a time
      stream.once('end', () => { resolve(Buffer.concat(chunks)) })
  })
}