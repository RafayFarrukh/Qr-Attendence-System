import React from 'react';

const ShowAttendance = () => {
  const data = [
    { name: 'John Doe', status: 'Present', date: '2023-04-17' },
    { name: 'Jane Smith', status: 'Absent', date: '2023-04-17' },
    // add more data here
  ];
  return (
    <div className='w-full overflow-hidden rounded-lg shadow-md'>
      <div className='w-full overflow-x-auto'>
        <table className='w-full'>
          <thead>
            <tr className='bg-gray-100 border-b-2 border-gray-300'>
              <th className='px-6 py-3 text-sm font-bold text-left text-gray-600 uppercase tracking-wider'>
                Name
              </th>
              <th className='px-6 py-3 text-sm font-bold text-left text-gray-600 uppercase tracking-wider'>
                Status
              </th>
              <th className='px-6 py-3 text-sm font-bold text-left text-gray-600 uppercase tracking-wider'>
                Date
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {data.map((row, index) => (
              <tr key={index}>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0 h-10 w-10'>
                      <img
                        className='h-10 w-10 rounded-full'
                        src={`https://picsum.photos/id/${index + 1}/50`}
                        alt=''
                      />
                    </div>
                    <div className='ml-4'>
                      <div className='text-sm font-medium text-gray-900'>
                        {row.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span
                    className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                      row.status === 'Present'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {row.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShowAttendance;
