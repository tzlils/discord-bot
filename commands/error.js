module.exports.config = {
    name: "error",
    description: "Throws a dummy error",
    format: [],
    privilegeLevel: 3,
    category: "utility"
}

module.exports.run = (client, message, args) => {
    throw Error("dummy error");
}