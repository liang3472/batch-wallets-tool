import Web3 from 'web3';
import chalk from 'chalk';
import Contract from 'web3-eth-contract';
import { HOST, ALCHEMY_AK, GAS_TRACKER_DELAY } from './setting.js';
import { convertReadAble, getExtraData } from './utils.js';

/**
 * 钱包助手
 */
class WalletHelper {
  web3;
  timer;
  constructor() {
    this.web3 = new Web3(`${HOST?.ALCHEMY_HOST}/v2/${ALCHEMY_AK}`);
  }

  /**
   * 获取多个钱包余额
   * @param {*} wallets 
   * @returns 
   */
  async getEachWalletBalance(wallets) {
    const task = [];
    (wallets || []).forEach(async ({ address, pk }) => task.push(new Promise((resolve, reject) => {
      this.web3.eth.getBalance(address)
        .then(res => resolve({ address, balance: res, pk }))
        .catch(err => reject(err));
    })));
    return Promise.all(task).then(res => res).catch(err => null);
  }

  /**
   * 设置等待的gas目标值
   * @param {*} target 
   * @returns 
   */
  async waitingForGas(target) {
    if (!target) {
      console.log(chalk.red('无效的目标 basefee'));
      return Promise.reject(null);
    }
    return new Promise((resolve, reject) => {
      this.watchBaseFee(target, (gas) => !!gas ? resolve(gas) : reject(null));
    });
  }

  /**
   * 检查当前gas情况
   * @param {*} target 目标值 单位:gwei
   * @param {*} callback 回调
   */
  async watchBaseFee(target, callback) {
    this.timer && clearTimeout(this.timer);
    const gas = await this.web3.eth.getGasPrice().
      then(res => res).
      catch(err => null);
    const current = Number(convertReadAble(gas, 'gwei'));

    if (current < 20) {
      console.log(chalk.green(current));
    } else if (current < 50) {
      console.log(chalk.yellow(current));
    } else {
      console.log(chalk.red(current));
    }

    if (gas && current && current <= target) {
      console.log(chalk.green(`当前basefee ${current} gwei`));
      callback(gas);
    } else {
      this.timer = setTimeout(() => this.watchBaseFee(target, callback), GAS_TRACKER_DELAY);
    }
  }

  /**
   * 转移eth
   * @param {*} wallet 
   * @param {*} to 
   * @param {*} gasPrice 
   * @returns 
   */
  async converge(wallet, to, gasPrice) {
    if (!wallet || !wallet.address) {
      console.log(chalk.red('无效的子钱包'));
      return;
    }
    if (!to) {
      console.log(chalk.red('无效的目标地址'));
      return;
    }
    if (wallet.address.toLowerCase() === to.toLowerCase()) {
      console.log(chalk.red('无效,自己转账给自己!'));
      return;
    }
    const value = wallet?.balance;
    const estimateGas = await this.web3.eth.estimateGas({
      from: wallet.address,
      to: to,
    });
    const fee = estimateGas * gasPrice;

    if (value <= fee) {
      console.log(chalk.red('钱包余额不足以支付gas!'));
      return;
    }
    const txObj = {
      from: wallet.address,
      gasPrice,
      gas: estimateGas,
      to,
      // 需要留点防止gas超，暂0.1%
      value: value - fee - fee * 0.001,
    };
    console.log(chalk.yellow('交易详情'));
    console.log(chalk.yellow(JSON.stringify(txObj)));
    this.signAndSendTransaction(txObj, wallet?.pk);
  }

  /**
   * 签名并发生交易
   * @param {*} tx 
   * @param {*} pk 
   * @returns 
   */
  async signAndSendTransaction(tx, pk) {
    if (!tx) {
      console.log(chalk.red('请检查交易详情'));
      return;
    }
    if (!pk) {
      console.log(chalk.red('请检查私钥是否正确'));
      return;
    }
    console.log(chalk.blue('sign...'));
    const signedTx = await this.web3.eth.accounts.signTransaction(tx, pk);
    console.log(chalk.blue(JSON.stringify(signedTx)));
    if (!signedTx?.rawTransaction) {
      console.log(chalk.red('签名异常!'));
      return;
    }
    console.log(chalk.green('发送交易中...'));
    this.web3.eth.sendSignedTransaction(signedTx.rawTransaction, (error, hash) => {
      if (!error) {
        console.log(chalk.green(`交易发送成功 ${hash}`));
      } else {
        console.log(chalk.red('发生异常'));
        console.log(error);
      }
    });
  }

  /**
   * 发送交易
   * @param {*} from 
   * @param {*} contract 
   * @param {*} data 
   * @param {*} value 
   */
  async sendInputData(from, contract, data, value) {
    console.log(chalk.green('正在同步当前gas...'));
    const estimateGas = await this.web3.eth.estimateGas({
      from: from?.address,
      data,
      to: contract,
      value: value,
    });
    const gasPrice = await this.web3.eth.getGasPrice();

    const txObj = {
      from: from?.address,
      data: this.web3.utils.toHex(data),
      to: contract,
      gasPrice,
      gas: estimateGas,
      value: value,
    };
    console.log(chalk.yellow('交易详情'));
    console.log(chalk.yellow(JSON.stringify(txObj)));
    this.signAndSendTransaction(txObj, from?.pk);
  }

  /**
   * 生成合约对象
   * @param {*} abi 
   * @param {*} contract 
   * @returns 
   */
  createContract(abi, contract) {
    if (!abi || !contract) {
      console.log(chalk.red('请检查合约参数'));
      return null;
    }
    return new Contract(abi, contract);
  }

  /**
   * 根据方法名调用合约方法
   * @param {*} funcName 
   * @param {*} params 
   * @param {*} contract 
   * @returns 
   */
  async getExtraDataByContract(funcName, params, contract) {
    if (!funcName) {
      console.log(chalk.red('请检查funcName是否正确'));
      return null;
    }
    if (!params) {
      console.log(chalk.red('请检查params是否正确'));
      return null;
    }
    if (!contract) {
      console.log(chalk.red('请检查contract是否正确'));
      return null;
    }
    return await getExtraData(funcName, params, contract).then(data => data).catch(error => {
      console.log('abi接口执行异常', error);
      return null;
    });
  }
}

export default new WalletHelper();