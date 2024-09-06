import React, { FC, useState, useEffect } from 'react';
import CreateGpt from './CreateGpt';
import { ChatbarSettings } from './ChatbarSettings';
import { Button, Stack } from '@mui/material';
import MyGPT from './MyGptComponent';

interface Props {
  loading: boolean;
  conversations: any[];
  lightMode: 'light' | 'dark';
  selectedConversation: any;
  apiKey: string;
  pluginKeys: any[];
  folders: any[];
  onCreateFolder: (name: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onUpdateFolder: (folderId: string, name: string) => void;
  onNewConversation: () => void;
  onToggleLightMode: (mode: 'light' | 'dark') => void;
  onSelectConversation: (conversation: any) => void;
  onDeleteConversation: (conversation: any) => void;
  onUpdateConversation: (conversation: any, data: any) => void;
  onApiKeyChange: (apiKey: string) => void;
  onClearConversations: () => void;
  onExportConversations: () => void;
  onImportConversations: (data: any) => void;
  onPluginKeyChange: (pluginKey: any) => void;
  onClearPluginKey: (pluginKey: any) => void;
  onMygpt: (pluginKey: any) => void;
}

function base64ToFile(dataurl:any, filename:any) {
  var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[arr.length - 1]), 
      n = bstr.length, 
      u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type:mime});
}

