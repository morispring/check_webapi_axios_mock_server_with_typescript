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

const baseUrl = axios.create({baseURL: 'https://api.uber.jp'})
mock(baseUrl)

const placeOrder = async (serviceId: string, amount: number): Promise<OrderResponse> =>  {
  try {
    const orderPostResponse = await baseUrl.post<OrderResponse>('/orders', { 'serviceId': serviceId })
    await baseUrl.post<BillingResponse>('/billings', {'orderId':orderPostResponse.data['id'],'amount': amount})
    const orderPatchResponse = await baseUrl.patch<OrderResponse>(`/orders/${orderPostResponse.data['id']}`, { 'status': 'PROCESSED' })
    return orderPatchResponse.data
  } catch (e) {
    if (axios.isAxiosError(e) && e.response && e.response.status === 400) {
      throw new Error('BAD_REQUEST')
    } else if (axios.isAxiosError(e) && e.response && e.response.status ===  500) {
      throw new Error('INTERNAL_SERVER_ERROR')
    }
  }
}

const changeBillingAmount = async (billingId: string, amount: number): Promise<BillingResponse> => {
  try {
    const billingGet = await baseUrl.get<BillingResponse>(`/billings/${billingId}`)
    await baseUrl.get<OrderResponse>(`/orders/${billingGet.data['orderId']}`)
    const billingPatch = await baseUrl.patch<BillingResponse>(`/billings/${billingGet.data['id']}`, { 'amount': amount })
    return billingPatch.data
  } catch (e) {
    if (axios.isAxiosError(e) && e.response && e.response.status === 400) {
      throw new Error('BAD_REQUEST')
    } else if (axios.isAxiosError(e) && e.response && e.response.status ===  500) {
      throw new Error('INTERNAL_SERVER_ERROR')
    }
  } 
}

const cancelOrder = async (orderId: string, billingId: string) => {
  try {
    await baseUrl.delete(`/orders/${orderId}`)
    await baseUrl.delete(`/billings/${billingId}`)
  } catch (e) {
    if (axios.isAxiosError(e) && e.response && e.response.status === 400) {
      throw new Error('BAD_REQUEST')
    } else if (axios.isAxiosError(e) && e.response && e.response.status ===  500) {
      throw new Error('INTERNAL_SERVER_ERROR')
    }
  } 
}
placeOrder('5XGNMiCS56', 1580)
changeBillingAmount('auB7hhfm6U', 799)
cancelOrder('ihSWb8O6A5', 'BdIr5itTvL')