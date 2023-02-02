const sourceMap = require('source-map');
const fs = require('fs');

module.exports = function (codeFile, fileName) {
  if (!fs.existsSync(codeFile)) {
    console.log(`❌ 没有找到需要生成map的文件 ${fileName} `);
    return;
  }
  console.log(`🛠️ 开始为 ${fileName} 生成map文件`);

  const fileContents = fs.readFileSync(codeFile).toString();
  const chunks = [];
  let line = 1;
  fileContents.match(/^[^\r\n]*(?:\r\n?|\n?)/mg).forEach(function(token) {
    if (!/^\s*$/.test(token)) {
      chunks.push(new sourceMap.SourceNode(line, 0, fileName, token));
    }
    ++line;
  });
  const node = new sourceMap.SourceNode(null, null, null, chunks);
  node.setSourceContent(fileName, fileContents);
  const result = node.toStringWithSourceMap({ file: fileName });

  fs.writeFileSync(codeFile + '.map', result.map.toString());
  console.log(`🍺 ${fileName}.map 编译成功`);

  const referContent = `\n//# sourceMapURL=${fileName}.map`
  fs.appendFileSync(codeFile, referContent);
  console.log(`✨ ${fileName} 与 ${fileName}.map 关联成功`);
}
