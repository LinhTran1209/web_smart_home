import GreetingCard from "../../components/dashboard/GreetingCard.jsx";
import HomeDevices from "../../components/dashboard/HomeDevices.jsx";
import TemperaturePanel from "../../components/dashboard/TemperaturePanel.jsx";
import MyDevicesPanel from "../../components/dashboard/MyDevicesPanel.jsx";
import MembersPanel from "../../components/dashboard/MembersPanel.jsx";
import PowerChart from "../../components/dashboard/PowerChart.jsx";

const HomePage = () => {
  return (
    <div className="home-grid">
      {/* Cột trái */}
      <div className="home-left">
        <GreetingCard city="HaNoi"/>

        <section className="card section-card">
          <HomeDevices />
        </section>

        <section className="card section-card">
          <TemperaturePanel />
        </section>
      </div>

      {/* Cột phải */}
      <div className="home-right">
        <section className="card side-card">
          <MyDevicesPanel />
        </section>

        <section className="card side-card">
          <MembersPanel />
        </section>

        <section className="card side-card">
          <PowerChart />
        </section>
      </div>
    </div>
  );
};

export default HomePage;
