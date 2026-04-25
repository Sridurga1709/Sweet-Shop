export const USERS = {
  oneOrder: {
    email: 'oneorder@sweetshop.local',
    password: 'qwerty',
    expectedOrders: 1,
  },
  twoOrders: {
    email: 'twoorders@sweetshop.local',
    password: 'qwerty',
    expectedOrders: 2,
  },
  fiveOrders: {
    email: 'fiveorders@sweetshop.local',
    password: 'qwerty',
    expectedOrders: 5,
  },
  invalidPassword: {
    email: 'oneorder@sweetshop.local',
    password: 'wrongpass',
  },
};

export const CHECKOUT_DATA = {
  valid: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'test@test.com',
    address: '1 Test Street',
    city: 'Bristol',
    zip: 'BS1 1AA',
    cardName: 'John Doe',
    cardNumber: '4111111111111111',
    expiration: '12/26',
    cvv: '123',
  },
  invalidCard: {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@test.com',
    address: '2 Test Road',
    city: 'Cardiff',
    zip: 'CF1 2BB',
    cardName: 'Jane Smith',
    cardNumber: '1234',
    expiration: '13/26',
    cvv: 'AB',
  },
};
