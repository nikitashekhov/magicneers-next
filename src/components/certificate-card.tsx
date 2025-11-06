'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Certificate } from '@/types/index';
import { Download, Pencil, Trash } from 'lucide-react';

interface CertificateCardProps {
  certificate: Certificate;
}

export default function CertificateCard({ certificate }: CertificateCardProps) {
  const [showPrivateInfo, setShowPrivateInfo] = useState(true);
  const [imageError, setImageError] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

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

  const handleDeleteCertificate = async (certificateId: string) => {
    const confirmed = window.confirm('Удалить сертификат?');
    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/certificate/delete/${certificateId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (data.success) {
      router.push('/certificates');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
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
          <span className="bg-[#1EB7D9] text-white text-xs px-2 py-1 rounded-full">
            {formatInstallationDate(certificate.installationDate)}
          </span>
        </div>
      </div>

      {/* Основная информация */}
      <div className="p-4">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2 font-playfair-display">
          {certificate.user.firstName} {certificate.user.lastName} 
        </h3>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <div className='flex gap-1'>
              <span className='font-bold text-gray-700'>Почта пациента:</span>
              <span>{certificate.user.email}</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className='flex gap-1'>
              <span className='font-bold text-gray-700'>Доктор:</span>
              <span>{certificate.doctorFirstName} {certificate.doctorLastName}</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className='flex gap-1'>
              <span className='font-bold text-gray-700'>Клиника:</span>
              <span>{certificate.clinicName}, {certificate.clinicCity}</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className='flex gap-1'>
              <span className='font-bold text-gray-700'>Установка:</span>
              <span>{formatInstallationDate(certificate.installationDate)}</span>
            </div>
          </div>
        </div>

        {/* Кнопка для показа приватной информации */}
        {/* <button
          onClick={() => setShowPrivateInfo(!showPrivateInfo)}
          className="mt-3 w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {showPrivateInfo ? 'Скрыть детали' : 'Показать детали'}
        </button> */}

        {/* Приватная информация */}
        {showPrivateInfo && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <span className="font-bold text-gray-700">Техник:</span>
                <p className="text-gray-600">{certificate.technicianFirstName} {certificate.technicianLastName}</p>
              </div>
              <div>
                <span className="font-bold text-gray-700">Материал виниров:</span>
                <p className="text-gray-600">{certificate.materialType} ({certificate.materialColor})</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <span className="font-bold text-gray-700">Материал фиксации:</span>
                <p className="text-gray-600">{certificate.fixationType} ({certificate.fixationColor})</p>
              </div>
              <div>
                <span className="font-bold text-gray-700">Размер файлов:</span>
                <p className="text-gray-600">
                {session && ((session.user as { role?: string }).role === 'admin') && <>Фото: {(parseInt(certificate.smilePhoto.size) / 1024 / 1024).toFixed(1)} MB<br /></>}
                  Архив: {(parseInt(certificate.digitalCopy.size) / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
            </div>

            {/* Зубная формула */}
            <div>
              <span className="font-bold text-gray-700 block mb-2">Зубная формула:</span>
              <div className="">
                <div className="overflow-auto flex flex-col text-xs">
                  <div className="flex gap-1 items-center">
                    {session && ((session.user as { role?: string }).role === 'user') && <div className="font-bold text-xs text-gray-700">
                      Правая сторона
                    </div>}
                    <div className="flex flex-col gap-1">
                    {session && ((session.user as { role?: string }).role === 'user') && <div className="text-center font-bold text-xs text-gray-700">
                        Верхняя челюсть
                      </div>}
                      <div>
                        <div className="flex">
                          {/* Top Right Teeth (18-11) */}
                          <div className="flex gap-0 border-b border-r border-gray-400 pr-1 pb-1">
                            {[18, 17, 16, 15, 14, 13, 12, 11].map((toothNumber, index) => {
                              const isSelected = certificate.dentalFormula?.top?.right?.[7-index] || false;
                              return (
                                <div key={`top-right-${index}`} className="w-6 h-6 flex items-center justify-center">
                                  <div className={`w-6 h-6 border border-gray-300 rounded text-center text-xs flex items-center justify-center ${
                                    isSelected ? 'bg-[#1EB7D9] text-white' : 'bg-white text-gray-600'
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
                                  <div className={`w-6 h-6 border border-gray-300 rounded text-center text-xs flex items-center justify-center ${
                                    isSelected ? 'bg-[#1EB7D9] text-white' : 'bg-white text-gray-600'
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
                                  <div className={`w-6 h-6 border border-gray-300 rounded text-center text-xs flex items-center justify-center ${
                                    isSelected ? 'bg-[#1EB7D9] text-white' : 'bg-white text-gray-600'
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
                                  <div className={`w-6 h-6 border border-gray-300 rounded text-center text-xs flex items-center justify-center ${
                                    isSelected ? 'bg-[#1EB7D9] text-white' : 'bg-white text-gray-600'
                                  }`}>
                                    {toothNumber}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      {session && ((session.user as { role?: string }).role === 'user') && <div className="text-center font-bold text-xs text-gray-700">
                        Нижняя челюсть
                      </div>}
                    </div>
                    {session && ((session.user as { role?: string }).role === 'user') && <div className="self-center font-bold text-xs text-gray-700">
                      Левая сторона
                    </div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Кнопки действий */}
        <div className="mt-4 space-y-2">
          <div className="flex space-x-2">
            {/* <a
              href={certificate.smilePhoto.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-blue-500 text-white text-center py-2 px-3 rounded text-sm hover:bg-blue-600 transition-colors"
            >
              Скачать фото
            </a> */}
            <a
              href={certificate.digitalCopy.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-500 text-white text-center py-3 px-4 rounded text-sm hover:bg-green-600 transition-colors flex items-center justify-center"
            >
              <Download className="w-4 h-4 mr-2" /> Скачать архив
            </a>
          </div>
          {session && ((session.user as { role?: string }).role === 'admin') && <div className="flex space-x-2">
            <a
              href={`/certificates/edit/${certificate.id}`}
              className="w-full border border-orange-500 text-orange-500 text-center py-3 px-4 rounded text-sm hover:bg-orange-600 hover:text-white transition-colors flex items-center justify-center"
            >
              <Pencil className="w-4 h-4 mr-2" /> Редактировать
            </a>
            <button
              onClick={() => handleDeleteCertificate(certificate.id)}
              className="w-full border border-red-500 text-red-500 text-center py-3 px-4 rounded text-sm hover:bg-red-500 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
            >
              <Trash className="w-4 h-4 mr-2" /> Удалить
            </button>
          </div>}
        </div>
      </div>
    </div>
  );
}
