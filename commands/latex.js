const mjAPI = require('mathjax-node-svg2png');

module.exports.config = {
    name: "latex",
    description: "Renders a LaTeX string.",
    format: [
                {name: "scale", type: "float"},
            ],
    privilegeLevel: 0,
    category: "utility"
}

module.exports.run = (client, message, args) => {
    mjAPI.typeset({
        math: args._,
        format: "TeX",
        png: true,
        scale: (args.scale ? args.scale : 4),
        svg: false
    }, function(result,data) {
		return {data: uriToBuffer(result.png), type: "image/png"}
        // message.channel.send({files: [{ attachment: uriToBuffer(result.png), name: 'image.png' }]});
    });
}

function uriToBuffer(uri) {
    if (!/^data:/i.test(uri)) {
		throw new TypeError(
			'`uri` does not appear to be a Data URI (must begin with "data:")'
		);
	}

	// strip newlines
	uri = uri.replace(/\r?\n/g, '');

	// split the URI up into the "metadata" and the "data" portions
	const firstComma = uri.indexOf(',');
	if (firstComma === -1 || firstComma <= 4) {
		throw new TypeError('malformed data: URI');
	}

	// remove the "data:" scheme and parse the metadata
	const meta = uri.substring(5, firstComma).split(';');

	let charset = '';
	let base64 = false;
	const type = meta[0] || 'text/plain';
	let typeFull = type;
	for (let i = 1; i < meta.length; i++) {
		if (meta[i] === 'base64') {
			base64 = true;
		} else {
			typeFull += `;${  meta[i]}`;
			if (meta[i].indexOf('charset=') === 0) {
				charset = meta[i].substring(8);
			}
		}
	}
	// defaults to US-ASCII only if type is not provided
	if (!meta[0] && !charset.length) {
		typeFull += ';charset=US-ASCII';
		charset = 'US-ASCII';
	}

	// get the encoded data portion and decode URI-encoded chars
	const encoding = base64 ? 'base64' : 'ascii';
	const data = unescape(uri.substring(firstComma + 1));
	const buffer = Buffer.from(data, encoding);

	// set `.type` and `.typeFull` properties to MIME type
	buffer.type = type;
	buffer.typeFull = typeFull;

	// set the `.charset` property
	buffer.charset = charset;

	return buffer;
}