//TODO: hier noch einen Brauchbaren Ladespinner umsetzten den man immer laden kann auf Seiten, wenn geladen wird
//Gibt es da was von Bootstrap was man nutzen kann??
import Spinner from "react-bootstrap/Spinner";

export default function MySpinner() {
  return (
    <div className='spinnerDiv'>
      <Spinner animation='border' role='status' variant='warning' />
    </div>
  );
}
