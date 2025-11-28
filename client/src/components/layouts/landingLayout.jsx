import "../../assets/styles/landing.css";

const LandingLayout = ({ children }) => {
  return (
    <>
      <header>
        <div className="logo">
          <img src=".\public\logo.png" alt="VO Smart logo" height="60" />
          <p>VO SMART</p>
        </div>
        <nav>
          <a href="/">Home</a>
          <a href="#features">About</a>
          <a href="/signin">Signin</a>
        </nav>
      </header>
      <main className="hero">{children}</main>

      
    </>
  );
};

export default LandingLayout;
