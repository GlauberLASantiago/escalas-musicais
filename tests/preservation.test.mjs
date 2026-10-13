import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inflateSync} from 'node:zlib';
function tags(file){const b=file.subarray(0,3).toString()==='CWS'?Buffer.concat([file.subarray(0,8),inflateSync(file.subarray(8))]):file;assert.equal(b.length,b.readUInt32LE(4));const rectLength=Math.ceil((5+4*(b[8]>>3))/8);let p=8+rectLength+4;const result=[];while(p<b.length){const header=b.readUInt16LE(p);p+=2;const type=header>>6;let length=header&63;if(length===63){length=b.readUInt32LE(p);p+=4;}assert.ok(p+length<=b.length);result.push({type,data:b.subarray(p,p+length)});p+=length;if(type===0)break;}return result;}
function stringPool(data){let p=data.indexOf(0,4)+1;const header=data.subarray(0,p);p+=4;function u(){let v=0,s=0,n;do{n=data[p++];v|=(n&127)<<s;s+=7;}while(n&128);return v;}for(let pool=0;pool<3;pool++){const count=u();for(let i=1;i<count;i++){if(pool===2)p+=8;else u();}}const count=u(),strings=[];for(let i=1;i<count;i++){const size=u();strings.push(data.subarray(p,p+size).toString());p+=size;}return {header,strings,tail:data.subarray(p)};}
function gameBytes(movie){return tags(movie).find(t=>t.type===87&&t.data.readUInt16LE(0)===3).data.subarray(6);}
function normalized(s){return s.replaceAll('fontFamily="Calibri"','fontFamily="Arial"').replaceAll('embedFonts="true"','embedFonts="false"');}
// Exact PlaceObject2 payloads: only the initial ra/wa MATRIX translation y changes by -140 twips (7 px).
const scorePlacements = {
 1: new Map([[70,['261a0004001ed5352018776100','261a0004001ed5351bb8776100']],[71,['261b0004001ebfa52028726100','261b0004001ebfa51bc8726100']]]),
 2: new Map([[72,['261b0004001ece2d1e90776100','261b0004001ece2d1a30776100']],[73,['261c0004001eb8891e90726100','261c0004001eb8891a30726100']]]),
 3: new Map([[72,['26220004001ed1f91e58776100','26220004001ed1f919f8776100']],[73,['26230004001ebc391e58726100','26230004001ebc3919f8726100']]])
};
for(const level of [1,2,3])test(`nível ${level}: adaptação preserva código, partituras, sons e carregador`,()=>{
 const original=readFileSync(new URL(`../assets/original/dificuldade_${level}.swf`,import.meta.url));const web=readFileSync(new URL(`../assets/web/dificuldade_${level}.swf`,import.meta.url));
 const outerA=tags(original),outerB=tags(web);assert.equal(outerA.length,outerB.length);outerA.forEach((tag,i)=>{assert.equal(tag.type,outerB[i].type);if(tag.type!==87||tag.data.readUInt16LE(0)!==3)assert.deepEqual(tag.data,outerB[i].data);});
 const a=tags(gameBytes(original)),b=tags(gameBytes(web));assert.equal(a.length,b.length);let changed=0,positions=0;
 a.forEach((tag,i)=>{assert.equal(tag.type,b[i].type);const score=scorePlacements[level].get(i);if(score){assert.equal(tag.type,26);assert.equal(tag.data.toString('hex'),score[0]);assert.equal(b[i].data.toString('hex'),score[1]);positions++;return;}if(tag.type!==82){assert.deepEqual(tag.data,b[i].data);return;}const old=stringPool(tag.data),updated=stringPool(b[i].data);assert.deepEqual(old.header,updated.header);assert.deepEqual(old.tail,updated.tail,'metadados, métodos e corpos ActionScript devem permanecer idênticos');assert.equal(old.strings.length,updated.strings.length);old.strings.forEach((s,j)=>{assert.equal(normalized(s),updated.strings[j]);if(s!==updated.strings[j])changed++;});});assert.ok(changed>0,'a correção de fontes deve existir');assert.equal(positions,2,'somente as duas posições iniciais dos contadores são ajustadas');
});
