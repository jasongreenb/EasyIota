import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import EditRide from "../components/EditRide";

export default function ViewPage() {
  const [upcomingRides, setUpcomingRides] = useState([]);
  const [isError, setIsError] = useState(null);
  const [editRide, setEditRide] = useState(null);
  const [table, setTable] = useState("");
  const [tableDone, setTableDone] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [rideupdate, setrideupdate] = useState(false);

  useEffect(() => {
    async function fetch_shifts() {
      //  setIsLoading(true);
      if (!tableDone) {
        return;
      }
      try {
        const response = await fetch(
          // "http://localhost:8000/api/getupcoming/realistic_test"
          `http://localhost:8000/api/getupcoming/${table}`
        );

        if (!response.ok) {
          console.error("Response is not OK/Invalid Table Name");
          setIsError("Response is not OK");
          setShowReset(true);
        }

        const data = await response.json();
        setUpcomingRides(data.upcoming_shifts);
        //      setIsLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setIsError("Error fetching data");
      }
    }

    fetch_shifts();
  }, [tableDone, table, rideupdate]);

  function handlereset() {
    setIsError(null);
    setTable("");
    setTableDone(false);
    setUpcomingRides([]);
    setShowReset(false);
  }

  if (isError) {
    if (showReset) {
      return (
        <>
          <button onClick={handlereset}>reset?</button>
          <h1>{isError}</h1>
        </>
      );
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTableDone((flag) => !flag);
  }

  return (
    <>
      {isError ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <div>
            <NavBar />
          </div>
          <h1>
            {editRide && (
              <EditRide
                ride={editRide}
                table={table}
                setrideupdate={setrideupdate}
                setEditRide={setEditRide}
                rideupdate={rideupdate}
              />
            )}
          </h1>
          <div>
            {!tableDone ? (
              <form onSubmit={(e) => handleSubmit(e)}>
                <input
                  type="text"
                  value={table}
                  placeholder="enter a tablename"
                  onChange={(e) => setTable(e.target.value)}
                />
                <button type="submit">Submit</button>
              </form>
            ) : (
              <>
                <h1 style={{ width: "35%" }}>Upcoming Rides (2 weeks)</h1>
                <div
                  style={{
                    maxHeight: 800,
                    overflow: "auto",
                    width: "35%",
                  }}
                >
                  {upcomingRides.map((ride) => (
                    <li
                      key={ride.id}
                      style={{
                        listStyleType: "none",
                        padding: "10px",
                        border: "solid black 1px",
                        textAlign: "center",
                        alignContent: "center",
                      }}
                    >
                      <p style={{ color: "red" }}>Access_Index: {ride.id}</p>
                      <p>Date: {new Date(ride.Date).toLocaleDateString()}</p>
                      <p>Day: {ride.Day_Of_Week}</p>
                      <p>Officer: {ride.Officer}</p>
                      <p>Officer Phone: {ride.Officer_Phone_Num}</p>
                      <p>Shotty: {ride.Shotty}</p>
                      <p>Shotty Phone: {ride.Shotty_Phone_Num}</p>
                      <p>Driver: {ride.Driver}</p>
                      <p>Driver Phone: {ride.Driver_Phone_Num}</p>
                      <p>Venmo: {ride.Venmo}</p>
                      <button onClick={() => setEditRide(ride)}>Edit</button>
                    </li>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
