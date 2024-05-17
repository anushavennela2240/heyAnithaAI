import { FC, KeyboardEvent, useContext, useEffect, useRef, useState } from 'react';


interface Props {
    plugin: any;
  onSubmit: (updatedVariables: string[]) => void;
  onClose: () => void;
}

export const OptionsModal: FC<Props> = ({
    plugin,
  onSubmit,
  onClose,
}) => {

    
//   const {
//     state: {
   
//       fileUploaded,
//     },
//     handleUpdateConversation,
//     dispatch: homeDispatch,
//   } = useContext(HomeContext);

  const modalRef = useRef<HTMLDivElement>(null);

  

  const handleSubmit = (val:any) => {
    onSubmit(val)
    
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
    //   handleSubmit();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // useEffect(() => {
  //   const handleOutsideClick = (e: MouseEvent) => {
  //     if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
  //       onClose();
  //     }
  //   };

  //   window.addEventListener('click', handleOutsideClick);

  //   return () => {
  //     window.removeEventListener('click', handleOutsideClick);
  //   };
  // }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onKeyDown={handleKeyDown}
    >
      <div
        ref={modalRef}
        className="dark:border-netural-400 inline-block max-h-[400px] transform overflow-y-auto rounded-lg border border-gray-300 bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all dark:bg-[#202123] sm:my-8 sm:max-h-[600px] sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
        role="dialog"
      >
        <div className="mb-4 text-xl font-bold text-black dark:text-neutral-200">
          Select Option
        </div>
        <div className="flex w-full flex-col gap-1">
        {plugin.map((val:any)=>(
 <button
 onClick={()=>handleSubmit(val)}
 key={val.id}
 className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-sm transition-colors duration-200 hover:bg-[#343541]/90"
>      

 <div className="relative max-h-5 flex-1 overflow-hidden text-ellipsis whitespace-nowrap break-all pr-4 text-left text-[12.5px] leading-3">
  {val.text}
 </div>
</button>

        ))}
       
     
      </div>
        <button
          className="mt-6 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};
