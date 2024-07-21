/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { API_BASE_URL } from "./DataSource";
import { useEffect } from "react";

export default function NavigationBar({
  isAdmin,
  toggleSidebar,
  isSidebarOpen,
}) {
  const { auth } = useSelector((state) => state);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const response = await fetch(API_BASE_URL + "/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ us_email: email, us_password: password }),
      });
      if (!response.ok) {
        alert("Invalid email and password combination");
        throw new Error("Network response was not ok");
      }
      const loginData = await response.json();
      localStorage.setItem("token", loginData.token);
      dispatch({
        type: "SET_AUTH",
        payload: {
          ...auth,
          isLogin: true,
          loginData: loginData,
          token: loginData.token,
        },
      });
    } catch (error) {
      console.log(error.message);
      alert("Failed to Login");
    }
  }

  useEffect(() => {
    (async () => {
      try {
        if (auth.token) {
          const response = await fetch(API_BASE_URL + "/api/login/info", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: auth.token }),
          });
          if (!response.ok) {
            localStorage.removeItem("token");
            throw new Error("Network response was not ok, please try again");
          }
          const json = await response.json();
          json.status
            ? json.status === "success"
              ? dispatch({
                  type: "SET_AUTH",
                  payload: {
                    ...auth,
                    isLogin: true,
                    loginData: json,
                    token: auth.token,
                  },
                })
              : dispatch({
                  type: "SET_AUTH",
                  payload: {
                    ...auth,
                    isLogin: false,
                    loginData: {},
                    token: "",
                  },
                })
            : console.log("Error check user token, please try again");
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [auth.isLogin]);

  async function handleLogout(e) {
    e.preventDefault();
    try {
      const response = await fetch(
        API_BASE_URL + "/api/auth/logout?token=" + auth.token
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      localStorage.removeItem("token");
      dispatch({
        type: "SET_AUTH",
        payload: { ...auth, isLogin: false, loginData: {}, token: "" },
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg bg-body-tertiary pk-navigation-bar sticky-top ${
          isAdmin ? (isSidebarOpen ? "shifted" : "") : ""
        }`}
      >
        <div className="container-fluid">
          {isAdmin ? (
            <button className="pk-sidebar-btn" onClick={toggleSidebar}>
              {isSidebarOpen ? "Close Sidebar >" : "Open Sidebar <"}
            </button>
          ) : (
            ""
          )}
          <a className="navbar-brand" href="#">
            <img className="pk-ball-logo" src="../img/pokeball.png" alt="" />
            <img className="pk-logo" src="../img/pokemon-logo.png" alt="" />
            <img
              className="pk-logo"
              style={{ width: "70px" }}
              src="../img/sgt-logo.png"
              alt=""
            />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to="/" className="nav-link active" aria-current="page">
                  <b>Pokemon List Page</b>
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav pk-menu-profile">
              <li className="nav-item dropdown">
                <div className="pk-auth">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {!auth.isLogin ? "Login" : auth.loginData.us_username}
                  </a>
                  <form onSubmit={handleLogin}>
                    {!auth.isLogin ? (
                      <ul className="dropdown-menu text-center">
                        <li>
                          <input
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </li>
                        <li>
                          <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </li>
                        <li>
                          <button type="submit">Login</button>
                        </li>
                      </ul>
                    ) : (
                      <ul className="dropdown-menu text-center">
                        <li>
                          <Link to={"/myPokemon"}>
                            {" "}
                            <button
                              style={{
                                margin: "10px",
                                backgroundColor: "blue",
                              }}
                            >
                              Go to My Pokemon
                            </button>
                          </Link>
                        </li>
                        {auth.loginData.us_username === "phincon" ? (
                          <li>
                            <Link to={"/admin"}>
                              {" "}
                              <button
                                style={{
                                  margin: "10px",
                                  backgroundColor: "gray",
                                }}
                              >
                                Configuration
                              </button>
                            </Link>
                          </li>
                        ) : (
                          ""
                        )}
                        <li>
                          <button onClick={handleLogout}>Logout</button>
                        </li>
                      </ul>
                    )}
                  </form>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
