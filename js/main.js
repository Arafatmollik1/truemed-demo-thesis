async function loadWeb3() {
    console.log('loaded 1');
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        window.ethereum.enable();
    } else {
        alert('Please install Metamask');
    }
}

async function loadContract() {
    return await new window.web3.eth.Contract(
        [{
                "inputs": [{
                    "internalType": "string",
                    "name": "_productID",
                    "type": "string"
                }],
                "name": "setProductDetail",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [{
                    "internalType": "address",
                    "name": "_admin",
                    "type": "address"
                }],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "inputs": [],
                "name": "admin",
                "outputs": [{
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [{
                    "internalType": "string",
                    "name": "_productID",
                    "type": "string"
                }],
                "name": "getProductDetails",
                "outputs": [{
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    },
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ],
        '0x2C7724fC473454Dd41a453Eeea1360445d949BA7',
    );
}

async function getCurrentAccount() {
    const accounts = await window.web3.eth.getAccounts();
    return accounts[0];
}
async function getadminAccount() {
    const account = await getCurrentAccount();
    const message = await window.contract.methods.admin().call({ from: account });
    // console.log(message);
    return message;
}

async function load() {
    await loadWeb3();
    window.contract = await loadContract();

    const account = await getCurrentAccount();
    console.log(account);
    var admin = await getadminAccount();
    console.log(admin);
    if (account == admin) {
        document.getElementById('startButton').style.display = "inline-block"
    } else {
        document.getElementById('startButton').style.display = "none"
    }
    document.getElementById('account').innerHTML = account;
    document.getElementById('admin').innerHTML = admin;
}


async function addCode(code) {
    const account = await getCurrentAccount();
    const message = await window.contract.methods.setProductDetail(code).send({ from: account });
    alert('Transaction Confirmed');
    alert('https://ropsten.etherscan.io/tx/' + message.transactionHash);
    document.getElementById('result').textContent = 'https://ropsten.etherscan.io/tx/' + message.transactionHash;

    //window.location.replace('/');
}
async function checkCode(code) {
    const account = await getCurrentAccount();
    const message = await window.contract.methods.getProductDetails(code).call({ from: account });
    console.log(message);
    if (message[0] != '') {
        document.getElementById('result').textContent = 'BarCode is:' + message[0];
        document.getElementById('resultOwner').textContent = 'Owner is:' + message[1];
    } else {
        alert('Barcode is not Found');
    }
}
//Load Web3
load();

//Load Barcode Reader
let selectedDeviceId;
const codeReader = new ZXing.BrowserMultiFormatReader();
console.log('ZXing code reader initialized');
codeReader
    .listVideoInputDevices()
    .then((videoInputDevices) => {
        const sourceSelect = document.getElementById('sourceSelect');
        selectedDeviceId = videoInputDevices[0].deviceId;
        if (videoInputDevices.length >= 1) {
            videoInputDevices.forEach((element) => {
                const sourceOption = document.createElement('option');
                sourceOption.text = element.label;
                sourceOption.value = element.deviceId;
                sourceSelect.appendChild(sourceOption);
            });

            sourceSelect.onchange = () => {
                selectedDeviceId = sourceSelect.value;
            };

            const sourceSelectPanel = document.getElementById('sourceSelectPanel');
            sourceSelectPanel.style.display = 'block';
        }

        document.getElementById('startButton').addEventListener('click', () => {
            codeReader.decodeFromVideoDevice(selectedDeviceId, 'video', (result, err) => {
                if (result) {
                    console.log(result);
                    alert(result.text + ' Will be added to the BlockChain');
                    addCode(result.text);
                    document.getElementById('result').textContent =
                        result.text + ' BarCode have been added To BlockChain ';
                }
                if (err && !(err instanceof ZXing.NotFoundException)) {
                    console.error(err);
                    document.getElementById('result').textContent = err;
                }
            });
            console.log(`Started continous decode from camera with id ${selectedDeviceId}`);
        });
        document.getElementById('checkButton').addEventListener('click', () => {
            codeReader.decodeFromVideoDevice(selectedDeviceId, 'video', (result, err) => {
                if (result) {
                    console.log(result);
                    checkCode(result.text);
                }
                if (err && !(err instanceof ZXing.NotFoundException)) {
                    console.error(err);
                    document.getElementById('result').textContent = err;
                }
            });
            console.log(`Started continous decode from camera with id ${selectedDeviceId}`);
        });

        document.getElementById('resetButton').addEventListener('click', () => {
            codeReader.reset();
            document.getElementById('result').textContent = '';
            console.log('Reset.');
        });
    })
    .catch((err) => {
        console.error(err);
    });