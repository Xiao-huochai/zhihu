import HomeHead from "../components/HomeHead";
import _ from "../assets/utils";
import { useState } from "react";

const Home = function Home() {
  let [today, setToday] = useState<string>(
    _.formatTime(undefined, "{0}{1}{2}"),
  );

  return (
    <div className="home-box">
      <HomeHead today={today} />
    </div>
  );
};
export default Home;
