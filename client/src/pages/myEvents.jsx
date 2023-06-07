import { useAxios } from "@/lib/hooks/hooks";
import { useEffect, useState } from "react";
const HomePage = () => {
  const [Events, setEvents] = useState([]);

  let api = useAxios();

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async () => {
    api
      .get("/events/user-events/")
      .then((response) => {
        console.log("User events:", response.data);
        setEvents(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  
  return (
    <>
      <p>You are on the home page!</p>
      <ul>
        {Events.map((event) => (
          <li key={event.date}>
            {event.event_name},{event.location}
          </li>
        ))}
      </ul>
    </>
  );
};

export default HomePage;
