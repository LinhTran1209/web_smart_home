import img_next from '../../assets/icons/next.svg';
import img_done from '../../assets/icons/done.svg';

const IntroSlide = ({ slide, index, total, isLast, onNext, onSkip }) => {
  return (
    <div className="intro-onboard">
      <div className="onboard-left">
        <img src={slide.image} alt={slide.title} />
      </div>

      <div className="onboard-right">
        <h2>{slide.title}</h2>
        <p>{slide.description}</p>

        {/* indicator động theo tổng số slide */}
        <div className="onboard-indicator">
          {Array.from({ length: total }).map((_, i) =>
            i === index ? (
              <span key={i} className="indicator-pill" />
            ) : (
              <span key={i} className="indicator-dot" />
            )
          )}
        </div>

        <div className="onboard-actions">
          <button className="btn-skip" onClick={onSkip}>
            Skip
          </button>
          {/* <button className="btn-next" onClick={onNext}> */}
            {/* {isLast ? "Done" : "Next"} */}
            { isLast ? (
                <img className="btn-next" onClick={onNext} style={{background: "var(--primary-orange)"}} src={img_done} />
            ): (
                <img className="btn-next" onClick={onNext} style={{background: "var(--primary-orange)"}} src={img_next} />
            )}
          {/* </button> */}
        </div>
      </div>
    </div>
  );
};


export default IntroSlide;