let esc = "\033[";
let red = "31"
let green = "32";
let bold = "1";
let blink = "5";
let underline = "4";

let bold_green = `${esc}${green};${bold};${blink}m`;
let bold_red = `${esc}${red};${bold};${underline}m`

let reset = `${esc}0m`;

module.exports.error = (text) => {
    console.log(`${bold_red}[ERROR]${reset} ${text}`);
}

module.exports.info = (text) => {
    console.log(`${bold_green}[INFO]${reset} ${text}`);
}