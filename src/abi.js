/**
 * 合约abi
 */
const abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "recipients",
				"type": "address[]"
			},
			{
				"name": "values",
				"type": "uint256[]"
			}
		],
		"name": "disperseEther",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "token",
				"type": "address"
			},
			{
				"name": "recipients",
				"type": "address[]"
			},
			{
				"name": "values",
				"type": "uint256[]"
			}
		],
		"name": "disperseToken",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "token",
				"type": "address"
			},
			{
				"name": "recipients",
				"type": "address[]"
			},
			{
				"name": "values",
				"type": "uint256[]"
			}
		],
		"name": "disperseTokenSimple",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
export default abi;