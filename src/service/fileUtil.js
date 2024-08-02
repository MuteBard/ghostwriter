const fs = require('fs-extra');

exports.readdir = (name, options = { withFileTypes: true }) => {
    return new Promise((resolve, reject) => {
        fs.readdir('..', options, (err, files) => {
            if (err) reject(err);
            else {
                console.log(`listed directories`);
                resolve(new Set(files.filter(dirent => dirent.isDirectory())
                    .map(dirent => dirent.name)))
            }
        })

    })
}

exports.mkdir = (name, options = { recursive: true }) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(name, options, (err,) => {
            if (err) reject(err);
            else {
                console.log(`Created new directory ${name}`);
                resolve();
            }
        })
    })
}

exports.rmdir = (name, options = { recursive: true }) => {
    return new Promise((resolve, reject) => {
        fs.rmdir(name, options, (err) => {
            if (err) reject(err);
            else {
                console.log(`Deleted directory ${name}`);
                resolve();
            }
        })
    })
}

exports.move = (name, destination, options = { overwrite: false }) => {
    return new Promise((resolve, reject) => {
        fs.move(name, destination, options, (err) => {
            if (err) reject(err);
            else {
                console.log(`Moved directory at ${destination}`);
                resolve();
            }
        })
    })
}

exports.rename = (oldName, newName) => {
    return new Promise((resolve, reject) => {
        fs.rename(oldName, newName, (err) => {
            if (err) reject(err);
            else {
                console.log(`renamed ${oldName} to ${newName}`);
                resolve();
            }
        })
    })
}

exports.writeFile = (name, content = '') => {
    return new Promise((resolve, reject) => {
        fs.writeFile(name, content, (err) => {
            if (err) reject(err);
            else {
                console.log(`Created ${name}`);
                resolve();
            }
        })
    })
}

exports.readFile = (name) => {
    return new Promise((resolve, reject) => {
        fs.readFile(name, 'utf8', (err, data) => {
            if (err) {
                console.log(`File ${name} does not exist`);
                reject(err);
            }
            else {
                console.log(`Accessed ${name}`);
                resolve(data);
            }
        })
    })
}

exports.deleteFile = (name) => {
    return new Promise((resolve, reject) => {
        fs.remove(name, (err) => {
            if (err) {
                console.log(`File ${name} does not exist`);
                reject(err);
            }
            else {
                console.log(`Deleted ${name}`);
                resolve();
            }
        })
    })
}

exports.listFiles = (name) => {
    return new Promise((resolve, reject) => {
        fs.readdir(name, (err, data) => {
            if (err) {
                console.log(`No files in ${name}`);
                resolve([]);
            }
            else {
                resolve(data);
            }
        })
    })
}