import React, { useContext } from 'react';
import { useAtom } from 'jotai';

const ResetState = ({ date, resetStatusAtom }) => {
  const [, resetDateStatus] = useAtom(resetStatusAtom);

  const reset = () => {
    resetDateStatus(date)
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md max-w-md mx-auto my-8">
      <div className="font-medium text-gray-800 text-lg mb-2">Issue finding papers</div>
      <ul className="text-sm text-gray-700 mb-4 list-disc list-inside">
        <li>Make sure Chroma DB is running</li>
        <li>ArXiv's servers may be down</li>
        <li>Maybe we broke something.. again</li>
        <li>Actually no papers submitted (unlikely)</li>
      </ul>
      <button 
        className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
        type="button"
        onClick={reset}
      >
        Reset Status
      </button>
    </div>
  );
};

export default ResetState;
