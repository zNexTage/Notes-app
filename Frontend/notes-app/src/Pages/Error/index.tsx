import React from 'react';
import Lottie from '../../Components/Lottie';
import ErrorBot from '../../Assets/38463-error.json'
import './style.css';

function ErrorPage() {
  return (
    <div className="error-container">
      <Lottie
        autoplay
        loop
        animationData={ErrorBot}
        width="50%"
      />
      <label>
        Ops! Ocorreu um erro insperado!
      </label>
      <label>
        Não foi possível realizar a sua solicitação! Tente novamente mais tarde...
      </label>
    </div>
  );
}


export default ErrorPage;
