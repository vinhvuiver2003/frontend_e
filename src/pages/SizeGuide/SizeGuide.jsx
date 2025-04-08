import React from 'react';

const SizeGuide = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Hướng dẫn chọn size</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Cách đo size</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-medium mb-2">1. Đo vòng ngực</h3>
            <p className="text-gray-600 mb-4">
              Đo vòng ngực tại điểm rộng nhất, thường là qua núm vú. 
              Đảm bảo thước dây song song với mặt đất và không quá chặt.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium mb-2">2. Đo vòng eo</h3>
            <p className="text-gray-600 mb-4">
              Đo vòng eo tại điểm nhỏ nhất của eo, thường là trên rốn khoảng 2-3cm.
              Giữ thước dây vừa phải, không quá chặt.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium mb-2">3. Đo vòng mông</h3>
            <p className="text-gray-600 mb-4">
              Đo vòng mông tại điểm rộng nhất của mông.
              Đảm bảo thước dây song song với mặt đất.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium mb-2">4. Đo chiều cao</h3>
            <p className="text-gray-600 mb-4">
              Đứng thẳng, không mang giày, đo từ đỉnh đầu xuống sàn.
              Giữ thước dây thẳng đứng.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Bảng size tham khảo</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Size</th>
                <th className="py-2 px-4 border-b">Vòng ngực (cm)</th>
                <th className="py-2 px-4 border-b">Vòng eo (cm)</th>
                <th className="py-2 px-4 border-b">Vòng mông (cm)</th>
                <th className="py-2 px-4 border-b">Chiều cao (cm)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b text-center">S</td>
                <td className="py-2 px-4 border-b text-center">86-90</td>
                <td className="py-2 px-4 border-b text-center">66-70</td>
                <td className="py-2 px-4 border-b text-center">90-94</td>
                <td className="py-2 px-4 border-b text-center">155-160</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b text-center">M</td>
                <td className="py-2 px-4 border-b text-center">90-94</td>
                <td className="py-2 px-4 border-b text-center">70-74</td>
                <td className="py-2 px-4 border-b text-center">94-98</td>
                <td className="py-2 px-4 border-b text-center">160-165</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b text-center">L</td>
                <td className="py-2 px-4 border-b text-center">94-98</td>
                <td className="py-2 px-4 border-b text-center">74-78</td>
                <td className="py-2 px-4 border-b text-center">98-102</td>
                <td className="py-2 px-4 border-b text-center">165-170</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b text-center">XL</td>
                <td className="py-2 px-4 border-b text-center">98-102</td>
                <td className="py-2 px-4 border-b text-center">78-82</td>
                <td className="py-2 px-4 border-b text-center">102-106</td>
                <td className="py-2 px-4 border-b text-center">170-175</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 bg-yellow-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Lưu ý quan trọng</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Kích thước có thể thay đổi tùy theo chất liệu và kiểu dáng sản phẩm</li>
          <li>Nên đo lại size sau mỗi 3-6 tháng</li>
          <li>Nếu số đo của bạn nằm giữa hai size, hãy chọn size lớn hơn</li>
          <li>Đối với quần áo co giãn, có thể chọn size nhỏ hơn</li>
        </ul>
      </div>
    </div>
  );
};

export default SizeGuide; 