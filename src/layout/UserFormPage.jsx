import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import DropdownList from "../components/DropdownList";

const UserFormPage = ({ onBack }) => {

async ({ age }, { rejectWithValue }) => {
      try {
        const res = await fetch(`https://sym.packt.pl/api/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(
          {
            age: age, 
          }
          ),
        });
        if (!res.ok) {
          throw new Error(errorFormatter(res.status));
        }

        const data = await res.json();
        if (data) return data;
      } catch (error) {
        console.error("ERROR IN ASYNC THUNK user/login: ", error);
        return rejectWithValue(`Logowanie nieudane: ${error.message}`);
      }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({...prev,[field] : value}));
  };

  const PersonalInfo = {
    age: 0,
    sex: "",
    bruttoIncome:  "",
    firstYearOfWork: "",
    lastYearOfWork:  "",
    currentWorkplace: ""
  }

  const [formData, setFormData] = useState({PersonalInfo});

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const isFormValid = Object.values(formData).every(value => value !== '');


  return (
      <div className="max-w-2xl mx-auto p-6">
        <p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-4xl color-zus-green font-bold">Symulator emerytalny</h2>
              <p className="text-black">
                Wypełnij poniższe dane, aby obliczyć Twoją składkę emerytalną.
              </p>
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p>Wiek</p>
                <Input
                  id="age"
                  type="number"
                  placeholder="np. 35"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  required
                />
              </div>
  
              <div className="space-y-2">
                <p>Płeć</p>
                <DropdownList 
                placeholder="Wybierz płeć"
                value={formData.sex}
                onChange={(value) => handleInputChange('sex', value)}
                options={["Kobieta", "Mężczyzna", "Inna", "Nie chcę podawać"]}>
                </DropdownList>
              </div>
  
              <div className="space-y-2">
                <p>Dochód brutto (PLN/miesiąc)</p>
                <Input
                  id="bruttoIncome"
                  type="number"
                  placeholder="np. 5000"
                  value={formData.bruttoIncome}
                  onChange={(e) => handleInputChange('bruttoIncome', e.target.value)}
                  required
                />
              </div>
  
              <div className="space-y-2">
                <p>Pierwszy rok pracy</p>
                <Input
                  id="firstYearOfWork"
                  type="number"
                  placeholder="np. 2010"
                  value={formData.firstYearOfWork}
                  onChange={(e) => handleInputChange('firstYearOfWork', e.target.value)}
                  required
                />
              </div>
  
              <div className="space-y-2">
                <p>Ostatni rok pracy</p>
                <Input
                  id="lastYearOfWork"
                  type="number"
                  placeholder="np. 2055"
                  value={formData.lastYearOfWork}
                  onChange={(e) => handleInputChange('lastYearOfWork', e.target.value)}
                  required
                />
              </div>
  
              <div className="space-y-2">
                <p>Obecne miejsce pracy</p>
                <Input
                  id="currentWorkplace"
                  type="text"
                  placeholder="np. Firma XYZ Sp. z o.o."
                  value={formData.currentWorkplace}
                  onChange={(e) => handleInputChange('currentWorkplace', e.target.value)}
                  required
                />
              </div>
            </div>
  
            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={onBack}>
                Wstecz
              </Button>
              <Button type="submit" disabled={!isFormValid}>
                Oblicz emeryturę
              </Button>
            </div>
          </form>
        </p>
      </div>
  )
}
export default UserFormPage;