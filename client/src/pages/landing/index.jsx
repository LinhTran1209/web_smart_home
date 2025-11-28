import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LandingLayout from "../../components/layouts/landingLayout.jsx";
import img_test from "../../assets/images/test.jpg";
import img_onboard_1 from "../../assets/images/onboarding1.png";
import img_onboard_2 from "../../assets/images/onboarding2.png";
import IntroSlide from "../../components/forms/introSlide.jsx";

const onboardingSlides = [
  {
    id: 1,
    image: img_onboard_1,
    title: "Effortless control for your classroom",
    description: "VOSmart empowers you to easily manage devices.",
  },
  {
    id: 2,
    image: img_onboard_2,
    title: "Control your environment",
    description:
      "Data of temperature, humidity, and light charts to adjust settings automatically or manually.",
  },
];

// intro mặt định (onboarding0)
const IntroDefault = ({ onNext }) => (
  <div className="introDefault fade-in-up">
    <h1>Welcome to VO Smart Home</h1>
    <p>
      VO Smart helps you manage devices, lighting and classroom temperature
      automatically and intelligently.
    </p>

    <button className="btn btn-get-started" onClick={onNext}>
      Get Started
    </button>
  </div>
);

const LandingPage = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const totalSlides = onboardingSlides.length;

  // Khi bấm Skip hoặc Done -> sang trang register
  const handleSkip = () => {
    navigate("/register");
  };

  // Logic next: intro default -> slide 1 -> ... -> slide cuối -> /register
  const handleNext = () => {
    if (step === 0) {
      setStep(1);
      return;
    }
    if (step >= totalSlides) {
      handleSkip(); // slide cuối -> đi tiếp
      return;
    }
    setStep((prev) => prev + 1);
  };

  // Chọn nội dung intro theo step
  let introContent;
  if (step === 0) {
    introContent = <IntroDefault onNext={handleNext} />;
  } else {
    const currentSlide = onboardingSlides[step - 1];
    introContent = (
      <IntroSlide
        slide={currentSlide}
        index={step - 1}
        total={totalSlides}
        isLast={step === totalSlides}
        onNext={handleNext}
        onSkip={handleSkip}
      />
    );
  }

  // Hiệu ứng xuất hiện feature-card
  useEffect(() => {
    const cards = document.querySelectorAll(".feature-card");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // chỉ animate 1 lần
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <LandingLayout>
      <section className="intro">
        {step === 0 ? (
          <IntroDefault onNext={() => setStep(1)} />
        ) : (
          <div key={step} className="intro-screen fade-in-up">
            {introContent}
          </div>
        )}
      </section>

      <section id="features" className="features">
        <div className="feature-card">
          <h3>Device management</h3>
          <img src={img_test} alt="" className="img-card" />
          <p>
            Monitor and control all classroom devices right on one dashboard.
          </p>
        </div>

        <div className="feature-card">
          <h3>Control your environment</h3>
          <img src={img_test} alt="" className="img-card" />
          <p>
            Data of temperature, humidity, and light charts to adjust settings
            automatically or manually.
          </p>
        </div>

        <div className="feature-card">
          <h3>Data analysis</h3>
          <img src={img_test} alt="" className="img-card" />
          <p>
            Collect data and display visual charts to optimize classroom usage
            and save energy.
          </p>
        </div>
      </section>
    </LandingLayout>
  );
};

export default LandingPage;
