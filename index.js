const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
let accountToTotal = {}
// accountNumber => { currentBalance, list of audits [{depositAmount, dateTime{}] }


express()
  .use(express.json())
  .get('/', (req, res) => res.send("Hello world"))
  .post('/api/deposits', (req, res) =>
  {
    const accountNumber = Number(req.body.accountNumber)
    const depositAmount = Number(req.body.depositAmount)
    let accountDetails = accountToTotal[accountNumber] || {}
    let currentBalance = accountDetails.currentBalance || 0
    let audits = accountDetails.audits || []
    let currentDate = new Date()
    let newAudit = {
      depositAmount: depositAmount,
      date: currentDate
    }
    audits.push(newAudit)
    accountDetails.currentBalance = currentBalance + depositAmount
    accountDetails.audits = audits
    accountToTotal[accountNumber] = accountDetails

    const reponseObject = {
      newBalance: accountDetails.currentBalance
    }
    res.send(reponseObject)
  })
  .get('/api/accounts/:accountNumber', (req, res) => {
    const accountDetails = accountToTotal[req.params.accountNumber] || {}
    const responseObject = {
      currentBalance: accountDetails.currentBalance || 0
    }
    res.send(responseObject)
  })
  .get('/api/accounts/:accountNumber/audits', (req, res) => {
    const accountDetails = accountToTotal[req.params.accountNumber] || {}
    res.send(accountDetails.audits)
  })
  .get('/api/accounts', (req, res) => res.send(accountToTotal))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
