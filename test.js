const compiler = require('vue-template-compiler')

const result =
  compiler.compile(`<div id="app" style="color: red; font-size: 20px">
<p>Hello{{ name }}</p>
<span>{{ age }}</span>
</div>`)

console.log(result.render)
