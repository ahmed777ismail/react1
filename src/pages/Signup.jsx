import Header from "../comp/header";
import Footer from "../comp/Footer";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useState } from "react";

import { auth } from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [hasError, sethasError] = useState(false);
  const [firebaseError, setfirebaseError] = useState("");
  const [userName, setuserName] = useState("");
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      if (user.emailVerified) {
        navigate("/");
      }
    }
  });

  if (loading) {
    return (
      <div>
        <Header />
        <main></main>
        <Footer />
      </div>
    );
  }

  if (user) {
    if (!user.emailVerified) {
      return (
        <div>
          <Header />

          <main>
            <p>We send you an email to verify your Account</p>
            <button className="delete">Send again</button>
          </main>
          <Footer />
        </div>
      );
    }
  }
  if (!user) {
    return (
      <>
        <Helmet>
          <title>Signup</title>
        </Helmet>
        <Header />

        <main>
          <form>
            <p style={{ fontSize: "23px", marginBottom: "22px" }}>
              Create a new account <span>🧡</span>{" "}
            </p>

            <input
              onChange={(eo) => {
                setuserName(eo.target.value);
              }}
              required
              placeholder=" userName : "
              type="text"
            />

            <input
              onChange={(eo) => {
                setemail(eo.target.value);
              }}
              required
              placeholder=" E-mail : "
              type="email"
            />

            <input
              onChange={(eo) => {
                setpassword(eo.target.value);
              }}
              required
              placeholder=" Password : "
              type="password"
            />
            <button
              onClick={(eo) => {
                eo.preventDefault();

                createUserWithEmailAndPassword(auth, email, password)
                  .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    sendEmailVerification(auth.currentUser).then(() => {
                      // Email verification sent!
                      // ...
                    });

                    updateProfile(auth.currentUser, {
                      displayName: userName,
                    })
                      .then(() => {
                        navigate("/");
                      })
                      .catch((error) => {
                        // An error occurred
                        // ...
                      });

                    // ...
                  })
                  .catch((error) => {
                    const errorCode = error.code;
                    sethasError(true);

                    switch (errorCode) {
                      case "auth/invalid-email":
                        setfirebaseError("Wrong Email");
                        break;

                      case "auth/user-not-found":
                        setfirebaseError("Wrong Email");
                        break;

                      case "auth/wrong-password":
                        setfirebaseError("Wrong Password");
                        break;

                      case "auth/too-many-requests":
                        setfirebaseError(
                          "Too many requests, please try aganin later"
                        );
                        break;

                      default:
                        setfirebaseError("Please check your email & password");
                        break;
                    }
                  });
              }}
            >
              Sign up
            </button>
            <p className="account">
              Already hava an account <Link to="/signin"> Sign-in</Link>
            </p>

            {hasError && <h2>{firebaseError}</h2>}
          </form>
        </main>
        <Footer />
      </>
    );
  }
};

export default Signup;
