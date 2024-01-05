import Frankscomponent from "@/components/Frankscomponent";
import NavBar from "../components/navbar";
import axios from "axios";
import { db } from "@/db/db";

/* async function getShips() {
  const res = await axios.get("http://localhost:3000/api/relations/getAllManufacturerShips");
  return res.data;
}
 */
export default async function Home() {
  /*   const ships = await getShips();
   */

  return (
    <>
      <NavBar />
    </>
  );
}
