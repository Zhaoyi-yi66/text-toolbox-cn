import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const html=await readFile(new URL('../public/index.html',import.meta.url),'utf8');
assert.match(html,/<!DOCTYPE html>/i);
assert.match(html,/<meta[^>]+name="viewport"/i);
assert.match(html,/<\/html>\s*$/i);
assert.match(html,/id="runClean"/);
assert.match(html,/id="runDetect"/);
assert.match(html,/id="runRewrite"/);

const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(match=>match[1]);
assert.equal(new Set(ids).size,ids.length,'HTML 中存在重复 id');

const inlineScripts=[...html.matchAll(/<script(?![^>]+src=)[^>]*>([\s\S]*?)<\/script>/gi)].map(match=>match[1]);
assert.ok(inlineScripts.length,'未找到内联脚本');
for(const source of inlineScripts)new vm.Script(source);

console.log(`页面检查通过：${ids.length} 个唯一控件，${inlineScripts.length} 段脚本语法有效。`);
