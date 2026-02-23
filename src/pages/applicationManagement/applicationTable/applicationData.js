import { useState, useEffect } from "react";

// MOCK DATA (Move this here)
const MOCK_APPLICANTS = [
  { id: 1, name: "Juan De La Cruz", skills: "Communication, Teamwork, Reliability, Digital literacy", exp: "1 year", status: "Pending" },
  { id: 2, name: "Juan Ponce De Castro", skills: "Communication, Teamwork, Reliability, Digital literacy", exp: "1 year", status: "Hired" },
  { id: 3, name: "John Doe", skills: "Communication, Teamwork, Reliability, Digital literacy", exp: "3 years", status: "Pending" },
  { id: 4, name: "Harvey Spectre", skills: "Communication, Teamwork, Reliability, Digital literacy", exp: "6 years", status: "Shortlisted" },
  { id: 5, name: "Mike Ross", skills: "Communication, Teamwork, Reliability, Digital literacy", exp: "5 years", status: "Shortlisted" },
  { id: 6, name: "Gustavo Fring", skills: "Communication, Teamwork, Reliability, Digital literacy", exp: "2 years", status: "Pending" },
];

export const useApplications = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // SIMULATE DATABASE FETCH
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoading(true);
        
        // TODO: REPLACE THIS BLOCK WITH YOUR REAL API CALL LATER
        // Example: const response = await fetch('/api/applicants');
        // const data = await response.json();
        
        // Simulating network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setApplicants(MOCK_APPLICANTS); // Set data

      } catch (err) {
        setError("Failed to fetch applicants");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  return { applicants, loading, error };
};