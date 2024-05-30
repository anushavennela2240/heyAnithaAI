import { Message } from '@/types/chat';
import { OpenAIModel } from '@/types/openai';
import { Plugin } from '@/types/plugin';
import { Prompt } from '@/types/prompt';
import {
  IconBolt,
  IconBrandGoogle,
  IconMicrophoneOff,
  IconPaperclip,
  IconPlayerStop,
  IconRepeat,
  IconSend,
} from '@tabler/icons-react';
import { useTranslation } from 'next-i18next';
import {
  FC,
  KeyboardEvent,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { PluginSelect } from './PluginSelect';
import { PromptList } from './PromptList';
import { VariableModal } from './VariableModal';
import { IconMicrophone } from '@tabler/icons-react';
import { OptionsModal } from './OptionsModal';
import { QueryModal } from './QueryModal';
import { JiraModal } from './JiraModal';
import { json } from 'stream/consumers';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any
  }
}

interface Props {
  messageIsStreaming: boolean;
  model: OpenAIModel;
  conversationIsEmpty: boolean;
  prompts: Prompt[];
  onSend: (message: Message, plugin: Plugin | null, link: string | null, option: string | null) => void;
  onRegenerate: () => void;
  stopConversationRef: MutableRefObject<boolean>;
  textareaRef: MutableRefObject<HTMLTextAreaElement | null>;
}

