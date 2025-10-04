// import { useState } from 'react';
// import { Slider } from './ui/slider';
// import Button from '../components/Button';
// import Card from '../components/Card';
// import { Separator } from './ui/separator';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function UserEstimationPage({ }) {
  return ( 
    <p>Blabla</p>);
  }



// const chartData = [
//   { name: 'Minimalny', amount: 1500 },
//   { name: 'Średni', amount: 3000 },
//   { name: 'Komfortowy', amount: 5000 },
//   { name: 'Luksusowy', amount: 8000 },
// ];

// export function UserEstimationPage({}) {
//   const [desiredAmount, setDesiredAmount] = useState(3000);
//   const [showChart, setShowChart] = useState(false);

//   const handleSliderChange = (value) => {
//     setDesiredAmount(value[0]);
//     setShowChart(true);
//   };

//   const handleNext = () => {
//     onNext(desiredAmount);
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 space-y-6">
//       <Card className="p-8">
//         <div className="space-y-6">
//           <div className="text-center space-y-4">
//             <h1 className="text-3xl">Symulator emerytalny</h1>
//             <p className="text-muted-foreground">
//               Jaką chcesz emeryturę w przyszłości?
//             </p>
//           </div>

//           <div className="space-y-6">
//             <div className="space-y-4">
//               <label htmlFor="retirement-slider" className="block">
//                 Wybierz miesięczną kwotę emerytury (PLN):
//               </label>
//               <div className="px-4">
//                 <Slider
//                   id="retirement-slider"
//                   min={1000}
//                   max={10000}
//                   step={100}
//                   value={[desiredAmount]}
//                   onValueChange={handleSliderChange}
//                   className="w-full"
//                 />
//                 <div className="flex justify-between mt-2 text-sm text-muted-foreground">
//                   <span>1,000 PLN</span>
//                   <span className="font-medium text-foreground">
//                     {desiredAmount.toLocaleString()} PLN
//                   </span>
//                   <span>10,000 PLN</span>
//                 </div>
//               </div>
//             </div>

//             {showChart && (
//               <div className="space-y-4">
//                 <h3 className="text-center text-muted-foreground">
//                   Obecna, średnia wysokość świadczenia
//                 </h3>
//                 <div className="h-64 w-full">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart data={chartData}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="name" />
//                       <YAxis />
//                       <Tooltip formatter={(value) => [`${value} PLN`, 'Kwota']} />
//                       <Bar 
//                         dataKey="amount" 
//                         fill="hsl(var(--chart-1))"
//                         radius={[4, 4, 0, 0]}
//                       />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>
//             )}
//           </div>

//           <Separator />

//           <div className="flex justify-end">
//             <Button onClick={handleNext} className="min-w-32">
//               Dalej
//             </Button>
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// }

export default UserEstimationPage;