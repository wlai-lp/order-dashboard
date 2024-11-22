'use client'

import { useState, useEffect } from 'react'
import { completeOrder } from '../actions/completeOrder'

interface Order {
  id: number
  status: string
  // Add other relevant fields
}

export function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch('/api/orders')
      const data = await response.json()
      setOrders(data)
    }

    fetchOrders()
    // Set up polling to check for new orders every 5 seconds
    const intervalId = setInterval(fetchOrders, 5000)

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  const handleCompleteOrder = async (orderId: number) => {
    try {
      const result = await completeOrder(orderId)
      if (result.success) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: 'completed' } : order
        ))
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      alert(`Failed to complete order: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order Dashboard</h1>
      <div className="grid gap-4">
        {orders.map(order => (
          <div key={order.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">Order #{order.id}</h2>
            <p className="mb-2">Status: {order.status}</p>
            {order.status === 'pending' && (
              <button
                onClick={() => handleCompleteOrder(order.id)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Complete Order
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

