const Airtable = require('airtable')
const Mailgun = require('mailgun-js')

// Mail Stuff
// const appreciationEmail = async ({ data, orders }) => { // For Testing
const appreciationEmail = async ({ orders }) => {
  return new Promise((resolve, reject) => {
    console.log('Sending appreciation email')
    const { MG_API_KEY, MG_DOMAIN } = process.env
    const mailgun = Mailgun({ apiKey: MG_API_KEY, domain: MG_DOMAIN })
    // const mailgun = Mailgun({ apiKey: data.REACT_APP_MG_API_KEY, domain: data.REACT_APP_MG_DOMAIN }) // For Testing
    
    let html = `<div>
      <h1>Order Confirmation</h1>
      <div><h2 style="margin: 0;">Order ID: <span style="font-weight: normal;">${orders[0]['Order ID']}</span>  -  Order Date: <span style="font-weight: normal;">${orders[0]['Order Date']}</span></h2></div>`

    orders.forEach(order => {
      html += `<div><h3 style="margin-bottom: 0;">Item: <span style="font-weight: normal;">${orders[0]['Item']}</span></h2></div>`
      html += `<div style="margin-left: 2%;"><b>School Name: </b>${order['School Name']}  -  <b>School Mascot: </b>${order['School Mascot']}</div>`
      html += `<div style="margin-left: 2%;"><b>Name 1: </b>${order['Name 1']}  -  <b>Name 2: </b>${order['Name 2']}</div>`
      html += `<div style="margin-left: 2%;"><b>Colors: </b>${order['Colors'].join(', ')}  -  <b>Activities: </b>${order['Activities'].join(', ')}</div>`
      html += `<div style="margin-left: 2%;"><b>Extras: </b>${order['Extras']}</div>`
    })

    html += `<div>If the details of your order are incorrect, mail us at <a href="orders@boutiquemums.com">orders@boutiquemums.com</a></div>`
    html += `</div>`

    const message = {
      from: 'Boutique Mums <orders@boutiquemums.com>',
      to: orders[0]['Customer Email'],
      subject: 'Order Confirmation',
      text: 'Order Confirmation',
      html,
    }

    mailgun.messages().send(message, (error, body) => {
      if (error) console.log(error)
      if (body) console.log(body)
      if (error) return reject(error)
      resolve()
    })
  })
}

// const orderEmail = async ({ data, orders }) => { // For Testing
const orderEmail = async ({ orders }) => {
  return new Promise((resolve, reject) => {
    console.log('Sending order email')
    const { MG_API_KEY, MG_DOMAIN } = process.env
    const mailgun = Mailgun({ apiKey: MG_API_KEY, domain: MG_DOMAIN })
    // const mailgun = Mailgun({ apiKey: data.REACT_APP_MG_API_KEY, domain: data.REACT_APP_MG_DOMAIN }) // For Testing

    let html = `<div>
      <h1>Order Received</h1>
      <div><h2 style="margin: 0;">Customer Name: <span style="font-weight: normal;">${orders[0]['Customer Name']}</span></h2></div>
      <div><h2 style="margin: 0;">Contact Name: <span style="font-weight: normal;">${orders[0]['Contact Name']}</span>  -  Contact Phone: <span style="font-weight: normal;">${orders[0]['Contact Phone']}</span></h2></div>
      <div><h2 style="margin: 0;">Customer Email: <span style="font-weight: normal;">${orders[0]['Customer Email']}</span></h2></div>
      <div><h2 style="margin: 0;">Customer Address: <span style="font-weight: normal;">${orders[0]['Customer Address']}</span></h2></div>
      <div><h2 style="margin: 0;">Order ID: <span style="font-weight: normal;">${orders[0]['Order ID']}</span>  -  Order Date: <span style="font-weight: normal;">${orders[0]['Order Date']}</span></h2></div>
      <div><h2 style="margin: 0;">Special Instructions: <span style="font-weight: normal;">${orders[0]['Special Instructions']}</span></h2></div>`

    orders.forEach(order => {
      html += `<div><h3 style="margin-bottom: 0;">Item: <span style="font-weight: normal;">${orders[0]['Item']}</span></h2></div>`
      html += `<div style="margin-left: 2%;"><b>School Name: </b>${order['School Name']}  -  <b>School Mascot: </b>${order['School Mascot']}</div>`
      html += `<div style="margin-left: 2%;"><b>Name 1: </b>${order['Name 1']}  -  <b>Name 2: </b>${order['Name 2']}</div>`
      html += `<div style="margin-left: 2%;"><b>Colors: </b>${order['Colors'].join(', ')}  -  <b>Activities: </b>${order['Activities'].join(', ')}</div>`
      html += `<div style="margin-left: 2%;"><b>Extras: </b>${order['Extras']}</div>`
    })
    html += `</div>`

    const message = {
      from: 'Boutique Mums <orders@boutiquemums.com>',
      to: 'orders@boutiquemums.com',
      subject: 'Order Received',
      text: 'Order Received',
      html,
    }

    mailgun.messages().send(message, err => {
      if (err) {
        console.log(err)
        return reject(err)
      }
      resolve({ message: 'Email Sent' })
    });
  });
}

// Save Order Information
// const saveOrder = async ({ data, orders }) => { // For Testing
const saveOrder = async ({ orders }) => {
  return new Promise(async (resolve, reject) => {
    console.log('Saving order to airtable')
    const { AT_API_KEY, AT_BASE } = process.env
    // const base = new Airtable({ apiKey: data.REACT_APP_AT_API_KEY }).base(data.REACT_APP_AT_BASE); // For Testing
    const base = new Airtable({ apiKey: AT_API_KEY }).base(AT_BASE)
    const records = await Promise.all(orders.map(order => createRecord({ base, order }).catch(error => error)))
    
    resolve({ orders, records })
  });
};

const createRecord = ({ base, order }) => {
  return new Promise(async (resolve, reject) => {
    const date = order['Order Date'].split('-')
    const sheet = `${date[1]}/${date[0]}`

    base(sheet).create(order, (err, record) => {
      if (err) return reject(err)
      return resolve(record)
    })
  })
}

function errorCheck(records) {
  let error = false
  records.forEach(record => { if (record.error) error = record })
  return error
}

export async function handler(event, context, callback) {
  // console.log('EVENT', event)
  // console.log('CONTEXT', context)
  // console.log('CALLBACK', callback)

  // Set up for possible errors with saving/emailing through try/catch
  try {
    const data = JSON.parse(event.body)
    console.log('DATA: ', data)
    const run = await Promise.all([ saveOrder(data), orderEmail(data), appreciationEmail(data) ])
    console.log(run)

    // const message = await saveOrder(data)
    // const errors = errorCheck(message.records)
    
    // const sendOrder = await orderEmail(data)
    // const sendAppreciation = await appreciationEmail(data)

    // const response = { statusCode: 200, data: {}, error: null }
    // if (errors) {
    //   response.statusCode = errors.statusCode
    //   response.error = { type: 'AirTable Error', ...errors }
    // }
    // else response.data = message
    // response.data = message

    callback(null, {
      statusCode: 200,
      body: JSON.stringify({ message: 'Order Confirmed' }),
    })
  }
  catch(e) {
    console.log(e)
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({ message: e.message }),
    })
  }
}
