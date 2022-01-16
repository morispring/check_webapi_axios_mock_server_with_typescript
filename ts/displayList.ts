import axios from 'axios'
import mock from '../mocks/$mock'

interface OrderResponse {
  id: string,
  serviceId: string,
  status: string
}

interface BillingResponse {
  id: string,
  orderId: string,
  amount: number
}

// デバッグ用

const baseUrl = axios.create({baseURL: 'https://api.uber.jp'})
mock(baseUrl)

const displayPlaceOrder = async (serviceId: string, amount: number): Promise<OrderResponse> =>  {
  try {
    const orderPostResponse = await baseUrl.post<OrderResponse>('/orders', { 'serviceId': serviceId })
    const billingPostResponse = await baseUrl.post<BillingResponse>('/billings', {'orderId':orderPostResponse.data['id'],'amount': amount})
    const orderPatch = await baseUrl.patch<OrderResponse>(`/orders/${orderPostResponse.data['id']}`, { 'status': 'PROCESSED' })
    placeDisplayLists(orderPostResponse, billingPostResponse, orderPatch)
    return orderPostResponse.data
  } catch (e) {
    if (axios.isAxiosError(e) && e.response && e.response.status === 400) {
      throw new Error('BAD_REQUEST')
    } else if (axios.isAxiosError(e) && e.response && e.response.status ===  500) {
      throw new Error('INTERNAL_SERVER_ERROR')
    }
  }
}

const displayChangeBillingAmount = async (billingId: string, amount: number): Promise<BillingResponse> => {
  try {
    const billingGet = await baseUrl.get<BillingResponse>(`/billings/${billingId}`)
    const orderGet = await baseUrl.get<OrderResponse>(`/orders/${billingGet.data['orderId']}`)
    const billingPatch = await baseUrl.patch<BillingResponse>(`/billings/${billingGet.data['id']}`, { 'amount': amount })
    changeBillingAmountDisplayLists(billingGet, orderGet, billingPatch)
    return billingPatch.data
  } catch (e) {
    if (axios.isAxiosError(e) && e.response && e.response.status === 400) {
      throw new Error('BAD_REQUEST')
    } else if (axios.isAxiosError(e) && e.response && e.response.status ===  500) {
      throw new Error('INTERNAL_SERVER_ERROR')
    }
  }
}

const displayCancelOrder = async (orderId: string, billingId: string) => {
  try {
    const orderDelete = await baseUrl.delete(`/orders/${orderId}`)
    const billingDelete = await baseUrl.delete(`/billings/${billingId}`)
    cancelOrderDisplayLists(orderDelete, billingDelete)
  } catch (e) {
    if (axios.isAxiosError(e) && e.response && e.response.status === 400) {
      throw new Error('BAD_REQUEST')
    } else if (axios.isAxiosError(e) && e.response && e.response.status ===  500) {
      throw new Error('INTERNAL_SERVER_ERROR')
    }
  } 
}

displayPlaceOrder('5XGNMiCS56', 1580)
displayChangeBillingAmount('auB7hhfm6U', 799)
displayCancelOrder('ihSWb8O6A5', 'BdIr5itTvL')

const placeDisplayLists = (orderPostResponse, billingPostResponse, orderPatch): void => {
  document.getElementById('placeOrder').insertAdjacentHTML('beforeend', `<div class='http_method'>Order.post</div><br><div class='result'><pre>${JSON.stringify(orderPostResponse.data, null , '\t')}</pre></div>`)
  document.getElementById('placeOrder').insertAdjacentHTML('beforeend', `<div class='http_method'>Billing.post</div><br><div class='result'><pre>${JSON.stringify(billingPostResponse.data, null , '\t')}</pre></div>`)
  document.getElementById('placeOrder').insertAdjacentHTML('beforeend', `<div class='http_method'>Order.patch</div><br><div class='result'><pre>${JSON.stringify(orderPatch.data, null , '\t')}</pre></div>`)
} 
const changeBillingAmountDisplayLists = (billingGet, orderGet, billingPatch): void => {
  document.getElementById('changeBillingAmount').insertAdjacentHTML('beforeend', `<div class='http_method'>Billing.get</div><div class='result'><pre>${JSON.stringify(billingGet.data, null , '\t')}</pre></div>`)
  document.getElementById('changeBillingAmount').insertAdjacentHTML('beforeend', `<div class='http_method'>Order.get</div><br><div class='result'><pre>${JSON.stringify(orderGet.data, null , '\t')}</pre></div>`)
  document.getElementById('changeBillingAmount').insertAdjacentHTML('beforeend', `<div class='http_method'>Billing.patch</div><div class='result'><pre>STATES_CODE: ${JSON.stringify(billingPatch.data, null , '\t')}</pre></div>`)
}
const cancelOrderDisplayLists = (orderDelete, billingDelete): void => {
  document.getElementById('cancelOrder').insertAdjacentHTML('beforeend', `<div class='http_method'>Order.delete</div><div class='result'><pre>STATES_CODE: ${JSON.stringify(orderDelete['status'], null , '\t')}</pre></div>`)
  document.getElementById('cancelOrder').insertAdjacentHTML('beforeend', `<div class='http_method'>Billing.delete</div><div class='result'><pre>STATES_CODE: ${JSON.stringify(billingDelete['status'], null , '\t')}</pre></div>`)
}