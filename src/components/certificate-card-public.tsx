import Image from "next/image";
import { Certificate } from "@/types/index";

export default function CertificateCardPublic({ certificate }: { certificate: Certificate }) {


  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {certificate.title}
        </h3>
        
        <div className="space-y-2 text-sm text-gray-600 mb-4">
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
        </div>

        {/* Описание сертификата */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-1">Цифровой сертификат Magicneers</h4>
          <p className="text-xs text-blue-700">Сертификат подтверждает подлинность Magicneers виниров.</p>
        </div>

        {/* Кнопки действий */}
        <div className="space-y-2">
          <div className="flex space-x-2">
            <button className="flex-1 bg-green-500 text-white text-center py-2 px-3 rounded text-sm hover:bg-green-600 transition-colors flex items-center justify-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Поделиться
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}