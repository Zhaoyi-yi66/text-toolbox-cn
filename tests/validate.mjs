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
assert.match(html,/const XHS_THEMES = \[/,'缺少小红书主题表情库');
assert.match(html,/function emojiPoolFor\(/,'缺少内容感知表情选择');
assert.match(html,/function freshXhsLayout\(/,'缺少重复结果规避');
assert.ok((html.match(/pool: \[/g)||[]).length>=15,'小红书表情主题数量不足');

const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(match=>match[1]);
assert.equal(new Set(ids).size,ids.length,'HTML 中存在重复 id');

const inlineScripts=[...html.matchAll(/<script(?![^>]+src=)[^>]*>([\s\S]*?)<\/script>/gi)].map(match=>match[1]);
assert.ok(inlineScripts.length,'未找到内联脚本');
for(const source of inlineScripts)new vm.Script(source);

const xhsStart=html.indexOf('const XHS_POOLS =');
const xhsEnd=html.indexOf('function readOpts()',xhsStart);
assert.ok(xhsStart>=0&&xhsEnd>xhsStart,'无法提取小红书排版逻辑');
const xhsSource=String.raw`
function protectCode(text){return {text,blocks:[]}}
function stripMarkdown(text){return text}
function restoreCode(text){return text}
let xhsLastResult='';
${html.slice(xhsStart,xhsEnd)}
globalThis.foodPool=emojiPoolFor('周末探店，这家甜品和咖啡都很好吃','body');
globalThis.workPool=emojiPoolFor('职场效率和项目复盘技巧','title');
globalThis.sample=xhsLayout('周末美食探店\n\n- 咖啡\n- 甜品\n\n味道很惊喜，适合和朋友一起去。');`;
const xhsContext={Math};
vm.createContext(xhsContext);
new vm.Script(xhsSource).runInContext(xhsContext);
assert.ok(xhsContext.foodPool.includes('🍰')&&xhsContext.foodPool.includes('☕'),'美食内容未匹配到主题表情');
assert.ok(xhsContext.workPool.includes('💼')&&xhsContext.workPool.includes('📊'),'职场内容未匹配到主题表情');
assert.notEqual(xhsContext.sample,'周末美食探店\n\n- 咖啡\n- 甜品\n\n味道很惊喜，适合和朋友一起去。','小红书排版没有产生变化');

console.log(`页面检查通过：${ids.length} 个唯一控件，${inlineScripts.length} 段脚本语法有效。`);
