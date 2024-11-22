'use server'

import { updateOrder } from "../api/orders/route"

// import { updateOrder } from '../api/orders/route';

// import { updateOrder } from '../api/orders/route';

async function getAccessToken() {
  const clientId = process.env.AUTH_CLIENT_ID
  const clientSecret = process.env.AUTH_CLIENT_SECRET
  const authEndpoint = process.env.AUTH_ENDPOINT

  if (!clientId || !clientSecret || !authEndpoint) {
    throw new Error('Authentication credentials are not properly configured')
  }

  const response = await fetch(authEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to retrieve access token')
  }

  const data = await response.json()
  return data.access_token
}

export async function completeOrder(orderId: number) {
  try {
    const accessToken = await getAccessToken()
    const orderCompletionEndpoint = process.env.ORDER_COMPLETION_ENDPOINT

    if (!orderCompletionEndpoint) {
      throw new Error('Order completion endpoint is not configured')
    }

    const response = await fetch(orderCompletionEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ orderId }),
    })

    if (!response.ok) {
      throw new Error('Failed to complete order on external system')
    }

    const updated = updateOrder(orderId, 'completed')
    if (updated) {
      return { success: true, message: 'Order completed successfully' }
    } else {
      return { success: false, message: 'Failed to update order status locally' }
    }
  } catch (error) {
    console.error('Error completing order:', error)
    return { success: false, message: 'An error occurred while completing the order' }
  }
}

