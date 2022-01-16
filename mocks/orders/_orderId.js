const orders = [
  {
    "id": "5XGNMiCS56",
    "serviceId": "0x3SUBYOax",
    "status": "PROCESSED"
  },
  {
    "id": "ihSWb8O6A5",
    "serviceId": "PAHp7KKnXi",
    "status": "PROCESSED"
  },
  {
    "id": "ia2goJ3IbQ",
    "serviceId": "5XGNMiCS56",
    "status": "CREATED"
  }
]

export default {
  get({ values }) {
    return [200, orders.find(order => order.id === values.orderId)]
    // return [400, values]
  },
  patch({ values, data }) {
    let orderData = orders.find(order => order.id === values.orderId)
    orderData['status'] = data['status']
    return [204, orderData]
    // return [400]
  },
  delete({ values }) {
    orders.filter(order => order.id === values.orderId)
    return [204]
  }
}