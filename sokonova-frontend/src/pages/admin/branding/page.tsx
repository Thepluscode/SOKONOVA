import { useState } from 'react';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';

const colorPresets = [
  { name: 'Teal', primary: '#14B8A6', secondary: '#0D9488', accent: '#5EEAD4' },
  { name: 'Ocean Blue', primary: '#0EA5E9', secondary: '#0284C7', accent: '#7DD3FC' },
  { name: 'Royal Purple', primary: '#A855F7', secondary: '#9333EA', accent: '#D8B4FE' },
  { name: 'Sunset Orange', primary: '#F97316', secondary: '#EA580C', accent: '#FDBA74' },
  { name: 'Forest Green', primary: '#10B981', secondary: '#059669', accent: '#6EE7B7' },
  { name: 'Rose Pink', primary: '#EC4899', secondary: '#DB2777', accent: '#F9A8D4' },
  { name: 'Amber Gold', primary: '#F59E0B', secondary: '#D97706', accent: '#FCD34D' },
  { name: 'Indigo', primary: '#6366F1', secondary: '#4F46E5', accent: '#A5B4FC' },
];

export default function AdminBrandingPage() {
  const [brandName, setBrandName] = useState('SOKONOVA');
  const [tagline, setTagline] = useState('Your Trusted Marketplace');
  const [selectedPreset, setSelectedPreset] = useState(colorPresets[0]);
  const [customColors, setCustomColors] = useState({
    primary: '#14B8A6',
    secondary: '#0D9488',
    accent: '#5EEAD4',
  });
  const [logoUrl, setLogoUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('brandSettings', JSON.stringify({
      brandName,
      tagline,
      colors: customColors,
      logoUrl,
      faviconUrl,
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const applyPreset = (preset: typeof colorPresets[0]) => {
    setSelectedPreset(preset);
    setCustomColors({
      primary: preset.primary,
      secondary: preset.secondary,
      accent: preset.accent,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8 mt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Branding & Customization</h1>
          <p className="text-gray-600">Customize your marketplace's look and feel</p>
        </div>

        {saved && (
          <div className="mb-6 bg-teal-50 border border-teal-200 text-teal-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <i className="ri-check-line text-xl"></i>
            <span>Settings saved successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Brand Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <i className="ri-store-2-line text-teal-600"></i>
                Brand Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter your brand name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter your tagline"
                  />
                </div>
              </div>
            </div>

            {/* Color Schemes */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <i className="ri-palette-line text-teal-600"></i>
                Color Scheme
              </h2>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Preset Themes</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset)}
                      className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                        selectedPreset.name === preset.name
                          ? 'border-teal-600 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex gap-1 mb-2">
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: preset.primary }}
                        ></div>
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: preset.secondary }}
                        ></div>
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: preset.accent }}
                        ></div>
                      </div>
                      <p className="text-xs font-medium text-gray-700">{preset.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Custom Colors</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customColors.primary}
                        onChange={(e) => setCustomColors({ ...customColors, primary: e.target.value })}
                        className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customColors.primary}
                        onChange={(e) => setCustomColors({ ...customColors, primary: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Secondary Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customColors.secondary}
                        onChange={(e) => setCustomColors({ ...customColors, secondary: e.target.value })}
                        className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customColors.secondary}
                        onChange={(e) => setCustomColors({ ...customColors, secondary: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Accent Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customColors.accent}
                        onChange={(e) => setCustomColors({ ...customColors, accent: e.target.value })}
                        className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customColors.accent}
                        onChange={(e) => setCustomColors({ ...customColors, accent: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Logo & Assets */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <i className="ri-image-line text-teal-600"></i>
                Logo & Assets
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="https://example.com/logo.png"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended size: 200x60px</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Favicon URL
                  </label>
                  <input
                    type="url"
                    value={faviconUrl}
                    onChange={(e) => setFaviconUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="https://example.com/favicon.ico"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended size: 32x32px</p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              Save Changes
            </button>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h2>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-2">Brand Name</p>
                  <h3 className="text-2xl font-bold" style={{ color: customColors.primary }}>
                    {brandName}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{tagline}</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-3">Button Styles</p>
                  <div className="space-y-2">
                    <button
                      className="w-full py-2 rounded-lg text-white font-medium whitespace-nowrap cursor-pointer"
                      style={{ backgroundColor: customColors.primary }}
                    >
                      Primary Button
                    </button>
                    <button
                      className="w-full py-2 rounded-lg text-white font-medium whitespace-nowrap cursor-pointer"
                      style={{ backgroundColor: customColors.secondary }}
                    >
                      Secondary Button
                    </button>
                    <button
                      className="w-full py-2 rounded-lg border-2 font-medium whitespace-nowrap cursor-pointer"
                      style={{ 
                        borderColor: customColors.accent,
                        color: customColors.primary 
                      }}
                    >
                      Accent Button
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-3">Color Palette</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded border border-gray-200"
                        style={{ backgroundColor: customColors.primary }}
                      ></div>
                      <div>
                        <p className="text-xs font-medium text-gray-700">Primary</p>
                        <p className="text-xs text-gray-500">{customColors.primary}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded border border-gray-200"
                        style={{ backgroundColor: customColors.secondary }}
                      ></div>
                      <div>
                        <p className="text-xs font-medium text-gray-700">Secondary</p>
                        <p className="text-xs text-gray-500">{customColors.secondary}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded border border-gray-200"
                        style={{ backgroundColor: customColors.accent }}
                      ></div>
                      <div>
                        <p className="text-xs font-medium text-gray-700">Accent</p>
                        <p className="text-xs text-gray-500">{customColors.accent}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
