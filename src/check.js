/**
 * 检查各个钱包余额
 */
import chalk from 'chalk';
import { convertReadAble } from './utils.js';
import { WALLETS } from '../wallets.js';
import walletHelper from './walletHelper.js';

const run = async () => {
  console.log(chalk.yellow('开始检查钱包余额...'));
  const data = await walletHelper.getEachWalletBalance(WALLETS);
  if(data && data.length){
    data.forEach(({ address, balance }) => {
      console.log(chalk.green(`${address} bal:${convertReadAble(balance)} ETH`));
    });
    console.log(chalk.yellow('检查完毕!'));
  } else {
    console.log(chalk.red('检查余额异常!', data));
  }
};

run();