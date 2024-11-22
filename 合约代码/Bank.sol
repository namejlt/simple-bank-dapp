// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**

记录余额

用于代币的流通
代币地址要授权给其他合约，其他合约才能使用代币进行流通


- 代币合约approve给银行合约
- 银行合约就可以从代币合约存钱


特殊说明

- 部署合约后，记得，用banker给bank合约授权指定代币余额


*/

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Bank {
    // 存款数据
    mapping(address => uint256) public deposited;

    // 绑定代币

    address public immutable token; //常量
    address public immutable banker; //常量 需要提前授权指定余额
    uint256 private immutable workmaxcoin; //常量

    constructor(address _token, address _banker, uint256 _workmaxcoin) {
        token = _token; //绑定代币地址，可以用代币地址用来存取
        banker = _banker; //拥有代币的人，可以用来发钱，没了就不可以打工了
        _workmaxcoin = _workmaxcoin * 10 ** 18;
        workmaxcoin = _workmaxcoin; //工作最多赚取的代币
    }

    // 公用检测 修饰符来实现

    modifier requireBalance(uint256 amount) {
        amount = amount * 10 ** 18;
        uint256 balance = deposited[msg.sender];
        require(amount <= balance, "the amount more than bank of balance");
        _; // 后续执行代码
    }

    // 查询余额
    function myBalance() public view returns (uint256) {
        return deposited[msg.sender] / (10 ** 18);
    }

    function getMyBalance() public view returns (uint256 balance) {
        balance = deposited[msg.sender] / (10 ** 18);
    }

    // 通过工作获取余额，到银行账户
    function workearncoin(uint256 amount) public {
        // 这里可以扩展复杂逻辑
        // 转账到银行合约地址
        amount = amount * 10 ** 18;
        require(amount <= workmaxcoin, "the amount more than workmaxcoin");
        // transferFrom 需要授权 合约地址发起的，这里如果banker授权额度不足，会报错，无法打工赚钱
        require(
            IERC20(token).transferFrom(banker, address(this), amount),
            "transfer workearncoin error"
        );
        deposited[msg.sender] += amount; // 转账成功后，修改余额
    }

    // 通过消费指定业务，转钱到banker银行账户
    function costcoin(uint256 amount) public {
        // 这里可以扩展复杂逻辑
        transfer(banker, amount);
    }

    // 存
    function deposit(uint256 amount) public {
        // 转账到银行合约地址
        amount = amount * 10 ** 18;
        // transferFrom 需要授权 合约地址发起的
        require(
            IERC20(token).transferFrom(msg.sender, address(this), amount),
            "transfer deposit error"
        );
        deposited[msg.sender] += amount; // 转账成功后，修改余额
    }

    // 取 真实开发用 safeTransfer

    function withdraw(uint256 amount) external requireBalance(amount) {
        amount = amount * 10 ** 18;
        //require(deposited[msg.sender] >= amount, "the amount more than bank of balance");//判断余额是否足够
        //require(IERC20(token).transfer(msg.sender, amount), "transfer withdraw error");
        SafeERC20.safeTransfer(IERC20(token), msg.sender, amount);
        deposited[msg.sender] -= amount; // 转账成功后，修改余额
    }

    function transfer(
        address to,
        uint256 amount
    ) public requireBalance(amount) {
        amount = amount * 10 ** 18;
        //require(deposited[msg.sender] >= amount, "the amount more than bank of balance");//判断余额是否足够

        // 转账
        deposited[msg.sender] -= amount;
        deposited[to] += amount;
    }
}
