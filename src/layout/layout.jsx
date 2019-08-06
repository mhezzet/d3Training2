import React from "react"
import SEO from "../components/seo"
import { Link } from "gatsby"

export default function Layout(props) {
  const location = window.location.pathname
  const title = location.substring(1)
    ? location.substring(1)
    : "responsive bar chart"

  return (
    <>
      <SEO title={title} />
      <div className="whole">
        <div className="side">
          <h1 className="title">D3 Training</h1>
          <ul className="nav-links">
            <Link to="/">
              <li
                className={`nav-link ${
                  location === "/" ? "nav-link-active" : ""
                }`}
              >
                responsive bar chart
              </li>
            </Link>
            <Link to="/gapminder">
              <li
                className={`nav-link ${
                  location === "/gapminder" ? "nav-link-active" : ""
                }`}
              >
                Gap Minder
              </li>
            </Link>
            <Link to="/coinstats">
              <li
                className={`nav-link ${
                  location === "/coinstats" ? "nav-link-active" : ""
                }`}
              >
                Coin Stats
              </li>
            </Link>
            <Link to="/forcedirected">
              <li
                className={`nav-link ${
                  location === "/forcedirected" ? "nav-link-active" : ""
                }`}
              >
                Force Directed Graph
              </li>
            </Link>
          </ul>
        </div>
        <div className="main">{props.children}</div>
      </div>
    </>
  )
}
