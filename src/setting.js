
const ENV = 'test';
const currENV = ENV || 'test';

// 链上分发合约，测试和真实主网都是一个
export const DISPERSE_CONTRACT = '0xD152f549545093347A162Dce210e7293f1452150';

const ALCHEMY_ENV = {
  pro: 'wss://eth-mainnet.alchemyapi.io',
  test: 'wss://eth-rinkeby.ws.alchemyapi.io'
}
export const ALCHEMY_AK = '改成你的KEY';
export const HOST = {
  ALCHEMY_HOST: ALCHEMY_ENV[currENV],
}

// 每5s检查一次gas
export const GAS_TRACKER_DELAY = 5 * 1000; 