export const Chatbar: FC<Props> = ({
  loading,
  conversations,
  lightMode,
  selectedConversation,
  apiKey,
  pluginKeys,
  folders,
  onCreateFolder,
  onDeleteFolder,
  onUpdateFolder,
  onNewConversation,
  onToggleLightMode,
  onSelectConversation,
  onDeleteConversation,
  onUpdateConversation,
  onApiKeyChange,
  onClearConversations,
  onExportConversations,
  onImportConversations,
  onPluginKeyChange,
  onClearPluginKey,
  onMygpt,
}) => {
  const [activeComponent, setActiveComponent] = useState<'create' | 'configure'>('create');
  const [gptDataList, setGptDataList] = useState<any[]>([]);
  const [selectedGpt, setSelectedGpt] = useState<any>(null);

  useEffect(() => {
        const loadDataFromCache = async () => {
          try {
            const cache = await caches.open('create-gpt-cache');
            const cacheKeys = await cache.keys();
    
            const formDataPromises = cacheKeys
              .filter(request => request.url.startsWith(location.origin + '/form-data-'))
              .map(async request => {
                const response = await cache.match(request);
                if (response) {
                  const data = await response.json();
                  return data;
                }
                return null;
              });
    
            const formDataList = await Promise.all(formDataPromises);
            const validFormDataList: any = formDataList.filter(data => data !== null);
            for (let i = 0; validFormDataList.length > i; i++) {
              const data = validFormDataList[i].files?.map((item: any, index: any) => base64ToFile(item, validFormDataList[i].fileNames[index].name))
              validFormDataList[i].files = data
            }
            console.log(validFormDataList,"validationDatalist")
            setGptDataList(validFormDataList as any[]);
            setActiveComponent(validFormDataList.length > 0 ? 'configure' : 'create');
          } catch (error) {
            console.error('Error loading data from cache:', error);
          }
        };
    
        loadDataFromCache();
      }, []);
    

    const handleFormSubmit = async (data: any) => {
    try {
      const cache = await caches.open('create-gpt-cache');

      if (selectedGpt) {
        await cache.delete(`form-data-${selectedGpt.id}`);
      }

      await cache.put(`form-data-${data.id}`, new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
      }));

      if (selectedGpt) {
        setGptDataList(prev => prev.map(gpt => gpt.id === data.id ? data : gpt));
      } else {
        setGptDataList(prev => [...prev, data]);
      }

      setActiveComponent('configure');
      setSelectedGpt(null);
    } catch (error) {
      console.error('Error updating data in cache:', error);
    }
  };

  const handleSelectGpt = (gptData: any) => {
    // const data = gptData.files?.map((item: any, index: any) => base64ToFile(item, gptData.fileNames[index].name))
    // gptData.files = data
    // console.log(gptData,"gptData",data)
    onMygpt(gptData);
  };

  const onhandleSelectGpt = (gpt:any)=>{
    onMygpt(gpt)
  }

  const handleEditGpt = (gptData: any) => {
    setSelectedGpt(gptData);
    setActiveComponent('create');
  };

  const handleDeleteGpt = async (id: string) => {
    try {
      const cache = await caches.open('create-gpt-cache');

      await cache.delete(`form-data-${id}`);

      setGptDataList(prev => prev.filter(gpt => gpt.id !== id));

      if (selectedGpt && selectedGpt.id === id) {
        setSelectedGpt(null);
        setActiveComponent('create');
      }
      if (gptDataList.find(gpt => gpt.id === id)) {
        onMygpt(null);
      }
    } catch (error) {
      console.error('Error deleting data from cache:', error);
    }
  };

  const handleCancelEdit = () => {
    setSelectedGpt(null);
    setActiveComponent('configure');
  };

  return (
    <div
      className={`fixed top-0 bottom-0 z-50 flex h-full w-[460px] flex-none flex-col space-y-2 p-2 transition-all ${
        lightMode === 'light' ? 'bg-white text-black' : 'bg-[#202123] text-white'
      } sm:relative sm:top-0`}
    >
<div style={{ background: '#262626', padding: 5 }}>
      <Stack direction="row" spacing={2}>
           <Button
            variant="outlined"
            sx={{
              width: '50%',
              borderColor: activeComponent === 'configure' ? '' : 'var(--button-border)',
              color: activeComponent === 'configure' ? '#858482' : 'var(--text-color)',
              background: activeComponent === 'configure' ? 'var(--button-active-background)' : '#363532',
              border: 0,
              textTransform: 'capitalize',
              fontWeight: 'normal',
              padding: '4px 12px',
              fontSize: '0.875rem',
              borderRadius: '12px',
              '&:hover': {
                borderColor: 'var(--button-border)',
              },
            }}
            onClick={() => setActiveComponent('create')}
          >
            Create
          </Button>
          <Button
            variant="outlined"
            sx={{
              width: '50%',
              borderColor: 'var(--button-border)',
              color: activeComponent === 'create' ? '#858482' : 'var(--text-color)',
              background: activeComponent === 'create' ? 'var(--button-active-background)' : '#363532',
              border: 0 ,
              textTransform: 'capitalize',
              fontWeight: 'normal',
              padding: '4px 12px',
              fontSize: '0.875rem',
              borderRadius: '12px',
              '&:hover': {
                borderColor: 'var(--button-border)',
              },
            }}
            onClick={() => setActiveComponent('configure')}
          >
            My GPT
          </Button>
        </Stack>
      </div>

      {activeComponent === 'create' && (
        <CreateGpt
          onFormSubmit={handleFormSubmit}
          initialData={selectedGpt}
          onCancelEdit={handleCancelEdit}
        />
      )}
      {activeComponent === 'configure' && (
        <MyGPT
          gptDataList={gptDataList}
          onSelectGpt={handleSelectGpt}
          onEditGpt={handleEditGpt}
          onDeleteGpt={handleDeleteGpt}
        />
      )}

      {/* <ChatbarSettings
        lightMode={lightMode}
        apiKey={apiKey}
        pluginKeys={pluginKeys}
        conversationsCount={conversations.length}
        onToggleLightMode={onToggleLightMode}
        onApiKeyChange={onApiKeyChange}
        onClearConversations={onClearConversations}
        onExportConversations={onExportConversations}
        onImportConversations={onImportConversations}
        onPluginKeyChange={onPluginKeyChange}
        onClearPluginKey={onClearPluginKey}
      /> */}
    </div>
  );
};
