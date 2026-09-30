import {build} from 'esbuild';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const base=new URL('./',import.meta.url),out=base;await mkdir(out,{recursive:true});
const result=await build({entryPoints:[new URL('app.js',base).pathname],bundle:true,format:'iife',minify:true,write:false,target:['es2020'],legalComments:'inline'});
const css=await readFile(new URL('style.css',base),'utf8'),template=await readFile(new URL('template.html',base),'utf8');const html=template.replace('/* STYLES */',css).replace('/* APP */',()=>result.outputFiles[0].text.replaceAll('</script>','<\\/script>'));
await writeFile(new URL('index.html',out),html);const notices=[await readFile(new URL('LICENSE',base),'utf8'),'\nThree.js (MIT)\n'+await readFile(new URL('node_modules/three/LICENSE',base),'utf8'),'\ncannon-es (MIT)\n'+await readFile(new URL('node_modules/cannon-es/LICENSE',base),'utf8')].join('\n');await writeFile(new URL('LICENSE.txt',out),notices);console.log(`Built Siegeworks offline: ${Math.round(Buffer.byteLength(html)/1024)} KiB`);
