import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotification } from './NotificationContext';
import { useUserInfo } from './UserContext';

function SimplePassword() {
  const { isLoggedIn, login } = useUserInfo();
  const { addNotification } = useNotification();
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { linkTo } = useParams();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if(isLoggedIn){ 
      setTimeout(function(){
        navigate(`/${linkTo === 'dashboard' ? '' : linkTo}`);
      }, 1000);
      
      setRedirecting(true);
    }
  }, [isLoggedIn, navigate, linkTo])

  /*Nebezpečné !!! Heslo je primitivní a dá se vyčíst z kódu - v aplikaci je blokováno developer tools, nicméně to stále není bezpečné! Pro účely aplikace dle zadání ale stačí.*/
  const handleLogin = (pass) => {
    if(pass === 'Admin123*'){
        login({ name: 'admin'});
        addNotification("Přihlášení proběhlo úspěšně, probíhá přesměrování ...")
    } else {
        addNotification("Neplatné heslo ! Zkuste akci prosím opakovat.")
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleLogin(password);
    }
  }

  return (
    <>
    {redirecting && (
      <div className="loader-container d-flex align-items-center gap-3 flex-column">
        <div className="loader"></div>
        <p>Ověření přihlášení ...</p>
      </div>
    )}
    {!redirecting && (<section className="d-flex align-items-center login-background">
      <div className="login">
            <h1>Vyžadováno přihlášení</h1>
            <input type="password" placeholder="Zadejte heslo ..." onClick= {() => setPassword(password)} onKeyDown={handleKeyDown} value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" />
            <button className="btn btn-primary w-100" onClick={() => handleLogin(password)}>Potvrdit</button>
      </div>
    </section>)}
    </>
  );
}

export default SimplePassword;