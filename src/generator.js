class Generator {
  constructor() {
    this.buff = '';
  }

  space() {
    this.buff += ' ';
  }

  nextLine() {
    this.buff += '\n';
  }

  Program(node) {
    node.body.forEach(node => {
      this[node.type](node) + ';';
      this.nextLine();
    });
  }

  VariableDeclaration(node) {
    this.buff += node.kind; // eg: const / let
    this.space();
    node.declarations.forEach((declaration, index) => {
      if (index !== 0) {
        this.buff += ',';
      }
      this[declaration.type](declaration);
    });
    this.buff += ';';
  }

  VariableDeclarator(node) {
    this[node.id.type](node.id);
    this.buff += ' = ';
    this[node.init.type](node.init);
  }

  Identifier(node) {
    this.buff += node.name;
  }

  Literal(node) {
    this.buff += node.raw;
  }

  generate(node) {
    this[node.type](node);
    return this.buff;
  }

}

module.exports = function(node) {
  return new Generator().generate(node);
}
