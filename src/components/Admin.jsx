/* eslint-disable react/prop-types */
import NavigationBar from "./NavigationBar";
import NoAccess from "./NoAccess";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "./DataSource";

export default function Admin() {
  const { auth } = useSelector((state) => state);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarItems, setSidebarItems] = useState([
    {
      name: "Setup Logic",
      type: "logic",
      api: {
        status: true,
        url: API_BASE_URL + "/api/config",
      },
      selected: true,
    },
  ]);
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  return (
    <>
      <NavigationBar
        isAdmin={auth.loginData.us_username === "phincon" ? true : false}
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />
      <Sidebar sidebarItems={sidebarItems} isOpen={isSidebarOpen} isAdmin={auth.loginData.us_username === "phincon" ? true : false} />
      <Content
        isAdmin={auth.loginData.us_username === "phincon" ? true : false}
        isSidebarOpen={isSidebarOpen}
        sidebarItems={sidebarItems}
      />
    </>
  );
}

function Content({ isAdmin, isSidebarOpen, sidebarItems }) {
  const [dataAPI, setDataAPI] = useState();
  const [selectedOptions, setSelectedOptions] = useState([]);
  let selectedItem = sidebarItems.find((item) => item.selected === true);
  useEffect(() => {
    (async () => {
      try {
        if (selectedItem.api.status === true) {
          const response = await fetch(selectedItem.api.url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ type: selectedItem.type }),
          });
          const json = await response.json();
          const targetArray = Object.keys(json.data.config_data).map(
            (key) => json.data.config_data[key].target
          );
          setSelectedOptions(targetArray);
          setDataAPI(json);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  return (
    <>
      {isAdmin ? (
        <div
          className={`content-admin ${
            isAdmin ? (isSidebarOpen ? "shifted" : "") : ""
          }`}
        >
          {selectedItem.type === "logic" ? (
            <LogicContent
              dataAPI={dataAPI}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
            />
          ) : (
            ""
          )}
        </div>
      ) : (
        <NoAccess />
      )}
    </>
  );
}

function LogicContent({ dataAPI, selectedOptions, setSelectedOptions }) {
  const logics = [
    {
      name: "Pseudo Number",
      value: "pseudoNumber",
    },
    {
      name: "Prime Number",
      value: "primeNumber",
    },
    {
      name: "Fibonacci Number",
      value: "fibonacciNumber",
    },
  ];

  const handleSelectChange = (index, event, key) => {
    const newSelectValues = [...selectedOptions];
    newSelectValues[index] = event.target.value;
    setSelectedOptions(newSelectValues);
    handleUpdateConfig(index, event, key);
  };

  async function handleUpdateConfig(index, event, key) {
    let newConfigData = { ...dataAPI.data.config_data };
    newConfigData[key]["target"] = event.target.value;
    const response = await fetch(API_BASE_URL + "/api/updateConfig", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        config_data: newConfigData,
        config_type: dataAPI.data.config_type,
      }),
    });
    const json = await response.json();
    if (json.status === "success") {
      alert("Configuration Updated Successfully");
    } else {
      alert("Failed to Update Configuration");
    }
  }

  return (
    <>
      {dataAPI ? (
        <div className="logic-content">
          <table className="table m-3">
            <tbody>
              {Object.keys(dataAPI.data.config_data).map((d, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{dataAPI.data.config_data[d].title}</td>
                  <td>
                    <select
                      value={selectedOptions[index]}
                      onChange={(e) => handleSelectChange(index, e, d)}
                    >
                      {logics.map((logic, index) => (
                        <option key={index} value={logic.value}>
                          {logic.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
