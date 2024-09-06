// import React, { FC, useState } from 'react';
// import { Button, IconButton } from '@mui/material';
// import { IconPencil, IconTrash, IconCheck, IconX } from '@tabler/icons-react';

// interface MyGPTProps {
//   gptDataList: {
//     id: string;
//     name: string;
//     description: string;
//     files: File[];
//     urls: string[];
//   }[];
//   onSelectGpt: (gptData: any) => void;
//   onEditGpt: (gptData: any) => void;
//   onDeleteGpt: (id: string) => void;
// }

// const MyGPT: FC<MyGPTProps> = ({ gptDataList, onSelectGpt, onEditGpt, onDeleteGpt }) => {
//   const [deletingId, setDeletingId] = useState<string | null>(null);

//   const handleDelete = (id: string) => {
//     setDeletingId(id);
//   };

//   const confirmDelete = () => {
//     if (deletingId) {
//       onDeleteGpt(deletingId);
//       setDeletingId(null); // Reset deletion state after confirming
//     }
//   };

//   const cancelDelete = () => {
//     setDeletingId(null); // Reset deletion state after canceling
//   };

//   if (gptDataList.length === 0) {
//     return (
//       <div className="p-4">
//         <p>No GPT data available. Please create a new GPT.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4">
//       {gptDataList.map(gptData => (
//         <div key={gptData.id} className="flex items-center justify-between mb-2 p-2 border rounded" style={{ height: '95%', overflowY: 'scroll' }}>
//           <Button
//             variant="outlined"
//             className="w-full text-left"
//             onClick={() => onSelectGpt(gptData)}
//             sx={{
//               justifyContent: 'flex-start',
//               textAlign: 'left',
//               borderRadius: '8px',
//               padding: '8px',
//               '&:hover': {
//                 backgroundColor: '#f0f0f0',
//               },
//               borderColor: 'black',
//               color: 'black',
//             }}
//           >
//             {gptData.name}
//           </Button>

//           <div className="flex space-x-2">
//             {deletingId === gptData.id ? (
//               <div className="flex space-x-2">
//                 <IconButton onClick={confirmDelete}>
//                   <IconCheck size={18} />
//                 </IconButton>
//                 <IconButton onClick={cancelDelete}>
//                   <IconX size={18} />
//                 </IconButton>
//               </div>
//             ) : (
//               <>
//                 <IconButton
//                   onClick={() => onEditGpt(gptData)}
//                   sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }}
//                 >
//                   <IconPencil size={18} />
//                 </IconButton>
//                 <IconButton
//                   onClick={() => handleDelete(gptData.id)}
//                   sx={{ '&:hover': { backgroundColor: '#fdd' } }}
//                 >
//                   <IconTrash size={18} />
//                 </IconButton>
//               </>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default MyGPT;


import React, { FC, useState } from 'react';
import { Button, IconButton } from '@mui/material';
import { IconPencil, IconTrash, IconCheck, IconX } from '@tabler/icons-react';

interface MyGPTProps {
  gptDataList: {
    id: string;
    name: string;
    description: string;
    files: File[];
    urls: string[];
  }[];
  onSelectGpt: (gptData: any) => void;
  onEditGpt: (gptData: any) => void;
  onDeleteGpt: (id: string) => void;
}

const MyGPT: FC<MyGPTProps> = ({ gptDataList, onSelectGpt, onEditGpt, onDeleteGpt }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = () => {
    if (deletingId) {
      onDeleteGpt(deletingId);
      setDeletingId(null); // Reset deletion state after confirming
    }
  };

  const cancelDelete = () => {
    setDeletingId(null); // Reset deletion state after canceling
  };

  if (gptDataList.length === 0) {
    return (
      <div className="p-4" style={{ color: 'var(--text-color)', backgroundColor: 'var(--background-color)' }}>
        <p>No GPT data available. Please create a new GPT.</p>
      </div>
    );
  }

  return (
    <div className="p-4" style={{ width: '100%', color: 'var(--text-color)', backgroundColor: 'var(--background-color)' }}>
      {gptDataList.map(gptData => (
        <div key={gptData.id} className="flex items-center justify-between mb-2 p-2 border rounded"
             style={{border:'none' }}>
          <Button
            variant="outlined"
            className="w-full text-left"
            onClick={() => onSelectGpt(gptData)}
            sx={{
              justifyContent: 'flex-start',
              textAlign: 'left',
              borderRadius: '8px',
              padding: '8px',
              '&:hover': {
                backgroundColor: 'var(--button-hover-background)',
              },
              borderColor: 'var(--border-color)',
              color: 'var(--text-color)',
            }}
          >
            {gptData.name}
          </Button>

          <div className="flex space-x-2">
            {deletingId === gptData.id ? (
              <div className="flex space-x-2">
                <IconButton onClick={confirmDelete} sx={{ color: 'var(--alert-success-text)', backgroundColor: 'var(--alert-success-background)' }}>
                  <IconCheck size={18} />
                </IconButton>
                <IconButton onClick={cancelDelete} sx={{ color: 'var(--alert-error-text)', backgroundColor: 'var(--alert-error-background)' }}>
                  <IconX size={18} />
                </IconButton>
              </div>
            ) : (
              <>
                <IconButton
                  onClick={() => onEditGpt(gptData)}
                  sx={{ '&:hover': { backgroundColor: 'var(--button-hover-background)' }, color: 'var(--text-color)' }}
                >
                  <IconPencil size={18} />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(gptData.id)}
                  sx={{ '&:hover': { backgroundColor: 'var(--button-active-background)' }, color: 'var(--text-color)' }}
                >
                  <IconTrash size={18} />
                </IconButton>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyGPT;

