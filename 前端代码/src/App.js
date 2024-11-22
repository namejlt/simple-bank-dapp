import './App.css';
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Web3 from 'web3';
import ABI from './ABI.json';

function App() {

  const [address, setAddress] = useState('');
  const [bankConnect, setBankConnect] = useState(null);
  const [myDeposit, setMyDeposit] = useState(0);

  // 连接钱包
  const connectWallet = async () => {
    // 1. 获取钱包账户
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => {
          setAddress(accounts[0]);
          console.log('Connected accounts:', accounts);
        })
        .catch(error => {
          if (error.code === 4001) {
            console.error('User rejected the request.');
            alert('User rejected the request.')
          } else {
            console.error('Error requesting accounts:', error);
            alert('Error requesting accounts:', error)
          }
        });
    } else {
      console.error('MetaMask is not installed');
      alert('MetaMask is not installed')
      return
    }

    // 2. 连接web3
    const web3 = new Web3(window.web3.currentProvider);

    // 3. 获取智能合约 ABI + 地址
    const bankConnectT = new web3.eth.Contract(ABI, '0xa71d4CcF0FF76De742AEE54DC6CBFA215106ce08');// 替换自己的银行合约地址
    setBankConnect(bankConnectT);
  }

  const getMyDeposit = async () => {
    if (!bankConnect) {
      console.error('Bank contract is not connected.');
      alert('Bank contract is not connected.')
      return
    }
    let deposit = await bankConnect.methods.getMyBalance().call({
      from: address
    });
    setMyDeposit(deposit);
  }

  const deposit = async () => {
    if (!bankConnect) {
      console.error('Bank contract is not connected.');
      alert('Bank contract is not connected.')
      return
    }
    const depositAmount = document.getElementById('deposit').value;
    if (depositAmount <= 0) {
      console.error('Deposit amount must be greater than 0.');
      alert('Deposit amount must be greater than 0.')
      return
    }
    await bankConnect.methods.deposit(depositAmount).send({
      from: address
    });
  }

  const withdraw = async () => {
    if (!bankConnect) {
      console.error('Bank contract is not connected.');
      alert('Bank contract is not connected.')
      return
    }
    const withdrawAmount = document.getElementById('withdraw').value;
    if (withdrawAmount <= 0) {
      console.error('Withdraw amount must be greater than 0.');
      alert('Withdraw amount must be greater than 0.')
      return
    }
    await bankConnect.methods.withdraw(withdrawAmount).send({
      from: address
    });
  }

  const transfer = async () => {
    if (!bankConnect) {
      console.error('Bank contract is not connected.');
      alert('Bank contract is not connected.')
      return
    }
    const transferTo = document.getElementById('transfer-to').value;
    const transferAmount = document.getElementById('transfer-amount').value;
    if (transferTo === '') {  // 转账地址不能为空
      console.error('Transfer address cannot be empty.');
      alert('Transfer address cannot be empty.')
      return
    }
    if (transferAmount <= 0) {  // 转账金额不能为空
      console.error('Transfer amount cannot be empty.');
      alert('Transfer amount cannot be empty.')
      return
    }
    await bankConnect.methods.transfer(transferTo, transferAmount).send({
      from: address
    });
  }

  const workearncoin = async () => {
    if (!bankConnect) {
      console.error('Bank contract is not connected.');
      alert('Bank contract is not connected.')
      return
    }
    const workearncoinAmount = document.getElementById('workearncoin').value;
    if (workearncoinAmount <= 0) {
      console.error('workearncoin amount cannot be empty.');
      alert('workearncoin amount cannot be empty.')
      return
    }
    await bankConnect.methods.workearncoin(workearncoinAmount).send({
      from: address
    });
  }

  const costcoin = async () => {
    if (!bankConnect) {
      console.error('Bank contract is not connected.');
      alert('Bank contract is not connected.')
      return
    }
    const costcoinAmount = document.getElementById('costcoin').value;
    if (costcoinAmount <= 0) {
      console.error('costcoin amount cannot be empty.');
      alert('costcoin amount cannot be empty.')
      return
    }
    await bankConnect.methods.costcoin(costcoinAmount).send({
      from: address
    });
  }


  return (
    <div className="App">
      <header className="App-header">

        <article>
          <h1>银行功能</h1>
          <ol>
            <li>链接钱包</li>
            <li>查询余额</li>
            <li>存钱</li>
            <li>取钱</li>
            <li>转账</li>
            <li>赚钱</li>
            <li>花钱</li>
          </ol>
        </article>


        <article><h1>银行表单</h1></article>
        <div className="container mt-4">
          <form>
            <div className="mb-3">
              <label htmlFor="connect" className="form-label">链接钱包:</label>
              <input
                type="button"
                id="connect"
                name="connect"
                value={'链接钱包'}
                onClick={connectWallet}
                className="btn btn-primary"
              />
              <span>
                账户地址：{address}
              </span>
            </div>
            <div className="mb-3">
              <label htmlFor="my-balance" className="form-label">查询余额:</label>
              <span>{myDeposit}</span>
              <button type="button" className="btn btn-primary" onClick={getMyDeposit}>查询余额</button>
            </div>
            <div className="mb-3">
              <label htmlFor="deposit" className="form-label">存钱:</label>
              <input
                type="text"
                id="deposit"
                name="deposit"
                required
              />
              <button type="button" className="btn btn-primary" onClick={deposit}>存钱</button>
            </div>
            <div className="mb-3">
              <label htmlFor="withdraw" className="form-label">取钱:</label>
              <input
                type="text"
                id="withdraw"
                name="withdraw"
                required
              />
              <button type="button" className="btn btn-primary" onClick={withdraw}>取钱</button>
            </div>
            <div className="mb-3">
              <label htmlFor="transfer" className="form-label">转账:</label>
              <input
                type="text"
                id="transfer-to"
                name="transfer-to"
                className="form-control"
                placeholder="转账地址"
                required
              />
              <input
                type="text"
                id="transfer-amount"
                name="transfer-amount"
                className="form-control"
                placeholder="转账金额"
                required
              />
              <button type="button" className="btn btn-primary" onClick={transfer}>转账</button>
            </div>
            <div className="mb-3">
              <label htmlFor="workearncoin" className="form-label">赚钱:</label>
              <input
                type="text"
                id="workearncoin"
                name="workearncoin"
                required
              />
              <button type="button" className="btn btn-primary" onClick={workearncoin}>赚钱</button>
            </div>
            <div className="mb-3">
              <label htmlFor="costcoin" className="form-label">花钱:</label>
              <input
                type="text"
                id="costcoin"
                name="costcoin"
                required
              />
              <button type="button" className="btn btn-primary" onClick={costcoin}>花钱</button>
            </div>
          </form>
        </div>

      </header>
    </div >
  );
}

export default App;
