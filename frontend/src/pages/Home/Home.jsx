import Hero from "../../components/home/Hero";
import FlightSearch from "../../components/home/FlightSearch";
import PopularDestinations from "../../components/home/PopularDestinations";
import Features from "../../components/home/Features";

function Home() {
  return (
    <>
      <Hero />
      <FlightSearch />
      <PopularDestinations />
      <Features />
    </>
  );
}

export default Home;