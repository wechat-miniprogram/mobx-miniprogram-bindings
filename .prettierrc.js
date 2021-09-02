module.exports = {
  // 字符串使用单引号
  singleQuote: false,
  // 每行末尾自动添加分号
  semi: true,
  // tab缩进大小,默认为2
  tabWidth: 2,
  // 使用tab缩进，默认false
  useTabs: true,
  // 对象中打印空格 默认true
  // true: { foo: bar }
  // false: {foo: bar}
  bracketSpacing: true,
  // 箭头函数参数括号 默认avoid 可选 avoid| always
  // avoid 能省略括号的时候就省略 例如x => x
  // always 总是有括号
  arrowParens: 'avoid',
  // 换行长度，默认80
  printWidth: 80,

  // 设置为true时,将多行JSX元素的 > 放在最后一行的末尾，而不是单独放在下一行
  /* 
    <button
       className="prettier-class"
       id="prettier-id"
       onClick={this.handleClick}>
       Click Here
    </button> 
     */
  // 设置为false时
  /*
    <button
        className="prettier-class"
        id="prettier-id"
        onClick={this.handleClick}
    >
        Click Here
    </button>
     */
  jsxBracketSameLine: true
};