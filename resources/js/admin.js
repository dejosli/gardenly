// external imports
import axios from 'axios';
import moment from 'moment';

// write custom functions
function renderItems(items) {
  let parsedItems = Object.values(items);
  return parsedItems
    .map((menuItem) => {
      return `
                <p>${menuItem.item.name} - ${menuItem.qty} pcs </p>
            `;
    })
    .join('');
}

function generateMarkup(orders) {
  return orders
    .map((order) => {
      return `
                <tr>
                <td class="border px-4 py-2 text-green-900">
                    <p class="link-dark">${order._id}</p>
                    <div>${renderItems(order.items)}</div>
                </td>
                <td class="border px-4 py-2">${order.customerId.username}</td>
                <td class="border px-4 py-2">${order.address}</td>
                <td class="border px-4 py-2">
                    <div class="inline-block relative w-64">
                        <form action="/admin/order/status" method="POST">
                            <input type="hidden" name="orderId" value="${
                              order._id
                            }">
                            <select name="status" onchange="this.form.submit()"
                                class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                <option value="order_placed"
                                    ${
                                      order.status === 'order_placed'
                                        ? 'selected'
                                        : ''
                                    }>
                                    Placed</option>
                                <option value="confirmed" ${
                                  order.status === 'confirmed' ? 'selected' : ''
                                }>
                                    Confirmed</option>
                                <option value="prepared" ${
                                  order.status === 'prepared' ? 'selected' : ''
                                }>
                                    Prepared</option>
                                <option value="delivered" ${
                                  order.status === 'delivered' ? 'selected' : ''
                                }>
                                    Delivered
                                </option>
                                <option value="completed" ${
                                  order.status === 'completed' ? 'selected' : ''
                                }>
                                    Completed
                                </option>
                            </select>
                        </form>
                    </div>
                </td>
                <td class="border px-4 py-2">
                    ${moment(order.createdAt).format('lll')}
                </td>
                <td class="border px-4 py-2">
                    ${order.paymentStatus ? 'paid' : 'Not paid'}
                </td>
            </tr>
        `;
    })
    .join('');
}

// exports
export default function () {
  const orderTableBody = document.querySelector('#orderTableBody');
  if (orderTableBody) {
    let orders = [];
    // fetch all orders
    axios
      .get('/admin/orders')
      .then((res) => {
        orders = res.data;
        orderTableBody.innerHTML = generateMarkup(orders);
      })
      .catch((err) => {
        console.log(err);
      });

    // Socket
    //   socket.on('orderPlaced', (order) => {
    //     new Noty({
    //       type: 'success',
    //       timeout: 1000,
    //       text: 'New order!',
    //       progressBar: false,
    //     }).show();
    //     orders.unshift(order);
    //     orderTableBody.innerHTML = '';
    //     orderTableBody.innerHTML = generateMarkup(orders);
    //   });
  }
}
