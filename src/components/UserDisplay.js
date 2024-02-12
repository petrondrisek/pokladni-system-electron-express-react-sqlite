import React, { useState } from 'react';
import { useUserInfo } from './UserContext';
import '../assets/NotificationSystem.css';
import { Modal, Button } from 'react-bootstrap'


const UserDisplay = () => {
  const { isLoggedIn, loggedUser, logout } = useUserInfo();

  const [loginShow, setLoginShow] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const handleLoginClose = () => setLoginShow(false);
  const handleLoginShow = () => setLoginShow(true);

  const handleLoginSubmit = (user, pass) => {
      console.log(user, pass);

      setLoginShow(false);
  }

  return (
    <div className="user-container">
      {isLoggedIn ? (
        <div className="user-container__user-panel container">
           <p>Přihlášen <strong>{loggedUser.name}</strong> <button className="btn btn-danger" onClick={() => logout()}>Odhlásit se</button></p>
        </div>
      ) : (
        <>
        <div className="user-container__login container">
          <p>Nepřihlášen <button className="btn btn-warning" onClick={() => handleLoginShow()}>Přihlásit se</button></p>
        </div>
        

        <Modal show={loginShow} onHide={handleLoginClose}>
                <Modal.Header closeButton>
                <Modal.Title>Přihlášení</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label htmlFor="username">Uživatelské jméno</label>
                    <input type="text" id="username" className="form-control" value={userInput} onChange={(e) => setUserInput(e.target.value)}/>
                    
                    <label htmlFor="password">Heslo: </label>
                    <input type="text" id="password" className="form-control" onChange={(e) => setPassInput(e.target.value)} value={passInput} />
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={() => handleLoginSubmit(userInput, passInput)}>
                    Přihlásit se
                </Button>
                <Button variant="secondary" onClick={handleLoginClose}>
                    Zrušit
                </Button>
                </Modal.Footer>
        </Modal>
        </>
      )}
      
      
    </div>
  );
};

export default UserDisplay;