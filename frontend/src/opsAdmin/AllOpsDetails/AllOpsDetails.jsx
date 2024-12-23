import AllOpsData from "./AllOpsData.jsx";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import * as XLSX from "xlsx";
import VITE_DATA from "../../config/config.jsx";
import TextLoader from "../../loader/TextLoader.jsx";
import Paginationops from "./Paginationops.jsx";
function AllOpsDetails() {
  const [APIData, setAPIData] = useState([]);
  const [empData, setEmpData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [totalPages, setTotalPages] = useState();
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState();
  const [searchId, setSearchId] = useState("");
  const [searchBranch, setSearchBranch] = useState("");
  const [searchInsuredName, setSearchInsuredName] = useState("");
  const [searchPolicyMadeBy, setSearchPolicyMadeBy] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const name = sessionStorage.getItem("name");
  const [deletingStaffId, setDeletingStaffId] = useState(null);

  const deleteStaff = (_id) => {
    // Show modal confirmation dialog
    setDeletingStaffId(_id);
  };
  const handleUpdateClick = (id) => {
    setSelectedRowId(id);
    setShowUpdatePopup(true);
  };

  const handleClosePopup = () => {
    setSelectedRowId(null);
    setShowUpdatePopup(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          toast.error("Not Authorized yet.. Try again! ");
          return;
        }
        const response = await axios.get(`${VITE_DATA}/employees/data`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setEmpData(response.data);
        // setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // POLICY DATA LISTS
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Not Authorized yet.. Try again! ");
    } else {
      // The user is authenticated, so you can make your API request here.
      axios
        .get(`${VITE_DATA}/alldetails/viewdata`, {
          headers: {
            Authorization: `${token}`, // Send the token in the Authorization header
          },
          params: {
            page: currentPage,
            limit: itemsPerPage,
          },
        })
        .then((response) => {
          setAPIData(response.data.allList);
          setTotalPages(response.data.totalPages);
          // setIsLoading(false);
        })
        .catch((error) => {
          toast.error(error);
          console.error(error);
        });
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get("page")) || 1;
    const limit = parseInt(params.get("limit")) || 1000;

    setCurrentPage(page);
    setItemsPerPage(limit);
  }, []);

  // Handle date range filter change
  const handleDateRangeChange = (event, type) => {
    if (type === "start") {
      setStartDate(event.target.value);
    } else if (type === "end") {
      setEndDate(event.target.value);
    }
  };

  const filteredData = APIData.filter((data) => {
    // Check if data is defined
    if (!data) return false;
    // Filter conditions
    const idLower = data.policyrefno?.toLowerCase() || "";
    const insuredNameLower = data.insuredName?.toLowerCase() || "";
    const branchLower = data.branch?.toLowerCase() || "";
    const policyMadeByLower = data.staffName?.toLowerCase() || "";
    return (
      // Filter conditions using optional chaining and nullish coalescing
      (idLower.includes(searchId.toLowerCase()) || searchId === "") &&
      (insuredNameLower.includes(searchInsuredName.toLowerCase()) ||
        searchInsuredName === "") &&
      (branchLower.includes(searchBranch.toLowerCase()) ||
        searchBranch === "") &&
      (policyMadeByLower.includes(searchPolicyMadeBy.toLowerCase()) ||
        searchPolicyMadeBy === "") &&
      (startDate === "" || new Date(data.entryDate) >= new Date(startDate)) &&
      (endDate === "" || new Date(data.entryDate) <= new Date(endDate))
    );
  });

  // Calculate total number of pages
  // const totalItems = filteredData.length;
  // const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // refreshing page after updating data
  const onUpdatePolicy = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("Not Authorized yet.. Try again!");
      } else {
        const response = await axios.get(`${VITE_DATA}/alldetails/viewdata`, {
          headers: {
            Authorization: `${token}`,
          },
          params: {
            page: currentPage, // Send current page as a parameter
          },
        });
        setAPIData(response.data.allList);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching updated insurance data:", error);
    }
  };
  const exportToExcel = () => {
    try {
      const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const fileExtension = ".xlsx";
      const fileName = name;

      // Include all sorted data
      const rowsToInclude = filteredData.map((data) => [
        data.policyrefno,
        data.entryDate,
        data.branch,
        data.insuredName,
        data.contactNo,
        data.staffName,
        data.currentTime,
        data.empTime,
        data.company,
        data.category,
        data.policyType,
        data.policyNo,
        data.engNo,
        data.chsNo,
        data.odPremium,
        data.liabilityPremium,
        data.netPremium,
        data.taxes,
        data.rsa,
        data.finalEntryFields,
        data.odDiscount,
        data.ncb,
        data.policyPaymentMode,
      ]);

      // Create worksheet
      const ws = XLSX.utils.aoa_to_sheet([
        [
          "Reference ID",
          "Entry Date",
          "Branch",
          "Insured Name",
          "Mobile No.",
          "Policy Made By",
          "Receive Time",
          "Update Time",
          "Company",
          "Category",
          "Policy Type",
          "Policy No.",
          "Engine No.",
          "Chassis No",
          "OD Premium",
          "Liability Premium",
          "Net Premium",
          "GST in rupees",
          "RSA",
          "Final Amount",
          "OD Discount(%)",
          "NCB",
          "Policy Payment Mode",
        ],
        ...rowsToInclude,
      ]);

      // Create workbook and export
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, {
        bookType: "xlsx",
        type: "array",
      });
      const data = new Blob([excelBuffer], { type: fileType });
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName + fileExtension);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Error exporting to Excel");
    }
  };

  const confirmDelPolicy = async (_id) => {
    try {
      const resp = await axios.delete(
        `${VITE_DATA}/alldetails/deletedata/${_id}`
      );
      console.log(resp);
      toast.error(`${resp.data.message}`, {
        theme: "dark",
        position: "top-right",
      });
      setAPIData((prevData) => prevData.filter((data) => data._id !== _id));
    } catch (error) {
      console.error("Error to Delete Policy", error);
    }
  };

  const handleExportClick = () => {
    exportToExcel();
  };

  return (
    <section className="container relative sm:ml-44 bg-slate-200">
      <div className="container flex justify-center  border-gray-200 border-dashed rounded-lg   bg-slate-200">
        <div className="inline-block min-w-full w-full py-0 ">
          <div className="flex justify-between items-center  w-full my-2">
            <div className="flex justify-center items-center space-x-4 space-y-5">
              <button
                onClick={() => setIsFilterVisible(!isFilterVisible)}
                className={`flex ${
                  isFilterVisible
                    ? "bg-gradient-to-r from-red-500 via-red-600 to-red-700 focus:ring-red-300"
                    : "focus:ring-blue-300 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"
                } text-white  hover:bg-gradient-to-br focus:ring-1 focus:outline-none  shadow-lg font-medium rounded text-sm px-4 py-2`}
              >
                {isFilterVisible ? "Hide Filters" : "Show Filters"}
              </button>
            </div>
            {/* Title */}
            <span className="my-auto text-blue-700 text-2xl font-semibold">
              Policies Assign List&apos;s
            </span>

            {/* Buttons Container */}
            <div className="flex justify-center items-center">
              {/* Recalculate Button */}

              {/* Export Button */}
              <button onClick={handleExportClick}>
                <img
                  src="/excel.png"
                  alt="Export to Excel"
                  height={30}
                  width={30}
                />
              </button>
            </div>
          </div>
          {/* filter with table */}
          {/* <div className="inline min-w-full w-full pt-2 "> */}
            
            {isFilterVisible && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-5 bg-white shadow-md rounded-md text-blue-500 ">
                <div className="flex flex-col relative">
                  <label className="text-base text-start font-medium text-blue-700">
                    Date Range:
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => handleDateRangeChange(e, "start")}
                      className="input-style w-full"
                      placeholder="From Date"
                    />
                    <span className="text-sm">to</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => handleDateRangeChange(e, "end")}
                      className="input-style w-full"
                      placeholder="To Date"
                    />
                  </div>
                </div>

                {[
                  {
                    label: "ID",
                    placeholder: "Enter ID",
                    onChange: setSearchId,
                    value: searchId,
                  },
                  // {
                  //   label: "Company",
                  //   placeholder: "Company Name",
                  //   onChange: setSearchCompany,
                  //   value: searchCompany,
                  // },
                  {
                    label: "Insured Name",
                    placeholder: "Insured Name",
                    onChange: setSearchInsuredName,
                    value: searchInsuredName,
                  },
                  {
                    label: "Branch",
                    placeholder: "Branch Name",
                    onChange: setSearchBranch,
                    value: searchBranch,
                  },
                  // {
                  //   label: "Policy No",
                  //   placeholder: "Policy Number",
                  //   onChange: setPolicyNo,
                  //   value: policyNo,
                  // },
                  // {
                  //   label: "Vehicle No.",
                  //   placeholder: "Vehicle Registration No.",
                  //   onChange: setVeh,
                  //   value: veh,
                  // },
                  {
                    label: "Policy Made By",
                    placeholder: "Policy Made By",
                    onChange: setSearchPolicyMadeBy,
                    value: searchPolicyMadeBy,
                  },
                ].map((input, index) => (
                  <div className="flex flex-col" key={index}>
                    <label className="text-base text-start font-medium text-blue-700">
                      {input.label}:
                    </label>
                    <input
                      type="search"
                      value={input.value}
                      onChange={(e) => input.onChange(e.target.value)}
                      className="input-style w-full"
                      placeholder={input.placeholder}
                    />
                  </div>
                ))}
                <button
                  className="absolute top-16 right-1 bg-red-500 text-white px-4 hover:bg-red-700 rounded"
                  onClick={() => setIsFilterVisible(false)}
                >
                  X
                </button>
              </div>
            )}

            <table className="min-w-full my-2 z-100 text-center text-xs font-light table bg-slate-200">
              {/* <div className="min-w-full  border text-center bg-slate-200 text-sm font-light table"> */}
                {APIData.length > 0 ? (
                  <>
                    <thead className="border-b border-black font-medium bg-slate-300  sticky top-16">
                      <tr className="text-blue-700 sticky   border border-black top-16">
                        <th
                          scope="col"
                          className="  border py-1 border-black sticky"
                        >
                          Update
                        </th>
                        <th
                          scope="col"
                          className="px-1 py-1 border border-black"
                        >
                          Reference ID
                        </th>
                        <th
                          scope="col"
                          className="px-1 py-1 border border-black"
                        >
                          Entry Date
                        </th>
                        <th
                          scope="col"
                          className="px-1 py-1 border border-black"
                        >
                          Branch
                        </th>
                        <th
                          scope="col"
                          className="px-1 py-1 border border-black sticky"
                        >
                          Insured By
                        </th>
                        <th
                          scope="col"
                          className="px-1 py-1 border border-black sticky"
                        >
                          Contact No.
                        </th>
                        <th
                          scope="col"
                          className="px-1 py-1 border border-black sticky"
                        >
                          Policy Made By
                        </th>
                        <th
                          scope="col"
                          className="px-1 py-1 border border-black sticky"
                        >
                          Sent Time
                        </th>
                        <th
                          scope="col"
                          className="px-1 border border-black sticky"
                        >
                          Update Time
                        </th>
                        <th scope="col" className="px-1 border border-black">
                          Company
                        </th>
                        <th scope="col" className="px-1 border border-black">
                          Category
                        </th>
                        <th
                          scope="col"
                          className="px-1 border border-black sticky"
                        >
                          Policy Type
                        </th>
                        <th
                          scope="col"
                          className="px-1 border border-black sticky"
                        >
                          Policy No.
                        </th>
                        <th
                          scope="col"
                          className="px-1 border border-black sticky"
                        >
                          Engine No.
                        </th>
                        <th
                          scope="col"
                          className="px-1 border border-black sticky"
                        >
                          Chassis No
                        </th>
                        <th
                          scope="col"
                          className="px-1 border border-black sticky"
                        >
                          OD Premium
                        </th>
                        <th
                          scope="col"
                          className="px-1 border border-black sticky"
                        >
                          Liability Premium
                        </th>
                        <th
                          scope="col"
                          className="px-1 border border-black sticky"
                        >
                          Net Premium
                        </th>
                        <th
                          scope="col"
                          className="px-1 border border-black sticky"
                        >
                          GST(in rupees)
                        </th>
                        <th
                          scope="col"
                          className="px-1 border border-black sticky"
                        >
                          RSA
                        </th>
                        <th
                          scope="col"
                          className="px-1 border border-black sticky"
                        >
                          Final Amount
                        </th>
                        <th
                          scope="col"
                          className="px-1 border border-black sticky"
                        >
                          OD Discount(%)
                        </th>
                        <th
                          scope="col"
                          className="px-1 border border-black sticky"
                        >
                          NCB
                        </th>
                        <th
                          scope="col"
                          className="px-1 border border-black sticky"
                        >
                          Policy Pay Mode
                        </th>
                        <th
                          scope="col"
                          className="px-1 py-0 border border-black sticky"
                        >
                          Delete
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 border border-black overflow-y-hidden">
                      {filteredData.map((data) => (
                        <AllOpsData
                          key={data._id}
                          datas={data}
                          policy={onUpdatePolicy}
                          deleteStaff={deleteStaff}
                          empData={empData}
                          showUpdatePopup={showUpdatePopup}
                          selectedRowId={selectedRowId}
                          onClose={handleClosePopup}
                          handleUpdateClick={handleUpdateClick}
                        />
                      ))}
                    </tbody>
                  </> // Conditional rendering when there are no policies
                ) : (
                  <TextLoader />
                )}
              {/* </div> */}
            </table>
          {/* </div> */}

          {deletingStaffId && (
            <div
              id="popup-modal"
              tabIndex="-1"
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            >
              <div className="bg-white p-4 rounded-lg ">
                <h2 className="text-lg font-semibold text-gray-800">
                  {`Are you sure you want to delete `}
                  <span className="text-red-600">
                    {
                      APIData.find((data) => data._id === deleteStaff)
                        ?.policyrefno
                    }
                  </span>

                  {`?`}
                </h2>
                <div className="flex justify-end mt-10">
                  <button
                    onClick={() => {
                      confirmDelPolicy(deletingStaffId);
                      setDeletingStaffId(null);
                    }}
                    className="text-white bg-red-600 hover:bg-red-800 focus:ring-1 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-4 py-2 mr-2"
                  >
                    Yes, I&apos;m sure
                  </button>
                  <button
                    onClick={() => setDeletingStaffId(null)}
                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-1 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-4 py-2 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  >
                    No, cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <Paginationops
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </section>
  );
}
export default AllOpsDetails;
