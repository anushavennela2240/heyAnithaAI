import { FC, KeyboardEvent, useContext, useEffect, useRef, useState } from 'react';

import { Prompt } from '@/types/prompt';
// import HomeContext from '@/pages/api/home/home.context';
import MultipleValueTextInput from 'react-multivalue-text-input';

interface Props {
    plugin: any;
    onSubmit: (textQuery: string) => void;
    onClose: () => void;
}

export const JiraModal: FC<Props> = ({
    plugin,
    onSubmit,
    onClose,
}) => {


    // const {
    //     state: {

    //         fileUploaded,
    //     },
    //     handleUpdateConversation,
    //     dispatch: homeDispatch,
    // } = useContext(HomeContext);

    const modalRef = useRef<HTMLDivElement>(null);

    const [jiraDetails, setJiraDetails]: any = useState({
        "issue_summary": "",
        "start_date": "",
        "due_date": "",
        "tasks":""
    })
    const handleSubmit = () => {
            onSubmit(jiraDetails)
            setJiraDetails({ "issue_summary": "",
            "start_date": "",
            "due_date": "",
            "tasks":""})

    };

    const handelChange = (e: any) => {
        const { name, value } = e.target;
        setJiraDetails({
            ...jiraDetails,
            [name]: value
        });
    }

    const handelWebUrl = (val:any)=>{
        setJiraDetails({
            ...jiraDetails,
            'tasks':val
        });
    }
    
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
                    {/* {plugin.text? plugin.text:plugin.name} */}
                    Jira Integration
                </div>
                <div>
                    <label>Issue Summary</label>
                    <input
                        className="mt-1 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#40414F] dark:text-neutral-100"
                        placeholder='Enter Issue Summary'
                        type="text"
                        name='issue_summary'
                        onChange={(e) => {
                            if (!e.target.value) return;
                            handelChange(e)
                        }}
                    />
                </div>
                <div>
                    <label>Start Date</label>
                    <input
                        className="mt-1 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#40414F] dark:text-neutral-100"
                        placeholder='Enter Start Date'
                        type="date"
                        name='start_date'
                        onChange={(e) => {
                            if (!e.target.value) return;
                            handelChange(e)
                        }}
                    />
                </div>
                <div>
                    <label>Due Date</label>
                    <input
                        className="mt-1 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#40414F] dark:text-neutral-100"
                        placeholder='Enter Due Datey'
                        type="date"
                        name='due_date'
                        onChange={(e) => {
                            if (!e.target.value) return;
                            handelChange(e)
                        }}
                    />
                </div>
                <div>
                <MultipleValueTextInput
                onItemAdded={(item, allItems) => handelWebUrl(allItems)}
                onItemDeleted={(item, allItems) => handelWebUrl(allItems)}
                label="Issues"
                className="mt-1 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#40414F] dark:text-neutral-100"
                name="item-input"
                placeholder="Enter your link you want; separate them with COMMA or ENTER."
              // values={[]}
              />
                </div>
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
