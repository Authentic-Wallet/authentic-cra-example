require('dotenv').config();

const express = require('express')
const axios = require('axios')

const app = express()
const port = 8000

class AuthenticError extends Error {
  constructor(message) {
    super(message)
    this.name = 'AuthenticError'
  }
}

const authenticClient = axios.create({
  baseURL: process.env.AUTHENTIC_WALLET_API_URI,
  headers: { 'Authorization': `Token ${process.env.AUTHENTIC_WALLET_API_TOKEN}` }
});

async function authentic_createReceipt() {
  const receipt_response = await authenticClient.post('/api/receipts/', {
    body: defaultReceipt,
    headers: { 'Content-Type': 'application/json' }
  })

  return receipt_response.data.receipt_id
}

async function authentic_createSession(receipt_id, email) {
  const session_response = await authenticClient.post('/rpc/session.create/', {
    body: {
      method: "smart_receipt.mint", // we ony support smart_receipt.mint method rightnow
      receipt_id: receipt_id,
      email: email
    },
    headers: { 'Content-Type': 'application/json' }
  })

  const session_data = session_response.data

  if (!session_data.success) {
    throw new AuthenticError(session_data)
  }

  return session_data.data.session_token
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/i-want-nft', async (req, res) => {
  const { customer_email } = req.body
  try {

    const receipt_id = await authentic_createReceipt()
    const session = await authentic_createSession(receipt_id, customer_email)

    return res.redirect(`${process.env.AUTHENTIC_WALLET_API}/rpc/session.execute/?session_token=${session}`)
  } catch (error) {

    // NOTE: the error comes with the session_token. So in theory you could just redirect to execution
    return res.status(500).send(error)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const defaultReceipt = {
  "assets": [
    {
      "source": "https://assets-delivery.s3.amazonaws.com/api-docs/sequence_receipt-creationv2--cleaner.png",
      "type": "showcase",
      "private": "true",
      "name": "PreviewShowcase"
    },
    {
      "source": "https://assets-delivery.s3.amazonaws.com/api-docs/sequence_receipt-creationv2--cleaner.png",
      "type": "document",
      "private": "true",
      "name": "PreviewDocument"
    },
  ],
  "custom_schema": {
    "name": "Preview NFT",
    "gem_specs": {
      "carat": "2.3",
      "color": "F",
      "clarity": "VS2",
      "shape": "Oval"
    },
    "ring_specification": "This is a cute ring. Is made of gold and rare-ores.",
    "gia_report_number": "1231231231"
  }
}
