import { Link } from "gatsby"
import React from "react"
import SEO from "../components/seo"

export default function Header(props) {
  const location = window.location.pathname

  return (
    <>
      <SEO title="examples" />
      <div>
        <h1 className="text-6xl text-center">D3 training</h1>
        <ul className="flex container mx-auto w-1/2 justify-between">
          <li
            className={`text-blue-500 hover:text-blue-800 ${
              location === "/" ? "text-blue-800" : ""
            }`}
          >
            <Link to="/">first example</Link>
          </li>
          <li
            className={`text-blue-500 hover:text-blue-800 ${
              location === "/second" ? "text-blue-800" : ""
            }`}
          >
            <Link to="/second">second example</Link>
          </li>
          <li
            className={`text-blue-500 hover:text-blue-800 ${
              location === "/third" ? "text-blue-800" : ""
            }`}
          >
            <Link to="/third">third example</Link>
          </li>
        </ul>
      </div>
    </>
  )
}
