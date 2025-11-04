'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function TestCertificateContent() {
  const router = useRouter();
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
  const [result, setResult] = useState<{ success: boolean; error?: string; certificateId?: string } | null>(null);
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const lastIndex = parseInt(searchParams.get('lastIndex') || '0');
    setFormData(prevFormData => ({
      ...prevFormData,
      title: `Magicneers #${lastIndex + 1}`
    }));
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
    } catch {
      setResult({ success: false, error: 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold mb-6  text-gray-900">Создание сертификата</h1>
          
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Основная информация */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Основная информация</h3>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Название сертификата *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Дата установки *
                    </label>
                    <input
                      type="date"
                      value={formData.installationDate}
                      onChange={(e) => setFormData({...formData, installationDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Информация о пользователе */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Информация о пациенте</h3>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Имя пациента *
                    </label>
                    <input
                      type="text"
                      value={formData.userFirstName}
                      onChange={(e) => setFormData({...formData, userFirstName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Фамилия пациента *
                    </label>
                    <input
                      type="text"
                      value={formData.userLastName}
                      onChange={(e) => setFormData({...formData, userLastName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email пациента *
                    </label>
                    <input
                      type="email"
                      value={formData.userEmail}
                      onChange={(e) => setFormData({...formData, userEmail: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Информация о враче */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Информация о враче и клинике</h3>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Имя врача *
                    </label>
                    <input
                      type="text"
                      value={formData.doctorFirstName}
                      onChange={(e) => setFormData({...formData, doctorFirstName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Фамилия врача *
                    </label>
                    <input
                      type="text"
                      value={formData.doctorLastName}
                      onChange={(e) => setFormData({...formData, doctorLastName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Город клиники *
                    </label>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                      required
                    >
                      <option value="">Выберите город</option>
                      <option value="Барвиха">Барвиха</option>
                      <option value="Москва">Москва</option>
                      <option value="Дубай">Дубай</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Название клиники *
                    </label>
                    <input
                      type="text"
                      value={formData.clinicName}
                      onChange={(e) => setFormData({...formData, clinicName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                      required
                      disabled={true}
                    />
                  </div>
                </div>
              </div>

              {/* Техническая информация */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Техническая информация</h3>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Имя техника *
                    </label>
                    <input
                      type="text"
                      value={formData.technicianFirstName}
                      onChange={(e) => setFormData({...formData, technicianFirstName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Фамилия техника *
                    </label>
                    <input
                      type="text"
                      value={formData.technicianLastName}
                      onChange={(e) => setFormData({...formData, technicianLastName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Тип материала *
                    </label>
                    <input
                      type="text"
                      value={formData.materialType}
                      onChange={(e) => setFormData({...formData, materialType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Цвет материала *
                    </label>
                    <input
                      type="text"
                      value={formData.materialColor}
                      onChange={(e) => setFormData({...formData, materialColor: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Тип фиксации *
                    </label>
                    <input
                      type="text"
                      value={formData.fixationType}
                      onChange={(e) => setFormData({...formData, fixationType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Цвет фиксации *
                    </label>
                    <input
                      type="text"
                      value={formData.fixationColor}
                      onChange={(e) => setFormData({...formData, fixationColor: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Зубная формула */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Зубная формула</h3>
                <div className="overflow-auto flex flex-col text-sm">
                  <div className="flex gap-2">
                  <div className="self-center font-bold text-gray-900">
                    Правая сторона
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-center font-bold text-sm must14 text-gray-900">
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
                                <span className="text-xs text-gray-900">{toothNumber}</span>
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
                                <span className="text-xs text-gray-900">{toothNumber}</span>
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
                                <span className="text-xs mb-1 text-gray-900">{toothNumber}</span>
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
                                <span className="text-xs mb-1 text-gray-900">{toothNumber}</span>
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
                    <div className="text-center font-bold must14 text-gray-900">
                      Нижняя челюсть
                    </div>
                  </div>
                  <div className="self-center font-bold text-gray-900">
                    Левая сторона
                  </div>
                  </div>
                </div>
              </div>

              {/* Файлы */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Файлы</h3>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Фото улыбки */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Фото улыбки *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSmilePhoto(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                      required
                    />
                  </div>

                  {/* Цифровая копия */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Цифровая копия (ZIP/STL) *
                    </label>
                    <input
                      type="file"
                      accept=".zip,.stl"
                      onChange={(e) => setDigitalCopy(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Создание сертификата...' : 'Создать сертификат'}
                </button>
              </div>
            </form>

            {result && (
              <div className="mt-6 p-4 border rounded">
                {result.success ? (
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <div className="flex">
                      <div className="shrink-0">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">
                          Сертификат успешно создан!
                        </h3>
                        <div className="mt-4">
                          <div className="-mx-2 -my-1.5 flex">
                            <button
                              onClick={() => router.push('/certificates')}
                              className="bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                            >
                              Перейти к списку сертификатов
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                      <div className="shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Ошибка создания сертификата
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>{result.error || 'Произошла неизвестная ошибка'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestCertificatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h1 className="text-2xl font-bold mb-6 text-gray-900">Загрузка...</h1>
            </div>
          </div>
        </div>
      </div>
    }>
      <TestCertificateContent />
    </Suspense>
  );
}
