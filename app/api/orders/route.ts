import { NextResponse } from 'next/server'

// This is a simple in-memory store. In a real application, you'd use a database.
let orders: any[] = []

export async function POST(request: Request) {
  const order = await request.json()
  order.id = Date.now() // Simple way to generate unique IDs
  order.status = 'pending'
  orders.push(order)
  return NextResponse.json({ message: "Order received", orderId: order.id })
}

export async function GET() {
  return NextResponse.json(orders)
}

// Helper function to find and update an order
export function updateOrder(id: number, status: string) {
  const order = orders.find(o => o.id === id)
  if (order) {
    order.status = status
    return true
  }
  return false
}

