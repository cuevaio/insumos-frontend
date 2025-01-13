import React from 'react';

/* function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(';').shift();
} */

export const useAuth = () => {
  const [token] = React.useState<string>('hi!');

  /* React.useEffect(() => {
    if (!token) {
      const tokenCookie = getCookie('pci_auth_access_token');
      if (tokenCookie) {
        setToken(tokenCookie);
      } else {
        window.location.replace(
          'http://localhost:1080/authenticate?username=cpp_pro',
        );
      }
    }
  }, [token]); */

  return token;
};
