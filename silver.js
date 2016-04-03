// https://github.com/thejameskyle/the-super-tiny-compiler/blob/master/super-tiny-compiler.js

// Tokenizer
function tokenizer (input) {
  var current = 0
  var tokens = []

  while (current < input.length) {
    var char = input[current]

    if (char === '(') {
      tokens.push({
        type: 'paren',
        value: '('
      })
      current++
      continue
    }

    if (char === ')') {
      tokens.push({
        type: 'paren',
        value: ')'
      })
      current++
      continue
    }

    var WHITESPACE = /\s/
    if (WHITESPACE.test(char)) {
      current++
      continue
    }

    var NUMBERS = /[0-9]/
    if (NUMBERS.test(char)) {
      var value = ''
      while (NUMBERS.test(char)) {
        value += char
        char = input[++current]
      }

      tokens.push({
        type: 'number',
        value: value
      })

      continue
    }

    var LETTERS = /[a-z]/i
    if (LETTERS.test(char)) {
      var value = ''

      while (LETTERS.test(char)) {
        value += char
        char = input[++current]
      }

      tokens.push({
        type: 'name',
        value: value
      })

      continue
    }

    throw new TypeError('I do not know what this character is: ' + char)
  }

  return tokens
}

// Parser
function parser (tokens) {
  var current = 0

  function walk () {
    var token = tokens[current]

    if (token.type === 'number') {
      current++

      return {
        type: 'NumberLiteral',
        value: token.value
      }
    }

    if (token.type === 'paren' && token.value === '(') {
      token = tokens[++current]

      var node = {
        type: 'CallExpression',
        name: token.value,
        params: []
      }

      token = tokens[++current]

      while ((token.type !== 'paren') || (token.type === 'paren' && token.value !== ')')) {
        node.params.push(walk())
        token = tokens[current]
      }

      current++

      return node
    }

    throw new TypeError(token.type)
  }

  var ast = {
    type: 'Program',
    body: []
  }

  while (current < tokens.length) {
    ast.body.push(walk())
  }

  return ast
}

// Traverser
function traverser (ast, visitor) {
  
}
