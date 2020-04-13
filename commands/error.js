module.exports.config = {
    name: "error",
    description: "Throws a dummy error",
    format: [],
    privilegeLevel: 3,
    category: "utility"
}

module.exports.run = async (message, stdin, stdout) => {
    throw Error("dummy error");
}