import React, { useState } from "react";
import axios from 'axios';

function ImageUploader() {
    const [file, setFile] = useState(null);
    const [extractedData, setExtractedData] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('http://localhost:3001/upload', formData);
            const rawText = response.data.text;

            // Format the extracted text into the desired JSON structure
            const formattedData = extractRelevantData(rawText);
            setExtractedData(formattedData);
        } catch (error) {
            console.error(error);
        }
    };

    // Function to extract relevant data from the raw text
    const extractRelevantData = (text) => {
        const data = {
            "Invoice_Number": "",
            "Revised": "No",
            "Voucher_Number": "",
            "Payee_Name": "PG&E",
            "Total_Expenditure": "",
            "Amount": "",
            "Dept_Name": "Public Works Agency",
            "Dept_Claims_Processor": "Ann Mak Wong",
            "Dept_Claims_Approver": "Teresa Hewitt",
            "Date": "",
            "Account": "",
            "Period": "2025"
        };

        // Example logic to extract values from the raw text
        const lines = text.split('\n').map(line => line.trim());
        
        lines.forEach(line => {
            if (line.includes("Invoice #")) {
                data.Invoice_Number = line.split("Invoice #")[1].trim();
            }
            if (line.includes("Voucher#")) {
                data.Voucher_Number = line.split("Voucher#")[1].trim();
            }
            if (line.includes("Total")) {
                data.Total_Expenditure = line.split("Total")[1].trim();
                data.Amount = data.Total_Expenditure; // Assuming Amount is the same as Total
            }
            if (line.includes("Date")) {
                data.Date = line.split("Date")[1].trim();
            }
            if (line.includes("Account")) {
                data.Account = line.split("Account")[1].trim();
            }
        });

        return JSON.stringify(data, null, 2); // Pretty print JSON
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} accept="image/*" required />
                <button type="submit">Upload</button>
            </form>
            {extractedData && (
                <div>
                    <h3>Extracted Data:</h3>
                    <pre>{extractedData}</pre>
                </div>
            )}
        </div>
    );
}

export default ImageUploader;