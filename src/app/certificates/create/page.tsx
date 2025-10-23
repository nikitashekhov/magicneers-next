'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TestCertificatePage() {
  const [formData, setFormData] = useState({
    title: 'Magicneers #1',
    installationDate: new Date().toISOString().split('T')[0],
    userFirstName: '',
    userLastName: '',
    userEmail: '',
    doctorFirstName: '',
    doctorLastName: '',
    clinicName: 'AestheticA',
    clinicCity: 'Москва',
    technicianFirstName: '',
    technicianLastName: '',
    materialType: '',
    materialColor: '',
    fixationType: '',
    fixationColor: '',
    dentalFormulaData: {
      "top": {
        "right": [false, false, false, false, false, false, false, false],
        "left": [false, false, false, false, false, false, false, false]
      },
      "bottom": {
        "right": [false, false, false, false, false, false, false, false],
        "left": [false, false, false, false, false, false, false, false]
      }
    },
    dentalFormula: JSON.stringify({
      "top": {
        "right": [false, false, false, false, false, false, false, false],
        "left": [false, false, false, false, false, false, false, false]
      },
      "bottom": {
        "right": [false, false, false, false, false, false, false, false],
        "left": [false, false, false, false, false, false, false, false]
      }
    })
  });

  const [smilePhoto, setSmilePhoto] = useState<File | null>(null);
  const [digitalCopy, setDigitalCopy] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const lastIndex = parseInt(searchParams.get('lastIndex') || '0');
    setFormData({
      ...formData,
      title: `Magicneers #${lastIndex + 1}`
    });
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const formDataToSend = new FormData();
      
      // Добавляем все текстовые поля
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'dentalFormulaData') {
          // Skip dentalFormulaData as it's only used for UI state
          return;
        }
        if (typeof value === 'object' && value !== null) {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, String(value));
        }
      });

      // Добавляем файлы
      if (smilePhoto) {
        formDataToSend.append('smilePhoto', smilePhoto);
      }
      if (digitalCopy) {
        formDataToSend.append('digitalCopy', digitalCopy);
      }

      const response = await fetch('/api/certificate/create', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, error: 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Создание сертификата</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Название</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>


        <div>
          <label className="block text-sm font-medium mb-1">Дата установки</label>
          <input
            type="date"
            value={formData.installationDate}
            onChange={(e) => setFormData({...formData, installationDate: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* User Information */}
        <div className="p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Информация о пациенте</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium mb-1">Имя пациента</label>
              <input
                type="text"
                value={formData.userFirstName}
                onChange={(e) => setFormData({...formData, userFirstName: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Фамилия пациента</label>
              <input
                type="text"
                value={formData.userLastName}
                onChange={(e) => setFormData({...formData, userLastName: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email пациента</label>
              <input
                type="email"
                value={formData.userEmail}
                onChange={(e) => setFormData({...formData, userEmail: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Имя врача</label>
            <input
              type="text"
              value={formData.doctorFirstName}
              onChange={(e) => setFormData({...formData, doctorFirstName: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Фамилия врача</label>
            <input
              type="text"
              value={formData.doctorLastName}
              onChange={(e) => setFormData({...formData, doctorLastName: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
        <div>
            <label className="block text-sm font-medium mb-1">Город клиники</label>
            <select
              value={formData.clinicCity}
              onChange={(e) => {
                const selectedCity = e.target.value;
                let clinicName = formData.clinicName;
                
                // Автоматически изменяем название клиники в зависимости от города
                if (selectedCity === 'Москва' || selectedCity === 'Барвиха') {
                  clinicName = 'AestheticA';
                } else if (selectedCity === 'Дубай') {
                  clinicName = 'Aesthet';
                }
                
                setFormData({
                  ...formData, 
                  clinicCity: selectedCity,
                  clinicName: clinicName
                });
              }}
              className="w-full p-2 border rounded"
            >
              <option value="">Выберите город</option>
              <option value="Барвиха">Барвиха</option>
              <option value="Москва">Москва</option>
              <option value="Дубай">Дубай</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Название клиники</label>
            <input
              type="text"
              value={formData.clinicName}
              onChange={(e) => setFormData({...formData, clinicName: e.target.value})}
              className="w-full p-2 border rounded"
              disabled={true}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Имя техника</label>
            <input
              type="text"
              value={formData.technicianFirstName}
              onChange={(e) => setFormData({...formData, technicianFirstName: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Фамилия техника</label>
            <input
              type="text"
              value={formData.technicianLastName}
              onChange={(e) => setFormData({...formData, technicianLastName: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Тип материала</label>
            <input
              type="text"
              value={formData.materialType}
              onChange={(e) => setFormData({...formData, materialType: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Цвет материала</label>
            <input
              type="text"
              value={formData.materialColor}
              onChange={(e) => setFormData({...formData, materialColor: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Тип фиксации</label>
            <input
              type="text"
              value={formData.fixationType}
              onChange={(e) => setFormData({...formData, fixationType: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Цвет фиксации</label>
            <input
              type="text"
              value={formData.fixationColor}
              onChange={(e) => setFormData({...formData, fixationColor: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Dental Formula Section */}
        <div className="overflow-auto flex flex-col text-sm">
          <div className="flex gap-2">
            <div className="self-center font-bold">
              Правая сторона
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-center font-bold text-sm must14">
                Верхняя челюсть
              </div>
              <div>
                <div className="flex">
                  {/* Top Right Teeth (18-11) */}
                  <div className="flex gap-0 border-b border-r border-black pr-2 pb-1">
                    {[18, 17, 16, 15, 14, 13, 12, 11].map((toothNumber, index) => (
                      <div key={`top-right-${index}`} className="veneer">
                        <label className="flex flex-col items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.dentalFormulaData?.top?.right?.[7-index] || false}
                            onChange={(e) => {
                              const newFormula = { ...formData.dentalFormulaData };
                              if (!newFormula.top) newFormula.top = { right: [], left: [] };
                              if (!newFormula.top.right) newFormula.top.right = new Array(8).fill(false);
                              newFormula.top.right[7-index] = e.target.checked;
                              setFormData({
                                ...formData,
                                dentalFormulaData: newFormula,
                                dentalFormula: JSON.stringify(newFormula)
                              });
                            }}
                            className="mb-1"
                          />
                          <span className="text-xs">{toothNumber}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                  {/* Top Left Teeth (21-28) */}
                  <div className="flex gap-0 border-b border-black pl-2 pb-1">
                    {[21, 22, 23, 24, 25, 26, 27, 28].map((toothNumber, index) => (
                      <div key={`top-left-${index}`} className="veneer">
                        <label className="flex flex-col items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.dentalFormulaData?.top?.left?.[index] || false}
                            onChange={(e) => {
                              const newFormula = { ...formData.dentalFormulaData };
                              if (!newFormula.top) newFormula.top = { right: [], left: [] };
                              if (!newFormula.top.left) newFormula.top.left = new Array(8).fill(false);
                              newFormula.top.left[index] = e.target.checked;
                              setFormData({
                                ...formData,
                                dentalFormulaData: newFormula,
                                dentalFormula: JSON.stringify(newFormula)
                              });
                            }}
                            className="mb-1"
                          />
                          <span className="text-xs">{toothNumber}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex">
                  {/* Bottom Right Teeth (48-41) */}
                  <div className="flex gap-0 pr-2 pt-1 border-r border-black">
                    {[48, 47, 46, 45, 44, 43, 42, 41].map((toothNumber, index) => (
                      <div key={`bottom-right-${index}`} className="veneer">
                        <label className="flex flex-col items-center cursor-pointer">
                          <span className="text-xs mb-1">{toothNumber}</span>
                          <input
                            type="checkbox"
                            checked={formData.dentalFormulaData?.bottom?.right?.[7-index] || false}
                            onChange={(e) => {
                              const newFormula = { ...formData.dentalFormulaData };
                              if (!newFormula.bottom) newFormula.bottom = { right: [], left: [] };
                              if (!newFormula.bottom.right) newFormula.bottom.right = new Array(8).fill(false);
                              newFormula.bottom.right[7-index] = e.target.checked;
                              setFormData({
                                ...formData,
                                dentalFormulaData: newFormula,
                                dentalFormula: JSON.stringify(newFormula)
                              });
                            }}
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                  {/* Bottom Left Teeth (31-38) */}
                  <div className="flex gap-0 pt-1 pl-2">
                    {[31, 32, 33, 34, 35, 36, 37, 38].map((toothNumber, index) => (
                      <div key={`bottom-left-${index}`} className="veneer">
                        <label className="flex flex-col items-center cursor-pointer">
                          <span className="text-xs mb-1">{toothNumber}</span>
                          <input
                            type="checkbox"
                            checked={formData.dentalFormulaData?.bottom?.left?.[index] || false}
                            onChange={(e) => {
                              const newFormula = { ...formData.dentalFormulaData };
                              if (!newFormula.bottom) newFormula.bottom = { right: [], left: [] };
                              if (!newFormula.bottom.left) newFormula.bottom.left = new Array(8).fill(false);
                              newFormula.bottom.left[index] = e.target.checked;
                              setFormData({
                                ...formData,
                                dentalFormulaData: newFormula,
                                dentalFormula: JSON.stringify(newFormula)
                              });
                            }}
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-center font-bold must14">
                Нижняя челюсть
              </div>
            </div>
            <div className="self-center font-bold">
              Левая сторона
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Фото улыбки</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSmilePhoto(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Цифровая копия (ZIP/STL)</label>
          <input
            type="file"
            accept=".zip,.stl"
            onChange={(e) => setDigitalCopy(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Создание сертификата...' : 'Создать сертификат'}
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 border rounded">
          <h3 className="font-bold mb-2">Результат:</h3>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto text-black">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
