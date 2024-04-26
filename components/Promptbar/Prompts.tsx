import { FC, useState } from 'react';

import { Prompt } from '@/types/prompt';

import { PromptComponent } from './Prompt';
import { IconBulbFilled, IconChevronDown, IconChevronUp } from '@tabler/icons-react';

interface Props {
  prompts: Prompt[];
  onUpdatePrompt: (prompt: Prompt) => void;
  onDeletePrompt: (prompt: Prompt) => void;
}

export const Prompts: FC<Props> = ({
  prompts,
  onUpdatePrompt,
  onDeletePrompt,
}) => {
  const[openIndex,setOpenIndex]=useState<any>([])

  const PromptSubList=(data:any)=>{

    return(
      data?.length && data.map((val:any,index:any)=>(
<div key={'key-'+index}>
        <div className="relative flex items-center">
      <button
        className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-sm transition-colors duration-200 hover:bg-[#343541]/90"
        draggable="true"
        onClick={()=>{ 
          let i = openIndex.indexOf(val.name);                  
          let openIndexClo = openIndex;
          if (i >-1) {            
            openIndexClo.splice(i,1);            
          }else{
            openIndexClo.push(val.name);
          }
          setOpenIndex([...openIndexClo])
          
        }}
      >
        <IconBulbFilled size={18} />

        <div className="relative max-h-5 flex-1 overflow-hidden text-ellipsis whitespace-nowrap break-all pr-4 text-left text-[12.5px] leading-3">
          {val.name}
        </div>
       {val.items?.length && (openIndex.includes(val.name)?<IconChevronUp/>:<IconChevronDown/>)}
      </button> 
    </div>
  {openIndex.includes(val.name) &&  <div className='ml-3'>
        {PromptSubList(val.items)}
      </div>}
    </div>
      ))
    )
  }
  return (
    <div className="flex w-full flex-col gap-1">
      {/* {prompts
        .slice()
        .reverse()
        .map((prompt, index) => (
          <PromptComponent
            key={index}
            prompt={prompt}
            onUpdatePrompt={onUpdatePrompt}
            onDeletePrompt={onDeletePrompt}
          />
        ))} */}
        {prompts && PromptSubList(prompts)}
    </div>
  );
};
