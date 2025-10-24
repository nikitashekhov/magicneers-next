'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

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

interface CertificateCardProps {
  certificate: Certificate;
}

export default function CertificateCard({ certificate }: CertificateCardProps) {
  const [showPrivateInfo, setShowPrivateInfo] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { data: session, status } = useSession();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatInstallationDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Заголовок и изображение */}
      <div className="relative">
        <div className="h-48 bg-gray-100 flex items-center justify-center">
          {!imageError && certificate.smilePhoto?.link ? (
            <Image
              src={certificate.smilePhoto.link}
              alt={`Фото улыбки - ${certificate.title}`}
              width={300}
              height={200}
              className="object-cover w-full h-full"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="text-gray-500 text-center">
              <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <p>Изображение недоступно</p>
            </div>
          )}
        </div>
        <div className="absolute top-2 right-2">
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            {formatDate(certificate.createdAt)}
          </span>
        </div>
      </div>

      {/* Основная информация */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {certificate.title}
        </h3>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span>Пациент: {certificate.user.firstName} {certificate.user.lastName}</span>
          </div>
          
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" clipRule="evenodd" />
            </svg>
            <span>{certificate.user.email}</span>
          </div>
          
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span>Доктор: {certificate.doctorFirstName} {certificate.doctorLastName}</span>
          </div>
          
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>{certificate.clinicName}, {certificate.clinicCity}</span>
          </div>
          
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span>Установка: {formatInstallationDate(certificate.installationDate)}</span>
          </div>
        </div>

        {/* Кнопка для показа приватной информации */}
        <button
          onClick={() => setShowPrivateInfo(!showPrivateInfo)}
          className="mt-3 w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {showPrivateInfo ? 'Скрыть детали' : 'Показать детали'}
        </button>

        {/* Приватная информация */}
        {showPrivateInfo && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="font-medium text-gray-700">Техник:</span>
                <p className="text-gray-600">{certificate.technicianFirstName} {certificate.technicianLastName}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Материал:</span>
                <p className="text-gray-600">{certificate.materialType} ({certificate.materialColor})</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="font-medium text-gray-700">Фиксация:</span>
                <p className="text-gray-600">{certificate.fixationType} ({certificate.fixationColor})</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Размер файлов:</span>
                <p className="text-gray-600">
                  Фото: {(parseInt(certificate.smilePhoto.size) / 1024 / 1024).toFixed(1)} MB<br />
                  Копия: {(parseInt(certificate.digitalCopy.size) / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
            </div>

            {/* Зубная формула */}
            <div>
              <span className="font-medium text-gray-700 block mb-2">Зубная формула:</span>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="overflow-auto flex flex-col text-xs">
                  <div className="flex gap-1">
                    <div className="self-center font-bold text-xs">
                      Прав
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-center font-bold text-xs">
                        Верхняя челюсть
                      </div>
                      <div>
                        <div className="flex">
                          {/* Top Right Teeth (18-11) */}
                          <div className="flex gap-0 border-b border-r border-gray-400 pr-1 pb-1">
                            {[18, 17, 16, 15, 14, 13, 12, 11].map((toothNumber, index) => {
                              const isSelected = certificate.dentalFormula?.top?.right?.[7-index] || false;
                              return (
                                <div key={`top-right-${index}`} className="w-6 h-6 flex items-center justify-center">
                                  <div className={`w-4 h-4 border border-gray-300 rounded text-center text-xs flex items-center justify-center ${
                                    isSelected ? 'bg-blue-500 text-white' : 'bg-white'
                                  }`}>
                                    {toothNumber}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          {/* Top Left Teeth (21-28) */}
                          <div className="flex gap-0 border-b border-gray-400 pl-1 pb-1">
                            {[21, 22, 23, 24, 25, 26, 27, 28].map((toothNumber, index) => {
                              const isSelected = certificate.dentalFormula?.top?.left?.[index] || false;
                              return (
                                <div key={`top-left-${index}`} className="w-6 h-6 flex items-center justify-center">
                                  <div className={`w-4 h-4 border border-gray-300 rounded text-center text-xs flex items-center justify-center ${
                                    isSelected ? 'bg-blue-500 text-white' : 'bg-white'
                                  }`}>
                                    {toothNumber}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <div className="flex">
                          {/* Bottom Right Teeth (48-41) */}
                          <div className="flex gap-0 pr-1 pt-1 border-r border-gray-400">
                            {[48, 47, 46, 45, 44, 43, 42, 41].map((toothNumber, index) => {
                              const isSelected = certificate.dentalFormula?.bottom?.right?.[7-index] || false;
                              return (
                                <div key={`bottom-right-${index}`} className="w-6 h-6 flex items-center justify-center">
                                  <div className={`w-4 h-4 border border-gray-300 rounded text-center text-xs flex items-center justify-center ${
                                    isSelected ? 'bg-blue-500 text-white' : 'bg-white'
                                  }`}>
                                    {toothNumber}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          {/* Bottom Left Teeth (31-38) */}
                          <div className="flex gap-0 pt-1 pl-1">
                            {[31, 32, 33, 34, 35, 36, 37, 38].map((toothNumber, index) => {
                              const isSelected = certificate.dentalFormula?.bottom?.left?.[index] || false;
                              return (
                                <div key={`bottom-left-${index}`} className="w-6 h-6 flex items-center justify-center">
                                  <div className={`w-4 h-4 border border-gray-300 rounded text-center text-xs flex items-center justify-center ${
                                    isSelected ? 'bg-blue-500 text-white' : 'bg-white'
                                  }`}>
                                    {toothNumber}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="text-center font-bold text-xs">
                        Нижняя челюсть
                      </div>
                    </div>
                    <div className="self-center font-bold text-xs">
                      Лев
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Кнопки действий */}
        <div className="mt-4 space-y-2">
          <div className="flex space-x-2">
            <a
              href={certificate.smilePhoto.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-blue-500 text-white text-center py-2 px-3 rounded text-sm hover:bg-blue-600 transition-colors"
            >
              Просмотр фото
            </a>
            <a
              href={certificate.digitalCopy.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-500 text-white text-center py-2 px-3 rounded text-sm hover:bg-green-600 transition-colors"
            >
              Скачать копию
            </a>
          </div>
          {session && ((session.user as any).role === 'admin') && <a
            href={`/certificates/edit/${certificate.id}`}
            className="w-full bg-orange-500 text-white text-center py-2 px-3 rounded text-sm hover:bg-orange-600 transition-colors block"
          >
            Редактировать
          </a>
          }
        </div>
      </div>
    </div>
  );
}
