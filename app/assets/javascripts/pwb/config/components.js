  Vue.component('about-page', {
    template: '#about-page',
    data: function() {
      return {
        dialog: false,

      }
    }
  })

  Vue.component('simple-form', {
    template: '#simple-form',
    data: function() {
      return {
        props: null,
        rightDrawer: false,
        right: true,
        search: '',
        errText: 'ttt',
        pagination: {},
        snackbar: false,
        headers: [{
            text: 'First Name',
            left: true,
            sortable: false,
            value: 'firstName'
          },
          { text: 'Last Name', value: 'lastName' },
          { text: 'Email', value: 'email' },
          { text: 'Age', value: 'age' },
          { text: 'Order Record', value: 'orderRecord' },
          { text: 'Active', value: 'isActive' },
          { text: '', value: '' }
        ],
        items: [{
            "isActive": false,
            "age": 21,
            "id": 2,
            "firstName": "Larsen",
            "lastName": "Shaw",
            "email": "abc@test.com",
            "avatar": "/assets/img/avatar3.png",
            "orders": [{
                "id": 2,
                "reference": "order-2-2-1-2",
                "customerId": 2,
                "products": [{
                    "id": 1,
                    "productName": "Product HHYDP",
                    "categoryId": 1,
                    "unitInStock": null,
                    "unitPrice": 18
                  },
                  {
                    "id": 2,
                    "productName": "Product RECZE",
                    "categoryId": 1,
                    "unitInStock": null,
                    "unitPrice": 19
                  }
                ],
                "amount": 9.99,
                "orderDate": "2017-01-01",
                "shippedDate": "2017-01-01",
                "shipAddress": {
                  "address": "Gran Vía, 0123",
                  "city": "Madrid",
                  "zipcode": "10298",
                  "country": "Spain"
                }
              },
              {
                "id": 12,
                "reference": "order-2-12-1-2",
                "customerId": 2,
                "products": [{
                  "id": 5,
                  "productName": "Product EPEIM",
                  "categoryId": 2,
                  "unitInStock": null,
                  "unitPrice": 21.5
                }],
                "amount": 49.99,
                "orderDate": "2017-01-01",
                "shippedDate": "2017-01-01",
                "shipAddress": {
                  "address": "Gran Vía, 0123",
                  "city": "Madrid",
                  "zipcode": "10298",
                  "country": "Spain"
                }
              }
            ]
          }

        ],
        searchVm: {
          contains: {
            firstName: '',
            lastName: ''
          },
          between: {
            age: { former: 0, latter: 0 }
          }
        }
      }
    },
    methods: {
      print() {
        window.print()
      },
      edit(item) {
        this.$router.push({ name: 'Customer', params: { id: item.id } })
      },
      add() {
        this.$router.push('NewCustomer')
      },
      remove(item) {

        this.$parent.openDialog('Do you want to delete this item?', '', () => {
          this.api.deleteData('customers/' + item.id.toString()).then((res) => {
            this.getCustomers()
          }, (err) => {
            console.log(err)
            this.snackbar = true
            this.errText = 'Status has not be deleted successfully. Please try again.'
          })
        })
      },
      changeStatus(item) {
        item.isActive = !item.isActive
        this.api.putData('customers/' + item.id.toString(), item).then((res) => {
          // this.$router.push('Customers')
        }, (err) => {
          console.log(err)
          this.snackbar = true
          this.errText = 'Status has not be updated successfully. Please try again.'
          item.isActive = !item.isActive
        })
      },
      searchCustomers() {
        this.rightDrawer = !this.rightDrawer
        this.appUtil.buildSearchFilters(this.searchVm)
        let query = this.appUtil.buildJsonServerQuery(this.searchVm)

        this.api.getData('customers?' + query).then((res) => {

          this.items = res.data
          this.items.forEach((item) => {
            if (item.orders && item.orders.length) {
              item.orderRecord = item.orders.length
            } else {
              item.orderRecord = 0
            }
          })
        }, (err) => {
          console.log(err)
        })
      },
      clearSearchFilters() {

        this.rightDrawer = !this.rightDrawer
        this.appUtil.clearSearchFilters(this.searchVm)

        this.api.getData('customers').then((res) => {
          this.items = res.data
          this.items.forEach((item) => {
            if (item.orders && item.orders.length) {
              item.orderRecord = item.orders.length
            } else {
              item.orderRecord = 0
            }
          })
          console.log(this.items)
        }, (err) => {
          console.log(err)
        })
      },
      getCustomers() {
        // this.api.getData('customers?_embed=orders').then((res) => {
        //   this.items = res.data
        //   this.items.forEach((item) => {
        //     // item.avatar = '/assets/' + item.avatar
        //     if (item.orders && item.orders.length) {
        //       item.orderRecord = item.orders.length
        //     } else {
        //       item.orderRecord = 0
        //     }
        //   })
        // }, (err) => {
        //   console.log(err)
        // })
      }
    },
    computed: {},
    mounted: function() {
      this.getCustomers()
    }


  })
