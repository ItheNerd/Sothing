import AuthContext from "@/context/AuthContext";
import React, { useContext, useEffect } from "react";

const baseURL = import.meta.env.VITE_API_AUTH_URL


const test = () => {
  const {accessToken} = useContext(AuthContext)
  useEffect(() => {
    const createEvent = () => {
      const event_data = {
        event_name: "Default Event",
        date: "2023-06-01",
        time: "12:00",
        location: "Default Location",
        image: "default_image.jpg",
      };
  
      fetch(`${baseURL}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Include the access token for authentication
        },
        body: JSON.stringify(event_data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Event created:", data);
          // Handle the response from the server
        })
        .catch((error) => {
          console.error("Error:", error);
          // Handle any errors that occur during the request
        });
    };
  
    // Call the createEvent function to make the POST request
    createEvent();
  }, []);
  return <div>test</div>;
};

export default test;
