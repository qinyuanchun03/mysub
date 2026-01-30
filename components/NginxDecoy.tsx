
import React from 'react';

interface NginxDecoyProps {
  onUnlock: () => void;
}

export const NginxDecoy: React.FC<NginxDecoyProps> = ({ onUnlock }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      color: 'black',
      fontFamily: 'Georgia, serif',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '100px',
      margin: 0
    }}>
      <div style={{ width: '600px', textAlign: 'left' }}>
        <h1 
          onClick={onUnlock}
          style={{ 
            fontSize: '2em', 
            marginBottom: '0.5em', 
            cursor: 'default',
            userSelect: 'none'
          }}
        >
          Welcome to nginx!
        </h1>
        <p>If you see this page, the nginx web server is successfully installed and working. Further configuration is required.</p>

        <p>For online documentation and support please refer to <a href="http://nginx.org/" style={{ color: '#0000EE' }}>nginx.org</a>.<br/>
        Commercial support is available at <a href="http://nginx.com/" style={{ color: '#0000EE' }}>nginx.com</a>.</p>

        <p><em>Thank you for using nginx.</em></p>
      </div>
    </div>
  );
};
