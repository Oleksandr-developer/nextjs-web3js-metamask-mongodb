import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";

import 'bootstrap/dist/css/bootstrap.min.css';

import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import UserDataService from "../services/UserService";

export const injected = new InjectedConnector();

export default function Home() {
  const router = useRouter();
  const refcode = router.query["ref"];
  const [hasMetamask, setHasMetamask] = useState(false);
  const [anotherUser, setAnotherUser] = useState({});
  const [address, setAddress] = useState('');
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
  }, []);

  useEffect(() => {
    if (refcode != undefined)
      UserDataService.get(refcode)
        .then(response => {
          setAnotherUser(response.data)
        })
        .catch(e => {
          console.log(e);
        });
  }, [refcode])

  const {
    active,
    activate,
  } = useWeb3React();

  const btnhandler = async () => {
    if (window.ethereum) {
      await activate(injected);
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((res) => accountChangeHandler(res[0]));
    } else {
      alert("install metamask extension!!");
    }
  };

  const accountChangeHandler = (account) => {
    setHasMetamask(true);
    setAddress(account);
  };

  const initialUserState = {
    id: null,
    nickname: "",
  };

  const [user, setUser] = useState(initialUserState);
  const [reflink, setReflink] = useState("");
  const handleInputChange = event => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const saveUser = () => {
    var req_data = {
      nickname: user.nickname,
      address: address
    };
    UserDataService.create(req_data)
      .then(response => {
        if (response.data.status == 'success') {
          setUser({
            id: response.data.data.id,
            nickname: response.data.data.nickname
          });
          console.log(response.data.data);
          setReflink(response.data.data.code);
        }
        else {
          setMsg(response.data.message);
        }
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div className="text-center mt-5">
      {refcode && <Card style={{ width: '25rem', margin: '0 auto' }}>
        <Card.Body>
          <Card.Title>Nickname</Card.Title>
          <Card.Text>
            {anotherUser.nickname}
          </Card.Text>
          <Card.Title>Address</Card.Title>
          <Card.Text>
            {anotherUser.address}
          </Card.Text>
        </Card.Body>
      </Card>}
      {hasMetamask ? (
        active ? (
          <>
            <Card style={{ width: '25rem', margin: '0 auto' }}>
              <Card.Body>
                <Card.Title>Address</Card.Title>
                <Card.Text>
                  {address}
                </Card.Text>
              </Card.Body>
            </Card>

            <InputGroup hasValidation className="my-3" style={{ width: '18rem', margin: '0 auto' }}>
              <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Nickname"
                name="nickname"
                aria-describedby="inputGroupPrepend"
                onChange={handleInputChange}
                required
              />
              {msg ? (
                <div style={{ width: '18rem', margin: '0 auto' }}>
                  <Alert variant="error" className="d-block px-5 m-0">{msg}</Alert>
                </div>
              ) : (<div className="d-none"></div>)}
            </InputGroup>

            <div style={{ width: '22rem', margin: '0 auto' }}>
              <Alert variant="success" className="d-block px-5">Connected!</Alert>
              <Button variant="info" onClick={saveUser}>Submit</Button>
            </div>
            <div>Referral link: <a href={window.location + '?ref=' + reflink} target="_blank">{window.location + '?ref=' + reflink}</a></div>
          </>
        ) : (
          <>
            <Button variant="primary" className="mt-3" onClick={btnhandler}>Connect</Button>
          </>
        )
      ) : (
        <Alert variant="warning" className="d-inline-block px-5 me-5">Please install metamask!</Alert>
      )}
      {/* {active ? <Button variant="success" onClick={() => execute()}>Execute</Button> : ""} */}
    </div>
  );
}
