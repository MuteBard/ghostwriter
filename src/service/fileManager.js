const { writeFile, readFile } = require('./fileUtil');

async function makeFile(path, content) {
    await writeFile(path, content);
}

async function getFile(path) {
    return readFile(path);
}

exports.makeFile = makeFile;
exports.getFile = getFile;