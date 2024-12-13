import { useParams } from "react-router-dom";
import AllMotorInsurances from "../TataAIG/Motor/AllMotorInsurances.jsx";
// import SomeOtherComponent from "./SomeOtherComponent"; // Example component
import NotFound from "../../../notFound/NotFound.jsx";

function CompSwitch() {
  const { insuranceName, category } = useParams();
  const renderComponent = () => {
    if (insuranceName === "tata_aig") {
      if (category === "motor") {
        return <AllMotorInsurances />;
      } else {
        return <NotFound />;
      }
    } else {
      return <NotFound />;
    }
  };

  return <>{renderComponent()}</>;
}

export default CompSwitch;
