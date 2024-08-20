import React, { Component } from "react";
import Chart from "react-apexcharts";

class Donut extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          id: "donut-chart",
        },
        labels: props.labels,
        plotOptions: {
          pie: {
            donut: {
              size: "75%",
            },
          },
        },
      },
      series: props.series,
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.series !== this.props.series ||
      prevProps.labels !== this.props.labels
    ) {
      this.setState({
        series: this.props.series,
        options: {
          ...this.state.options,
          labels: this.props.labels,
        },
      });
    }
  }

  render() {
    return (
      <div className="donut">
        <Chart
          options={this.state.options}
          series={this.state.series}
          type="donut"
          width="380"
        />
      </div>
    );
  }
}

export default Donut;
