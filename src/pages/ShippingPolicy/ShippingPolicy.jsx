import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Chính sách vận chuyển</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Phạm vi giao hàng</h2>
        <p className="text-gray-600 mb-4">
          Chúng tôi giao hàng toàn quốc, bao gồm 63 tỉnh thành trên cả nước. 
          Đối với các khu vực nội thành, ngoại thành và các tỉnh lân cận, thời gian giao hàng sẽ khác nhau.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Thời gian giao hàng</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-medium mb-2">2.1. Khu vực nội thành Hà Nội và TP.HCM</h3>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Giao hàng trong vòng 24 giờ kể từ khi đặt hàng</li>
              <li>Miễn phí vận chuyển cho đơn hàng từ 500.000đ</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-medium mb-2">2.2. Khu vực ngoại thành và các tỉnh lân cận</h3>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Giao hàng trong vòng 2-3 ngày làm việc</li>
              <li>Miễn phí vận chuyển cho đơn hàng từ 1.000.000đ</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-medium mb-2">2.3. Các tỉnh thành khác</h3>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Giao hàng trong vòng 3-5 ngày làm việc</li>
              <li>Miễn phí vận chuyển cho đơn hàng từ 1.500.000đ</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Phí vận chuyển</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Khu vực</th>
                <th className="py-2 px-4 border-b">Phí vận chuyển</th>
                <th className="py-2 px-4 border-b">Miễn phí từ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b">Nội thành Hà Nội, TP.HCM</td>
                <td className="py-2 px-4 border-b text-center">20.000đ</td>
                <td className="py-2 px-4 border-b text-center">500.000đ</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Ngoại thành và tỉnh lân cận</td>
                <td className="py-2 px-4 border-b text-center">30.000đ</td>
                <td className="py-2 px-4 border-b text-center">1.000.000đ</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Các tỉnh thành khác</td>
                <td className="py-2 px-4 border-b text-center">40.000đ</td>
                <td className="py-2 px-4 border-b text-center">1.500.000đ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Quy trình giao hàng</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">1</div>
            <div>
              <h3 className="text-xl font-medium mb-2">Xác nhận đơn hàng</h3>
              <p className="text-gray-600">Sau khi nhận được đơn hàng, chúng tôi sẽ liên hệ xác nhận trong vòng 24 giờ.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">2</div>
            <div>
              <h3 className="text-xl font-medium mb-2">Đóng gói và vận chuyển</h3>
              <p className="text-gray-600">Đơn hàng sẽ được đóng gói cẩn thận và giao cho đơn vị vận chuyển.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">3</div>
            <div>
              <h3 className="text-xl font-medium mb-2">Theo dõi đơn hàng</h3>
              <p className="text-gray-600">Khách hàng có thể theo dõi trạng thái đơn hàng qua email hoặc số điện thoại đã đăng ký.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">4</div>
            <div>
              <h3 className="text-xl font-medium mb-2">Nhận hàng</h3>
              <p className="text-gray-600">Kiểm tra hàng hóa trước khi thanh toán. Nếu có vấn đề, vui lòng liên hệ ngay với chúng tôi.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Lưu ý quan trọng</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Thời gian giao hàng có thể thay đổi do các yếu tố khách quan như thời tiết, lễ tết, v.v.</li>
          <li>Đối với đơn hàng có giá trị cao, chúng tôi khuyến nghị nên chọn hình thức thanh toán trước.</li>
          <li>Vui lòng cung cấp địa chỉ giao hàng chính xác và số điện thoại liên hệ để đảm bảo giao hàng thành công.</li>
          <li>Nếu không liên hệ được với khách hàng sau 3 lần, đơn hàng sẽ được hoàn trả về kho.</li>
        </ul>
      </div>
    </div>
  );
};

export default ShippingPolicy; 