import { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Slider from "../components/slider";
import Divider from "../components/Divider";
import Input from "../components/Input";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { forceSyntheticLoading } from "../redux/slices/userSlice";

const staticChartData = [
  { name: "Średnia", amount: 3000, isUser: false },
  { name: "Komfortowa", amount: 5000, isUser: false },
  { name: "Luksusowa", amount: 8000, isUser: false },
];

export function UserEstimationPage({}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [desiredAmount, setDesiredAmount] = useState(3000);
  const [showChart, setShowChart] = useState(false);
  const [isSliderDragging, setIsSliderDragging] = useState(false);

  const handleSliderChange = (value) => {
    setDesiredAmount(value[0]);
    setShowChart(true);
  };

  const handleInputChange = (e) => {
    const inputValue = +e.target.value;

    if (inputValue < 1000) {
      setDesiredAmount(1000);
      return;
    }

    if (inputValue > 20000) {
      setDesiredAmount(20000);
      return;
    }

    setDesiredAmount(inputValue);
    setShowChart(true);
  };

  const handleSliderDragStart = () => {
    setIsSliderDragging(true);
  };

  const handleSliderDragEnd = () => {
    setIsSliderDragging(false);
  };

  // Create chart data with user's desired amount positioned correctly
  const createChartData = () => {
    const userBar = {
      id: "user-bar", // Stable ID for smooth animations
      name: "Twoja wybrana",
      amount: desiredAmount,
      isUser: true,
    };

    const staticBars = staticChartData.map((bar) => ({
      ...bar,
      id: bar.name.toLowerCase().replace(/[^a-z]/g, "-"), // Stable ID for each static bar
    }));

    const allBars = [...staticBars, userBar];

    // Sort all bars by amount to position user bar correctly
    return allBars.sort((a, b) => a.amount - b.amount);
  };

  const chartData = createChartData();

  const handleNext = () => {
    navigate("/wprowadz-dane");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl">Symulator emerytalny</h1>
            <p className="text-muted-foreground">
              Jaką chcesz emeryturę w przyszłości?
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block">
                Wybierz miesięczną kwotę emerytury (PLN):
              </label>
              <div className="px-4">
                <Slider
                  min={1000}
                  max={20000}
                  step={100}
                  value={[desiredAmount]}
                  onValueChange={handleSliderChange}
                  onDragStart={handleSliderDragStart}
                  onDragEnd={handleSliderDragEnd}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground select-none">
                  <span>1000 PLN</span>
                  <span className="font-medium text-foreground">
                    <Input
                      value={desiredAmount}
                      onChange={handleInputChange}
                      type="number"
                      step={10}
                    />
                  </span>
                  <span>20,000 PLN</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-center text-muted-foreground">
                Obecna, średnia wysokość świadczenia
              </h3>
              <div className="h-80 md:h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    animationBegin={0}
                    animationDuration={isSliderDragging ? 0 : 100}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      animationBegin={0}
                      animationDuration={isSliderDragging ? 0 : 100}
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      interval={0}
                    />
                    <YAxis
                      animationBegin={0}
                      animationDuration={isSliderDragging ? 0 : 100}
                    />
                    <Tooltip
                      formatter={(value, name, props) => {
                        const isUserBar = props.payload.isUser;
                        const label = isUserBar ? "Twoja wybrana kwota" : ``;
                        return [`${value} PLN`];
                      }}
                    />
                    <Bar
                      dataKey="amount"
                      radius={[4, 4, 0, 0]}
                      animationBegin={0}
                      animationDuration={isSliderDragging ? 0 : 20}
                      animationEasing="ease-in-out"
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={entry.id}
                          fill={entry.isUser ? "#00993F" : "#64748b"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <Divider />

          <div className="flex justify-end">
            <Button onClick={handleNext} customStyle="flex justify-center">
              Dalej
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default UserEstimationPage;
