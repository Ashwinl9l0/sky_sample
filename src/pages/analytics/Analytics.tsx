// Analytics.tsx
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Group, Bolt, CalendarToday } from "@mui/icons-material";
import "./Analytics.scss";
import type { TimeSeriesData } from "./constants";
import apiService from "../../services/ApiService";

const Analytics: React.FC = () => {
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeSeriesData = async () => {
      try {
        const response = await apiService.get(
          "alb90/aieng-tech-test-timeseries/data"
        );
        const data = await response?.data;

        const transformedData = data.map((item: any) => ({
          ...item,
          date: new Date(item.timestamp).toLocaleDateString(),
          time: new Date(item.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          formattedValue: item.value.toLocaleString(),
        }));

        setTimeSeriesData(transformedData);
      } catch (error) {
        console.error("Error fetching timeseries data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeSeriesData();
  }, []);

  if (loading) {
    return (
      <div className="analytics_loader">
        <div className="analytics_spinner" role="status"></div>
      </div>
    );
  }

  const maxValue = Math.max(...timeSeriesData.map((d) => d.value));
  const minValue = Math.min(...timeSeriesData.map((d) => d.value));
  const avgValue =
    timeSeriesData.reduce((sum, d) => sum + d.value, 0) / timeSeriesData.length;

  return (
    <div className="analytics_root">
      <div className="analytics_header">
        <h1>
          Platform <span className="analytics_gradient">Analytics</span>
        </h1>
        <p>
          Real-time insights and performance metrics for your streaming platform
        </p>
      </div>

      <div className="analytics_metrics">
        <div className="analytics_card analytics_blue">
          <div className="analytics_cardContent">
            <div>
              <p>Peak Value</p>
              <h2>{maxValue.toLocaleString()}</h2>
            </div>
            <TrendingUp className="analytics_icon" />
          </div>
        </div>

        <div className="analytics_card analytics_green">
          <div className="analytics_cardContent">
            <div>
              <p>Average</p>
              <h2>{Math.round(avgValue).toLocaleString()}</h2>
            </div>
            <Group className="analytics_icon" />
          </div>
        </div>

        <div className="analytics_card analytics_purple">
          <div className="analytics_cardContent">
            <div>
              <p>Data Points</p>
              <h2>{timeSeriesData.length}</h2>
            </div>
            <Bolt className="analytics_icon" />
          </div>
        </div>

        <div className="analytics_card analytics_orange">
          <div className="analytics_cardContent">
            <div>
              <p>Range</p>
              <h2>{(maxValue - minValue).toLocaleString()}</h2>
            </div>
            <CalendarToday className="analytics_icon" />
          </div>
        </div>
      </div>

      <div className="analytics_charts">
        <div className="analytics_chartBox">
          <h2>Time Series Trend</h2>
          <div className="analytics_chart" style={{ height: "500px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" fontSize={12} />
                <YAxis
                  fontSize={12}
                  tickFormatter={(v: any) => v.toLocaleString()}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "1px solid #0076be",
                    borderRadius: "8px",
                    color: "white",
                  }}
                  formatter={(value: any) => [value.toLocaleString(), "Value"]}
                  labelFormatter={(label: any) => `Time: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#0076be"
                  strokeWidth={2}
                  dot={{ fill: "#0076be", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#0076be", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
