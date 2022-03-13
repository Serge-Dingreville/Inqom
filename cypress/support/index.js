// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
// Import commands.js using ES2015 syntax:
import './commands'
// Alternatively you can use CommonJS syntax:
// require('./commands')
Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

const findAllByKey = (obj, key_name) => {
  return Object.entries(obj).reduce((acc, [key, value]) => (key === key_name) ? acc.concat(value) : (typeof value === 'object') ? acc.concat(findAllByKey(value, key_name)) : acc, [])
}
Cypress.findAllByKey = findAllByKey