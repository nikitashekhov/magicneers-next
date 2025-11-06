'use client';

import { useState } from 'react';
import Image from "next/image";
import { Certificate } from "@/types/index";
import { Share } from 'lucide-react';

export default function CertificateCardPublic({ certificate }: { certificate: Certificate }) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Формируем URL для просмотра сертификата
  const certificateUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/view/${certificate.id}`
    : `/view/${certificate.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(certificateUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShowCertificate = () => {
    window.open(certificateUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="p-4 flex items-center gap-2 justify-between">
        <Image src="/images/magicneers.svg" alt="Magicneers" width={140} height={24} />
        <h3 className="text-lg font-semibold text-gray-900">
          {certificate.title.split(' ')[1]}
        </h3>
      </div>
      {/* Заголовок и изображение */}
      <div className="relative">
        <div className="h-48 bg-gray-100 flex items-center justify-center">
          {certificate.smilePhoto?.link ? (
            <Image
              src={certificate.smilePhoto.link}
              alt={`Фото улыбки - ${certificate.title}`}
              width={300}
              height={200}
              className="object-cover w-full h-full"
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
      </div>

      {/* Основная информация */}
      <div className="p-4">
        
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <div className='flex gap-1'>
              <span className='font-bold text-gray-700'>Доктор:</span>
              <span>{certificate.doctorFirstName} {certificate.doctorLastName}</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <div className='flex gap-1'>
              <span className='font-bold text-gray-700'>Клиника:</span>
              <span>{certificate.clinicName}, {certificate.clinicCity}</span>
            </div>
          </div>
        </div>

        {/* Описание сертификата */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-700 mb-1 font-playfair-display">Цифровой сертификат Magicneers</h4>
          <p className="text-xs text-gray-700">Сертификат подтверждает подлинность виниров Magicneers и содержит электронный архив данных.</p>
        </div>

        {/* Кнопки действий */}
        <div className="space-y-2">
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowShareModal(true)}
              className="flex-1 bg-[#1EB7D9] text-white text-center py-3 px-4 rounded text-sm hover:bg-[#18CCF4] transition-colors flex items-center justify-center cursor-pointer"
            >
              <Share className="w-4 h-4 mr-2" /> Поделиться
            </button>
          </div>
        </div>
      </div>

      {/* Модальное окно для поделиться */}
      {showShareModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowShareModal(false)}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Заголовок */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'serif' }}>
              Поделиться
            </h2>
            
            {/* Описательный текст */}
            <p className="text-gray-600 text-sm mb-4">
              Поделитесь ссылкой на Цифровой сертификат Magicneers
            </p>

            {/* Поле с ссылкой */}
            <div className="mb-4">
              {/* <label className="block text-sm text-gray-600 mb-2">Ссылка на сертификат</label> */}
              <div className="flex items-center border border-gray-300 rounded">
                <input
                  type="text"
                  value={certificateUrl}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm text-gray-900 bg-white border-0 outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="p-2 hover:bg-gray-100 transition-colors cursor-pointer"
                  title={copied ? 'Скопировано!' : 'Копировать ссылку'}
                >
                  {copied ? (
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Кнопка Show certificate */}
            <button
              onClick={handleShowCertificate}
              className="w-full bg-[#1EB7D9] text-white py-3 px-4 rounded text-sm font-medium hover:bg-[#18CCF4] transition-colors cursor-pointer"
            >
              Посмотреть сертификат
            </button>
          </div>
        </div>
      )}
    </div>
  )
}