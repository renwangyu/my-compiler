const Parser = require('./parser');
const traverse = require('./traverser');
const generate = require('./generator');

function transformSync(code, options) {
  const ast = Parser.parse(code);
  const vistors = {};
  options.plugins.forEach(([plugin, opts]) => {
    const res = plugin(null, opts);
    Object.assign(vistors, res.vistor);
  });
  traverse(ast, vistors);
  return generate(ast);
}

exports.transformSync = transformSync;
