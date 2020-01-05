const StripeService = require('../services/StripeService');
const fs = require('fs');
let data = [];

const createStripeAccounts = async () => {
  try {
    let promise = await Array(51)
      .fill(null)
      .map(async (val, i) => {
        await sleep(1000 * i).then(async () => {
          await createAccount(i);
        });
      });
    await Promise.all(promise);

    const { userData, cardInfoData } = buildData();

    fs.writeFileSync('./userData.json', JSON.stringify({ userData }));

    fs.writeFileSync('./cardInfoData.json', JSON.stringify({ cardInfoData }));

    console.log('okk');
    process.kill(process.pid);
  } catch (error) {
    console.log('TCL: ann -> error', error);
    process.kill(process.pid);
  }
};

async function createAccount(i) {
  let email = i == 0 ? 'harisbeslic32@gmail.com' : `sema${i}@gmail.com`;

  const { id: customerId } = await StripeService.createCustomer(
    'Customer for atlant auction app',
    email
  );

  const { id: accountId } = await StripeService.createAccount(email);

  await sleep(500);

  data = [...data, { email, customerId, accountId }];
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function buildData() {
  const cardInfoData = data.map((val, i) => {
    return {
      name: null,
      number: null,
      cvc: null,
      exp_year: null,
      exp_month: null,
      cardId: null,
      cardFingerprint: null,
      accountId: data[i].accountId,
      customerId: data[i].customerId
    };
  });

  const userData = data.map((val, i) => {
    return {
      firstName: i == 0 ? 'Haris' : 'Semir',
      lastName: i == 0 ? 'Beslic' : 'lastname',
      email: data[i].email,
      photo: 'https://static.thenounproject.com/png/363633-200.png',
      password:
        i == 0
          ? '$2a$10$EvaQJZf.TU7POOzXv.n69.xbrtamfBQU5GAx/rfm86JftI6jlFk9m'
          : `$2a$10$9DXn5n4Q.0ZyYQm6uMWr0OVtKzagWH41PWAfWvgncMV3l/Q9QSGNu`,
      roleId: Math.floor(Math.random() * 2 + 1),
      optionalInfoId: i + 1,
      cardInfoId: i + 1,
      googleId: null,
      facebookId: null
    };
  });

  return { userData, cardInfoData };
}

createStripeAccounts();
