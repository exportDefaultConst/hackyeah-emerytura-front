import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import DropdownList from "../components/DropdownList";
import { useNavigate } from "react-router";
import Divider from "../components/Divider";
import { API_URL } from "../constants";

const UserFormPage = () => {

  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    // Handle default values when arrows are pressed on empty fields
    if ((formData[field] === '' || formData[field] === null)) {
      if (field === 'age' && (value === '1' || value === '0')) {
        setFormData(prev => ({...prev, [field]: '35'}));
        return;
      }
      if (field === 'gross_salary' && (value === '1' || value === '0' || value === '100')) {
        setFormData(prev => ({...prev, [field]: '8000'}));
        return;
      }
      if (field === 'work_start_year' && (value === '1' || value === '0')) {
        setFormData(prev => ({...prev, [field]: '2010'}));
        return;
      }
      if (field === 'work_end_year' && (value === '1' || value === '0')) {
        setFormData(prev => ({...prev, [field]: '2045'}));
        return;
      }
      if (field === 'zus_account_balance' && (value === '1' || value === '0' || value === '1000')) {
        setFormData(prev => ({...prev, [field]: '50000'}));
        return;
      }
      if (field === 'zus_subaccount_balance' && (value === '1' || value === '0' || value === '1000')) {
        setFormData(prev => ({...prev, [field]: '15000'}));
        return;
      }
      if (field === 'sick_leave_days_per_year' && (value === '1' || value === '0')) {
        setFormData(prev => ({...prev, [field]: '5'}));
        return;
      }
    }
    setFormData(prev => ({...prev,[field] : value}));
  };

  const PersonalInfo = {
    age: '',
    gender: "",
    gross_salary: "",
    work_start_year: "",
    work_end_year: "",
    industry: "",
    position: "",
    zus_account_balance: "",
    zus_subaccount_balance: "",
    sick_leave_days_per_year: ""
  }

  const [formData, setFormData] = useState(PersonalInfo);
  const [showAdvancedData, setShowAdvancedData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) return;
    
    setIsSubmitting(true);
    
    try {
      // Convert form data to proper types and handle empty values
      const userData = {
        age: parseInt(formData.age) || 35,
        gender: formData.gender === "Kobieta" ? "female" : formData.gender === "Mężczyzna" ? "male" : "other",
        gross_salary: parseFloat(formData.gross_salary) || 8000,
        work_start_year: parseInt(formData.work_start_year) || 2010,
        work_end_year: parseInt(formData.work_end_year) || 2045,
        industry: formData.industry || "IT",
        position: formData.position || "Employee",
        zus_account_balance: formData.zus_account_balance ? parseFloat(formData.zus_account_balance) : 0.0,
        zus_subaccount_balance: formData.zus_subaccount_balance ? parseFloat(formData.zus_subaccount_balance) : 0.0,
        sick_leave_days_per_year: formData.sick_leave_days_per_year ? parseFloat(formData.sick_leave_days_per_year) : 0.0
      };

      console.log('Sending request to API with data:', userData);

      const res = await fetch(`${API_URL}/api/calculate_pension`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          user_data: userData
        }),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      console.log('Received response:', data);
      
      // Navigate to dashboard with the response data
      navigate('/dashboard', { state: { pensionData: data } });
      
    } catch (error) {
      console.error("Error calculating pension: ", error);
      
      let errorMessage = 'Wystąpił nieoczekiwany błąd.';
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Błąd połączenia z serwerem. Sprawdź połączenie internetowe i spróbuj ponownie.';
      } else if (error.message.includes('NetworkError')) {
        errorMessage = 'Nie można połączyć się z serwerem. Serwer może być niedostępny.';
      } else if (error.message.includes('CORS')) {
        errorMessage = 'Problem z uprawnieniami dostępu do API.';
      } else if (error.message.includes('HTTP')) {
        errorMessage = `Błąd API: ${error.message}`;
      } else if (error.message.includes('missing') || error.message.includes('required')) {
        errorMessage = 'Błąd walidacji danych. Sprawdź czy wszystkie wymagane pola są wypełnione.';
      }
      
      alert(`Błąd podczas obliczania emerytury: ${errorMessage}`);
      
      // For testing purposes, navigate to dashboard with mock data
      console.log('Using mock data for testing...');
      navigate('/dashboard', { 
        state: { 
          pensionData: {
            current_pension_projection: 3840.0,
            indexed_pension_projection: 2760.0,
            replacement_rate: 48.0,
            minimum_pension_gap: 844.8,
            years_to_work_longer: 7,
            sick_leave_impact: -1300.0,
            calculation_details: {
              assumptions: [
                "Wynagrodzenie brutto stałe: 8000 PLN/mc przez cały okres pracy",
                "Składka emerytalna: 1561,60 PLN/mc (19,52% wynagrodzenia brutto)",
                "Liczba lat pracy: 35 (2010-2045)"
              ]
            }
          } 
        } 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = Object.entries(formData).every(([key, value]) => {
    // Optional fields - don't require validation
    if (['zus_account_balance', 'zus_subaccount_balance', 'sick_leave_days_per_year'].includes(key)) {
      return true;
    }
    if (key === 'age') return value !== null && value > 0;
    return value !== '';
  });

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card customClass="p-8">
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
                min={0}
                max={120}
                required
              />
            </div>

            <div className="space-y-2">
              <p>Płeć</p>
              <DropdownList 
                placeholder="Wybierz płeć"
                value={formData.gender}
                onChange={(value) => handleInputChange('gender', value)}
                options={["Kobieta", "Mężczyzna", "Inna", "Nie chcę podawać"]}>
              </DropdownList>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <p>Wynagrodzenie brutto (PLN/miesiąc)</p>
              <Input
                id="gross_salary"
                type="number"
                placeholder="np. 8000"
                value={formData.gross_salary}
                onChange={(e) => handleInputChange('gross_salary', e.target.value)}
                step={100}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p>Rok rozpoczęcia pracy</p>
              <Input
                id="work_start_year"
                type="number"
                placeholder="np. 2010"
                value={formData.work_start_year}
                onChange={(e) => handleInputChange('work_start_year', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <p>Rok zakończenia pracy</p>
              <Input
                id="work_end_year"
                type="number"
                placeholder="np. 2045"
                value={formData.work_end_year}
                onChange={(e) => handleInputChange('work_end_year', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <p>Branża</p>
              <DropdownList 
                placeholder="Wybierz branżę"
                value={formData.industry}
                onChange={(value) => handleInputChange('industry', value)}
                options={["IT", "Finanse", "Edukacja", "Ochrona zdrowia", "Produkcja", "Handel", "Transport", "Budownictwo", "Inne"]}>
              </DropdownList>
            </div>

            <div className="space-y-2">
              <p>Stanowisko</p>
              <Input
                id="position"
                type="text"
                placeholder="np. Senior Developer"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                required
              />
            </div>
          </div>

          <Divider />
          {/* Optional fields section */}
          <div className="">
            <h3 
              className="text-lg font-semibold mb-4 text-gray-500 cursor-pointer hover:underline hover:text-gray-900 transition-all duration-100"
              onClick={() => setShowAdvancedData(!showAdvancedData)}
            >
              Zaawansowane Dane
            </h3>
            {showAdvancedData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p>Środki na koncie ZUS (PLN)</p>
                  <Input
                    id="zus_account_balance"
                    type="number"
                    placeholder="np. 50000"
                    value={formData.zus_account_balance}
                    onChange={(e) => handleInputChange('zus_account_balance', e.target.value)}
                    step={1000}
                  />
                </div>

                <div className="space-y-2">
                  <p>Środki na subkoncie ZUS (PLN)</p>
                  <Input
                    id="zus_subaccount_balance"
                    type="number"
                    placeholder="np. 15000"
                    value={formData.zus_subaccount_balance}
                    onChange={(e) => handleInputChange('zus_subaccount_balance', e.target.value)}
                    step={1000}
                  />
                </div>

                <div className="space-y-2">
                  <p>Dni zwolnień lekarskich rocznie</p>
                  <Input
                    id="sick_leave_days_per_year"
                    type="number"
                    placeholder="np. 5"
                    value={formData.sick_leave_days_per_year}
                    onChange={(e) => handleInputChange('sick_leave_days_per_year', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row justify-between pt-4 gap-6">
            <Button 
            type="secondary" 
            variant="outline" 
            onClick={() => navigate('/jaka-chcesz')}
            customStyle="flex justify-center">
              Wstecz
            </Button>
            <Button 
            type="primary" 
            disabled={!isFormValid || isSubmitting} 
            customStyle="flex justify-center">
              {isSubmitting ? 'Obliczanie...' : 'Oblicz emeryturę'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
export default UserFormPage;