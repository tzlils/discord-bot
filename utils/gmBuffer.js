module.exports = function() {
    return new Promise((resolve, reject) => {
      this.stream((err, stdout, stderr) => {
        if (err) { return reject(err) }
        const chunks = []
        stdout.on('data', (chunk) => { chunks.push(chunk) })
        // these are 'once' because they can and do fire multiple times for multiple errors,
        // but this is a promise so you'll have to deal with them one at a time
        stdout.once('end', () => { resolve(Buffer.concat(chunks)) })
        stderr.once('data', (data) => { reject(String(data)) })
      })
    })
}