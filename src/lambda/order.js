const Airtable = require('airtable')
const Mailgun = require('mailgun-js')

// Mail Stuff
const appreciationEmail = async ({ data, orders }) => {
  return new Promise((resolve, reject) => {
    console.log('Sending the email')
    // const { MG_API_KEY: apiKey, MG_DOMAIN: domain } = process.env;
    // const mailgun = Mailgun.client({ username: 'api', key: data.REACT_APP_MG_APIKEY })
    const mailgun = Mailgun({ apiKey: data.REACT_APP_MG_API_KEY, domain: data.REACT_APP_MG_DOMAIN })
    
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
      to: 'alvelaisv@gmail.com', // orders[0]['Customer Email']
      subject: 'Order Confirmation',
      text: 'Order Confirmation',
      html,
    }

    mailgun.messages().send(message, (error, body) => {
      console.log(error)
      console.log(body)
      if (error) return reject(error)
      resolve()
    })
  })
}

const orderEmail = async ({ data, orders }) => {
  return new Promise((resolve, reject) => {
    console.log('Sending the email')
    console.log('ORDERS: ', orders)
    // const { MG_API_KEY: apiKey, MG_DOMAIN: domain } = process.env;
    const mailgun = Mailgun({ apiKey: data.REACT_APP_MG_API_KEY, domain: data.REACT_APP_MG_DOMAIN })

    let html = `<div>
      <h1>Order Received</h1>
      <div><h2 style="margin: 0;">Customer Name: <span style="font-weight: normal;">${orders[0]['Customer Name']}</span></h2></div>
      <div><h2 style="margin: 0;">Customer Email: <span style="font-weight: normal;">${orders[0]['Customer Email']}</span></h2></div>
      <div><h2 style="margin: 0;">Customer Address: <span style="font-weight: normal;">${orders[0]['Customer Address']}</span></h2></div>
      <div><h2 style="margin: 0;">Order ID: <span style="font-weight: normal;">${orders[0]['Order ID']}</span>  -  Order Date: <span style="font-weight: normal;">${orders[0]['Order Date']}</span></h2></div>`

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
      to: 'alvelaisv@gmail.com',
      subject: 'Order Received',
      text: 'Order Received',
      html,
    }

    mailgun.messages().send(message, err => {
      console.log('ERR: ', err)
      if (err) return reject(err);
      resolve()
    });
  });
}

// Save Order Information
const saveOrder = async ({ data, orders }) => {
  console.log(orders)
  return new Promise(async (resolve, reject) => {
    // const { REACT_APP_AT_API_KEY, REACT_APP_AT_BASE, AT_TABLE } = process.env;
    const base = new Airtable({ apiKey: data.REACT_APP_AT_API_KEY }).base(data.REACT_APP_AT_BASE); // Change to env method for production
    const records = await Promise.all(orders.map(order => createRecord({ base, order }).catch(error => error)))
    console.log(records)
    
    resolve({ orders, records })
  });
};

const createRecord = ({ base, order }) => {
  return new Promise(async (resolve, reject) => {
    const date = order['Order Date'].split('-')
    const sheet = `${date[1]}/${date[0]}`
    console.log('SHEET: ', sheet)

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
  const data = JSON.parse(event.body)

  const message = await saveOrder(data)
  const errors = errorCheck(message.records)
  
  const sendOrder = await orderEmail(data)
  const sendAppreciation = await appreciationEmail(data)

  const response = { statusCode: 200, data: {}, error: null }
  if (errors) {
    response.statusCode = errors.statusCode
    response.error = { type: 'AirTable Error', ...errors }
  }
  else response.data = message

  callback(null, {
    statusCode: response.statusCode,
    body: JSON.stringify({ response }),
  })
}
