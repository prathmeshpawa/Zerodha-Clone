import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="container-fluid" id="supportHero">
      <div className="p-5" id="supportWrapper">
        <h4>Support Portal</h4>
        <Link to="/">Track Tickets</Link>
      </div>

      <div className="row p-5 m-3">
        <div className="col-6 p-3">
          <h1 className="fs-3">
            Search for an answer or browse help topics to create a ticket
          </h1>

          <input placeholder="Eg. how do I activate F&O" />

          <br />

          <Link to="/">Track account opening</Link>{" "}
          <Link to="/">Track segment activation</Link>{" "}
          <Link to="/">Intraday margins</Link>{" "}
          <Link to="/">Kite user manual</Link>
        </div>

        <div className="col-6 p-3">
          <h1 className="fs-3">Featured</h1>

          <ol>
            <li>
              <Link to="/">
                Current Takeovers and Delisting - January 2024
              </Link>
            </li>

            <li>
              <Link to="/">
                Latest Intraday leverages - MIS & CO
              </Link>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}

export default Hero;