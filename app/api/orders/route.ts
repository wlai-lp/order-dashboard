import { NextResponse } from 'next/server'
import { Order } from '../../types/Order'
import { type NextRequest } from 'next/server'

// This is a simple in-memory store. In a real application, you'd use a database.
const orders: Order[] = []

export async function POST(request: Request) {
  const order = await request.json()
  console.log(JSON.stringify(order))
  order.id = Date.now() // Simple way to generate unique IDs
  order.status = 'pending'
  orders.push(order)
  return NextResponse.json({ message: "Order received", orderId: order.id })
}

export async function GET() {
  return NextResponse.json(orders)
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')
  console.log(query)
  // query = all means delete all
  if (query === 'all') {
    orders.length = 0
    console.log("delete all")

    return NextResponse.json({ message: "All orders deleted" })
  }
  
  // query = specific order id means delete one
  // const orderId = parseInt(query)
  // const index = orders.findIndex(o => o.id === orderId)
  // if (index!== -1) {
  //   orders.splice(index, 1)
  //   return NextResponse.json({ message: "Order deleted" })
  // } else {
  //   return NextResponse.status(404).json({ message: "Order not found" })
  // }
 

  
  const req = await request.json()
  console.log(JSON.stringify(req))
  // const orderId = parseInt(request.query.id as string)
  // const index = orders.findIndex(o => o.id === orderId)
  // if (index !== -1) {
  //   orders.splice(index, 1)
    return NextResponse.json({ message: "Order deleted" })
  // } else {
  //   return NextResponse.status(404).json({ message: "Order not found" })
  // }
}

// // Helper function to find and update an order
// export function updateOrder(id: number, status: string) {
//   const order = orders.find(o => o.id === id)
//   if (order) {
//     order.status = status
//     return true
//   }
//   return false
// }

