"use client";
import { useState } from "react";

const Disperse = () => {
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState([]);
  const [result, setResult] = useState(null);

  const updateLineNumbers = () => {
    const lines = code.split("\n");
    return lines.map((line, index) => {
      const lineNumber = (index + 1).toString().padStart(2, "0");
      return lineNumber;
    });
  };

  const handleDuplicateAction = (action) => {
    setErrors([]);

    if (action === "keep") {
      keepTheFirstOne();
    } else if (action === "combine") {
      combineBalances();
    }
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
    setErrors([]);
    setResult(null);
  };

  const keepTheFirstOne = () => {
    const lines = code.split("\n");
    const uniqueAddresses = new Set();
    const filteredLines = [];

    lines.forEach((line) => {
      const parts = line.split(/[ ,=]+/);
      const address = parts[0];

      if (!uniqueAddresses.has(address)) {
        filteredLines.push(line);
        uniqueAddresses.add(address);
      }
    });

    setCode(filteredLines.join("\n"));
    setErrors([]);
    setResult("Duplicates removed. Updated code:");
  };

  const combineBalances = () => {
    // Implement logic to combine balances of duplicate addresses
    const lines = code.split("\n");
    const addressBalances = new Map();

    lines.forEach((line) => {
      const parts = line.split(/[ ,=]+/); // Split by space, comma, or equal sign
      const address = parts[0];
      const balance = parseInt(parts[1]);

      if (addressBalances.has(address)) {
        addressBalances.set(address, addressBalances.get(address) + balance);
      } else {
        addressBalances.set(address, balance);
      }
    });

    const combinedLines = Array.from(addressBalances.entries()).map(
      ([address, balance]) => `${address} = ${balance}`
    );

    setCode(combinedLines.join("\n"));
    setErrors([]);
    setResult("Balances combined. Updated code:");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);

    const lines = code.split("\n");
    const addressOccurrences = new Map();

    lines.forEach((line, index) => {
      const parts = line.split(/[ ,=]+/);

      if (parts.length !== 2 || !/^\d+$/.test(parts[1])) {
        setErrors((prevErrors) => [
          ...prevErrors,
          `Error on line ${index + 1}: Invalid format or non-integer amount`,
        ]);
        return;
      }

      const address = parts[0];

      if (addressOccurrences.has(address)) {
        const lineNumbers = addressOccurrences.get(address);
        lineNumbers.push(index + 1);
        addressOccurrences.set(address, lineNumbers);
      } else {
        addressOccurrences.set(address, [index + 1]);
      }
    });

    let hasDuplicates = false;

    addressOccurrences.forEach((lineNumbers, address) => {
      if (lineNumbers.length > 1) {
        setErrors((prevErrors) => [
          ...prevErrors,
          `Address ${address} encountered duplicate in lines: ${lineNumbers.join(
            ", "
          )}`,
        ]);
        hasDuplicates = true;
      }
    });

    if (!hasDuplicates) {
      setErrors((prevErrors) => [...prevErrors, "No Errors Found"]);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white">
      <form onSubmit={handleSubmit}>
        <div className="p-8 bg-gray-100 rounded-sm flex flex-col justify-center-items-center h-auto w-[800px]">
          <div className="flex flex-col justify-center items-start">
            <p className="font-semibold text-gray-500 text-xs">
              Addresses with Amounts
            </p>
            <div className="flex my-4 p-2">
              <div className="w-16 text-gray-500 text-right bg-opacity-30">
                <div className="bg-blue-200 h-[200px] rounded-sm">
                  {updateLineNumbers().map((lineNumber, index) => (
                    <div key={index} className="">
                      <p className="text-xs p-1">{lineNumber}</p>
                    </div>
                  ))}
                </div>
              </div>
              <textarea
                className="flex-grow rounded-sm p-2 resize-none h-[200px] w-[650px] bg-blue-300 bg-opacity-30 border-none focus:ring-0 outline-none text-sm"
                value={code}
                onChange={handleCodeChange}
              ></textarea>
            </div>
            <p className="font-semibold text-gray-500 text-xs">
              Seperated by ',' or ' ' or '='
            </p>
          </div>

          {errors.length > 0 && (
            <div className="text-red-500 text-sm p-2 border border-red-500 my-1">
              {errors.map((errorMessage, index) => (
                <div key={index}>{errorMessage}</div>
              ))}
              {errors.some((error) => error.includes("duplicate")) && (
                <div className="mt-2">
                  <span className="flex flex-row space-x-2">
                    <p
                      onClick={() => handleDuplicateAction("keep")}
                      className="text-sm font-medium cursor-pointer"
                    >
                      Keep the first one
                    </p>
                    <p>|</p>
                    <p
                      onClick={() => handleDuplicateAction("combine")}
                      className="text-sm font-medium cursor-pointer"
                    >
                      Combine Balance
                    </p>
                  </span>
                </div>
              )}
            </div>
          )}
          <button
            className="mt-4 bg-blue-600 hover:bg-blue-400 w-full py-2 text-white font-semibold rounded-sm"
            type="submit"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default Disperse;