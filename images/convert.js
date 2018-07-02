#!/usr/bin/env node
const {join,extname} = require('path');
const {promisify} = require('util');
const readdir = promisify(require('fs').readdir);
const mkdir = promisify(require('fs').mkdir);
const writeFile = promisify(require('fs').writeFile);
const execPromise = promisify(require('child_process').execFile);

function exec(command, ...args) {
    console.log(command, ...args);
    return execPromise(command, args);
}


(async(...fileNames)=>{
    let here=__dirname;
    let source=join(here,"renamed");

    let sizes = ['400x300', '800x600', '1200x900', '1600x1200', '2000x1500', 'full'];

    await Promise.all(sizes.map(size=>mkdir(join(here,size)).catch(e=>{if (e.code!="EEXIST") throw e;})));

    let files = (await readdir(source)).filter(name=>[".jpg", ".jpeg"].includes(extname(name).toLowerCase()));

    let cssText='';
    let carouselText='';
    let imageText='';

    for (let file of files) {
        if (fileNames.includes(file) || fileNames[0]=='all') {
            let name=file.replace(/\..*$/,'');
            cssText+=`.image-${name} {background-image:url("full/${file}")}\n`;
            let imageSizes='';
            let imageLocations=[];
            carouselText+=`<div data-src="${file}"></div>\n`;
            await Promise.all(sizes.map(size=>{
                let target=join(here,size);
                let width=size.split("x")[0];
                if (size!='full') {
                    cssText+=`@media (max-width : ${width}px) {.images-${name} {background-image:url("${size}/${file}")}}\n`;
                    imageLocations.push(`images/${size}/${file} ${width}w`);
                }
                return exec('convert',join(source,file),'-interlace','Plane',...size!="full"?['-resize',size]:[],'-quality','90',join(target,file));
            }));
            imageText+=`srcset="${imageLocations.join(",")}"\n`;
        }
    }

    await writeFile(join(here,"images.css"), cssText);
    await writeFile(join(here,"carousel.html"), carouselText);
    await writeFile(join(here,"srcset.txt"), imageText);

})(...process.argv.slice(2)).catch(e=>console.error(e))
