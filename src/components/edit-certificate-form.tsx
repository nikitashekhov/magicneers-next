'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Certificate } from '@/types/index';

interface EditCertificateFormProps {
  certificate: Certificate;
}

export default function EditCertificateForm({ certificate }: EditCertificateFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: certificate.title,
    installationDate: certificate.installationDate.toISOString().split('T')[0],
    userFirstName: certificate.user.firstName || '',
    userLastName: certificate.user.lastName || '',
    userEmail: certificate.user.email,
    doctorFirstName: certificate.doctorFirstName,
    doctorLastName: certificate.doctorLastName,
    clinicName: certificate.clinicName,
    clinicCity: certificate.clinicCity,
    technicianFirstName: certificate.technicianFirstName,
    technicianLastName: certificate.technicianLastName,
    materialType: certificate.materialType,
    materialColor: certificate.materialColor,
    fixationType: certificate.fixationType,
    fixationColor: certificate.fixationColor,
    dentalFormulaData: certificate.dentalFormula || {
      "top": {
        "right": [false, false, false, false, false, false, false, false],
        "left": [false, false, false, false, false, false, false, false]
      },
      "bottom": {
        "right": [false, false, false, false, false, false, false, false],
        "left": [false, false, false, false, false, false, false, false]
      }
    },
    dentalFormula: JSON.stringify(certificate.dentalFormula || {
      "top": {
        "right": [false, false, false, false, false, false, false, false],
        "left": [false, false, false, false, false, false, false, false]
      },
      "bottom": {
        "right": [false, false, false, false, false, false, false, false],
        "left": [false, false, false, false, false, false, false, false]
      }
    }),
  });

  const [smilePhoto, setSmilePhoto] = useState<globalThis.File | null>(null);
  const [digitalCopy, setDigitalCopy] = useState<globalThis.File | null>(null);
  const [smilePhotoPreview, setSmilePhotoPreview] = useState<string | null>(null);
  const [digitalCopyPreview, setDigitalCopyPreview] = useState<string | null>(null);

  const handleFileChange = (file: globalThis.File | null, type: 'smile' | 'digital') => {
    if (type === 'smile') {
      setSmilePhoto(file);
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setSmilePhotoPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setSmilePhotoPreview(null);
      }
    } else {
      setDigitalCopy(file);
      if (file) {
        setDigitalCopyPreview(file.name);
      } else {
        setDigitalCopyPreview(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formDataToSend = new FormData();
      
      // Добавляем ID сертификата
      formDataToSend.append('certificateId', certificate.id);
      
      // Добавляем все текстовые поля
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'dentalFormulaData') {
          // Skip dentalFormulaData as it's only used for UI state
          return;
        }
        if (value !== undefined) {
          if (typeof value === 'object' && value !== null) {
            formDataToSend.append(key, JSON.stringify(value));
          } else {
            formDataToSend.append(key, String(value));
          }
        }
      });

      // Добавляем файлы только если они выбраны
      if (smilePhoto) {
        formDataToSend.append('smilePhoto', smilePhoto as Blob);
      }
      if (digitalCopy) {
        formDataToSend.append('digitalCopy', digitalCopy as Blob);
      }

      const response = await fetch('/api/certificate/update', {
        method: 'PUT',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        router.push('/certificates');
      } else {
        setError(data.error || 'Произошла ошибка при обновлении сертификата');
      }
    } catch {
      setError('Ошибка сети при обновлении сертификата');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/certificates');
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Ошибка</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Успешно!</h3>
              <div className="mt-2 text-sm text-green-700">
                Сертификат успешно обновлен. Перенаправление через 2 секунды...
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Основная информация */}
        <div className="bg-gray-50 p-4 rounded-lg">
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
                Email пользователя *
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
        <div className="bg-gray-50 p-4 rounded-lg">
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
        <div className="bg-gray-50 p-4 rounded-lg">
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
        <div className="bg-gray-50 p-4 rounded-lg">
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
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Файлы</h3>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Фото улыбки */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Фото улыбки
              </label>
              
              {/* Текущее фото */}
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">Текущее фото:</p>
                <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={certificate.smilePhoto.link}
                    alt="Текущее фото улыбки"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {certificate.smilePhoto.name} ({(parseInt(certificate.smilePhoto.size) / 1024 / 1024).toFixed(1)} MB)
                </p>
              </div>

              {/* Новое фото */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null, 'smile')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                />
                {smilePhotoPreview && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">Предварительный просмотр:</p>
                    <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={smilePhotoPreview}
                        alt="Предварительный просмотр"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Оставьте пустым, чтобы сохранить текущее фото
                </p>
              </div>
            </div>

            {/* Цифровая копия */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Цифровая копия (ZIP/STL)
              </label>
              
              {/* Текущий файл */}
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">Текущий файл:</p>
                <div className="p-3 bg-gray-100 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">{certificate.digitalCopy.name}</p>
                  <p className="text-xs text-gray-500">
                    {(parseInt(certificate.digitalCopy.size) / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </div>

              {/* Новый файл */}
              <div>
                <input
                  type="file"
                  accept=".zip,.stl"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null, 'digital')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                />
                {digitalCopyPreview && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Новый файл: {digitalCopyPreview}</p>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Оставьте пустым, чтобы сохранить текущий файл
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </div>
      </form>
    </div>
  );
}
