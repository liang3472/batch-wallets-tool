import Web3 from 'web3';

/**
 * 转换为可读
 * @param {*} num 
 * @param {*} unit 
 * @returns 
 */
export const convertReadAble = (num, unit = 'ether') => {
  return Number(Web3.utils.fromWei(String(num), unit)).toFixed(3).slice(0, -1);
}

/**
 * 调用指定的合约方法
 * @param {*} contract 
 * @returns 
 */
export const getExtraData = async (funcName = '', params = {}, contract) => {
  const extraData = await contract?.methods?.[funcName](...params);
  return extraData?.encodeABI();
}