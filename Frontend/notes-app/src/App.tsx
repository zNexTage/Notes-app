import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Input from './Components/Input';
import RealizingNotes from './Assets/39019-completing-tasks.json';
import LottiePlayer from 'lottie-web';
import Lottie from './Components/Lottie';
import { Container, Modal } from 'react-bootstrap'
import NoteIcon from './Components/NoteIcon';
import MySvg from './Assets/41070-notepad-with-a-list-of-tick-boxes-and-5-star-feedback.json';
import Button from './Components/Button'
import LoginClient from './Client/Login';
import { gql, useMutation } from '@apollo/client';
import Loading from './Components/Loading';

type TModal = {
  title: string
  body: string
  isVisible: boolean
}

function App() {
  const LOGIN_MUTATION = gql`
  mutation login($username:String!, $password:String!){
      Login(username:$username, password:$password){
          id
          name
      }
  }    
  
  `;

  const initialModalState = {
    title: "",
    body: "",
    isVisible: false
  } as TModal

  const [login] = useMutation(LOGIN_MUTATION, { errorPolicy: 'all' });
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [modal, setModal] = useState<TModal>(initialModalState);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
  }

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }

  const handlebtnLogin = () => {
    setIsLoading(true);

    login({
      variables: {
        username, password
      }
    })
      .then(({ errors, data }) => {
        if (errors) {
          const body: Array<string> = new Array();

          errors.forEach((error, index) => {
            const pError = `${error.message}\n`

            body.push(pError);
          });

          setModal({
            title: "Atenção",
            body: body.join(","),
            isVisible: true
          });

          return;
        }
      })
      .catch((error) => {
        const body: string = "Não foi possível realizar o login :( Tente novamente mais tarde.";

        setModal({
          title: "Atenção",
          body,
          isVisible: true
        });
      })
      .finally(() => {
        setIsLoading(false);
      })
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
