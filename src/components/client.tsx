'use client';

import { useState } from 'react';
import CertificateCard from '@/components/certificate-card';

interface File {
  id: string;
  name: string;
  type: string;
  size: string;
  link: string;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

interface Certificate {
  id: string;
  title: string;
  installationDate: Date;
  user: User;
  smilePhoto: File;
  digitalCopy: File;
  doctorFirstName: string;
  doctorLastName: string;
  clinicName: string;
  clinicCity: string;
  technicianFirstName: string;
  technicianLastName: string;
  materialType: string;
  materialColor: string;
  fixationType: string;
  fixationColor: string;
  dentalFormula: any;
  createdAt: Date;
  updatedAt: Date;
}

interface CertificatesClientProps {
  certificates: Certificate[];
}

export default function CertificatesClient({ certificates }: CertificatesClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'doctor' | 'clinic' | 'date'>('all');

  const filteredCertificates = certificates.filter(certificate => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    
    switch (filterBy) {
      case 'doctor':
        return `${certificate.doctorFirstName} ${certificate.doctorLastName}`.toLowerCase().includes(searchLower);
      case 'clinic':
        return certificate.clinicName.toLowerCase().includes(searchLower) || 
               certificate.clinicCity.toLowerCase().includes(searchLower);
      case 'date':
        return certificate.title.toLowerCase().includes(searchLower) ||
               certificate.installationDate.toISOString().includes(searchTerm);
      default:
        return certificate.title.toLowerCase().includes(searchLower) ||
               `${certificate.doctorFirstName} ${certificate.doctorLastName}`.toLowerCase().includes(searchLower) ||
               certificate.clinicName.toLowerCase().includes(searchLower) ||
               certificate.clinicCity.toLowerCase().includes(searchLower);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Сертификаты</h1>
          <p className="text-gray-600">Всего сертификатов: {certificates.length}</p>
        </div>

        {/* Поиск и фильтры */}
        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Поиск
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Введите поисковый запрос..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="sm:w-48">
              <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-2">
                Фильтр по
              </label>
              <select
                id="filter"
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as 'all' | 'doctor' | 'clinic' | 'date')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Всё</option>
                <option value="doctor">Врач</option>
                <option value="clinic">Клиника</option>
                <option value="date">Дата/Название</option>
              </select>
            </div>
          </div>
        </div>

        {/* Сетка сертификатов */}
        {filteredCertificates.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm ? 'Сертификаты не найдены' : 'Сертификаты отсутствуют'}
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? 'Попробуйте изменить поисковый запрос или фильтр'
                : 'Создайте первый сертификат, чтобы увидеть его здесь'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertificates.map((certificate) => (
              <CertificateCard key={certificate.id} certificate={certificate} />
            ))}
          </div>
        )}

        {/* Статистика */}
        {certificates.length > 0 && (
          <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Статистика</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{certificates.length}</div>
                <div className="text-sm text-gray-600">Всего сертификатов</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {new Set(certificates.map(c => c.clinicName)).size}
                </div>
                <div className="text-sm text-gray-600">Уникальных клиник</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(certificates.map(c => `${c.doctorFirstName} ${c.doctorLastName}`)).size}
                </div>
                <div className="text-sm text-gray-600">Уникальных врачей</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
