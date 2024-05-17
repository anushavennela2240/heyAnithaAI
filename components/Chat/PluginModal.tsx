import { FC, KeyboardEvent, useContext, useEffect, useRef, useState } from 'react';

import { Prompt } from '@/types/prompt';
// import HomeContext from '@/pages/api/home/home.context';

interface Props {
    plugin: any;
  onSubmit: () => void;
  onClose: () => void;
}

export const PluginModal: FC<Props> = ({
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

  

  const handleSubmit = () => {
    onSubmit()
    // onClose();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
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
          {plugin.name}
        </div>
       {
      //  plugin.value == 'docupload'? 
       plugin.value == 'womenwithoutai'? 
       <input
        id="import-file"
        className="mt-1 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#40414F] dark:text-neutral-100"
        accept=".jpg,.png,.mp4"
        tabIndex={-1}
        type="file"
        // accept=".json"
        onChange={(e) => {
          if (!e.target.files?.length) return;

        //   const file = e.target.files[0];
        //   homeDispatch({ field: 'fileUploaded', value: e.target.files[0] });
        //   const reader = new FileReader();
        //   reader.onload = (e) => {
        //     let json = JSON.parse(e.target?.result as string);
        //     // onImport(json);
        //   };
        //   reader.readAsText(file);
        }}
      /> :<input
      className="mt-1 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#40414F] dark:text-neutral-100"
          placeholder='Enter your link here'
      tabIndex={-1}
      type="text"
      // accept=".json"
      onChange={(e) => {
        if (!e.target.value) return;
        // homeDispatch({ field: 'fileUploaded', value: e.target.value });
      
      }}
    />}

    <div className="flex gap-4 ">
        <button
          className="mt-6 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
          onClick={handleSubmit}
        >
          Submit
        </button>

        <button
          className="mt-6 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
          onClick={onClose}
        >
          Close
        </button>
        </div>
      </div>
    </div>
  );
};
