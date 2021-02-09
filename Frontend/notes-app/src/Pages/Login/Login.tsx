import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import Input from '../../Components/Input';
import Lottie from '../../Components/Lottie';
import { Container, Modal } from 'react-bootstrap'
import NoteIcon from '../../Components/NoteIcon';
import MySvg from '../../Assets/41070-notepad-with-a-list-of-tick-boxes-and-5-star-feedback.json';
import Button from '../../Components/Button'
import { gql } from '@apollo/client';
import Loading from '../../Components/Loading';
import { useHistory } from 'react-router-dom'
import client from '../../Api';
import UserUtil from '../../Util/UserUtil';
import _ from 'lodash';
import User from '../../Model/User';

type TModal = {
  title: string
  body: string
  isVisible: boolean
}

function App() {
  const LOGIN_QUERY = gql`
  query login($username:String!, $password:String!){
      Login(username:$username, password:$password){
          id
          name
          lastname
          picture
          username
          picture
          createdAt
      }
  }    
  
  `;

  const initialModalState = {
    title: "",
    body: "",
    isVisible: false
  } as TModal


  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [modal, setModal] = useState<TModal>(initialModalState);
  const history = useHistory();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
  }

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }

  const handlebtnLogin = async () => {
    setIsLoading(true);

    const queryOptions = {
      query: LOGIN_QUERY,
      variables: {
        username, password
      }
    }

    try {
      const apolloCache = client.readQuery(queryOptions);

      console.log(apolloCache);
      if (!_.isEmpty(apolloCache)) {

        const { Login } = apolloCache;

        new UserUtil().SaveUserDataInCache(Login as User);

        history.replace("/userprofile");
      }
      else {
        const { error, data } = await client.query(queryOptions);

        if (!_.isUndefined(error) && !_.isEmpty(error)) {
          let body = "";

          error.graphQLErrors.forEach((err) => {
            body += err.message;
          });

          setModal({
            title: "Ops! Ocorreu um erro",
            body,
            isVisible: true
          });
        }
        else {
          const user = data.Login as User;

          new UserUtil().SaveUserDataInCache(user);

          history.replace("/userprofile");
        }
      }
    }
    catch (err) {
      setModal({
        title: "Ops! Ocorreu um erro",
        body: "Não foi possível realizar o login :( Tente novamente mais tarde!",
        isVisible: true
      });
    }
    finally {
      setIsLoading(false)
    }
  }

  const ErrorModal = () => {
    return (
      <Modal
        key={`${modal.isVisible}`}
        backdrop="static" size="lg" centered show={modal.isVisible}>
        <Modal.Header>
          <Modal.Title>{modal.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {modal.body}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="#F54961"
            title={`Fechar :(`}
            onClick={() => {
              setModal({
                title: "",
                body: "",
                isVisible: false
              })
            }}
          />
        </Modal.Footer>
      </Modal>
    )
  }

  return (
    <>
      <Container className="container-background" fluid>
        <div className="login-container">

          <Lottie
            id="lottie-animation"
            autoplay={true}
            loop={true}
            animationData={MySvg}
            width="50%"
          />
          <div className="login-content">
            <div className="login-header">
              <h1>
                Notes App
          </h1>
              <NoteIcon
                width={60}
                height={60}
              />
            </div>
            <br />
            <Input
              placeholder="Nome de usuário"
              type="text"
              onChange={handleUsername}
            />

            <br />
            <Input
              placeholder="Senha"
              type="password"
              onChange={handlePassword}
            />
            <br />
            <div className="login-buttons">
              <Button
                onClick={handlebtnLogin}
                color="#E88BCF"
                title="Entrar"
              />
              <Button
                color="#ECA7FF"
                title="Cadastrar"
              />
            </div>
          </div>

        </div>

      </Container>
      <ErrorModal />
      <Loading isLoading={isLoading} />
    </>
  );
}

export default App;
