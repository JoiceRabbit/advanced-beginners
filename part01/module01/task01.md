# 李青 | Part1 | 模块一

### 第一题
最终执行结果为 9

原因是：变量提升（var声明的变量被提升为全局变量，因此每次循环++的都是全局i的值，循环结束，i的值且9，函数执行获取的是全局的i）

**修改**

最终执行结果为 10

原因是：循环结束 i 的值累加到了10

### 第二题
打印结果为 123

原因是: let定义的变量不会提升，因此console获取的tmp是全局的tmp

**修改**

最终执行结果为 报错

原因是：console是运行时，js引擎在编译时就知道if作用域中有个t的定义，所以在访问t的时候if作用域里遮蔽了全局的，但是在临时死区访问则报错

### 第三题
```
Math.min.apply(null, arr)
```

### 第四题
区别：
1. 是否提升：var会被提升到当前作用域顶部；let const不会提升
2. 是否可修改：var let定义的变量允许修改；const定义的变量不允许修改值（引用类型则不允许修改引用）
3. 重复声明：同一个作用域中，var可以重复声明一个标识符，后者覆盖前者；let const不允许重复声明

### 第五题
打印结果为 10

原因是: 剪头函数内部的this指向作用域链上最近的this，题目中则是全局的window，所以取得是全局的a

**修改**

最终执行结果为 20

原因是：剪头函数内部的this指向作用域链上最近的this，即fn函数作用域中的this，fn函数被调用时遵循this指向调用者的基本原则，所以a取值为obj的a

### 第六题
Symbol是一个新增的数据类型，用于解决开发中遇到的问题
1. 属性名易覆盖
2. 私有属性不能很好被保护
因为Symbol的特点： 每次调用生成的symbol类型的值都不相同

### 第七题
主要针对于引用类型的变量
浅拷贝：变量的值复制（即引用），得到的两个变量指向同一块内存
深拷贝：完全的副本，值相同，引用不同，指向不同的内存

### 第八题
JS异步编程：为了保证dom渲染不会发生冲突，所以js只能设计为单线程，但是一些耗时任务如定时器，网络请求，事件监听，异步回调如果都放在主线程执行，会影响页面交互响应，因为js可以借助宿主环境提供的多线程能力，将耗时任务同步执行。
Event loop：鉴于异步编程模式，对于外派的任务就需要在特定时间（主线程空闲）去完结，外派任务可能由多个，所以需要排队等候（异步队列），“完结”即主线程在有空的时候执行异步任务的收尾工作，循环往复
宏任务：与微任务的区别在于执行优先级，任务类型包括：setTime系列，事件监听，ajax等，任务队列中的内容算作下一轮
微任务：如 promise，mutationRequest，process.nextTick等，算作本轮任务，追加在本轮js主线程的


### 第九题
```
const arr = ['hello', 'lagou', 'hi']

Promise.all(
    arr.map(item => {
        setTimeout(() => {
            Promise.resolve(item)
        }, 10)
    })
).then(resultArr => {
    console.log(resultArr.reduce((prev, next) => prev + next, ''))
})
```

### 第十题
1. js是ts的基础
2. ts增加了类型系统和对es6+的支持

### 第十一题
1. 优点
    1. 增加了编译时类型检测，提高代码质量
    2. 增强了代码可读性
    3. js作为解释性语言需要在运行做类型推导，而动态类型语言的类型变化为js运行增加了成本，ts的类型检测在编译阶段去除大部分不必要的类型变化，减少运行时类型推导，提高了js运行性能
    4. 渐进式：降低入手和学习成本
2. 缺点
    1. 增加开发量，对小型项目优势不明显