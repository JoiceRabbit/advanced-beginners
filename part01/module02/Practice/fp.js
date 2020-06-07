const _ = require('lodash')
const fp = require('lodash/fp')

const cars = [{
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

const curriedProp = _.curry(fp.prop)

const isLastInStock = fp.flowRight(curriedProp('name'), fp.first)

console.log(isLastInStock(cars))

let sanitizeNames = fp.flowRight(fp.map(fp.join('_')), fp.map(_.toLower))

console.log(sanitizeNames(['HEPP LL']))


const { Maybe, Container } = require('./support')
let maybe = Maybe.of([5, 6, 1])

let ex1 = maybe.map(fp.map(fp.add(1)))

console.log(ex1)
console.log(ex1)

let safeProp = fp.curry(function (x, o) {
  return Maybe.of(o[x])
})
let user = { id: 2, name: "Albert" }

let ex3 = safeProp('name', user).map(fp.first)
console.log(ex3)

let ex4 = Maybe.of(null).map(parseInt)

console.log(ex4)