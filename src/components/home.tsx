import { useEffect, useCallback, useState } from "react";
import { useAuth } from "../auth/use-auth";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function Home() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleCredentialResponse = useCallback(
    async (response: CredentialResponse) => {
      const token = response.credential;
      setError(null);

      try {
        const res = await fetch("https://we23tm7jpl.execute-api.us-east-1.amazonaws.com/dev/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) {
          throw new Error('Login failed. Please try again.');
        }

        const data = await res.json();
        Cookies.set('authToken', data.token, { 
          expires: 2,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Lax'
        });
        login(data.user);
        navigate("/dashboard");
      } catch (err) {
        console.error('Login error:', err);
        setError(err instanceof Error ? err.message : 'Failed to login. Please try again.');
      }
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
        <div className="flex flex-col items-center gap-4">
          <div id="google-button" style={{ width: "200px" }}></div>
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
