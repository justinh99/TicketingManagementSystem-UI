import React, { useEffect, useState } from 'react';
import './App.css';
import TicketForm from './TicketForm';
import OpenTickets from './OpenTickets';
import AssignedTickets from './AssignedTickets';
import { useNavigate } from 'react-router-dom';
import LoginButton from './LoginButton';

type UserType = {
  name: string;
};

const Home = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('openTickets');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Home";
  }, [navigate]);

  const handleTabChange = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

  return (
    <div className="App">
      <header className="header" style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', width: '150px' }}>
          <img src="/logo.png" alt="Your Logo" style={{ width: '100%', height: 'auto' }} />
        </div>
        <h1 style={{ flex: 1, textAlign: 'center', fontSize: '50px', marginRight: '150px' }} onClick={() => navigate("/")}>
          ME100
        </h1>
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '150px' }}>
          {user ? (
            <>
              <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>Hi, {user.name}!</span>
              <button onClick={() => {}}>Log Out</button>
            </>
          ) : (
            <LoginButton onLoginSuccess={setUser} />
          )}
        </div>
      </header>
      <div>
        <p style={{ fontSize: '1.5rem' }}>
          Welcome to ME 100 OH Queue. Please make a ticket on the queue
        </p>
        <p style={{ fontSize: '1rem', color: 'darkgreen', fontWeight: 700, padding: 30 }}>
          Please note that creating a ticket acknowledges that we gather your information to help you with your problem.
          We will not share your information with anyone outside of the ME 100 staff.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
          <div
            style={{
              padding: '10px 20px',
              cursor: 'pointer',
              borderBottom: activeTab === 'openTickets' ? '2px solid black' : 'none'
            }}
            onClick={() => handleTabChange('openTickets')}
          >
            Open Tickets
          </div>
          <div
            style={{
              padding: '10px 20px',
              cursor: 'pointer',
              borderBottom: activeTab === 'assignedTickets' ? '2px solid black' : 'none'
            }}
            onClick={() => handleTabChange('assignedTickets')}
          >
            Assigned Tickets
          </div>
        </div>
        <div className="tickets-container">
          {activeTab === 'openTickets' && <OpenTickets />}
          {activeTab === 'assignedTickets' && <AssignedTickets />}
        </div>
      </div>
    </div>
  );
}

export default Home;
