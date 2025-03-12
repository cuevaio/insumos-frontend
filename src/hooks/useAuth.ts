import React from 'react';

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(';').shift() ?? '';
  return '';
};

export const useAuth = () => {
  const [token, setToken] = React.useState<string>('');

  React.useEffect(() => {
    if (__SERVER_SCOPE__ === 'gsms') {
      setToken('no-auth-needed');
    } else if (!token) {
      // TODO: Define logic for KUBE access token
      const tokenCookie = getCookie('pci_auth_access_token');
      if (tokenCookie) {
        setToken(tokenCookie);
      } else {
        // // TODO: Redirect to login page
        // window.location.replace(
        //   'http://localhost:1080/authenticate?username=cpp_pro',
        // );
      }
    }
  }, [token]);

  return token;
};
