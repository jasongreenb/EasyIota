import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import styles from "./NewViewPage.module.css";
import NewEditRide from "../components/NewEditRide";

export default function ViewPage() {
  const [upcomingShifts, setUpcomingShifts] = useState([]);
  const [tableLoaded, setTableLoaded] = useState(false);
  const [tableToLoad, setTableToLoad] = useState("");
  const [currentShiftToEdit, setCurrentShiftToEdit] = useState(null);
  const [editedRide, setEditedRide] = useState(false);
  const [isError, setIsError] = useState(false);
  const [tables, setTables] = useState([]);

  useEffect(() => {
    async function fetch_shifts() {
      if (!tableLoaded) {
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:8000/api/getupcoming/${tableToLoad}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          console.error("Error fetching shifts");
          setIsError(true);
          return;
        }

        const data = await res.json();
        setUpcomingShifts(data.upcoming_shifts);
      } catch (error) {
        console.error(error);
      }
    }

    fetch_shifts();
  }, [tableLoaded, tableToLoad, editedRide]);

  useEffect(() => {
    async function fetch_tables() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/api/gettables", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          console.error("Error fetching tables");
        }

        const data = await res.json();
        const tables = data.tables;
        setTables(tables);
      } catch (error) {
        console.error("error -- ", error);
      }
    }
    fetch_tables();
  }, []);

  function handleTableLoad(e) {
    e.preventDefault();
    setTableLoaded(true);
  }

  function handleReset() {
    setTableLoaded(false);
    setTableToLoad("");
    setUpcomingShifts([]);
    setCurrentShiftToEdit(null);
    setIsError(false);
  }

  if (isError) {
    return (
      <>
        <div>
          You entered an invalid tablename!
          <button onClick={handleReset}>Reset?</button>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />

      {!tableLoaded ? (
        <>
          <form className={styles.prompt} onSubmit={(e) => handleTableLoad(e)}>
            <input
              type="text"
              value={tableToLoad}
              placeholder="Enter a table name"
              onChange={(e) => setTableToLoad(e.target.value)}
              required
            ></input>
            <button type="submit">Click to submit</button>
          </form>

          <ul className={styles.tablelist}>
            {tables.map((row, index) => (
              <li key={index}>
                {" "}
                Table {index + 1}: {row.table_name}{" "}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className={styles.container}>
          <ul className={styles.shiftlist}>
            <div className={styles.container2}>
              <h3>Current table is -- {tableToLoad}</h3>
              <button onClick={handleReset}>Reset</button>
            </div>

            {upcomingShifts.map((shift) => (
              <li className={styles.shiftlistitem} key={shift.id}>
                <b>Access_Index: {shift.id}</b>
                <p>Date: {new Date(shift.Date).toLocaleDateString()}</p>
                <p>Day: {shift.Day_Of_Week}</p>
                <p>Officer: {shift.Officer}</p>
                <p>Officer Phone: {shift.Officer_Phone_Num}</p>
                <p>Shotty: {shift.Shotty}</p>
                <p>Shotty Phone: {shift.Shotty_Phone_Num}</p>
                <p>Driver: {shift.Driver}</p>
                <p>Driver Phone: {shift.Driver_Phone_Num}</p>
                <p>Venmo: {shift.Venmo}</p>
                <button onClick={() => setCurrentShiftToEdit(shift)}>
                  Edit
                </button>
              </li>
            ))}
          </ul>
          <div>
            {currentShiftToEdit && (
              <NewEditRide
                close={setCurrentShiftToEdit}
                shift={currentShiftToEdit}
                table={tableToLoad}
                reload={setEditedRide}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
