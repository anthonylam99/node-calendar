let helloWorld = (req, res) => {
    return res.send("Hello World")
}


module.exports = {
    helloWorld : helloWorld
}