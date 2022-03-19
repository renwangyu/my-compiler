const fs = require('fs');
const path = require('path');
const { transformSync } = require('./core');

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
        annotation: ' // changed by me',
      }
    ]
  ]
}
const transformedCode = transformSync(code, vistors);
console.log(transformedCode);

