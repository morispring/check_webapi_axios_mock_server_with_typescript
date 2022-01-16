const billings = [
  {
    "id": "auB7hhfm6U",
    "orderId": "5XGNMiCS56",
    "amount": 10000
  },
  {
    "id": "BdIr5itTvL",
    "orderId": "ihSWb8O6A5",
    "amount": 4000
  },
  {
    "id": "HDU6X0cMeJ",
    "orderId": "XTHteCcaLe",
    "amount": 2400
  }
]

export default {
  get({ values }) {
    return [200, billings.find(billing => billing.id === values.billingId)]
  },
  patch({ values, data }) {
    let billingData = billings.find(billing => billing.id === values.billingId)
    billingData['amount'] = data.amount
    return [204, billingData]
  },
  delete({ values }) {
    billings.filter(billing => billing.id === values.billingId)
    return [204]
  }
}