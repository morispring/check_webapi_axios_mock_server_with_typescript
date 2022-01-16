/* eslint-disable */
import mockServer from 'axios-mock-server'
import mock0 from './orders/_orderId'
import mock1 from './orders'
import mock2 from './billings/_billingId'
import mock3 from './billings'

export default (client) => mockServer([
  {
    path: '/orders/_orderId',
    methods: mock0
  },
  {
    path: '/orders',
    methods: mock1
  },
  {
    path: '/billings/_billingId',
    methods: mock2
  },
  {
    path: '/billings',
    methods: mock3
  }
], client, '')
