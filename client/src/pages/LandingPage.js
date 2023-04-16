import React, { useState, useEffect } from 'react';
import { Button, Form, Col, Row, Navbar, Nav, Container } from 'react-bootstrap';
import Payments from "../contracts/Payments.json"
import Web3 from 'web3';
import Logo from '../images/bravo_logo.png'
import '../App.css'

function LandingPage() {

  const [address, setAddress] = useState('To populate the address field, click "Set Address"');
  const [contract, setContract] = useState({});
  const [contractAddr, setContractAddr] = useState("");

  const [winner1, setWinner1] = useState("");
  const [winner2, setWinner2] = useState("");
  const [winner3, setWinner3] = useState("");

  const [winner1Amount, setWinner1Amount] = useState(0);
  const [winner2Amount, setWinner2Amount] = useState(0);
  const [winner3Amount, setWinner3Amount] = useState(0);

  const [isValid, setIsValid] = useState(false);
  const [depositAmnt, setDepositAmnt] = useState(0);

  const loadUserData = async () => {
    const web3 = window.web3;

    // find the network
    const networkId = await web3.eth.net.getId();

    // find the contract
    const deployedNetwork = Payments.networks[networkId];
    if (deployedNetwork) {
      const instance = new web3.eth.Contract(
        Payments.abi,
        deployedNetwork.address
      );

      setContract(instance);
      setContractAddr(deployedNetwork.address)
    } else {
      window.alert(
        "Bravo contract not deployed to detected network."
      );
    }
  };

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const loadMetaMask = async () => {
    const web3 = window.web3;
    // find the metamask account
    let accounts = await web3.eth.getAccounts().then();
    setAddress(accounts[0]);
  };

  useEffect(() => {
    loadWeb3();
    loadUserData();
  }, []);

  const handleWinner1Addr = (event) => {
    event.preventDefault()
    setWinner1(event.target.value)
  }

  const handleWinner2Addr = (event) => {
    event.preventDefault()
    setWinner2(event.target.value)
  }

  const handleWinner3Addr = (event) => {
    event.preventDefault()
    setWinner3(event.target.value)
  }

  const handleWinner1Amnt = (event) => {
    event.preventDefault()
    setWinner1Amount(event.target.value)
  }

  const handleWinner2Amnt = (event) => {
    event.preventDefault()
    setWinner2Amount(event.target.value)
  }

  const handleWinner3Amnt = (event) => {
    event.preventDefault()
    setWinner3Amount(event.target.value)
  }

  const handleValidate = async () => {
    // console.log(winner1)
    // console.log(winner2)
    // console.log(winner3)
    // console.log(winner1Amount)
    // console.log(winner2Amount)
    // console.log(winner3Amount)
    let balance = await contract.methods.getBalance().call({ from: address });
    balance = Web3.utils.fromWei(balance, "ether");
    if (balance <= winner1Amount + winner2Amount + winner3Amount) {
      setIsValid(true);
    }
  }

  const handlePayment = async () => {
    await contract.methods.withdraw(winner1, Web3.utils.toWei(winner1Amount, "ether")).send({ from: address })
    await contract.methods.withdraw(winner2, Web3.utils.toWei(winner2Amount, "ether")).send({ from: address })
    await contract.methods.withdraw(winner3, Web3.utils.toWei(winner3Amount, "ether")).send({ from: address })
  }

  const handleDepositChange = (event) => {
    event.preventDefault()
    setDepositAmnt(event.target.value)
  }

  const handleDeposit = async () => {
    await contract.methods.deposit().send({ from: address, value : Web3.utils.toWei(depositAmnt, "ether") })
  }

  return (
    <div style={{ textAlign: "center" }} className="app">
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">
            <img
              alt=""
              src={Logo}
              height="32"
              className="d-inline-block align-bottom"
            />
          </Navbar.Brand>
          <Nav className="justify-content-end">
            <Button variant="dark" onClick={loadMetaMask}>
              Set Address
            </Button>
          </Nav>
        </Container>
      </Navbar>
      <h1>Bravo Hackathon Payment Dashboard</h1>
      <p>User address: {address}</p>
      <p>Contract address: {contractAddr}</p>
      <br />
      <div style={{ width: "80%", marginLeft: "auto", marginRight: "auto" }}>
        <Form>
          <Row className="mb-3 d-flex">
            <Form.Group as={Col} sm={5} onChange={event => handleDepositChange(event)}>
              <Form.Control type="text" name="address" placeholder="Deposit Amount" />
            </Form.Group>
            <Form.Group as={Col} controlId="formButton">
              <Button variant="dark" onClick={handleDeposit} >Deposit</Button>
            </Form.Group>
          </Row>
        </Form>
        <Form>
          <Row className="mb-3 d-flex align-items-end">
            <Form.Group as={Col}>
              <Form.Select name="role" defaultValue="default">
                <option value="default" disabled>Select a Prize</option>
                <option value="first">First Place</option>
                <option value="second">Second Place</option>
                <option value="third">Third Place</option>
              </Form.Select>
            </Form.Group>

            <Form.Group as={Col} sm={5} onChange={event => handleWinner1Addr(event)}>
              <Form.Control type="text" name="address" placeholder="User Address" />
            </Form.Group>

            <Form.Group as={Col} sm={3} onChange={event => handleWinner1Amnt(event)}>
              <Form.Control type="text" name="prizeAmount" placeholder="Amount of Tokens" />
            </Form.Group>

            <Form.Group as={Col} controlId="formButton">
              <Button variant="outline-danger" >Remove Winner</Button>
            </Form.Group>
          </Row>
          <Row className="mb-3 d-flex align-items-end">
            <Form.Group as={Col}>
              <Form.Select name="role" defaultValue="default">
                <option value="default" disabled>Select a Prize</option>
                <option value="first">First Place</option>
                <option value="second">Second Place</option>
                <option value="third">Third Place</option>
              </Form.Select>
            </Form.Group>

            <Form.Group as={Col} sm={5}>
              <Form.Control type="text" name="address" placeholder="User Address" onChange={event => handleWinner2Addr(event)} />
            </Form.Group>

            <Form.Group as={Col} sm={3}>
              <Form.Control type="text" name="prizeAmount" placeholder="Amount of Tokens" onChange={event => handleWinner2Amnt(event)} />
            </Form.Group>

            <Form.Group as={Col} controlId="formButton">
              <Button variant="outline-danger" >Remove Winner</Button>
            </Form.Group>
          </Row>
          <Row className="mb-3 d-flex align-items-end">
            <Form.Group as={Col}>
              <Form.Select name="role" defaultValue="default">
                <option value="default" disabled>Select a Prize</option>
                <option value="first">First Place</option>
                <option value="second">Second Place</option>
                <option value="third">Third Place</option>
              </Form.Select>
            </Form.Group>

            <Form.Group as={Col} sm={5}>
              <Form.Control type="text" name="address" placeholder="User Address" onChange={event => handleWinner3Addr(event)} />
            </Form.Group>

            <Form.Group as={Col} sm={3}>
              <Form.Control type="text" name="prizeAmount" placeholder="Amount of Tokens" onChange={event => handleWinner3Amnt(event)} />
            </Form.Group>

            <Form.Group as={Col} controlId="formButton">
              <Button variant="outline-danger" >Remove Winner</Button>
            </Form.Group>
          </Row>
        </Form>
      </div>
      <Button variant="outline-success" >Add Another Winner</Button>
      <br />
      <br />
      <Button variant="dark" onClick={handleValidate}>
        Validate Amounts
      </Button>
      <br />
      <br />
      <Button variant="dark" onClick={handlePayment} disabled={!isValid}>
        Dispense Payments!
      </Button>
      <br />
      <br />
    </div>
  );
}

export default LandingPage;