import { useEffect, useCallback } from "react";
import { useAuth } from "../auth/use-auth";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function Home() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const handleCredentialResponse = useCallback(
    async (response: CredentialResponse) => {
      const token = response.credential;

      const res = await fetch("https://we23tm7jpl.execute-api.us-east-1.amazonaws.com/dev/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      Cookies.set('authToken', data.token, { 
        expires: 2,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax'
      });
      login(data.user);
      navigate("/dashboard");
    },
    [login, navigate]
  );

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });

        const buttonContainer = document.getElementById("google-button");
        if (buttonContainer) {
          window.google.accounts.id.renderButton(buttonContainer, {
            theme: "outline",
            size: "large",
          });
        }
      }
    };

    return () => {
      script.remove();
    };
  }, [handleCredentialResponse]);

  return (
    <div>
      {user ? (
        <div />
      ) : (
        <div id="google-button" style={{ width: "200px" }}></div>
      )}
    </div>
  );
}

export default Home;
