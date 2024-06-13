import React from "react";
import "./Addtask.scss"; // Import local SCSS file
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../../components/Header/Header";
import Navigation from "../../../components/Navigation/Navigation";
import Loading from "../../../components/Loading/Loading";
import baseUrl from "../../../scripts/baseUrl";

const Addtask = () => {
  const [station_name, setStation_name] = useState("");
  const [todayTask, setTodayTask] = useState("");
  const [tommorow_plan, setTomorrowPlan] = useState("");
  const [loader, setLoader] = useState(false);

  const [stations, setStations] = useState([]);
  const [tommorow, setTommorow] = useState([]);

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // setIsLoading(true);
      // setError(null);
      try {
        const response = await axios.get(`${baseUrl}/api/task/today`);
        // console.log("res ", response);
        setTasks(response.data);
      } catch (error) {
        // setError(error.message);
        console.error("Error fetching tasks:", error);
      } finally {
        // setIsLoading(false);
      }
    };

    fetchData();
  }, [todayTask]);

  useEffect(() => {
    const fetchData = async () => {
      // setIsLoading(true);
      // setError(null);
      try {
        const response = await axios.get(`${baseUrl}/api/task/tommorow`);
        // console.log("res ", response);
        setTommorow(response.data);
      } catch (error) {
        // setError(error.message);
        console.error("Error fetching tasks:", error);
      } finally {
        // setIsLoading(false);
      }
    };

    fetchData();
  }, [tommorow]);

  useEffect(() => {
    const fetchData = async () => {
      // setIsLoading(true);
      // setError(null);
      try {
        const response = await axios.get(`${baseUrl}/api/task/station`);
        console.log("res ", response);
        setStations(response.data);
      } catch (error) {
        // setError(error.message);
        console.error("Error fetching tasks:", error);
      } finally {
        // setIsLoading(false);
      }
    };

    fetchData();
  }, [station_name]);

  console.log("station ", stations);
  console.log("task ", tasks);
  console.log("tommo ", tommorow);

  const handleSubmitStation = async (event) => {
    event.preventDefault();

    // Implement database integration logic here
    // Example using axios (replace with your preferred method)
    console.log("submitting" , station_name);
    
    try {
      const response = await axios.post(`${baseUrl}/api/task/station`, {
        station_name,
      });
      console.log("Task submission response:", response.data);
      // Handle successful submission (e.g., clear form, display success message)
    } catch (error) {
      console.error("Error submitting task:", error.message);
      // Handle errors appropriately (e.g., display error message)
    } finally {
      setStation_name("");
    }
  };

  const handleSubmitTodayPlan = async (event) => {
    event.preventDefault();

    // Implement database integration logic here
    // Example using axios (replace with your preferred method)
    console.log("submitting");
    try {
      const response = await axios.post(`${baseUrl}/api/task/today`, {
        todayTask,
      });
      console.log("Task submission response:", response.data);
      // Handle successful submission (e.g., clear form, display success message)
    } catch (error) {
      console.error("Error submitting task:", error.message);
      // Handle errors appropriately (e.g., display error message)
    } finally {
      setTodayTask("");
    }
  };

  const handleSubmitTommorowPlan = async (event) => {
    event.preventDefault();

    // Implement database integration logic here
    // Example using axios (replace with your preferred method)
    console.log("submitting");
    try {
      const response = await axios.post(`${baseUrl}/api/task/tommorow`, {
        tommorow_plan,
      });
      console.log("Task submission response:", response.data);
      // Handle successful submission (e.g., clear form, display success message)
    } catch (error) {
      console.error("Error submitting task:", error.message);
      // Handle errors appropriately (e.g., display error message)
    } finally {
      setTomorrowPlan(""); // Clear form after submission
    }
  };

  return (
    <>
      {localStorage.getItem("n_admin") !== null && (
        <>
          <Header />
          <div className="screen-container">
            <Navigation />
            <div className="side-container">
              <div className="screen-title title-large">Add task</div>

              <form className="addtask-form" onSubmit={handleSubmitStation}>
                {/* <label htmlFor="station">Station:</label>
                <select
                  id="station"
                  value={station_name}
                  onChange={(e) => setStation_name(e.target.value)}
                >
                  <option value="">Select Station</option>
                  {/* Replace with your actual station options */}
                {/* <option value="stationA">Station A</option>
                  <option value="stationB">Station B</option>
                  <option value="stationC">Station C</option> */}
                {/* </select> */}

                <label htmlFor="todayTask">Station</label>
                <input
                  type="text"
                  id="station"
                  value={station_name}
                  onChange={(e) => setStation_name(e.target.value)}
                  required
                  className="addtask-input"
                />
                <button type="submit" className="addtask-submit">
                  Submit
                </button>
                <h3>Stations Table</h3>
                <table>
                  <thead>
                    <tr>
                      <th className="sr-no">Sr.no</th>
                      <th className="station-name">Station Name</th>
                      {/* Add more headers as needed */}
                    </tr>
                  </thead>
                  <tbody>
                    {stations.map((station) => (
                      <tr key={station.id}>
                        <td className="sr-no">{station.id}</td>
                        <td className="station-name">{station.station_name}</td>
                        {/* Add more table cells for other station properties */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </form>

              <form className="addtask-form" onSubmit={handleSubmitTodayPlan}>
                <label htmlFor="todayTask">Today's Task:</label>
                <input
                  type="text"
                  id="todayTask"
                  value={todayTask}
                  onChange={(e) => setTodayTask(e.target.value)}
                  required
                  className="addtask-input"
                />

                <button type="submit" className="addtask-submit">
                  Submit
                </button>

                <h3>Tasks Table</h3>
                {/* Check for empty data before rendering the tasks table */}
                {/* {renderEmptyMessage(tasks)} */}
                <table>
                  <thead>
                    <tr>
                      {/* Add table headers based on your tasks data structure */}
                      <th className="sr-no">Sr.no</th>
                      <th className="station-name">Task Name</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task.id}>
                        {" "}
                        {/* Replace 'id' with the unique identifier property */}
                        {/* Render task data in table cells */}
                        <td className="sr-no">{task.id}</td>
                        <td className="station-name">{task.today_plan}</td>
                        {/* Assuming 'name' is a property for tasks */}
                        {/* Assuming 'priority' is a property for tasks */}
                        {/* Add more table cells for other task properties */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </form>

              <form
                className="addtask-form"
                onSubmit={handleSubmitTommorowPlan}
              >
                <label htmlFor="tomorrowPlan">Tomorrow's Plan:</label>
                <input
                  type="text"
                  id="tomorrowPlan"
                  value={tommorow_plan}
                  onChange={(e) => setTomorrowPlan(e.target.value)}
                  required
                  className="addtask-input"
                />

                <button type="submit" className="addtask-submit">
                  Submit
                </button>

                <h3>Tomorrow's Schedule Table</h3>
                {/* Check for empty data before rendering the tommorow table */}
                {/* {renderEmptyMessage(tommorow)} */}
                <table>
                  <thead>
                    <tr>
                      {/* Add table headers based on your tommorow data structure */}
                      <th>Sr.no</th>
                      <th>Event Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tommorow.map((item) => (
                      <tr key={item.id}>
                        {" "}
                        {/* Replace 'id' with the unique identifier property */}
                        {/* Render tommorow data in table cells */}
                        <td>{item.id}</td>{" "}
                        {/* Assuming 'name' is a property for tommorow items */}
                        <td>{item.tommorow_plan}</td>{" "}
                        {/* Assuming 'time' is a property for tommorow items */}
                        {/* Add more table cells for other tommorow item properties */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </form>

              {/* Check for empty data before rendering the stations table */}
              {/* {renderEmptyMessage(stations)} */}
            </div>
          </div>

          {loader && <Loading />}
        </>
      )}
    </>
  );
};

export default Addtask;
