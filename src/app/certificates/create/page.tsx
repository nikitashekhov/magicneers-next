'use client';

import { useState } from 'react';

export default function TestCertificatePage() {
  const [formData, setFormData] = useState({
    title: 'Magicneers #1',
    installationDate: '2024-01-15',
    userFirstName: 'John',
    userLastName: 'Doe',
    userEmail: 'john.doe@example.com',
    doctorFirstName: 'Artavazd',
    doctorLastName: 'Manukyan',
    clinicName: 'AestheticA',
    clinicCity: 'Moscow',
    technicianFirstName: 'Nikita',
    technicianLastName: 'Nikitin',
    materialType: 'Type 1',
    materialColor: 'Color 1',
    fixationType: 'Type 2',
    fixationColor: 'Color 2',
    dentalFormula: JSON.stringify({
      "top": {
        "right": ["1", "1", "1", "1", "1", "1", "1", false],
        "left": ["1", "1", "1", "1", "1", "1", "1", false]
      },
      "bottom": {
        "right": ["1", "1", "1", "1", "1", "1", "1", false],
        "left": ["1", "1", "1", "1", "1", "1", "1", false]
      }
    })
  });

  const [smilePhoto, setSmilePhoto] = useState<File | null>(null);
  const [digitalCopy, setDigitalCopy] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const formDataToSend = new FormData();
      
      // Добавляем все текстовые поля
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
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
      <h1 className="text-2xl font-bold mb-6">Test Certificate Creation</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>


        <div>
          <label className="block text-sm font-medium mb-1">Installation Date</label>
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
          <h3 className="text-lg font-medium text-gray-900 mb-4">User Information</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium mb-1">User First Name</label>
              <input
                type="text"
                value={formData.userFirstName}
                onChange={(e) => setFormData({...formData, userFirstName: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">User Last Name</label>
              <input
                type="text"
                value={formData.userLastName}
                onChange={(e) => setFormData({...formData, userLastName: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">User Email</label>
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
            <label className="block text-sm font-medium mb-1">Doctor First Name</label>
            <input
              type="text"
              value={formData.doctorFirstName}
              onChange={(e) => setFormData({...formData, doctorFirstName: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Doctor Last Name</label>
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
            <label className="block text-sm font-medium mb-1">Clinic Name</label>
            <input
              type="text"
              value={formData.clinicName}
              onChange={(e) => setFormData({...formData, clinicName: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Clinic City</label>
            <input
              type="text"
              value={formData.clinicCity}
              onChange={(e) => setFormData({...formData, clinicCity: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Technician First Name</label>
            <input
              type="text"
              value={formData.technicianFirstName}
              onChange={(e) => setFormData({...formData, technicianFirstName: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Technician Last Name</label>
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
            <label className="block text-sm font-medium mb-1">Material Type</label>
            <input
              type="text"
              value={formData.materialType}
              onChange={(e) => setFormData({...formData, materialType: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Material Color</label>
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
            <label className="block text-sm font-medium mb-1">Fixation Type</label>
            <input
              type="text"
              value={formData.fixationType}
              onChange={(e) => setFormData({...formData, fixationType: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fixation Color</label>
            <input
              type="text"
              value={formData.fixationColor}
              onChange={(e) => setFormData({...formData, fixationColor: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Smile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSmilePhoto(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Digital Copy (ZIP/STL)</label>
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
          {loading ? 'Creating Certificate...' : 'Create Certificate'}
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 border rounded">
          <h3 className="font-bold mb-2">Result:</h3>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto text-black">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
