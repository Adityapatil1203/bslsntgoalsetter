import React from "react";
import "./Addtask.scss"; // Import local SCSS file
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../../components/Header/Header";
import Navigation from "../../../components/Navigation/Navigation";
import Loading from "../../../components/Loading/Loading";
import baseUrl from "../../../scripts/baseUrl";
import Modal from "../../../components/Modal/Modal";

const Addtask = () => {
  const [station_name, setStation_name] = useState("");
  const [todayTask, setTodayTask] = useState("");
  const [tomorrow_plan, setTomorrowPlan] = useState("");
  const [loader, setLoader] = useState(false);

  const [stations, setStations] = useState([]);
  const [tommorow, setTommorow] = useState([]);
  const [tasks, setTasks] = useState([]);

  // const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'edit' or 'delete'
  const [selectedStation, setSelectedStation] = useState("");
  const [newWord,setNewWord] = useState('')
  const [selectedStationId, setSelectedStationId] = useState()
  const [table,setTable] = useState('')


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

  // console.log("station ", stations);
  // console.log("task ", tasks);
  // console.log("tommo ", tommorow);

  const handleSubmitStation = async (event) => {
    event.preventDefault();

    // Implement database integration logic here
    // Example using axios (replace with your preferred method)
    console.log("submitting", station_name);

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
    console.log("submitting ",tomorrow_plan);
    try {
      const response = await axios.post(`${baseUrl}/api/task/tomorrow`, {
        tomorrow_plan,
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


  const handleDelete = (data)=>{
    setTable(data)
  
    setModalType("delete");
    setShowModal(true);
    setNewWord('')
   
  }

  const handleEdit = (data)=>{
    setTable(data)
   
    setModalType("edit");
    setShowModal(true);
    setNewWord('')
  
  }


  const handleModalSubmitStation = async () => {
    console.log("data ",selectedStationId , newWord , selectedStation);

    console.log("table ",table);

    try {
      if (modalType === "edit") {
        await axios.put(`${baseUrl}/api/task/station/${selectedStationId}`, { station_name: newWord });
      } else if (modalType === "delete") {
        await axios.delete(`${baseUrl}/api/task/station/${selectedStationId}`);
      }
      setShowModal(false);
      setSelectedStation("");
      setNewWord('')
      setLoader(true);
      // Re-fetch data after update or delete
      const fetchData = async () => {
        try {
          // const todayResponse = await axios.get(`${baseUrl}/api/task/today`);
          // const tomorrowResponse = await axios.get(`${baseUrl}/api/task/tomorrow`);
          const stationsResponse = await axios.get(`${baseUrl}/api/task/station`);
          setStations(stationsResponse.data);
          // setTomorrow(tomorrowResponse.data);
          // setStations(stationsResponse.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoader(false);
        }
      };
      fetchData();
    } catch (error) {
      console.error("Error updating station:", error);
    }
    setTable('')
   
  };

 
  const  handleModalSubmitToday = async()=>{
    console.log("data ",selectedStationId , newWord , selectedStation);

    console.log("table ",table);

    try {
      if (modalType === "edit") {
        await axios.put(`${baseUrl}/api/task/today/${selectedStationId}`, { todayTask: newWord });
      } else if (modalType === "delete") {
        await axios.delete(`${baseUrl}/api/task/today/${selectedStationId}`);
      }
      setShowModal(false);
      setSelectedStation("");

      setNewWord('')
      setLoader(true);
      // Re-fetch data after update or delete
      const fetchData = async () => {
        try {
          const todayResponse = await axios.get(`${baseUrl}/api/task/today`);
          // const tomorrowResponse = await axios.get(`${baseUrl}/api/task/tomorrow`);
          // const stationsResponse = await axios.get(`${baseUrl}/api/task/station`);
          setTasks(todayResponse.data);
          // setTomorrow(tomorrowResponse.data);
          // setStations(stationsResponse.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoader(false);
        }
      };
      fetchData();
    } catch (error) {
      console.error("Error updating station:", error);
    }
    setTable('')
  }

  const  handleModalSubmitTomorrow = async()=>{
    console.log("data ",selectedStationId , newWord , selectedStation);

    console.log("table ",table);

    try {
      if (modalType === "edit") {
        await axios.put(`${baseUrl}/api/task/tomorrow/${selectedStationId}`, { tomorrow_plan: newWord });
      } else if (modalType === "delete") {
        await axios.delete(`${baseUrl}/api/task/tomorrow/${selectedStationId}`);
      }
      setShowModal(false);
      setSelectedStation("");

      setNewWord('')
      setLoader(true);
      // Re-fetch data after update or delete
      const fetchData = async () => {
        try {
          // const todayResponse = await axios.get(`${baseUrl}/api/task/today`);
          const tomorrowResponse = await axios.get(`${baseUrl}/api/task/tommorow`);
          // const stationsResponse = await axios.get(`${baseUrl}/api/task/station`);
          setTommorow(tomorrowResponse.data);
          // setTomorrow(tomorrowResponse.data);
          // setStations(stationsResponse.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoader(false);
        }
      };
      fetchData();
    } catch (error) {
      console.error("Error updating station:", error);
    }
    setTable('')
  }



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
                <label htmlFor="todayTask">Station</label>
                <div>
                  <input
                    type="text"
                    id="station"
                    value={station_name}
                    onChange={(e) => setStation_name(e.target.value)}
                    placeholder="Enter station"
                    required
                    className="addtask-input"
                  />
                  <button type="submit" className="addtask-submit">
                    Submit
                  </button>
                </div>

               
              </form>
              <div>
                
              <h5>Stations Table</h5>
              <button onClick={()=>handleEdit('station')} className="table-action-button">Edit</button>
                <button onClick={()=>handleDelete('station')} className="table-action-button">Delete</button>
                <table>
                  <thead>
                    <tr>
                      <th className="sr-no">Sr.no</th>
                      <th className="station-name">Station Name</th>
                      {/* Add more headers as needed */}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(stations) && stations?.map((station,ind) => (
                      <tr key={station.id}>
                        <td className="sr-no">{ind+1}</td>
                        <td className="station-name">{station.station_name}</td>
                        {/* Add more table cells for other station properties */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>


              <form className="addtask-form" onSubmit={handleSubmitTodayPlan}>
                <label htmlFor="todayTask">Today's Task:</label>
                <div>            
                <input
                  type="text"
                  id="todayTask"
                  value={todayTask}
                  onChange={(e) => setTodayTask(e.target.value)}
                  placeholder="Enter today task"
                  required
                  className="addtask-input"
                />

                <button type="submit" className="addtask-submit">
                  Submit
                </button>
                </div>
              
              </form>
            <div>
            <h5>Today's task table</h5>
            <button onClick={()=>handleEdit('today')} className="table-action-button">Edit</button>
                <button onClick={()=>handleDelete('today')} className="table-action-button">Delete</button>
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
                    {Array.isArray(tasks) && tasks?.map((task,ind) => (
                      <tr key={task.id}>
                        {" "}
                        {/* Replace 'id' with the unique identifier property */}
                        {/* Render task data in table cells */}
                        <td className="sr-no">{ind+1}</td>
                        <td className="station-name">{task?.today_task}</td>
                        {/* Assuming 'name' is a property for tasks */}
                        {/* Assuming 'priority' is a property for tasks */}
                        {/* Add more table cells for other task properties */}
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>

              <form
                className="addtask-form"
                onSubmit={handleSubmitTommorowPlan}
              >
                <label htmlFor="tomorrowPlan">Tomorrow's Plan:</label>
                <div>
                <input
                  type="text"
                  id="tomorrowPlan"
                  value={tomorrow_plan}
                  onChange={(e) => setTomorrowPlan(e.target.value)}
                  placeholder="Enter tomorrow's plan"
                  required
                  className="addtask-input"
                />

                <button type="submit" className="addtask-submit">
                  Submit
                </button>
                </div>
               
              </form>
              <div>
              <h5>Tomorrow's plan table</h5>
              <button onClick={()=>handleEdit('tomorrow')} className="table-action-button">Edit</button>
                <button onClick={()=>handleDelete('tomorrow')} className="table-action-button">Delete</button>
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
                    {Array.isArray(tommorow) && tommorow?.map((item , ind) => (
                      <tr key={item.id}>
                        {" "}
                        {/* Replace 'id' with the unique identifier property */}
                        {/* Render tommorow data in table cells */}
                        <td>{ind+1}</td>{" "}
                        {/* Assuming 'name' is a property for tommorow items */}
                        <td>{item?.tomorrow_plan}</td>{" "}
                        {/* Assuming 'time' is a property for tommorow items */}
                        {/* Add more table cells for other tommorow item properties */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Check for empty data before rendering the stations table */}
              {/* {renderEmptyMessage(stations)} */}
            </div>
          </div>

          {loader && <Loading />}
        </>
      )}
       {/* <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={ ()=>{
          if(table==='station')
          handleModalSubmitStation()
           else if(table==='today')
          handleModalSubmitToday()
           else if(table==='tomorrow')
          handleModalSubmitTomorrow()
        }        
          }
        title={modalType === "edit" ? "Edit Station" : "Delete Station"}
      >
        <div>
          <label htmlFor="stationSelect">Select Station</label>
          <select
            id="stationSelect"
            value={selectedStation}
            onChange={(e) => {
              const selectedStationId = stations.find(station => station.station_name === e.target.value)?.id;
              setSelectedStation(e.target.value);
              setSelectedStationId(selectedStationId);
            }}
            
          >
            <option value="">Select a station</option>
            {referTable?.map((item) => (
              <option key={item?.id} value={item?.itemName}>
                {item?.itemName}
              </option>
            ))}
           
          </select>
         <input type="text"
         value={newWord}
         onChange={(e)=>setNewWord(e.target.value)}
         ></input>
        </div>
       
      </Modal> */}


   {
     table === 'station' && 
    <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={ handleModalSubmitStation  
          }
        title={modalType === "edit" ? "Edit Station" : "Delete Station"}
      >
        <div>
          <label htmlFor="stationSelect">Select Station</label>
          <select
            id="stationSelect"
            value={selectedStation}
            onChange={(e) => {
              const selectedStationId = stations.find(station => station.station_name === e.target.value)?.id;
              setSelectedStation(e.target.value);
              setSelectedStationId(selectedStationId);
            }}
            
          >
            <option value="">Select a station</option>
            {stations?.map((station) => (
              <option key={station?.id} value={station?.station_name}>
                {station?.station_name}
              </option>
            ))}
           
          </select>
          { modalType === 'edit'  && <input type="text"
         value={newWord}
         onChange={(e)=>setNewWord(e.target.value)}
         ></input>
     }
        </div>
       
      </Modal>
}


{
     table === 'today' && 
    <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={ handleModalSubmitToday  
          }
        title={modalType === "edit" ? "Edit Today task" : "Delete today task"}
      >
        <div>
          <label htmlFor="stationSelect">Select task</label>
          <select
            id="stationSelect"
            value={selectedStation}
            onChange={(e) => {
              const selectedStationId = tasks.find(t => t.today_task === e.target.value)?.id;
              setSelectedStation(e.target.value);
              setSelectedStationId(selectedStationId);
            }}
            
          >
            <option value="">Select a station</option>
            {tasks?.map((t) => (
              <option key={t?.id} value={t?.today_task}>
                {t?.today_task}
              </option>
            ))}
           
          </select>
          { modalType === 'edit'  && <input type="text"
         value={newWord}
         onChange={(e)=>setNewWord(e.target.value)}
         ></input>
     }
        </div>
       
      </Modal>
}


{
     table === 'tomorrow' && 
    <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={ handleModalSubmitTomorrow  
          }
        title={modalType === "edit" ? "Edit Tomorrow plan" : "Delete Tomorrow plan"}
      >
        <div>
          <label htmlFor="stationSelect">Select Tomorrow plan</label>
          <select
            id="stationSelect"
            value={selectedStation}
            onChange={(e) => {
              const selectedStationId = tommorow.find(t => t.tomorrow_plan === e.target.value)?.id;
              setSelectedStation(e.target.value);
              setSelectedStationId(selectedStationId);
            }}
            
          >
            <option value="">Select a station</option>
            {tommorow?.map((t) => (
              <option key={t?.id} value={t?.tomorrow_plan}>
                {t?.tomorrow_plan}
              </option>
            ))}
           
          </select>
     { modalType === 'edit'  && <input type="text"
         value={newWord}
         onChange={(e)=>setNewWord(e.target.value)}
         ></input>
     }
        </div>
       
      </Modal>
}


    </>
  );
};

export default Addtask;
