import axios from 'axios'
import { apollo, gql } from '../_lib/apollo'

const handler = async (req, res) => {
  const { amount, currency, intent } = req?.body?.input
  try {
    const params = new URLSearchParams()
    params.append('amount', amount)
    params.append('currency', currency)
    params.append('source', 'tok_visa')

    const responseStripe = await axios.post(
      'http://stripe-mock:12111/v1/charges',
      params,
      {
        headers: {
          Authorization: `Bearer sk_test_4eC39HqLyjWDarjtT1zdp7dc`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )

    // Prepare payment data for the Apollo mutation
    const paymentData = {
      user_id: req?.body?.session_variables['x-hasura-user-id'],
      amount: responseStripe?.data?.amount,
      currency: responseStripe?.data?.currency,
      intent: intent,
      status: responseStripe?.data?.status,
      method: responseStripe?.data?.payment_method,
      receipt_url: responseStripe?.data?.receipt_url,
      processor: 'Stripe', // at the future it could be variable for different processors
    }

    await apollo.mutate({
      mutation: gql`
        mutation insertPayment($object: payment_insert_input!) {
          insert_payment_one(object: $object) {
            id
            created_at
            amount
          }
        }
      `,
      variables: {
        object: paymentData,
      },
    })

    // Send the Stripe response data back to the client
    return res.json(responseStripe.data)
  } catch (error) {
    console.log(error)
    // Specific error messages based on the error type
    if (error.response && error.response.config.url.includes('stripe-mock')) {
      return res
        .status(500)
        .json({ error: 'Failed to process payment with Stripe' })
    } else if (error.networkError || error.graphQLErrors) {
      return res.status(500).json({ error: 'Failed to insert payment data' })
    } else {
      return res.status(500).json({ error: error.message })
    }
  }
}

export default handler
