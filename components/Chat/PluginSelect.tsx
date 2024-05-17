import { FC, useEffect, useRef } from 'react';

import { useTranslation } from 'next-i18next';

import { Plugin, PluginList } from '@/types/plugin';

interface Props {
  plugin: Plugin | null;
  onPluginChange: (plugin: any) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLSelectElement>) => void;
}

export const PluginSelect: FC<Props> = ({
  plugin,
  onPluginChange,
  onKeyDown,
}) => {
  const { t } = useTranslation('chat');

  const selectRef = useRef<HTMLSelectElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>) => {
    const selectElement = selectRef.current;
    const optionCount = selectElement?.options.length || 0;

    if (e.key === '/' && e.metaKey) {
      e.preventDefault();
      if (selectElement) {
        selectElement.selectedIndex =
          (selectElement.selectedIndex + 1) % optionCount;
        selectElement.dispatchEvent(new Event('change'));
      }
    } else if (e.key === '/' && e.shiftKey && e.metaKey) {
      e.preventDefault();
      if (selectElement) {
        selectElement.selectedIndex =
          (selectElement.selectedIndex - 1 + optionCount) % optionCount;
        selectElement.dispatchEvent(new Event('change'));
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectElement) {
        selectElement.dispatchEvent(new Event('change'));
      }

      onPluginChange(
        PluginList.find(
          (plugin) =>
            plugin.name === selectElement?.selectedOptions[0].innerText,
        ) as Plugin,
      );
    } else {
      onKeyDown(e);
    }
  };

  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.focus();
    }
  }, []);
 
const optionList =[{ name:'Url Link',value:'0'},
// { name:'Doc Upload',value:'docupload'},{ name:'Video Url',value:'urllink'},
{ name:'Charts',value:'chart'},
// { name:"Video Generation",value:'womenwithoutai'},
// { name:'Diagrams',value:'diagrams'},
// { name:'Flowchart',value:'flowchart'},
// { name:'Mindmap',value:'mindmap'}
]
  return (
    <div className="flex flex-col">
      <div className="mb-1 w-full rounded  bg-transparent pr-2 ">
        {/* <select
          ref={selectRef}
          className="w-full cursor-pointer bg-transparent p-2 border border-neutral-200 text-neutral-900 dark:border-neutral-600 dark:text-white"
          placeholder={t('Select a plugin') || ''}
          // value={plugin?.id || ''}
          onChange={(e) => {            
            onPluginChange(
              optionList.find(
                (plugin) => plugin.value === e.target.value,
              ) 
            );
          }}
          
          defaultValue={0}
          onKeyDown={(e) => {
            handleKeyDown(e);
          }}
        > */}
        <div>
          <ul className='w-full cursor-pointer  bg-transparent border border-neutral-200 text-neutral-900 dark:border-neutral-600 dark:text-white'>
          { optionList.map((item)=>(
          <li
          onClick={(e) => {            
            onPluginChange(
              optionList.find(
                (plugin) => plugin.value === item.value,
              ) 
            );
          }}
         
            key={item.value}
            value={item.value}
            className={`px-4 py-2 hover:bg-[#444654] dark:text-white ${item.value=='0'? 'hidden ':'' }`}
          >
            {item.name}
          </li>
         ))
           }
          </ul>
         </div>


          {/* {PluginList.map((plugin) => (
            <option
              key={plugin.id}
              value={plugin.id}
              className="dark:bg-[#343541] dark:text-white"
            >
              {plugin.name}
            </option>
          ))} */}
        {/* </select> */}

        
      </div>
    </div>
  );
};
