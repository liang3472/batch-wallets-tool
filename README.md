# 多钱包管理脚本
## 安装
建议fork一份代码进行配置修改，需要填写自己的私钥，私钥不会上传
一定要小心保管自己的私钥，

**一定不要提交上来**，

**一定不要提交上来**，

**一定不要提交上来**，

否则后果自负

1、安装依赖
```
npm install
```

## 使用
### 1、检查钱包余额
```
npm run check
```

### 2、向子钱包分发eth (通过开源分发合约实现)
下方的`0.1`是向每个子钱包转的`0.1 eth`，改成其他值就是转其他数量的`eth`

合约地址：https://etherscan.io/address/0xd152f549545093347a162dce210e7293f1452150#code
```
npm run disperse 0.1
```

### 3、聚合子钱包eth到主钱包
下方的`12`是指定当`Base Fee`达到多少的时候执行，具体可以查看链上的Gas Tracker

Gas Tracker: https://etherscan.io/gastracker
```
npm run converge 12
```

## 配置说明
1、`wallets.js`文件 基本上只需要改这个文件的东西
```
export const WALLETS = [
  { address: '子钱包地址1', pk: '子钱包1私钥' },
  { address: '子钱包地址2', pk: '子钱包2私钥' },
];

export const MAIN_WALLET = {
  address: '主钱包地址',
  pk: '主钱包私钥'
};
```

2、src 下的 `setting.js` 文件

a、申请 `Alchemy Api Key`, 有的话直接填写

b、`ENV` 为了安全我改成了了测试环境 `test`, 这里如果要转真实主网请改成 `pro`

地址 https://dashboard.alchemyapi.io/
```
...
const ENV = 'test';
...
...
export const ALCHEMY_AK = '改成你的KEY';
...
```

c、配置完成，可以运行了

## 验证
以下为本人亲自验证工具有效性