import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import Chart from "react-apexcharts";
import { toast } from "react-toastify";
import "../Components_Css/MakeComplaints.css";
const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [totalComplaints, setTotalComplaints] = useState(0);
  const [totalServiced, setTotalServiced] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      fetch("http://localhost:5000/api/user/validateToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Token validation failed");
          }
          return response.json();
        })
        .then((data) => {
          setUser(data.user);
          if (data.user.role === "admin") {
            fetchComplaintsStatistics("admin");
          } else {
            fetchComplaintsStatistics(data.user._id);
          }
          console.log(data.user);
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.error("Failed to fetch user data. Please log in again.");
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const fetchComplaintsStatistics = async (userId) => {
    try {
      const complaintsResponse = await fetch(
        `http://localhost:5000/reg_complaints?serviced=false&id=${userId}`
      );
      const complaintsData = await complaintsResponse.json();
      setTotalComplaints(complaintsData.length);

      const servicedResponse = await fetch(
        `http://localhost:5000/reg_complaints?serviced=true&id=${userId}`
      );
      const servicedData = await servicedResponse.json();
      setTotalServiced(servicedData.length);
    } catch (error) {
      console.error("Error fetching complaints statistics:", error);
      toast.error("Failed to fetch complaints statistics.");
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!user) {
    return <p>No user data available</p>;
  }

  // Chart options and data
  const barChartOptions = {
    chart: {
      id: "complaints-bar-chart",
    },
    xaxis: {
      categories: ["Requested Complaints", "Total Serviced"],
    },
    colors: ["#008FFB", "#00E396"],
  };

  const barChartSeries = [
    {
      name: "Complaints",
      data: [totalComplaints, totalServiced],
    },
  ];

  const donutChartOptions = {
    chart: {
      id: "donut-chart",
    },
    labels: ["Requested Complaints", "Serviced Complaints"],
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
        },
      },
    },
    colors: ["#FF4560", "#00E396"],
  };

  const donutChartSeries = [totalComplaints, totalServiced];

  // const pieChartOptions = {
  //   chart: {
  //     id: "pie-chart",
  //   },
  //   labels: ["Requested Complaints", "Serviced Complaints"],
  //   colors: ["#FF4560", "#00E396"],
  // };

  // const pieChartSeries = [totalComplaints, totalServiced];
  const themeClass = user === "true" ? "dark-theme" : "light-theme";

  return (
    <Container className={`mt-2 container ${themeClass}`}>
      {/* First Row: Split Card with User Information and Hostel Complaint System Info */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header as="h1">
              Welcome, {user.firstname + user.lastname}
            </Card.Header>
            <Card.Body className="jack">
              <Card.Subtitle className="mb-2 text-muted" as="h2">
                Email: {user.email}
              </Card.Subtitle>
              <Card.Text as="h3">Hostel: {user.hostel}</Card.Text>
              <Card.Text as="h2">Room No: {user.room}</Card.Text>
              <Card.Text as="h2" className="mb-3">
                College: Vishnu Institute of Technology
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header as="h5">About Hostel Complaint System</Card.Header>
            <Card.Body>
              <Card.Text>
                The Hostel Complaint System is designed to streamline and manage
                complaints raised by students in a hostel environment. It allows
                users to:
                <ul>
                  <li>Raise new complaints and track their status.</li>
                  <li>View and manage previously raised complaints.</li>
                  <li>Receive updates on the status of their complaints.</li>
                  <li>View statistics on complaints and services done.</li>
                </ul>
                This system ensures efficient handling of issues, enhances
                communication between hostel management and students, and
                improves overall satisfaction within the hostel.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Second Row: Donut Chart and Bar Chart */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header as="h5">Complaints Breakdown</Card.Header>
            <Card.Body>
              <Chart
                options={donutChartOptions}
                series={donutChartSeries}
                type="donut"
                width="100%"
                height={320}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header as="h5">Complaints Statistics</Card.Header>
            <Card.Body>
              <Chart
                options={barChartOptions}
                series={barChartSeries}
                type="bar"
                width="100%"
                height={320}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
