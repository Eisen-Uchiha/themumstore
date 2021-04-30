const Airtable = require('airtable')
const Mailgun = require('mailgun-js')

const appreciationEmail = async ({ orders }) => {
  return new Promise((resolve, reject) => {
    console.log('Sending appreciation email')
    const { MG_API_KEY, MG_DOMAIN } = process.env
    const mailgun = Mailgun({ apiKey: MG_API_KEY, domain: MG_DOMAIN })
    
    let html = `<div>
      <h1>Order Confirmation</h1>
      <div><h2 style="margin: 0;">Order ID: <span style="font-weight: normal;">${orders[0]['Order ID']}</span>  -  Order Date: <span style="font-weight: normal;">${orders[0]['Order Date']}</span></h2></div>`

    orders.forEach(order => {
      html += `<div><h3 style="margin-bottom: 0;">Item: <span style="font-weight: normal;">${orders[0]['Item']}</span></h2></div>`
      html += `<div style="margin-left: 2%;"><b>School Name: </b>${order['School Name']}  -  <b>School Mascot: </b>${order['School Mascot']}</div>`
      html += `<div style="margin-left: 2%;"><b>Name 1: </b>${order['Name 1']}  -  <b>Name 2: </b>${order['Name 2']}</div>`
      html += `<div style="margin-left: 2%;"><b>Colors: </b>${order['Colors'].join(', ')}  -  <b>Activities: </b>${order['Activities'].join(', ')}</div>`
      html += `<div style="margin-left: 2%;"><b>Extras: </b>${order['Extras']}</div>`
      html += `<div style="margin-left: 2%;"><b>Trinkets: </b>${order['Trinkets']}</div>`
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
      if (error) return reject({ id: 'customer-email', error })
      resolve()
    })
  })
}

const orderEmail = async ({ orders }) => {
  return new Promise((resolve, reject) => {
    console.log('Sending order email')
    const { MG_API_KEY, MG_DOMAIN } = process.env
    const mailgun = Mailgun({ apiKey: MG_API_KEY, domain: MG_DOMAIN })

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
      html += `<div style="margin-left: 2%;"><b>Trinkets: </b>${order['Trinkets']}</div>`
    })
    html += `</div>`

    const message = {
      from: 'Boutique Mums <orders@boutiquemums.com>',
      to: 'orders@boutiquemums.com',
      subject: 'Order Received',
      text: 'Order Received',
      html,
    }

    mailgun.messages().send(message, error => {
      if (error) {
        console.log(error)
        return reject({ id: 'order-email', error })
      }
      resolve({ message: 'Email Sent' })
    });
  });
}

const saveOrder = async ({ orders }) => {
  return new Promise(async (resolve, reject) => {
    console.log('Saving order to airtable')
    const { AT_API_KEY, AT_BASE } = process.env
    const base = new Airtable({ apiKey: AT_API_KEY }).base(AT_BASE)
    const records = await Promise.all(orders.map(order => createRecord({ base, order }).catch(error => error)))
    
    resolve({ orders, records })
  });
};

const createRecord = ({ base, order }) => {
  return new Promise(async (resolve, reject) => {
    const date = order['Order Date'].split('-')
    const sheet = `${date[1]}/${date[0]}`
    console.log('Airtable Sheet', sheet)

    base(sheet).create(order, (error, record) => {
      if (error) return reject({ id: 'air-record', error })
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
  try {
    const data = JSON.parse(event.body)
    const run = await Promise.all([ saveOrder(data), orderEmail(data), appreciationEmail(data) ])
    console.log(JSON.stringify(run))

    callback(null, {
      statusCode: 200,
      body: JSON.stringify({ message: 'Order Confirmed' }),
    })
  }
  catch(error) {
    console.log(error)
    callback(null, {
      statusCode: 500,
      body: JSON.stringify(error),
    })
  }
}
