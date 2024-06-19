import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import styles from "./EmailPage.module.css";

export default function EmailPage() {
  return (
    <>
      <NavBar />
      <div className={styles.container}>
        <div className={styles.halfWidth}>
          <p>placeholder</p>
        </div>

        <div className={styles.halfWidth}>
          <h3>Example Email (sober shift):</h3>

          <br />
          <h4>{"Shifts for (today's date)\n"}</h4>
          <p>
            {"Brothers,"} <br />{" "}
            {"Officer: (today's officer), Phone Number: (999)-999-9999"} <br />
            {"Shotty: (today's shotty), Phone Number: (999)-999-9999"} <br />
            {
              "Driver: (today's driver), Phone Number: (999)-999-9999"
            } <br /> <br />
            {"Hours: 9pm-2am"} <br />
            <br />
            <br />
            {"In Zax,"} <br />
            {"Jason Greenberg"}
          </p>
          <h3>Example Email (to Tau):</h3>
          <h4>{"Sober shift ---- (today's date)"}</h4>
          <p>
            {"Driver's name: (shift driver's name)"} <br />
            {"Driver's venmo: (shift driver's venmo"} <br />
            {"Hours: 9pm-2am"}
          </p>
        </div>
      </div>
    </>
  );
}
