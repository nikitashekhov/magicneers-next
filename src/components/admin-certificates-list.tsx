'use client';

import { useState } from 'react';
import CertificateCard from '@/components/certificate-card';
import { Certificate } from '@/types/index';

interface CertificatesAdminListProps {
  certificates: Certificate[];
}

export default function CertificatesAdminList({ certificates }: CertificatesAdminListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCertificates = certificates.filter(certificate => {
    if (!searchTerm) return true;
    return certificate.doctorFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           certificate.doctorLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           certificate.technicianFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           certificate.technicianLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           certificate.user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           certificate.user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           certificate.user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           certificate.clinicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           certificate.clinicCity.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <>
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
              placeholder="Поиск по данным пациента, врача, техника и клиники"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>
          <div className="sm:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Действия
            </label>
            <a
              href={`/certificates/create?${new URLSearchParams({
                lastIndex: certificates.length.toString()
              }).toString()}`}
              className="w-full px-3 py-2 bg-[#1EB7D9] text-white rounded-md hover:bg-[#18CCF4] transition-colors duration-200 inline-flex items-center justify-center"
            >
              Создать сертификат
            </a>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCertificates.map((certificate) => (
            <CertificateCard key={certificate.id} certificate={certificate} />
          ))}
        </div>
      )}
    </>
  );
}
