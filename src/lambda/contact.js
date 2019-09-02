const Mailgun = require('mailgun-js')

const sendEmail = async ({ data, contact }) => {
  return new Promise((resolve, reject) => {
    console.log('Sending Contact Email To Admin')
    console.log(contact)
    // const { MG_API_KEY: apiKey, MG_DOMAIN: domain } = process.env;
    const mailgun = Mailgun({ apiKey: data.REACT_APP_MG_API_KEY, domain: data.REACT_APP_MG_DOMAIN })

    let html = `<div>
      <h1>Message Received</h1>
      <div><h2 style="margin: 0;">Name: <span style="font-weight: normal;">${contact.name}</span></h2></div>
      <div><h2 style="margin: 0;">Email: <span style="font-weight: normal;">${contact.email}</span></h2></div>
      <div style="margin: 0;">
        <h2 style="margin: 0;">Message: <span style="font-weight: normal; font-size: medium;">${contact.message}</span></h2>
      </div>`

      if (contact.cart) {
        html += `<h2 style="margin: 8px 0 0 0;">Cart:</h2>`
        Object.keys(contact.cart).forEach(id => {
          const item = contact.cart[id]
          const { product, category, school, names, colors, activities, extras } = item
          html += `<div><h3 style="margin: 0 4%;">Item: <span style="font-weight: normal;">${product} ${category.replace('s','')}</span></h2></div>`
          html += `<div style="margin-left: 6%;"><b>School Name: </b>${school.name}  -  <b>School Mascot: </b>${school.mascot}</div>`
          html += `<div style="margin-left: 6%;"><b>Name 1: </b>${names.first}  -  <b>Name 2: </b>${names.second || 'N/A'}</div>`
          html += `<div style="margin-left: 6%;"><b>Colors: </b>${Object.keys(colors).filter(c => colors[c]).map(c => colors[c]).join(', ')}  -  <b>Activities: </b>${Object.keys(activities).filter(a => activities[a]).map(a => activities[a]).join(', ')}</div>`
          html += `<div style="margin-left: 6%;"><b>Extras: </b>${Object.keys(extras).filter(e => extras[e] === true).join(', ')}</div>`
        })
      }
    html += `</div>`

    const message = {
      from: 'Boutique Mums <contact@boutiquemums.com>',
      to: 'alvelaisv@gmail.com',
      subject: 'Message Received',
      text: 'Message Received',
      html,
    }

    mailgun.messages().send(message, err => {
      if (err) return reject(err);
      resolve({ message: 'Email Sent' })
    })
  })
}

export async function handler(event, context, callback) {
  try {
    const data = JSON.parse(event.body)
    const contact = await sendEmail(data)

    callback(null, {
      statusCode: 200,
      body: JSON.stringify({ data: contact }),
    })
  }
  catch(e) {
    console.log(e)
    callback(null, callback(null, {
      statusCode: 500,
      body: JSON.stringify({ message: e.message }),
    }))
  }
}
