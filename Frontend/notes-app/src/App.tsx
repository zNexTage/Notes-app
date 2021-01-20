import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Input from './Components/Input';
import RealizingNotes from './Assets/39019-completing-tasks.json';
import LottiePlayer from 'lottie-web';
import Lottie from './Components/Lottie';
import { Container } from 'react-bootstrap'
import NoteIcon from './Components/NoteIcon';
import MySvg from './Assets/41070-notepad-with-a-list-of-tick-boxes-and-5-star-feedback.json';
import Button from './Components/Button'
import LoginClient from './Client/Login';
import { gql, useMutation } from '@apollo/client';

function App() {
  const LOGIN_MUTATION = gql`
  mutation login($username:String!, $password:String!){
      Login(username:$username, password:$password){
          id
          name
      }
  }    
  
  `;

  const [login, { data }] = useMutation(LOGIN_MUTATION);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
  }

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }

  const handlebtnLogin = () => {
    login({
      variables: {
        username, password
      }
    }).then((value) => {
      console.log(value)
    })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
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
  );
}

export default App;
