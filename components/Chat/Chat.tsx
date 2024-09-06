import { Conversation, Message } from '@/types/chat';
import { KeyValuePair } from '@/types/data';
import { ErrorMessage } from '@/types/error';
import { OpenAIModel, OpenAIModelID } from '@/types/openai';
import { Plugin } from '@/types/plugin';
import { Prompt } from '@/types/prompt';
import { throttle } from '@/utils';
import { IconArrowDown, IconClearAll, IconSettings } from '@tabler/icons-react';
import { useTranslation } from 'next-i18next';
import {
  FC,
  MutableRefObject,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Spinner } from '../Global/Spinner';
import { ChatInput } from './ChatInput';
import { ChatLoader } from './ChatLoader';
import { ChatMessage } from './ChatMessage';
import { ErrorMessageDiv } from './ErrorMessageDiv';
import { ModelSelect } from './ModelSelect';
import { SystemPrompt } from './SystemPrompt';
import { Key } from '../Settings/Key';
import { Box, Button, Card, CardContent, Paper, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';

interface Props {
  conversation: Conversation;
  models: OpenAIModel[];
  apiKey: string;
  serverSideApiKeyIsSet: boolean;
  defaultModelId: OpenAIModelID;
  messageIsStreaming: boolean;
  modelError: ErrorMessage | null;
  loading: boolean;
  prompts: Prompt[];
  onApiKeyChange: (apiKey: string) => void;
  onSend: (
    message: Message,
    deleteCount: number,
    plugin: Plugin | null,
  ) => void;
  onUpdateConversation: (
    conversation: Conversation,
    data: KeyValuePair,
  ) => void;
  onEditMessage: (message: Message, messageIndex: number) => void;
  stopConversationRef: MutableRefObject<boolean>;
  mygptData: any
}

export const Chat: FC<Props> = memo(
  ({
    conversation,
    models,
    apiKey,
    serverSideApiKeyIsSet,
    defaultModelId,
    messageIsStreaming,
    modelError,
    loading,
    prompts,
    onSend,
    onUpdateConversation,
    onEditMessage,
    stopConversationRef,
    onApiKeyChange,
    mygptData
  }) => {
    const { t } = useTranslation('chat');
    const [currentMessage, setCurrentMessage] = useState<Message>();
    const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(true);
    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [showScrollDownButton, setShowScrollDownButton] =
      useState<boolean>(false);
    const [selectedTile, setSelectedTile] = useState<string | null>(null); // State for selected tile
    const [newKey, setNewKey] = useState<any>()
    const [isModalOpen, setIsModalOpen] = useState(true);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [internetData, setInternetData] = useState<any[]>([])
    const [isLoading, setisloading] = useState<boolean>(false)

    const scrollToBottom = useCallback(() => {
      if (autoScrollEnabled) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        textareaRef.current?.focus();
      }
    }, [autoScrollEnabled]);

    const handleScroll = () => {
      if (chatContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          chatContainerRef.current;
        const bottomTolerance = 30;

        if (scrollTop + clientHeight < scrollHeight - bottomTolerance) {
          setAutoScrollEnabled(false);
          setShowScrollDownButton(true);
        } else {
          setAutoScrollEnabled(true);
          setShowScrollDownButton(false);
        }
      }
    };

    const handleScrollDown = () => {
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    };

    const handleSettings = () => {
      setShowSettings(!showSettings);
    };

    const onClearAll = () => {
      if (confirm(t<string>('Are you sure you want to clear all messages?'))) {
        onUpdateConversation(conversation, { key: 'messages', value: [] });
      }
    };

    const scrollDown = () => {
      if (autoScrollEnabled) {
        messagesEndRef.current?.scrollIntoView(true);
      }
    };
    const throttledScrollDown = throttle(scrollDown, 250);

    useEffect(() => {
      throttledScrollDown();
      setCurrentMessage(
        conversation.messages[conversation.messages.length - 2],
      );
    }, [conversation.messages, throttledScrollDown]);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setAutoScrollEnabled(entry.isIntersecting);
          if (entry.isIntersecting) {
            textareaRef.current?.focus();
          }
        },
        {
          root: null,
          threshold: 0.5,
        },
      );
      const messagesEndElement = messagesEndRef.current;
      if (messagesEndElement) {
        observer.observe(messagesEndElement);
      }
      return () => {
        if (messagesEndElement) {
          observer.unobserve(messagesEndElement);
        }
      };
    }, [messagesEndRef]);

    const handleChange = (event: any) => {
      setNewKey(event.target.value)
    }

    const handleSubmit = (event: any) => {
      event?.preventDefault()
      onApiKeyChange(newKey)
      setTimeout(() => {
        setNewKey('')
      }, 2000)
    }

    const handleClose = () => {
      setIsModalOpen(false);
    };

    useEffect(() => {
      onApiKeyChange('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')
    }, [])

    const handleCrawlByDatabase = async (message: any) => {
      setisloading(true)
      try {
        const response = await fetch('https://1vqwm79std.execute-api.us-east-1.amazonaws.com/default/searchgeniusdb', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ application_description: message?.content }),
        });
        const data = await response.json();
        console.log(data);
        // Handle the data or update the state
        setisloading(false)
      } catch (error) {
        console.error('Error:', error);
        setisloading(false)
      }
    };

    const handleCrawlWithPDF = async (message: any) => {
      setisloading(true)
      const formData: any = new FormData();
      if (mygptData) {
        mygptData?.files.forEach((file: any, index: any) => {
          console.log(file, "files")
          formData.append(`file${index + 1}`, file);
        });

        // Append other fields if necessary
        formData.append('pdf_urls', mygptData.urls || '[]');
        formData.append('is_google_authenticated', mygptData.is_google_authenticated || 'false');
        formData.append('query', JSON.stringify({ query: message }));
      }
      // let json:any ={}
      // if(mygptData){
      //   mygptData?.files.forEach((file: any, index: any) => {
      //     console.log(file,"files")
      //     json[`file${index+1}`] = file;
      //   });

      //  // Append other fields if necessary
      //  json['pdf_urls'] = mygptData.urls || '[]';
      //  json['is_google_authenticated']= mygptData.is_google_authenticated || 'false';
      //  json['query']= JSON.stringify(message);
      // }
      // console.log(formData,"pdf form data",json)
      try {
        const response = await fetch('http://ec2-34-222-221-137.us-west-2.compute.amazonaws.com:8100/pdfqa', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: mygptData ? formData : JSON.stringify({ application_description: message }),
        })
        const data = await response.json()
        console.log(data)
        // Handle the data or update the state
        setisloading(false)
      } catch (error) {
        setisloading(false)
        console.error('Error:', error)
      }
    }



    const handleCrawlByGoogle = async (message: any) => {
      setisloading(true)
      try {
        const response = await fetch('http://ec2-34-222-221-137.us-west-2.compute.amazonaws.com:8100/start-oauth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: message?.content }),
        });

        const result = await response.json();
        setisloading(false)
      } catch (error) {
        setisloading(false)
        console.error('Error:', error);
      }
    };

    // const handleCrawlByInternet = async (message: any) => {
    //   setisloading(true)
    //   try {
    //     const response = await fetch('http://ec2-54-196-253-159.compute-1.amazonaws.com:8101/internetsearch', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({ query: message?.content }),
    //     });
    //     // const data = await response.json();
    //     const text = await response.text();

    //     // Parse HTML
    //     const parser = new DOMParser();
    //     const doc = parser.parseFromString(text, 'text/html');

    //     // Extract data
    //     const title = doc.querySelector('h1')?.textContent || '';
    //     const paragraphs = Array.from(doc.querySelectorAll('p'));
    //     const generatedAnswer = paragraphs.map(p => p.textContent || '').join('\n');
    //     const images = Array.from(doc.querySelectorAll('img')).map(img => img.src);

    //     // Construct JSON
    //     const json = {
    //       title,
    //       generatedAnswer,
    //       images
    //     };

    //     console.log(json);
    //     setInternetData(json)
    //     // Handle the data or update the state
    //     setisloading(false)
    //   } catch (error) {
    //     setisloading(false)
    //     console.error('Error:', error);
    //   }
    // };
    const extractDataFromHTML = (htmlString: string) => {
      // Parse the HTML string
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');

      // Extract title
      const title = doc.querySelector('h1')?.textContent?.trim() || '';

      // Extract full text content
      const fullText = doc.body.textContent || '';

      // Define regular expressions to match various section titles
      const followUpQuestionsPattern = /Follow[- ]?up[ -]?questions(?: for further understanding or exploration)?[:]?/i;
      const generatedAnswerPattern = /Generated Answer[:]?/i;
      const relatedImagesPattern = /Related Images[:]?/i; // Pattern for "Related Images"

      // Extract generated answer part and follow-up questions part
      const [generatedAnswerPart, followUpQuestionsPart] = fullText.split(followUpQuestionsPattern);

      // Extract and process generated answer
      const generatedAnswer = generatedAnswerPart
        ?.split(generatedAnswerPattern)[1] // Split further based on "Generated Answer:" if present
        ?.trim() || '';

      // Process follow-up questions
      const followUpQuestions = (followUpQuestionsPart || '')
        .split('\n')
        .filter(line => line.trim().match(/^\d+\.\s/)) // Match lines starting with numbers (e.g., "1. ")
        .map(question => question.trim().replace(/^\d+\.\s/, '')) // Remove leading number and period
        .filter(question => question.length > 0) || [];

      // Extract video links
      const videoLinks = Array.from(doc.querySelectorAll('a')).map(a => ({
        text: a.textContent?.trim() || '',
        url: a.href || ''
      }));

      // Extract and trim images section
      const imagesPart = (fullText.split(relatedImagesPattern)[1] || '').trim();

      // Extract all images from the document
      const images = Array.from(doc.querySelectorAll('img')).map(img => img.src || '').filter(src => src.length > 0);

      // Return formatted data
      return {
        title,
        generatedAnswer,
        followUpQuestions,
        videoLinks,
        images
      };
    };


    // Example usage in your handleCrawlByInternet function
    const handleCrawlByInternet = async (message: { content?: string }) => {
      setisloading(true);
      try {
        const response = await fetch('http://ec2-54-196-253-159.compute-1.amazonaws.com:8101/internetsearch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: message?.content || '' }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const htmlString = await response.text();
        const data = extractDataFromHTML(htmlString);
        console.log(data, "data")
        setInternetData(prev => [...prev, data]);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setisloading(false);
      }
    };

    const handleTileClick = (tileType: string) => {
      setSelectedTile(tileType); // Set the selected tile
    };

    const handleSend = async (message: Message, plugin: Plugin | null) => {
      console.log(message, "message")
      if (!selectedTile) {
        alert(t<string>('Please select a tile before sending the message.'));
        return;
      }
      setCurrentMessage(message);
      if (selectedTile) {
        switch (selectedTile) {
          case 'pdf':
            await handleCrawlWithPDF(message);
            break;
          case 'database':
            await handleCrawlByDatabase(message);
            break;
          case 'google_drive':
            await handleCrawlByGoogle(message);
            break;
          case 'internet':
            await handleCrawlByInternet(message);
            break;
          default:
            break;
        }
      }
      // onSend(message, 0, plugin);
    };
    console.log(internetData, "internet")
    return (
      <div className="relative flex-1 overflow-hidden" style={{ backgroundColor: 'var(--background-color)' }}>
        <Key apiKey={apiKey} onApiKeyChange={onApiKeyChange} />
        <div className="mx-auto flex w-[350px] flex-col space-y-10 pt-6 sm:w-[600px] mb-3">
          <div className="text-center text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {mygptData?.name ? mygptData?.name : 'Heyanitha.ai'}
          </div>
        </div>
        <div className="text-center text-l text-gray-800 dark:text-gray-100" style={{ marginBottom: '10px' }}>
          {mygptData?.description ? mygptData?.description : ''}
        </div>
        <div style={{ padding: 5, position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#262626', marginLeft: '20px', marginRight: '20px' }}>
          <Stack direction="row" spacing={2} justifyContent="center">
            {/* Crawl by PDF Button */}
            <Button
              variant="outlined"
              sx={{
                width: '100%',
                borderColor: selectedTile === 'pdf' ? '' : 'var(--button-border)',
                color: selectedTile === 'pdf' ? 'var(--button-active-color)' : '#858482',
                background: selectedTile === 'pdf' ? '#363532' : 'var(--button-background)',
                border: 0,
                textTransform: 'capitalize',
                fontWeight: 'normal',
                padding: '4px 12px',
                fontSize: '0.875rem',
                borderRadius: '12px',
                boxShadow: selectedTile === 'pdf' ? 'var(--box-shadow)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  borderColor: 'var(--button-border)',
                },
              }}
              onClick={() => handleTileClick('pdf')}
            >
              Crawl by PDF
            </Button>

            {/* Crawl by Database Button */}
            <Button
              variant="outlined"
              sx={{
                width: '100%',
                borderColor: selectedTile === 'database' ? '' : 'var(--button-border)',
                color: selectedTile === 'database' ? 'var(--button-active-color)' : '#858482',
                background: selectedTile === 'database' ? '#363532' : 'var(--button-background)',
                border: 0,
                textTransform: 'capitalize',
                fontWeight: 'normal',
                padding: '4px 12px',
                fontSize: '0.875rem',
                borderRadius: '12px',
                boxShadow: selectedTile === 'database' ? 'var(--box-shadow)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  borderColor: 'var(--button-border)',
                },
              }}
              onClick={() => handleTileClick('database')}
            >
              Crawl by Database
            </Button>

            {/* Crawl by Google Drive Button */}
            <Button
              variant="outlined"
              sx={{
                width: '100%',
                borderColor: selectedTile === 'google_drive' ? '' : 'var(--button-border)',
                color: selectedTile === 'google_drive' ? 'var(--button-active-color)' : '#858482',
                background: selectedTile === 'google_drive' ? '#363532' : 'var(--button-background)',
                border: 0,
                textTransform: 'capitalize',
                fontWeight: 'normal',
                padding: '4px 12px',
                fontSize: '0.875rem',
                borderRadius: '12px',
                boxShadow: selectedTile === 'google_drive' ? 'var(--box-shadow)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  borderColor: 'var(--button-border)',
                },
              }}
              onClick={() => handleTileClick('google_drive')}
            >
              Crawl by Google Drive
            </Button>

            {/* Crawl by Internet Button */}
            <Button
              variant="outlined"
              sx={{
                width: '100%',
                borderColor: selectedTile === 'internet' ? '' : 'var(--button-border)',
                color: selectedTile === 'internet' ? 'var(--button-active-color)' : '#858482',
                background: selectedTile === 'internet' ? '#363532' : 'var(--button-background)',
                border: 0,
                textTransform: 'capitalize',
                fontWeight: 'normal',
                padding: '4px 12px',
                fontSize: '0.875rem',
                borderRadius: '12px',
                boxShadow: selectedTile === 'internet' ? 'var(--box-shadow)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  borderColor: 'var(--button-border)',
                },
              }}
              onClick={() => handleTileClick('internet')}
            >
              Crawl by Internet
            </Button>
          </Stack>
        </div>


        <ChatInput
          stopConversationRef={stopConversationRef}
          textareaRef={textareaRef}
          messageIsStreaming={messageIsStreaming}
          conversationIsEmpty={conversation.messages.length === 0}
          model={conversation.model}
          prompts={prompts}
          onSend={(message, plugin) => {
            handleSend(message, plugin); // Use handleSend instead of onSend
          }}
          onRegenerate={() => {
            if (currentMessage) {
              handleSend(currentMessage, null); // Regenerate using handleSend
            }
          }}
        />
      </div>
    );
  },
);
Chat.displayName = 'Chat';
