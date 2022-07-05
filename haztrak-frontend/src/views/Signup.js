import React, {useState} from "react";
import {Link} from "react-router-dom";
import {Button, Card, Container, FloatingLabel, Form} from "react-bootstrap";

const Signup = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rePassword, setRePassword] = useState("")

  const onChangeUsername = e => {
    const username = e.target.value
    setUsername(username)
  }

  const onChangeRePassword = e => setRePassword(e.target.value)

  const onChangePassword = e => {
    const password = e.target.value
    setPassword(password)
  }

  return (
    <Container fluid>
      <div className="row justify-content-center">
        <div className="col-lg-5">
          {/* Sign Up Card */}
          <Card className="shadow-lg border-0 rounded my-5">
            <Card.Header className="py-4 bg-primary text-light text-center">
              <span className="h2">Sign Up</span>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <FloatingLabel controlId="usernameInput"
                                 label="Username"
                                 className="mb-3">
                    <Form.Control type="text"
                                  placeholder="Username"
                                  value={username}
                                  onChange={onChangeUsername}
                    />
                  </FloatingLabel>
                  <FloatingLabel controlId="passwordInput1"
                                 label="Password"
                                 className="mb-3">
                    <Form.Control type="password"
                                  placeholder="myP@assword"
                                  value={password}
                                  onChange={onChangePassword}
                    />
                  </FloatingLabel>
                  <FloatingLabel controlId="passwordInput2"
                                 label="Repeat Password"
                                 className="mb-3">
                    <Form.Control type="password"
                                  placeholder="Repeat myP@assword"
                                  value={rePassword}
                                  onChange={onChangeRePassword}
                    />
                  </FloatingLabel>
                  <div
                    className="d-flex align-items-center justify-content-end mt-4 mb-0">
                    <Button variant="success" type="submit">
                      Sign Up
                    </Button>
                  </div>
                </Form.Group>
              </Form>
            </Card.Body>
            <Card.Footer>
              <div className="d-flex justify-content-between">
                <Link to="#">Forgot Password?</Link>
              </div>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </Container>
  )
}

export default Signup
