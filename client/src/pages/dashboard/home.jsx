import GreetingCard from "../../components/dashboard/GreetingCard.jsx";
import HomeDevices from "../../components/dashboard/HomeDevices.jsx";
import MyDevicesPanel from "../../components/dashboard/DevicePanel.jsx";
import MembersPanel from "../../components/dashboard/MembersPanel.jsx";
import PowerChart from "../../components/dashboard/PowerChart.jsx";

import checkDeviceType from "../../utils/checkDeviceType.js";

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
          <MyDevicesPanel />
        </section>
      </div>

      {/* Cột phải */}
      <div className="home-right">
        {/* <section className="card side-card">
          <MyDevicesPanel />
        </section> */}

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
