### 1.描述引用计数的工作原理和优缺点
原理：
  通过遍历得到所有变量的可访问和被引用关系，并累计，当引用次数减为0时，会在下一次垃圾回收时被回收空间

优点：
  1. 立即清除：通过判断引用数立即确定是否可以回收
  2. 减少内存溢出的可能：在内存占用较高时，GC开始工作，将垃圾及时回收，释放空间
缺点：
  1. 出现循环引用时，引用次数不会降为0，尤其针对于局部变量，导致内存占用

### 2.描述标记整理算法的工作流程
原理：
  1. 遍历内存为所有变量打标
  2. 去掉活动变量的标记
  3. GC清除带有标记的变量（垃圾）

优点：
  1. 解决循环引用带来的内存占用，只判断变量是否可达
缺点：
  1. 内存碎片化（标记整理法可以弥补，但需要考虑时间和空间的性能问题）
  2. 对象越多，效率越低


优化：及时解除不使用的全局变量、全局对象属性、循环引用变量的引用等

### 3.描述V8中新生代存储区垃圾回收的流程
标记整理（解决碎片化） + 复制（解决整理耗时，但是浪费空间，所以新生代区只存储少量活跃变量）
1. 存活时间较短的如局部变量等会存放在新生代存储区
2. 首先分配From区的内存
3. From内存使用率较高时,通过标记整理法将活动对象拷贝到To空间（整理过程采用空间换时间，因为新生代存储区空间整体占用不会很高，所以空间换时间是划算的）
4. From区释放所有空间，作为预留区
补充：
1. 晋升：
  1. 拷贝过程中存活超过一次GC的就晋升至老生代
  2. 当To空间占用超过25%，为了From和To交换预留空间
2. 新生代相当于一个活跃的临时变量暂存区；老生代则存储大量的活跃时间较长的变量


### 4.描述增量标记算法在何时使用及工作原理
何时：在老生代存储区做标记时使用，因为存储区较大，一次性完成会较长时间阻塞js执行（1s），被用户感知，所以分段执行标记，最后完成清除

### 代码题1

```js
const fp = require('lodash/ fp')
// 数据
// horsepower 马力，dollar_value 价格，in_stock 库存

const cars =[{
    name: " Ferrari FF",
    horsepower: 660,
    dollar_value: 700000,
    in_stock: true
}, {
    name: "Spyker C12 Zagato",
    horsepower: 650,
    dollar_value: 648000,
    in_stock: false
}, {
    name: "Jaguar XKR-S",
    horsepower: 550,
    dollar_value: 132000,
    in_stock: false
}, {
    name: "Audi R8",
    horsepower: 525,
    dollar_value: 114200,
    in_stock: false
}, {
    name: "Aston Martin One-77",
    horsepower: 750,
    dollar_value: 1850000,
    in_stock: true
}, {
    name: "Pagani Huayra",
    horsepower: 700,
    dollar_value: 1300000,
    in_stock: false
}]

```

#### 练习1 使用函数组合fp.flowRight()重新实现下面这个函数

```js
// 题目
let isLastInStock = function (cars) {
    // 获取最后一条数据
    let last_car = fp.last(cars)
    // 获取最后一条数据的 in_stock 属性值
    return fp.prop('in_stock', last_car)
}
```

```js
const _ = require('lodash')

const isLastInStock = fp.flowRight(fp.prop('in_stock'), fp.last)

isLastInStock(cars)

```

#### 练习2 使用fp.flowRight()、fp.prop()和fp.first()获取第一个car的name

```js
const _ = require('lodash')

const isLastInStock = fp.flowRight(fp.prop('name'), fp.first)

isLastInStock(cars)

```

#### 练习3 使用帮助函数_average重构averageDollarValue，使用函数组合的方式实现

```js
// 题目
let _average = function (xs) { return fp.reduce(fp.add, 0, xs) / xs.length}

let averageDollarValue = function (cars) {
    let dollar_values = fp.map(function (car) {
        return car.dollar_value
    }, cars)
    return _average(dollar_values)
}
```

```js 

let _average = fp.flowRight(_average, fp.map(fp.prop('dollar_value')))

```

#### 练习4 使用flowRight写一个sanitizeNames()函数，返回一个下划线连接的小写字符串，把数组中的name转换为这种形式:例如: sanitizeNames(["Hello World"]) => ["hello_world"]

```js
let _underscore = fp.replace(/\W+/g, '_')
```
```js

let sanitizeNames = fp.flowRight(fp.map(_underscore), fp.map(_.toLower))

```

### 代码题2

```js
// support.js
class Container {
    static of (value) {
        return new Container(value)
    }

    constructor (value) {
        this._value = value
    }

    map (fn) {
        return Container.of(fn(this._value))
    }
}

class Maybe {
    static of (x) {
        return new MayBe(x)
    }

    isNothing () {
        return this._value === null || this._value === undefined
    }
    
    constructor (x) {
        this._value = x
    }
    
    map (fn) {
        return this.isNothing() ? this : MayBe.of(fn(this._value))
    }
}

module.exports = {
    Maybe,
    Container
}
```

#### 练习1: 使用fp.add(x, y)和fp.map(f, x)创建一个能让functor里的值增加的函数ex1

```js
const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')
let maybe = Maybe.of([5, 6, 1])

let ex1 = maybe.map(fp.map(fp.add(1)))
```

#### 练习2: 实现一个函数ex2，能够使用fp.first 获取列表的第一个元素

```js
const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')
let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])

let ex2 = xs.map(fp.first)
```

#### 练习3: 实现一个函数ex3，使用safeProp和fp.first找到user的名字的首字母

```js
const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')

let safeProp = fp.curry(function (x, o) {
    return Maybe.of(o[x])
})
let user = { id: 2, name: "Albert" }

let ex3 = safeProp('name', user).map(fp.first)
```

#### 练习4: 使用Maybe重写ex4，不要有if语句

```js
const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')

let ex4 = function (n) {
    if (n) { return parseInt(n) }
}
```

```js
let ex4 = MayBe.of(12.2).map(parseInt)
```