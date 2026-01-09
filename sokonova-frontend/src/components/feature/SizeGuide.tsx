
import { useState } from 'react';

interface SizeGuideProps {
  category?: 'clothing' | 'shoes' | 'accessories';
}

export default function SizeGuide({ category = 'clothing' }: SizeGuideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'size' | 'measure'>('size');

  const clothingSizes = [
    { size: 'XS', chest: '81-86', waist: '66-71', hips: '86-91' },
    { size: 'S', chest: '86-91', waist: '71-76', hips: '91-96' },
    { size: 'M', chest: '91-96', waist: '76-81', hips: '96-101' },
    { size: 'L', chest: '96-102', waist: '81-86', hips: '101-106' },
    { size: 'XL', chest: '102-107', waist: '86-91', hips: '106-111' },
    { size: 'XXL', chest: '107-112', waist: '91-96', hips: '111-116' },
  ];

  const shoeSizes = [
    { us: '6', uk: '3.5', eu: '36', cm: '22.5' },
    { us: '6.5', uk: '4', eu: '37', cm: '23' },
    { us: '7', uk: '4.5', eu: '37.5', cm: '23.5' },
    { us: '7.5', uk: '5', eu: '38', cm: '24' },
    { us: '8', uk: '5.5', eu: '38.5', cm: '24.5' },
    { us: '8.5', uk: '6', eu: '39', cm: '25' },
    { us: '9', uk: '6.5', eu: '40', cm: '25.5' },
    { us: '9.5', uk: '7', eu: '40.5', cm: '26' },
    { us: '10', uk: '7.5', eu: '41', cm: '26.5' },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 cursor-pointer whitespace-nowrap"
      >
        <i className="ri-ruler-line"></i>
        Size Guide
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Size Guide</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 hover:bg-gray-100 rounded-full flex items-center justify-center cursor-pointer whitespace-nowrap"
              >
                <i className="ri-close-line text-xl text-gray-600"></i>
              </button>
            </div>

            <div className="p-6">
              <div className="flex gap-2 mb-6 border-b border-gray-200">
                <button
                  onClick={() => setSelectedTab('size')}
                  className={`px-4 py-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    selectedTab === 'size'
                      ? 'text-emerald-600 border-b-2 border-emerald-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Size Chart
                </button>
                <button
                  onClick={() => setSelectedTab('measure')}
                  className={`px-4 py-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    selectedTab === 'measure'
                      ? 'text-emerald-600 border-b-2 border-emerald-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  How to Measure
                </button>
              </div>

              {selectedTab === 'size' && (
                <div>
                  {category === 'clothing' && (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">
                              Size
                            </th>
                            <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">
                              Chest (cm)
                            </th>
                            <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">
                              Waist (cm)
                            </th>
                            <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">
                              Hips (cm)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {clothingSizes.map((item) => (
                            <tr key={item.size} className="hover:bg-gray-50">
                              <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">
                                {item.size}
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-gray-600">
                                {item.chest}
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-gray-600">
                                {item.waist}
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-gray-600">
                                {item.hips}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {category === 'shoes' && (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">
                              US
                            </th>
                            <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">
                              UK
                            </th>
                            <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">
                              EU
                            </th>
                            <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">
                              CM
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {shoeSizes.map((item) => (
                            <tr key={item.us} className="hover:bg-gray-50">
                              <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">
                                {item.us}
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-gray-600">
                                {item.uk}
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-gray-600">
                                {item.eu}
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-gray-600">
                                {item.cm}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <i className="ri-information-line text-emerald-600 text-xl mt-0.5"></i>
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Size Tip
                        </p>
                        <p className="text-sm text-gray-600">
                          If you're between sizes, we recommend sizing up for a more comfortable fit.
                          All measurements are approximate and may vary slightly.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === 'measure' && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-emerald-600 font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Chest</h3>
                      <p className="text-sm text-gray-600">
                        Measure around the fullest part of your chest, keeping the tape horizontal.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-emerald-600 font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Waist</h3>
                      <p className="text-sm text-gray-600">
                        Measure around your natural waistline, keeping the tape comfortably loose.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-emerald-600 font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Hips</h3>
                      <p className="text-sm text-gray-600">
                        Measure around the fullest part of your hips, keeping the tape horizontal.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <i className="ri-lightbulb-line text-emerald-600"></i>
                      Measuring Tips
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <i className="ri-checkbox-circle-fill text-emerald-600 mt-0.5"></i>
                        <span>Use a soft measuring tape for accurate results</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="ri-checkbox-circle-fill text-emerald-600 mt-0.5"></i>
                        <span>Measure over light clothing or directly on skin</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="ri-checkbox-circle-fill text-emerald-600 mt-0.5"></i>
                        <span>Keep the tape snug but not tight</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="ri-checkbox-circle-fill text-emerald-600 mt-0.5"></i>
                        <span>Ask someone to help you for best accuracy</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
