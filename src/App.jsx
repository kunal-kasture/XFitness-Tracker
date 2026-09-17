import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./App.css";

const STORAGE_KEY = "healthAndFitness";
const PIE_COLORS = ["#a855f7", "#fb923c"];
const BAR_COLORS = { intake: "#818cf8", burned: "#6ee7b7" };

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent === 0) return null;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="13px"
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function App() {
  const [dataList, setDataList] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    calorieIntake: "",
    calorieBurned: "",
    description: "",
  });

  const totalIntake = dataList.reduce(
    (acc, cur) => acc + Number(cur.calorieIntake || 0),
    0
  );
  const totalBurned = dataList.reduce(
    (acc, cur) => acc + Number(cur.calorieBurned || 0),
    0
  );
  const hasData = totalIntake + totalBurned > 0;

  const pieChartData = [
    { name: "Intake", value: hasData ? totalIntake : 50 },
    { name: "Burned", value: hasData ? totalBurned : 50 },
  ];

  const getWeeklyData = () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    return [...dataList]
      .filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= sevenDaysAgo && itemDate <= today;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const weeklyChartData = getWeeklyData();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      date: new Date().toISOString().split("T")[0],
      calorieIntake: "",
      calorieBurned: "",
      description: "",
    });
    setIsOpen(true);
  };

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setFormData({
      date: item.date,
      calorieIntake: item.calorieIntake,
      calorieBurned: item.calorieBurned,
      description: item.description,
    });
    setIsOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let updated;
    if (editingId) {
      updated = dataList.map((item) =>
        item.id === editingId
          ? {
              ...item,
              date: formData.date,
              calorieIntake: Number(formData.calorieIntake),
              calorieBurned: Number(formData.calorieBurned),
              description: formData.description,
            }
          : item
      );
    } else {
      const newEntry = {
        id: Date.now(),
        date: formData.date,
        calorieIntake: Number(formData.calorieIntake),
        calorieBurned: Number(formData.calorieBurned),
        description: formData.description,
      };
      updated = [newEntry, ...dataList];
    }

    setDataList(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    setFormData({
      date: new Date().toISOString().split("T")[0],
      calorieIntake: "",
      calorieBurned: "",
      description: "",
    });
    setEditingId(null);
    setIsOpen(false);
  };

  const handleDeleteItem = (idToDelete) => {
    const updated = dataList.filter((item) => item.id !== idToDelete);
    setDataList(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <div className="tracker-app">
      <header className="tracker-header">
        <h1>Health And Fitness Tracker</h1>
      </header>

      <main className="tracker-content">
        <section className="top-grid">
          <div className="card add-card">
            <h2 className="card-title">Update Today's Data</h2>
            <button className="btn-primary" onClick={handleOpenAdd}>
              + Add data
            </button>
          </div>

          {weeklyChartData.length > 0 ? (
            <div className="card chart-card">
              <h2 className="card-title">Weekly Health Trends</h2>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={weeklyChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                    <XAxis dataKey="date" stroke="#bbb" />
                    <YAxis stroke="#bbb" />
                    <Tooltip contentStyle={{ backgroundColor: "#2b2b2b" }} />
                    <Legend />
                    <Bar dataKey="calorieIntake" fill={BAR_COLORS.intake} />
                    <Bar dataKey="calorieBurned" fill={BAR_COLORS.burned} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="no-data-bar">No data available</div>
          )}
        </section>

        <section className="bottom-grid">
          <div className="list-container">
            <h2 className="section-title">Recent Health Statistics</h2>
            {dataList.length > 0 ? (
              <div className="list-card">
                {dataList.map((item) => (
                  <div key={item.id} className="list-item">
                    <div className="item-details">
                      <p className="item-desc">{item.description || "No description"}</p>
                      <p className="item-sub">
                        Calories Intake = {item.calorieIntake} &nbsp; Calories Burned = {item.calorieBurned}
                      </p>
                      <p className="item-date">{item.date}</p>
                    </div>
                    <div className="item-actions">
                      <button
                        className="icon-btn edit-btn"
                        onClick={() => handleEditClick(item)}
                      >
                        ✎
                      </button>
                      <button
                        className="icon-btn delete-btn"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-progress-text">No Progress to show!</p>
            )}
          </div>

          <div className="pie-section">
            <h2 className="section-title">Overall Data:</h2>

            <div className="pie-wrapper">
              {dataList.length > 0 ? (
                <ResponsiveContainer width="100%" height={230}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {pieChartData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-pie-container">
                  <div className="empty-pie-legend">
                    <span className="legend-intake">■ Intake</span>
                    <span className="legend-burned">■ Burned</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {isOpen && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3 className="modal-title">Update Today's Data</h3>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="date">Date:</label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="calorieIntake">Calorie Intake:</label>
                <input
                  id="calorieIntake"
                  type="number"
                  name="calorieIntake"
                  placeholder="Enter Today's Calorie Intake"
                  value={formData.calorieIntake}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="calorieBurned">Calorie Burned:</label>
                <input
                  id="calorieBurned"
                  type="number"
                  name="calorieBurned"
                  placeholder="Enter Today's Calorie Burned"
                  value={formData.calorieBurned}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Short description:</label>
                <input
                  id="description"
                  type="text"
                  name="description"
                  placeholder="Enter a short description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  Submit
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;