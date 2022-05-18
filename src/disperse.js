/**
 * 通过合约向子钱包打钱
 */
import abi from './abi.js';
import Web3 from 'web3';
import walletHelper from './walletHelper.js';
import chalk from 'chalk';
import { WALLETS, MAIN_WALLET } from '../wallets.js';
import { convertReadAble } from './utils.js';
import { DISPERSE_CONTRACT } from './setting.js';

const FUNC_NAME = 'disperseEther';
const contract = walletHelper.createContract(abi, DISPERSE_CONTRACT);

const args = process.argv.slice(2);
// 输入price, 单位ether
const price = Number(args?.[0]);

const buildParams = (price) => {
  const params = [];
  params.push(WALLETS.map(wallet => wallet?.address));
  params.push(Array(WALLETS.length).fill(Web3.utils.toWei(String(price), 'ether')));
  return params;
}

const run = async () => {
  console.log(chalk.yellow('检查主钱包余额'));
  const data = await walletHelper.getEachWalletBalance([MAIN_WALLET]);
  if (data && data.length) {
    const wallet = data[0];
    const { balance } = wallet;
    const total = WALLETS.length * Web3.utils.toWei(String(price), 'ether');
    if (balance < total) {
      console.log(chalk.red(`余额不足以分发! 需要 ${convertReadAble(total)} eth, 但只有 ${convertReadAble(balance)} eth`));
    } else {
      console.log(chalk.yellow(`开始执行合约分发函数 ${FUNC_NAME}`));
      const params = buildParams(price);
      console.log(chalk.green('数据打包前'));
      console.log(chalk.yellow(JSON.stringify(params)));
      const data = await walletHelper.getExtraDataByContract(FUNC_NAME, params, contract);
      console.log(chalk.green('数据打包后'));
      console.log(chalk.blue(JSON.stringify(data)));
      walletHelper.sendInputData(wallet, DISPERSE_CONTRACT, data, total);
    }
  }
};

if (isNaN(price) && !price) {
  console.log(chalk.red('不是有效的 price'));
} else {
  console.log(chalk.green('启动分发脚本'));
  run();
}
