import { Plugin, PluginID } from '@/types/plugin';

export const getEndpoint = (plugin: Plugin | null,apiLink:any) => {
  // if (!plugin) {
  //   return 'api/chat';
  // }

  // if (plugin.id === PluginID.GOOGLE_SEARCH) {
  //   return 'api/google';
  // }
  if(apiLink){
    return "https://api.chatgeniusplus.ai/"+apiLink
  }

  return 'api/chat';
};


export const messageBalanceAPI=(user_id:any)  =>{ 
 const messageBalance = fetch(
              `https://api.botgeniusplus.ai/messagebalance`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  user_id
                }),
              }
            ).then((res)=>{
              return res.text()
            })
         return messageBalance;
          
          }