export const ChatInput: FC<Props> = ({
  messageIsStreaming,
  model,
  conversationIsEmpty,
  prompts,
  onSend,
  onRegenerate,
  stopConversationRef,
  textareaRef,
}) => {
  const { t } = useTranslation('chat');

  const [content, setContent] = useState<string>();
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showPromptList, setShowPromptList] = useState<any>(false);
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [promptInputValue, setPromptInputValue] = useState('');
  const [variables, setVariables] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showPluginSelect, setShowPluginSelect] = useState(false);
  const [plugin, setPlugin] = useState<any | null>(null);
  const [jiraIntegration, setJiraIntegration] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState<any>(null);
  const [showQueryModal, setShowQueryModal] = useState<any | null>(null);
  const [options, setOptions] = useState<any | null>(null);
  const [recognizing, setRecognizing] = useState(false);
  const [recognition, setRecognition] = useState<any>({});
  const [selectedPrompt, setSelectedPrompt] = useState<any>("")

  const promptListRef = useRef<HTMLUListElement | null>(null);

  const promptsData = [{ id: 1, name: 'Scrum Master', link: 'scrum', method: 'GET', text: 'I am a Chatgeniusplus AI Senior Professional Scrum Master Expert and will provide the answer for:', selected: false, icon: 'admin_panel_settings' },
  { id: 2, name: 'SRS Creation', link: 'srs', method: 'POST', text: 'I am a Chatgeniusplus AI Senior Professional Product Manager, and I will provide the answers for the following aspects of SRS documentation: Introduction to the purpose and context; Overall high-level description of the software application and its intended functionality; Specific requirements, including functional and non-functional ones; Interface requirements, including interactions with external systems or devices; Performance requirements, such as response times and processing rates; Design constraints that must be considered; User documentation to be delivered with the software application; Acceptance tests to verify the software meets the requirements for:', selected: false, icon: 'settings_applications' },
  { id: 3, name: 'Epic', link: 'epic', method: 'GET', text: 'I am a Chatgeniusplus AI Senior Technical Scrum Master, and I will analyze the major features and functionalities specified and will  create a series of Epics for :', selected: false, icon: 'insert_chart' },
  { id: 4, name: 'User stories/Acceptance creteria', link: 'epic', method: 'GET', text: 'I am a Chatgeniusplus AI, acting as a Sr. Technical Scrum master, and I will generate multiple User stories with positive and negative acceptance criteria for each User story based on :', selected: false, icon: 'insert_chart' },
  { id: 5, name: 'Tasks', link: 'epic', method: 'GET', text: 'I am a Chatgeniusplus AI  ,acting as a Sr. Software Scrum Master, and generate multiple tasks based on the following :', selected: false, icon: 'insert_chart' },
  { id: 16, name: 'Jira Integration', link: 'integration', method: 'POST', text: 'I am a Chatgeniusplus AI, generate multiple tasks based on the following :', selected: false, icon: 'insert_chart' },
  { id: 6, name: 'Test Plan', link: 'epic', method: 'GET', text: "I am a Chatgeniusplus AI Senior Software Test Engineer Architect, and I will provide answers for the following aspects of test plan documentation: Overview, including a summary of the application's purpose and scope; Testing Summary, focusing on the scope of testing; Analysis of Scope and Test Focus Areas, including release content, regression, and platform testing; Progression Test Objectives; Various Other Testing activities like Security, Stress & Volume, Connectivity, Disaster Recovery/Back Up, Unit, and Integration Testing; Comprehensive Test Strategy, including test level responsibility, test type & approach, build strategy, test execution schedule, facility, data, resource provision plan, testing tools, handover procedure, and metrics; Test Environment Plan, including management, details, establishment, control, roles, and responsibilities; Assumptions and Dependencies for the testing process; Entry and Exit Criteria; Administrative Plan, including approvals, test milestones and schedule, training, and defect management; Definitions of key terms and concepts; References used for the testing process; Points of Contact for the testing process for :", selected: false, icon: 'insert_chart' },
  { id: 7, name: 'Test scenarios', link: 'epic', method: 'GET', text: "I am chatgeniusplus AI ,acting as a Sr. Software Test Engineer Expert, I will be suggesting you the best 20 edge cases test scenarios for :", selected: false, icon: 'insert_chart' },
  { id: 8, name: 'Test data', link: 'epic', method: 'GET', text: "I am chatgeniusplus AI ,acting as a Sr. Software Test Engineer Expert, I will be suggesting you the best 50 testing dummy data for :", selected: false, icon: 'insert_chart' },
  { id: 9, name: 'Manual Test Case', link: 'epic', method: 'GET', text: "I am chatgeniusplus AI ,acting as a Sr. Software Test Engineer Expert and create a detailed test case. Include the unique ID, description, pre-steps, test steps, preconditions, test data, expected results, actual results, user acceptance criteria, and any additional comments or considerations for :", selected: false, icon: 'insert_chart' },
  { id: 10, name: 'Automation Code', link: 'epic', method: 'GET', text: "I am chatgeniusplus AI ,acting as a Senior Automation Software Test Engineer and generating automation code for :", selected: false, icon: 'insert_chart' },
  { id: 11, name: 'Deployment', link: 'epic', method: 'GET', text: "I am a Chatgeniusplus AI, acting as a  Senior Professional Product Manager, and I will provide the answers for the following aspects of deployment documentation: Introduction to the deployment plan, including its purpose and context; Description of the deployment strategy and the required steps to deploy the software to production; Outline of post-deployment activities, such as testing, monitoring, or maintenance; Description of resources required, including personnel, equipment, and materials; Identification and mitigation of deployment risks; Explanation of the approval process, including stakeholder sign-offs; Conclusion, summarizing key points and next steps for :", selected: false, icon: 'insert_chart' },
  { id: 12, name: 'Academic', link: 'epic', method: 'GET', text: "I am a Chatgeniusplus AI, acting as an AI academic advisor, capable of helping students in selecting appropriate courses, setting goals with a timeframe, and monitoring their academic progress. Provide detailed advice with specific steps for each grade level and a timeline for :", selected: false, icon: 'insert_chart' },
  { id: 13, name: 'Tutor', link: 'epic', method: 'GET', text: "I am Chatgeniusplus AI, acting as a AI-driven Tutor Genius, responsible for creating personalized study plans and offering clear educational support for :", selected: false, icon: 'insert_chart' },
  { id: 14, name: 'Career', link: 'epic', method: 'GET', text: "I am Chatgeniusplus AI , acting as a AI-driven Career Guidance Genius, capable of providing comprehensive career counseling to students at all stages of their academic journey. My expertise includes resume building, interview preparation, professional goal-setting, and career path advice. Now will provide solution for :", selected: false, icon: 'insert_chart' },
  { id: 15, name: 'Research', link: 'epic', method: 'GET', text: "I am Chatgeniusplus AI ,acting as a AI-powered Research Genius, equipped with the ability to discover pertinent literature, articles, and resources for student projects or assignments. Additionally, I can generate comprehensive literature reviews or annotated bibliographies based on user-defined criteria.Now will provide a solution for :", selected: false, icon: 'insert_chart' },
  { id: 17, name: 'QA Edge Innovator', link: 'epic', method: 'GET', text: "I am a Chatgeniusplus AI Senior Software Test Engineer and based on your input, will provide logical out-of-the-box scenarios, logical edge cases, and logical best test cases to break the model for : ", selected: false, icon: 'insert_chart' },
  ];

  const filteredPrompts:any = promptsData?.filter((prompt) =>
    prompt.name.toLowerCase().includes(promptInputValue.toLowerCase()),
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const maxLength = model.maxLength;

    if (value.length > maxLength) {
      alert(
        t(
          `Message limit is {{maxLength}} characters. You have entered {{valueLength}} characters.`,
          { maxLength, valueLength: value.length },
        ),
      );
      return;
    }

    setContent(value);
    updatePromptListVisibility(value);
  };

  const handleSend = () => {
    if (messageIsStreaming) {
      return;
    }

    if (!content) {
      alert(t('Please enter a message'));
      return;
    }

    onSend({ role: 'user', content :selectedPrompt.text ? selectedPrompt.text +  content : content }, plugin, null, null);
    setContent('');
    setPlugin(null);
    setSelectedPrompt("")

    if (window.innerWidth < 640 && textareaRef && textareaRef.current) {
      textareaRef.current.blur();
    }
  };

  const handleStopConversation = () => {
    stopConversationRef.current = true;
    setTimeout(() => {
      stopConversationRef.current = false;
    }, 1000);
  };

  const isMobile = () => {
    const userAgent =
      typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
    const mobileRegex =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    return mobileRegex.test(userAgent);
  };

  const handleInitModal = () => {
    const selectedPrompt:any = filteredPrompts[activePromptIndex];
    if (selectedPrompt) {
      setContent((prevContent) => {
        const newContent = prevContent?.replace(
          /\/\w*$/,""
          // selectedPrompt.content,
        );
        return newContent;
      });
      handlePromptSelect(selectedPrompt);
      setSelectedPrompt(selectedPrompt);
      if(selectedPrompt.id == '16')
        { setJiraIntegration(true)}
    }
    setShowPromptList(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (showPromptList) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActivePromptIndex((prevIndex) =>
          prevIndex < prompts.length - 1 ? prevIndex + 1 : prevIndex,
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActivePromptIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex,
        );
      } else if (e.key === 'Tab') {
        e.preventDefault();
        setActivePromptIndex((prevIndex) =>
          prevIndex < prompts.length - 1 ? prevIndex + 1 : 0,
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleInitModal();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowPromptList(false);
      } else {
        setActivePromptIndex(0);
      }
    } else if (e.key === 'Enter' && !isTyping && !isMobile() && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === '/' && e.metaKey) {
      e.preventDefault();
      setShowPluginSelect(!showPluginSelect);
    }
  };

  const parseVariables = (content: string) => {
    const regex = /{{(.*@)}}/g;
    const foundVariables = [];
    let match;

    while ((match = regex.exec(content)) !== null) {
      foundVariables.push(match[1]);
    }

    return foundVariables;
  };

  const updatePromptListVisibility = useCallback((text: string) => {
    const match = text.match(/\@\w*$/);

    if (match) {
      setShowPromptList(true);
      setPromptInputValue(match[0].slice(1));
    } else {
      setShowPromptList(false);
      setPromptInputValue('');
    }
  }, []);

  const handlePromptSelect = (prompt: Prompt) => {
    console.log(prompt,"prompt")
    const parsedVariables = parseVariables(prompt.content);
    setVariables(parsedVariables);

    if (parsedVariables.length > 0) {
      setIsModalVisible(true);
    } else {
      setContent((prevContent) => {
        // const updatedContent = prevContent?.replace(/\/\w*$/, prompt.content);
        const updatedContent = prevContent?.replace(/\@\w*$/, '');
        return updatedContent;
      });
      updatePromptListVisibility("");
    }
  };

  const handleSubmit = (updatedVariables: string[]) => {
    const newContent = content?.replace(/{{(.*@)}}/g, (match, variable) => {
      const index = variables.indexOf(variable);
      return updatedVariables[index];
    });

    setContent(newContent);

    if (textareaRef && textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleUploaded = () => {
    if (plugin && plugin.value == 'womenwithoutai') {
      setShowQueryModal({ ...plugin, link: plugin.value })
      return
    }

    if (plugin && plugin.value == 'docupload') {
      setOptions([
        { id: 1, text: 'Doc Summarization', link: 'pdfsummarize' },
        { id: 2, text: 'Doc Question Generator', link: 'pdfquestions' },
        { id: 3, text: 'Doc Question Answering', link: 'pdfqa' },
      ])
    }
    else if (plugin && plugin.value == 'chart') {
      setOptions([
        { id: 1, text: 'Diagrams', link: 'diagrams' },
        { id: 2, text: 'Flowchart', link: 'flowchart' },
        { id: 3, text: 'Mindmap', link: 'mindmap' }
      ])
    }
    else {
      setOptions([
        { id: 1, text: 'Video Summary ', link: 'videosummary' },
        { id: 2, text: 'Video Questions ', link: 'videoquestions' },
        { id: 3, text: 'Video QA', link: 'videoqa' },
        { id: 4, text: 'Video Suggestion ', link: 'videosuggestions' },

      ])
    }
    setShowOptionsModal(plugin)

  }

  const handleOption = (val: any) => {
    setShowOptionsModal(null);
    if (val.link == 'pdfqa' || val.link == 'videoqa' || showOptionsModal.value == 'chart') {
      setShowQueryModal({ ...val, 'btnOpt': showOptionsModal?.value })
    } else {
      onSend({ role: 'user', content: val.text }, plugin, val.link, showOptionsModal?.value);
      setPlugin(null);

    }
    setSelectedPrompt("")
  }

  const handleQuery = (val: string) => {
    setPlugin(null);
    setShowOptionsModal(null);
    setShowQueryModal(null);
    onSend({ role: 'user', content: showQueryModal.text ? showQueryModal.text + ": " + val : val }, plugin, showQueryModal.link, showQueryModal.link);
    setSelectedPrompt("")
  }

  const handleJiraInt = (val: any) => {
    val.start_date = reverseDateFormat(val.start_date)
    val.due_date = reverseDateFormat(val.due_date)
    setJiraIntegration(false)
    // onSend({ role: 'user', content:val.issue_summary }, null,selectedPrompt.link,val);
    setSelectedPrompt("")
    let body;
    if(selectedPrompt.link=="integration"){
      body = JSON.stringify(val)
    }
    let endpoint = "https://api.chatgeniusplus.ai/"+selectedPrompt.link
    const controller = new AbortController();
    const response = fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body,
    });
  }
  const reverseDateFormat = (inputDate: any) => {
    const dateParts = inputDate.split('-');
    if (dateParts.length === 3) {
      const [year, month, day] = dateParts;
      return `${day}-${month}-${year}`;
    }
    return inputDate;
  }

  useEffect(() => {
    if (promptListRef.current) {
      promptListRef.current.scrollTop = activePromptIndex * 30;
    }
  }, [activePromptIndex]);

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
      textareaRef.current.style.overflow = `${textareaRef?.current?.scrollHeight > 400 ? 'auto' : 'hidden'
        }`;
    }
  }, [content]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        promptListRef.current &&
        !promptListRef.current.contains(e.target as Node)
      ) {
        setShowPromptList(false);
      }
    };

    window.addEventListener('click', handleOutsideClick);

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  useEffect(() => {

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    //const recognition = new SpeechRecognition();
    setRecognition(new SpeechRecognition())
  }, []);

  recognition.continuous = true;


  recognition.onresult = (event: any) => {
    let current = event.resultIndex;
    let transcript = event.results[current][0].transcript;
    let mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);
    if (!mobileRepeatBug) {
      let inputMic = content
      inputMic += transcript;
      setContent(inputMic)
      //noteTextarea.val(userQuery);
    }
  }

  const startRecording = () => {

    if (content && content.length) {
      let inputMic = content;
      inputMic += ' ';
      setContent(inputMic);
    }

    if (recognizing) {
      recognition.stop();
      setRecognizing(false)
      // recognizing = false;
    }
    else {
      recognition.start();
      setRecognizing(true)
      //recognizing = true;
    }
  }

  return (
    <div className="absolute bottom-0 left-0 w-full border-transparent bg-gradient-to-b from-transparent via-white to-white pt-6 dark:border-white/20 dark:via-[#343541] dark:to-[#343541] md:pt-2">
      <div className="stretch mx-2 mt-4 flex flex-row gap-3 last:mb-2 md:mx-4 md:mt-[52px] md:last:mb-6 lg:mx-auto lg:max-w-3xl">
        {messageIsStreaming && (
          <button
            className="absolute top-0 left-0 right-0 mx-auto mb-3 flex w-fit items-center gap-3 rounded border border-neutral-200 bg-white py-2 px-4 text-black hover:opacity-50 dark:border-neutral-600 dark:bg-[#343541] dark:text-white md:mb-0 md:mt-2"
            onClick={handleStopConversation}
          >
            <IconPlayerStop size={16} /> {t('Stop Generating')}
          </button>
        )}

        {!messageIsStreaming && !conversationIsEmpty && (
          <button
            className="absolute top-0 left-0 right-0 mx-auto mb-3 flex w-fit items-center gap-3 rounded border border-neutral-200 bg-white py-2 px-4 text-black hover:opacity-50 dark:border-neutral-600 dark:bg-[#343541] dark:text-white md:mb-0 md:mt-2"
            onClick={onRegenerate}
          >
            <IconRepeat size={16} /> {t('Regenerate response')}
          </button>
        )}

        <div className="relative mx-2 flex w-full flex-grow flex-col rounded-md border border-black/10 bg-white shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:border-gray-900/50 dark:bg-[#40414F] dark:text-white dark:shadow-[0_0_15px_rgba(0,0,0,0.10)] sm:mx-4">

          <button
            className="absolute left-2 top-2 rounded-sm p-1 text-neutral-800 opacity-60 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-opacity-50 dark:text-neutral-100 dark:hover:text-neutral-200"
            onClick={() => startRecording()}
            onKeyDown={(e) => { }}
          >
            {recognizing ? <IconMicrophone size={20} /> : <IconMicrophoneOff size={20} />}
          </button>

          {selectedPrompt &&
            <button
              className="absolute left-0 bottom-14 py-2 px-2 rounded bg-white dark:bg-[#343541] rounded border border-neutral-200 "

            >
              {selectedPrompt.name}
            </button>
          }

          <textarea
            ref={textareaRef}
            className="m-0 w-full resize-none border-0 bg-transparent p-0 py-2 pr-8 pl-10 text-black dark:bg-transparent dark:text-white md:py-3 md:pl-10"
            style={{
              resize: 'none',
              bottom: `${textareaRef?.current?.scrollHeight}px`,
              maxHeight: '400px',
              overflow: `${textareaRef.current && textareaRef.current.scrollHeight > 400
                  ? 'auto'
                  : 'hidden'
                }`,
            }}
            placeholder={
              t('Type a message or type "@" to select a prompt...') || ''
            }
            value={content}
            rows={1}
            onCompositionStart={() => setIsTyping(true)}
            onCompositionEnd={() => setIsTyping(false)}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          {/* <button
            className="absolute right-8 top-2 rounded-sm p-1 text-neutral-800 opacity-60 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-opacity-50 dark:text-neutral-100 dark:hover:text-neutral-200"
            // onClick={handleSend}
            onClick={() => setShowPluginSelect(!showPluginSelect)}
          >
            {messageIsStreaming ? (
              <div></div>
            ) : (
              <IconPaperclip
                size={18} />
            )}
          </button> */}
          <button
            className="absolute right-2 top-2 rounded-sm p-1 text-neutral-800 opacity-60 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-opacity-50 dark:text-neutral-100 dark:hover:text-neutral-200"
            onClick={handleSend}
          >
            {messageIsStreaming ? (
              <div className="h-4 w-4 animate-spin rounded-full border-t-2 border-neutral-800 opacity-60 dark:border-neutral-100"></div>
            ) : (
              <IconSend size={18} />
            )}
          </button>
          {selectedPrompt &&
            <button
              className="absolute left-0 bottom-14 py-2 px-2 rounded bg-white dark:bg-[#343541] rounded border border-neutral-200 "

            >
              {selectedPrompt.name}
            </button>
          }

          {showPluginSelect && (
            <div className="absolute right-0 bottom-14 rounded bg-white dark:bg-[#343541]">
              <PluginSelect
                plugin={plugin}
                onKeyDown={(e: any) => {
                  if (e.key === 'Escape') {
                    e.preventDefault();
                    setShowPluginSelect(false);
                    textareaRef.current?.focus();
                  }
                }}
                onPluginChange={(plugin: any) => {
                  // if(plugin && ['diagrams','flowchart','mindmap'].includes(plugin.value)){
                  if (plugin && plugin.value == 'chart') {
                    // setShowQueryModal(plugin)
                    setOptions([
                      { id: 1, text: 'Diagrams', link: 'diagrams' },
                      { id: 2, text: 'Flowchart', link: 'flowchart' },
                      { id: 3, text: 'Mindmap ', link: 'mindmap' },
                    ]);
                    setShowOptionsModal(plugin);
                  } else {
                    setPlugin(plugin);
                  }
                  setShowPluginSelect(false);

                  if (textareaRef && textareaRef.current) {
                    textareaRef.current.focus();
                  }
                }}
              />
            </div>
          )}
          {showPromptList && filteredPrompts.length > 0 && (
            <div className="absolute bottom-12 w-full">
              <PromptList
                activePromptIndex={activePromptIndex}
                prompts={filteredPrompts}
                onSelect={handleInitModal}
                onMouseOver={setActivePromptIndex}
                promptListRef={promptListRef}
              />
            </div>
          )}
          {isModalVisible && (
            <VariableModal
              prompt={prompts[activePromptIndex]}
              variables={variables}
              onSubmit={handleSubmit}
              onClose={() => setIsModalVisible(false)}
            />
          )}


          {/* {plugin && 
           ( <PluginModal
            plugin={plugin}
            onSubmit={()=>handleUploaded()}
            onClose={() => setPlugin(null)}
            />)
          } */}
           {showOptionsModal &&
          (  <OptionsModal
            plugin={options}
            onSubmit={(val:any)=>handleOption(val)}
            onClose={() => setShowOptionsModal(null)}
            />)
          }

        {showQueryModal &&  (<QueryModal
           plugin={showQueryModal}
           onSubmit={handleQuery}
           onClose={() => setShowQueryModal(null)}
          />)}

{jiraIntegration &&  (<JiraModal
           plugin={jiraIntegration}
           onSubmit={handleJiraInt}
           onClose={() => setJiraIntegration(false)}
          />)}

        </div>
      </div>
    </div>
  );
};
