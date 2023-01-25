import Spinner from "react-bootstrap/Spinner";

export default function MySpinner() {
  return (
    <div className='spinnerDiv'>
      <Spinner animation='border' role='status' variant='warning' />
    </div>
  );
}
