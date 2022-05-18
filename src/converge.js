/**
 * 将各个钱包资金聚合到主钱包中
 */
import chalk from 'chalk';
import walletHelper from './walletHelper.js';
import { WALLETS, MAIN_WALLET } from '../wallets.js';
import { convertReadAble } from './utils.js';

const args = process.argv.slice(2);
const baseFee = Number(args?.[0]);

const run = async () => {
  console.log(chalk.yellow('检查各钱包余额'));
  const wallets = await walletHelper.getEachWalletBalance(WALLETS);
  let validWallets = [];
  if (wallets && wallets.length) {
    wallets.forEach(({ address, balance }) => {
      console.log(chalk.green(`${address} bal:${convertReadAble(balance)} ETH`));
    });
    console.log(chalk.yellow('过滤出余额钱包'));
    validWallets = wallets.filter(({ balance }) => balance > 0);

    if (validWallets && validWallets.length) {
      validWallets.forEach(async ({ address, balance }) => {
        console.log(chalk.green(`${address} bal:${convertReadAble(balance)} ETH`));
      });
    } else {
      console.log(chalk.red('钱包无余额!'));
      return;
    }
  } else {
    console.log(chalk.red('检查余额异常!', wallets));
    return;
  }

  console.log(chalk.yellow('开始检查gas'));
  const gasPrice = await walletHelper.waitingForGas(baseFee);
  if (gasPrice && validWallets.length) {
    console.log(chalk.green('到达指定gas, 开始执行转账流程...'));
    validWallets.forEach(wallet =>
      walletHelper.converge(wallet, MAIN_WALLET?.address, gasPrice));
  } else {
    console.log(chalk.yellow('检查gas异常'));
  }
};

if (isNaN(baseFee) && !baseFee) {
  console.log(chalk.red('不是有效的 basefee'));
} else {
  console.log(chalk.green('启动聚合脚本'));
  run();
}
