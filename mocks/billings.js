export default {
  post({ data }) {
    const billings = ({
      id: "ia2goJ3IbQ",
      orderId: data['orderId'],
      amount: data['amount']
    })
    return [201, billings, data]
  }
}