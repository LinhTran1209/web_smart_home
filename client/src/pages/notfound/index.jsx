// notfound.jsx
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <>
      <style>{`
        /*======================
            404 page
        =======================*/

        .page_404 {
          padding: 40px 0;
          background: #fff;
          font-family: "Arvo", serif;
          min-height: 100vh;
          display: flex;
          align-items: center;
        }

        .page_404 img {
          width: 100%;
        }

        .page_404 .container {
          max-width: 700px;
          margin: 0 auto;
          padding: 0 16px;
        }

        .page_404 .row {
          display: flex;
          justify-content: center;
        }

        .text-center {
          text-align: center;
        }

        .four_zero_four_bg {
          background-image: url("https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif");
          height: 400px;
          background-position: center;
          background-repeat: no-repeat;
        }

        .four_zero_four_bg h1 {
          font-size: 80px;
        }

        .contant_box_404 {
          margin-top: -50px;
        }

        .contant_box_404 h3 {
          font-size: 26px;
          margin-bottom: 10px;
        }

        .contant_box_404 p {
          margin-bottom: 16px;
          color: #555;
        }

        .link_404 {
          color: #fff !important;
          padding: 10px 20px;
          background: #f79421;
          margin: 20px 0;
          display: inline-block;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 500;
        }

        .link_404:hover {
          opacity: 0.9;
        }

        .col-sm-12 {
          width: 100%;
        }

        .col-sm-10 {
          width: 100%;
        }

        .col-sm-offset-1 {
          margin: 0 auto;
        }
      `}</style>

      <section className="page_404">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="col-sm-10 col-sm-offset-1 text-center">
                <div className="four_zero_four_bg">
                  <h1 className="text-center">404</h1>
                </div>

                <div className="contant_box_404">
                  <h3 className="h2">Look like you're lost</h3>

                  <p>The page you are looking for not avaible!</p>

                  <Link to="/" className="link_404">
                    Go to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
