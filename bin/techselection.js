#!/usr/bin/env node
const grs=require('../getRepoStats.js').getRepoStats
const process=require('process');
var techName=process.argv.slice(2);

techName.forEach((v,i,a)=>{
    grs(v);
})

