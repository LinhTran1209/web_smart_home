import "../../assets/styles/auth.css";

const AuthLayout = ({ children }) => {
  return (
    <>
      <header style={{background: "rgba(7, 8, 90, 0.75)"}}>
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

      <div className="wrapper-background">
        <div className="bg-gradient">
          <main className="auth-main">
            <section className="auth-card">{children}</section>
          </main>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
