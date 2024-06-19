import { useState } from "react";
import styles from "./NewEditRide.module.css"; // Import the CSS module

export default function EditShift({ shift, close, table, reload }) {
  const [Officer, setOfficer] = useState(shift.Officer);
  const [OfficerPhone, setOfficerPhone] = useState(shift.Officer_Phone_Num);
  const [Shotty, setShotty] = useState(shift.Shotty);
  const [ShottyPhone, setShottyPhone] = useState(shift.Shotty_Phone_Num);
  const [Driver, setDriver] = useState(shift.Driver);
  const [DriverPhone, setDriverPhone] = useState(shift.Driver_Phone_Num);
  const [Venmo, setVenmo] = useState(shift.Venmo);

  async function handleUpdate(e) {
    e.preventDefault();

    const updatedRide = {
      id: shift.id,
      table,
      Officer,
      Officer_Phone_Num: OfficerPhone,
      Shotty,
      Shotty_Phone_Num: ShottyPhone,
      Driver,
      Driver_Phone_Num: DriverPhone,
      Venmo: Venmo,
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/updateRide`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedRide),
      });

      if (res.ok) {
        console.log("Ride updated successfully");
        reload((flag) => !flag);
        handleClose();
      } else {
        console.log("Error updating ride");
      }
    } catch (error) {
      console.error("error: ", error);
    }
  }

  function handleClose() {
    close(null);
  }

  return (
    <div className={styles.formContainer}>
      <form className={styles.form} onSubmit={handleUpdate}>
        <label htmlFor="officer">Officer: </label>
        <input
          id="officer"
          type="text"
          placeholder={shift.Officer}
          value={Officer}
          onChange={(e) => setOfficer(e.target.value)}
        />
        <label htmlFor="officerPhone">Officer Phone: </label>
        <input
          id="officerPhone"
          type="text"
          placeholder={shift.OfficerPhone}
          value={OfficerPhone}
          onChange={(e) => setOfficerPhone(e.target.value)}
        />
        <label htmlFor="shotty">Shotty:</label>
        <input
          id="shotty"
          type="text"
          placeholder={shift.Shotty}
          value={Shotty}
          onChange={(e) => setShotty(e.target.value)}
        />
        <label htmlFor="shottyPhone">Shotty Phone: </label>
        <input
          id="shottyPhone"
          type="text"
          placeholder={shift.ShottyPhone}
          value={ShottyPhone}
          onChange={(e) => setShottyPhone(e.target.value)}
        />
        <label htmlFor="driver">Driver:</label>
        <input
          id="driver"
          type="text"
          placeholder={shift.Driver}
          value={Driver}
          onChange={(e) => setDriver(e.target.value)}
        />
        <label htmlFor="driverPhone">Driver Phone: </label>
        <input
          id="driverPhone"
          type="text"
          placeholder={shift.DriverPhone}
          value={DriverPhone}
          onChange={(e) => setDriverPhone(e.target.value)}
        />
        <label htmlFor="venmo">Venmo: </label>
        <input
          id="venmo"
          type="text"
          placeholder={shift.Venmo}
          value={Venmo}
          onChange={(e) => setVenmo(e.target.value)}
        />
        <button type="submit">Submit</button>
        <button type="button" onClick={handleClose}>
          Close
        </button>
      </form>
    </div>
  );
}
