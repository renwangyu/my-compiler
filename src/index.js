const fs = require('fs');
const path = require('path');
const { transformSync } = require('./core');
const sourceMapGenerator = require('./source-map-generator');

function getCode() {
  const codeFile = path.resolve(__dirname, '../code.js');
  const code = fs.readFileSync(codeFile).toString();
  return code;
}

const code = getCode();
const vistors = {
  plugins: [
    [
      function(api, options) {
        return {
          vistor: {
            Identifier: {
              enter: node => {
                node.name += 'Changed';
              }
            }
          }
        }
      },
      {}
    ],
    [
      function(api, options) {
        return {
          vistor: {
            Literal(node) {
              node.raw += options.annotation;
            }
          }
        }
      },
      {
        annotation: ' // changed by bb',
      }
    ]
  ]
}
const transformedCode = transformSync(code, vistors);
// console.log(transformedCode);

const distFileName = 'dist-code.js';
const distCodeFile = path.resolve(__dirname, `../${distFileName}`);
// 生成my-babel编译后的代码文件
fs.writeFileSync(distCodeFile, transformedCode);
// 编译sourceMap
sourceMapGenerator(distCodeFile, distFileName);