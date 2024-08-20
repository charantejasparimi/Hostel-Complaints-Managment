import React from "react";
import Chart from "react-apexcharts";

const Donut = ({ series, labels }) => {
  const options = {
    chart: {
      id: "donut-chart",
    },
    labels: labels,
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
        },
      },
    },
  };

  return (
    <div className="donut">
      <Chart options={options} series={series} type="donut" width="380" />
    </div>
  );
};

export default Donut;
