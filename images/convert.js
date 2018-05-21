#!/usr/bin/env node
const {join,extname} = require('path');
const {promisify} = require('util');
const readdir = promisify(require('fs').readdir);
const mkdir = promisify(require('fs').mkdir);
const execPromise = promisify(require('child_process').execFile);

function exec(command, ...args) {
    console.log(command, ...args);
    return execPromise(command, args);
}


(async()=>{
    let source=__dirname;

    let sizes = ['400x300', '800x600', '1200x900'];

    await Promise.all(sizes.map(size=>mkdir(join(source,size)).catch(e=>{if (e.code!="EEXIST") throw e;})));

    let files = (await readdir(source)).filter(name=>[".jpg", ".jpeg"].includes(extname(name).toLowerCase()));

    for (let size of sizes) {
        let target=join(source,size);
        for (let file of files) {
            await exec('convert',join(source,file),'-resize',size,join(target,file));
        }
    }
})().catch(e=>console.error(e))
