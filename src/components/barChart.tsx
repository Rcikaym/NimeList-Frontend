// File: components/SalesData.tsx
import React, { useState, useEffect } from "react";
import { DatePicker, message, Spin } from "antd";
import type { Moment } from "moment";
import moment from "moment";
import "antd/dist/reset.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SalesItem {
  month: string;
  income: number;
}

const SalesData: React.FC = () => {
  const currentYear = moment().year(); // Mendapatkan tahun saat ini
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [salesData, setSalesData] = useState<SalesItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch data penjualan berdasarkan tahun yang dipilih
  const fetchSalesData = async (year: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:4321/dashboard/bar-chart?year=${year}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: SalesItem[] = await response.json();
      setSalesData(data);
    } catch (error) {
      console.error("Error fetching sales data:", error);
      message.error("Gagal mengambil data penjualan.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data penjualan saat component pertama kali di-load
  useEffect(() => {
    fetchSalesData(currentYear); // Default ke tahun saat ini
  }, [currentYear]);

  // Handle ketika tahun dipilih menggunakan DatePicker
  const handleYearChange = (date: Moment | null) => {
    if (date) {
      const year = date.year();
      setSelectedYear(year);
      fetchSalesData(year);
    }
  };

  // Menyiapkan data untuk Chart.js
  const chartData: ChartData<"bar", number[], string> = {
    labels: salesData.map((item) => item.month),
    datasets: [
      {
        label: `Income (Rp)`,
        data: salesData.map((item) => item.income),
        backgroundColor: "#047857",
        borderColor: "#047857",
        borderWidth: 1,
      },
    ],
  };

  // Opsi untuk Chart.js
  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `${selectedYear} Income Report`,
      },
    },
  };

  return (
    <div>
      <h2>Select the Year for the Income Report</h2>
      <DatePicker
        picker="year"
        onChange={handleYearChange}
        style={{ marginBottom: "20px" }}
      />

      {loading ? (
        <Spin tip="Loading..." />
      ) : salesData.length > 0 ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>There is no income report for this year.</p>
      )}
    </div>
  );
};

export default SalesData;
