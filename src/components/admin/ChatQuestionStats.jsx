import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const ChatQuestionStats = () => {
  const [stats, setStats] = useState({
    totalQuestions: 0,
    topQuestions: [],
    recentTopQuestions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/admin/chat-questions/stats');
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        setError('Không thể tải dữ liệu thống kê');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64">Đang tải...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  const chartData = stats.topQuestions.map(q => ({
    question: q.question.length > 20 ? q.question.substring(0, 20) + '...' : q.question,
    frequency: q.frequency
  }));

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Thống kê câu hỏi chat</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Tổng số câu hỏi</h3>
          <p className="text-3xl font-bold text-blue-500">{stats.totalQuestions}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Câu hỏi thường gặp gần đây</h3>
          <ul className="space-y-2">
            {stats.recentTopQuestions.map((q, index) => (
              <li key={index} className="flex justify-between">
                <span className="text-gray-600">{q.question}</span>
                <span className="font-semibold">{q.frequency} lần</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Biểu đồ tần suất câu hỏi</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="question" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="frequency" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Danh sách câu hỏi thường gặp</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Câu hỏi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lần hỏi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lần cuối</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.topQuestions.map((q, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{q.question}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{q.frequency}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(q.lastAskedAt).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ChatQuestionStats; 