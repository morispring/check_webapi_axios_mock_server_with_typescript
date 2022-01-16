export default {
  post({ data }) {
    const orders = ({
      id: "ia2goJ3IbQ",
      serviceId: data['serviceId'],
      status: "CREATED"
    })
    return [201, orders, data]
  }
}