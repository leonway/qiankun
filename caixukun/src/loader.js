export async function importHtml(entry) {
  // 解析html 生成css和js
  // 1、加载子应用入口
  let content = await loadSource(entry)
  console.log(content);
  // !todo 解析script
  const scripts = await parseScript(content,entry)
  // console.log(scripts);
  // !todo 解析css
  const { css,styles } = parseCss(content,entry)
  console.log({css,styles,scripts});
  // !todo 解析body
  const body = parseBody(content)
  console.log(body);
}

function loadSource(url) {
  return window.fetch(url).then(res=>res.text())
}

const ATTR_RE = /["'=\w\s]*/.source

function parseBody(content) {
  const BODY_RE = /<body>([\w\W]*)<\/body>/g
  const SCRIPT_RE = /<script["'=\w\s]*>[\s\S]*<\/script>/g
  let bodyContent = content.match(BODY_RE)
  console.log(bodyContent);
}
function parseCss(content,entry) {
  const CSS_LINK_RE = new RegExp(`<link${ATTR_RE}href="([^"]+.css[^"]*)"${ATTR_RE}>`,'g')
  const STYLE_CONTENT_RE = /<style>([^<]*)<\/style>/g

  const CSS_RE = new RegExp(`(?:${CSS_LINK_RE.source})|(?:${STYLE_CONTENT_RE.source})`,'g')
  let css= []
  let styles = []
  let match 

  while((match=CSS_RE.exec(content))){
    let style
    if(match[1]){
      style = match[1].trim()
      style&&css.push(style)
    }else if(match[2]){
      style = match[2].trim()
      style&&styles.push(style)
    }
  }

  return {css,styles}
}
async function parseScript(content,entry) {
  // 远程js用的时候再load,也可以parse之后直接load进来，存文本
  // const SC

  const SCRIPT_CONTENT_RE = new RegExp(`<script${ATTR_RE}>([\\w\\W]*)</script>`,"g")
  const SCRIPT_SRC_RE = new RegExp(`<script${ATTR_RE}src="(.+)">`,'g')
  let scripts = []
  const scriptsUrls = []
  let match 
  while((match=SCRIPT_CONTENT_RE.exec(content))){
    const script = match[1].trim()
    script && scripts.push(script)
  }
  while((match=SCRIPT_SRC_RE.exec(content))){
    const script = match[1].trim()
    script && scriptsUrls.push(script)
  }
  // console.log(scripts);
  // console.log(scriptsUrls);
  let remoteScripts = await Promise.all(scriptsUrls.map(url=>{
    let u = (url.startsWith('http:')||url.startsWith('https:'))?url:entry+url
    return loadSource(u)
  }))

  scripts = remoteScripts.concat(scripts)
  return scripts
}
