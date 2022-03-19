
function traverser(ast, visitor) {

  function traverseArray(arr, parent) {
    arr.forEach(node => {
      traverseNode(node, parent);
    });
  }

  function traverseNode(node, parent) {
    let methods = visitor[node.type];
    if (typeof methods === 'function') {
      methods = {
        enter: methods,
      }
    }
    if (methods && methods.enter) {
      methods.enter(node, parent);
    }

    switch(node.type) {
      case 'Program':
        traverseArray(node.body, node);
        break;
      case 'VariableDeclaration':
        traverseArray(node.declarations, node);
        break;
      case 'VariableDeclarator':
        traverseNode(node.id, node);
        traverseNode(node.init, node);
        break;
      case 'Identifier':
      case 'Literal':
        break; // do nothing
      default:
        throw new TypeError(node.type);
    }

    if (methods && methods.exit) {
      methods.exit(node, parent);
    }
  }

  traverseNode(ast, null);

}

module.exports = traverser;
