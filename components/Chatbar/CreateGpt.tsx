import { FC, useState, useRef, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Alert, Button, Input } from '@mui/material';
import { CheckCircle, PlusCircle, Upload, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface CreateGptProps {
    onFormSubmit: (data: any) => void;
    initialData?: {
        id: string;
        name: string;
        description: string;
        files: File[];
        urls: string[];
    } | null;
    onCancelEdit?: () => void;
}

const CreateGpt: FC<CreateGptProps> = ({ onFormSubmit, initialData = null, onCancelEdit }) => {
    const [showComponent, setShowComponent] = useState<boolean>(true);
    const [name, setName] = useState<string>(initialData?.name || '');
    const [description, setDescription] = useState<string>(initialData?.description || '');
    const [pdfFiles, setPdfFiles] = useState<File[]>(initialData?.files || []);
    const [pdfUrls, setPdfUrls] = useState<string[]>(initialData?.urls || ['']);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        setShowComponent(true);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []);
        setPdfFiles(prevFiles => [...prevFiles, ...newFiles]);
    };

    const handleUrlChange = (index: number, value: string) => {
        const newUrls = [...pdfUrls];
        newUrls[index] = value;
        setPdfUrls(newUrls);
    };

    const addUrlField = () => {
        setPdfUrls([...pdfUrls, '']);
    };

    const removeFile = (index: number) => {
        setPdfFiles(files => files.filter((_, i) => i !== index));
    };

    const removeUrl = (index: number) => {
        setPdfUrls(urls => urls.filter((_, i) => i !== index));
    };

    const handleGoogleAuth = async () => {
        try {
            const response = await fetch('http://ec2-54-196-253-159.compute-1.amazonaws.com:8100/start-oauth', {
                method: 'GET',
            });

            if (response.ok) {
                const result = await response.json();
                setIsAuthenticated(true);
                setAlert({ type: 'success', message: 'Authenticated with Google Drive!' });
            } else {
                setAlert({ type: 'error', message: 'Failed to authenticate with Google Drive. Please try again.' });
            }
        } catch (error) {
            setAlert({ type: 'error', message: 'An error occurred during Google authentication. Please try again.' });
        }
    };
        const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result as string);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

        const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const fileNames = pdfFiles.map(file => ({ name: file.name }));
        const base64Files = await Promise.all(pdfFiles.map(file => convertFileToBase64(file)));
        const filesData = { files: base64Files };
        console.log(filesData, "filesData")
        const formData = {
            id: initialData?.id || uuidv4(),
            name,
            description,
            files: filesData.files,
            fileNames: fileNames,
            urls: pdfUrls,
        };

        try {
            const cache = await caches.open('create-gpt-cache');

            // Store the form data as a JSON response
            const formDataJson = JSON.stringify(formData);
            cache.put(`form-data-${formData.id}`, new Response(formDataJson, {
                headers: {
                    'Content-Type': 'application/json',
                },
            }));

            setAlert({ type: 'success', message: 'Data saved successfully!' });
            onFormSubmit(formData);
            // onhandleGpt(Data)
            if (onCancelEdit) onCancelEdit();
        } catch (error) {
            setAlert({ type: 'error', message: 'Failed to save data. Please try again.' });
            console.error('Error saving data to cache:', error);
        }
    };
        const styles = {
        inputGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
        },
        input: {
            padding: '12px 16px',
            borderRadius: '8px',
            border: '2px solid #363532',
            fontSize: '16px',
            transition: 'all 0.3s ease',
            backgroundColor: 'var(--background-color)',
            '&:focus': {
                borderColor: '#3498db',
                boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.2)',
                outline: 'none',
            },
        },
        textarea: {
            padding: '12px 16px',
            borderRadius: '8px',
            border: '2px solid #363532',
            fontSize: '16px',
            minHeight: '120px',
            backgroundColor: 'var(--background-color)',
            resize: 'vertical',
            transition: 'all 0.3s ease',
            '&:focus': {
                borderColor: '#3498db',
                boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.2)',
                outline: 'none',
            },
        },
        button: {
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#3498db',
            color: 'white',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
                backgroundColor: '#2980b9',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            },
        },
    };

    return (
        <>
            <style>
                {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 0px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: #363532;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #858482;
            border-radius: 6px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #888;
          }
        `}
            </style>
            <div
                className={`custom-scrollbar w-full max-w-2xl rounded-2xl shadow-2xl transition-all duration-500 ${showComponent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    overflowY: 'scroll',
                    backgroundColor: 'var(--background-color)',
                    borderRadius: '15px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
            >
                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        width: '100%',
                        maxWidth: '800px',
                        padding: '20px',
                        backgroundColor: 'var(--background-color)',
                        borderRadius: '15px',
                    }}
                >
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                    }}>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter a unique name for your GPT"
                            style={styles.input}
                        />
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                    }}>
                        <Typography sx={{ color: "var(--text-color)", fontWeight: "400",fontSize:'14px' }}>Description</Typography>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe what your GPT does and how it can be used"
                            style={{
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '2px solid #363532',
                                fontSize: '16px',
                                minHeight: '120px',
                                resize: 'vertical',
                                transition: 'all 0.3s ease',
                                backgroundColor: 'var(--background-color)'
                            }}
                        />
                    </div>

                    <div className="mb-3">
                        <Typography sx={{ color: "var(--text-color)", fontWeight: "400",fontSize:'14px'  }}>Uploaded PDFs</Typography>
                        <div className="mt-3 space-y-2">
                            {pdfFiles.length > 0 ? (
                                pdfFiles.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 truncate flex-grow">
                                            {file.name}
                                        </span>
                                        <Button
                                            size="small"
                                            variant="text"
                                            onClick={() => removeFile(index)}
                                            className="rounded-full p-1"
                                            style={{ color: 'var(--text-color)', }}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                null
                            )}
                        </div>
                        <div className="space-y-4">
                            <input
                                type="file"
                                accept=".pdf"
                                multiple
                                onChange={handleFileChange}
                                className="hidden"
                                ref={fileInputRef}
                            />
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                className="hover:scale-105 shadow-md"
                                style={{
                                    borderRadius: '8px',
                                    padding: '10px 10px',
                                    border: 'none',
                                    backgroundColor: '#3498db',
                                    color: 'white',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    fontFamily: "'Poppins', sans-serif",
                                }}
                            >
                                <Upload className="w-5 h-5 mr-2" />
                                Upload files
                            </Button>
                        </div>
                    </div>

                    <div className="mb-3">
                        <Typography sx={{ color: "var(--text-color)", fontWeight: "400", marginBottom: 2 ,fontSize:'14px' }}>Enter PDF URLs</Typography>
                        {pdfUrls.map((url, index) => (
                            <div key={index} className="flex items-center space-x-2 mb-3">
                                <input
                                    value={url}
                                    onChange={(e) => handleUrlChange(index, e.target.value)}
                                    placeholder="Enter PDF URL"
                                    className="flex-grow shadow-sm"
                                    style={{ ...styles.input, flex: 1 }}
                                />
                                <Button
                                    size="small"
                                    variant="text"
                                    style={{ color: 'var(--text-color)' }}
                                    onClick={() => removeUrl(index)}
                                    className="rounded-full"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                        <Button
                            onClick={addUrlField}
                            style={{
                                borderRadius: '8px',
                                padding: '10px 10px',
                                border: 'none',
                                backgroundColor: '#3498db',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                fontFamily: "'Poppins', sans-serif",
                            }}
                            className="mt-2 border-2 text-purple-600 hover:bg-purple-50 transition-all duration-300 transform hover:scale-105"
                        >
                            <PlusCircle className="w-5 h-5 mr-2" />
                            Add Another URL
                        </Button>
                    </div>

                    <div className="mb-3">
                        <Typography sx={{ color: "var(--text-color)", fontWeight: "400", marginBottom: 2 ,fontSize:'14px' }}>Google Drive Authentication</Typography>
                        <Button
                            onClick={handleGoogleAuth}
                            disabled={isAuthenticated}
                            style={{
                                padding: '10px 10px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: '#3498db',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                fontFamily: "'Poppins', sans-serif",
                            }}
                            className={`w-full text-white transition-all duration-300 transform hover:scale-105 shadow-md ${isAuthenticated ? 'bg-green-500 hover:bg-green-600' : ''}`}
                        >
                            {isAuthenticated ? <CheckCircle className="w-5 h-5 mr-2" /> : <Upload className="w-5 h-5 mr-2" />}
                            {isAuthenticated ? 'Authenticated with Google Drive' : 'Authenticate with Google Drive'}
                        </Button>
                    </div>

                    {alert && (
                        <Alert
                            severity={alert.type}
                            sx={{
                                backgroundColor: alert.type === 'success' ? 'var(--alert-success-background)' : 'var(--alert-error-background)',
                                color: alert.type === 'success' ? 'var(--alert-success-text)' : 'var(--alert-error-text)',
                                marginTop: 2
                            }}
                        >
                            {alert.message}
                        </Alert>
                    )}

                    <div className="flex w-full">
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ flex: 1, marginRight: '8px', backgroundColor: '#3498db' }}
                        >
                            Save
                        </Button>

                        {onCancelEdit && (
                            <Button
                                onClick={onCancelEdit}
                                variant="outlined"
                                sx={{ flex: 1, marginLeft: '8px', color: 'var(--text-color)', borderColor: '#363532', borderWidth: '2px', borderStyle: 'solid' }} // White border color
                            >
                                Cancel
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </>
    );
};

export default CreateGpt;


// import { FC, useState, useRef, useEffect } from 'react';
// import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';
// import { Alert, Button, Input } from '@mui/material';
// import { CheckCircle, PlusCircle, Upload, X } from 'lucide-react';
// import { v4 as uuidv4 } from 'uuid';

// interface CreateGptProps {
//     onFormSubmit: (data: any) => void;
//     initialData?: {
//         id: string;
//         name: string;
//         description: string;
//         files: File[];
//         urls: string[];
//     } | null;
//     onCancelEdit?: () => void;
//     onhandleGpt: (data: any) => void;
// }

// const CreateGpt: FC<CreateGptProps> = ({ onFormSubmit, initialData = null, onCancelEdit, onhandleGpt }) => {
//     const [showComponent, setShowComponent] = useState<boolean>(true);
//     const [name, setName] = useState<string>(initialData?.name || '');
//     const [description, setDescription] = useState<string>(initialData?.description || '');
//     const [pdfFiles, setPdfFiles] = useState<File[]>(initialData?.files || []);
//     const [pdfUrls, setPdfUrls] = useState<string[]>(initialData?.urls || ['']);
//     const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
//     const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
//     const fileInputRef = useRef<HTMLInputElement | null>(null);

//     useEffect(() => {
//         setShowComponent(true);
//     }, []);

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const newFiles = Array.from(e.target.files || []);
//         setPdfFiles(prevFiles => [...prevFiles, ...newFiles]);
//     };

//     const handleUrlChange = (index: number, value: string) => {
//         const newUrls = [...pdfUrls];
//         newUrls[index] = value;
//         setPdfUrls(newUrls);
//     };

//     const addUrlField = () => {
//         setPdfUrls([...pdfUrls, '']);
//     };

//     const removeFile = (index: number) => {
//         setPdfFiles(files => files.filter((_, i) => i !== index));
//     };

//     const removeUrl = (index: number) => {
//         setPdfUrls(urls => urls.filter((_, i) => i !== index));
//     };

//     const handleGoogleAuth = async () => {
//         try {
//             const response = await fetch('http://ec2-34-222-221-137.us-west-2.compute.amazonaws.com:8100/start-oauth', {
//                 method: 'GET',
//             });

//             if (response.ok) {
//                 const result = await response.json();
//                 setIsAuthenticated(true);
//                 setAlert({ type: 'success', message: 'Authenticated with Google Drive!' });
//             } else {
//                 setAlert({ type: 'error', message: 'Failed to authenticate with Google Drive. Please try again.' });
//             }
//         } catch (error) {
//             setAlert({ type: 'error', message: 'An error occurred during Google authentication. Please try again.' });
//         }
//     };

//     const convertFileToBase64 = (file: File): Promise<string> => {
//         return new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 resolve(reader.result as string);
//             };
//             reader.onerror = reject;
//             reader.readAsDataURL(file);
//         });
//     };

//     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault();

//         const fileNames = pdfFiles.map(file => ({ name: file.name }));
//         const base64Files = await Promise.all(pdfFiles.map(file => convertFileToBase64(file)));
//         const filesData = { files: base64Files };
//         console.log(filesData, "filesData")
//         const formData = {
//             id: initialData?.id || uuidv4(),
//             name,
//             description,
//             files: filesData.files,
//             fileNames: fileNames,
//             urls: pdfUrls,
//         };

//         try {
//             const cache = await caches.open('create-gpt-cache');

//             // Store the form data as a JSON response
//             const formDataJson = JSON.stringify(formData);
//             cache.put(`form-data-${formData.id}`, new Response(formDataJson, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             }));

//             setAlert({ type: 'success', message: 'Data saved successfully!' });
//             onFormSubmit(formData);
//             // onhandleGpt(Data)
//             if (onCancelEdit) onCancelEdit();
//         } catch (error) {
//             setAlert({ type: 'error', message: 'Failed to save data. Please try again.' });
//             console.error('Error saving data to cache:', error);
//         }
//     };

//     const styles = {
//         inputGroup: {
//             display: 'flex',
//             flexDirection: 'column',
//             gap: '8px',
//         },
//         input: {
//             padding: '12px 16px',
//             borderRadius: '8px',
//             border: '2px solid #363532',
//             fontSize: '16px',
//             transition: 'all 0.3s ease',
//             '&:focus': {
//                 borderColor: '#3498db',
//                 boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.2)',
//                 outline: 'none',
//             },
//         },
//         textarea: {
//             padding: '12px 16px',
//             borderRadius: '8px',
//             border: '2px solid #363532',
//             fontSize: '16px',
//             minHeight: '120px',
//             resize: 'vertical',
//             transition: 'all 0.3s ease',
//             '&:focus': {
//                 borderColor: '#3498db',
//                 boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.2)',
//                 outline: 'none',
//             },
//         },
//         button: {
//             padding: '12px 24px',
//             borderRadius: '8px',
//             border: 'none',
//             backgroundColor: '#3498db',
//             color: 'white',
//             fontSize: '16px',
//             fontWeight: '500',
//             cursor: 'pointer',
//             transition: 'all 0.3s ease',
//             '&:hover': {
//                 backgroundColor: '#2980b9',
//                 transform: 'translateY(-2px)',
//                 boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//             },
//         },
//     };

//     return (
//         <>
//             <style>
//                 {`
//           .custom-scrollbar::-webkit-scrollbar {
//             width: 0px;
//           }

//           .custom-scrollbar::-webkit-scrollbar-track {
//             background: #363532;
//           }

//           .custom-scrollbar::-webkit-scrollbar-thumb {
//             background: #858482;
//             border-radius: 6px;
//           }

//           .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//             background: #888;
//           }
//         `}
//             </style>
//             <div
//                 className={`custom-scrollbar w-full max-w-2xl rounded-2xl shadow-2xl transition-all duration-500 ${showComponent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
//                 style={{
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     overflowY: 'scroll',
//                     backgroundColor: 'var(--background-color)',
//                     borderRadius: '15px',
//                     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//                 }}
//             >
//                 <form
//                     onSubmit={handleSubmit}
//                     style={{
//                         display: 'flex',
//                         flexDirection: 'column',
//                         gap: '16px',
//                         width: '100%',
//                         maxWidth: '800px',
//                         padding: '20px',
//                         backgroundColor: 'var(--background-color)',
//                         borderRadius: '15px',
//                     }}
//                 >
//                     {/* <TextField
//                     placeholder='Name Your GPT'
//                     variant="outlined"
//                     fullWidth
//                     sx={{
//                         borderRadius: '4px',
//                         borderColor: 'white',
//                         border:1
//                     }}
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     InputProps={{
//                         style: {
//                             color: 'var(--text-color)',
//                         }
//                     }}
//                 />

//                 <Typography sx={{ color: "var(--text-color)", fontWeight: "400" }}>Description</Typography>
//                 <TextField
//                     id="description"
//                     multiline
//                     rows={3}
//                     placeholder="Add a short description about what this GPT does"
//                     variant="outlined"
//                     fullWidth
//                     sx={{
//                         borderRadius: '4px',
//                         borderColor: 'white', // White border color
//                         border:1
//                     }}
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     InputProps={{
//                         style: {
//                             color: 'var(--text-color)',
//                         }
//                     }}
//                 /> */}

//                     <div style={{
//                         display: 'flex',
//                         flexDirection: 'column',
//                         gap: '8px',
//                     }}>
//                         <input
//                             id="name"
//                             type="text"
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             placeholder="Enter a unique name for your GPT"
//                             style={styles.input}
//                         />
//                     </div>
//                     <div style={{
//                         display: 'flex',
//                         flexDirection: 'column',
//                         gap: '8px',
//                     }}>
//                         <Typography sx={{ color: "var(--text-color)", fontWeight: "400" }}>Description</Typography>
//                         <textarea
//                             id="description"
//                             value={description}
//                             onChange={(e) => setDescription(e.target.value)}
//                             placeholder="Describe what your GPT does and how it can be used"
//                             style={{
//                                 padding: '12px 16px',
//                                 borderRadius: '8px',
//                                 border: '2px solid #363532',
//                                 fontSize: '16px',
//                                 minHeight: '120px',
//                                 resize: 'vertical',
//                                 transition: 'all 0.3s ease',
//                             }}
//                         />
//                     </div>

//                     <div className="mb-3">
//                         <Typography sx={{ color: "var(--text-color)", fontWeight: "400" }}>Uploaded PDFs</Typography>
//                         <div className="mt-3 space-y-2">
//                             {pdfFiles.length > 0 ? (
//                                 pdfFiles.map((file, index) => (
//                                     <div key={index} className="flex items-center justify-between">
//                                         <span className="text-sm text-gray-600 truncate flex-grow">
//                                             {file.name}
//                                         </span>
//                                         <Button
//                                             size="small"
//                                             variant="text"
//                                             onClick={() => removeFile(index)}
//                                             className="rounded-full p-1"
//                                             style={{ color: 'var(--text-color)', }}
//                                         >
//                                             <X className="w-4 h-4" />
//                                         </Button>
//                                     </div>
//                                 ))
//                             ) : (
//                                 null
//                             )}
//                         </div>
//                         <div className="space-y-4">
//                             <input
//                                 type="file"
//                                 accept=".pdf"
//                                 multiple
//                                 onChange={handleFileChange}
//                                 className="hidden"
//                                 ref={fileInputRef}
//                             />
//                             <Button
//                                 onClick={() => fileInputRef.current?.click()}
//                                 className="hover:scale-105 shadow-md"
//                                 style={{
//                                     borderRadius: '8px',
//                                     padding: '10px 10px',
//                                     border: 'none',
//                                     backgroundColor: '#3498db',
//                                     color: 'white',
//                                     fontSize: '14px',
//                                     fontWeight: '500',
//                                     cursor: 'pointer',
//                                     transition: 'all 0.3s ease',
//                                     fontFamily: "'Poppins', sans-serif",
//                                 }}
//                             >
//                                 <Upload className="w-5 h-5 mr-2" />
//                                 Upload files
//                             </Button>
//                         </div>
//                     </div>

//                     <div className="mb-3">
//                         <Typography sx={{ color: "var(--text-color)", fontWeight: "400", marginBottom: 2 }}>Enter PDF URLs</Typography>
//                         {pdfUrls.map((url, index) => (
//                             <div key={index} className="flex items-center space-x-2 mb-3">
//                                 <input
//                                     value={url}
//                                     onChange={(e) => handleUrlChange(index, e.target.value)}
//                                     placeholder="Enter PDF URL"
//                                     className="flex-grow shadow-sm"
//                                     style={{ ...styles.input, flex: 1 }}
//                                 />
//                                 <Button
//                                     size="small"
//                                     variant="text"
//                                     style={{ color: 'var(--text-color)' }}
//                                     onClick={() => removeUrl(index)}
//                                     className="rounded-full"
//                                 >
//                                     <X className="w-4 h-4" />
//                                 </Button>
//                             </div>
//                         ))}
//                         <Button
//                             onClick={addUrlField}
//                             style={{
//                                 borderRadius: '8px',
//                                 padding: '10px 10px',
//                                 border: 'none',
//                                 backgroundColor: '#3498db',
//                                 color: 'white',
//                                 fontSize: '14px',
//                                 fontWeight: '500',
//                                 cursor: 'pointer',
//                                 transition: 'all 0.3s ease',
//                                 fontFamily: "'Poppins', sans-serif",
//                             }}
//                             className="mt-2 border-2 text-purple-600 hover:bg-purple-50 transition-all duration-300 transform hover:scale-105"
//                         >
//                             <PlusCircle className="w-5 h-5 mr-2" />
//                             Add Another URL
//                         </Button>
//                     </div>

//                     <div className="mb-3">
//                         <Typography sx={{ color: "var(--text-color)", fontWeight: "400", marginBottom: 2 }}>Google Drive Authentication</Typography>
//                         <Button
//                             onClick={handleGoogleAuth}
//                             disabled={isAuthenticated}
//                             style={{
//                                 padding: '10px 10px',
//                                 borderRadius: '8px',
//                                 border: 'none',
//                                 backgroundColor: '#3498db',
//                                 color: 'white',
//                                 fontSize: '14px',
//                                 fontWeight: '500',
//                                 cursor: 'pointer',
//                                 transition: 'all 0.3s ease',
//                                 fontFamily: "'Poppins', sans-serif",
//                             }}
//                             className={`w-full text-white transition-all duration-300 transform hover:scale-105 shadow-md ${isAuthenticated ? 'bg-green-500 hover:bg-green-600' : ''}`}
//                         >
//                             {isAuthenticated ? <CheckCircle className="w-5 h-5 mr-2" /> : <Upload className="w-5 h-5 mr-2" />}
//                             {isAuthenticated ? 'Authenticated with Google Drive' : 'Authenticate with Google Drive'}
//                         </Button>
//                     </div>

//                     {alert && (
//                         <Alert
//                             severity={alert.type}
//                             sx={{
//                                 backgroundColor: alert.type === 'success' ? 'var(--alert-success-background)' : 'var(--alert-error-background)',
//                                 color: alert.type === 'success' ? 'var(--alert-success-text)' : 'var(--alert-error-text)',
//                                 marginTop: 2
//                             }}
//                         >
//                             {alert.message}
//                         </Alert>
//                     )}

//                     <div className="flex w-full">
//                         <Button
//                             type="submit"
//                             variant="contained"
//                             sx={{ flex: 1, marginRight: '8px', backgroundColor: '#3498db' }}
//                         >
//                             Save
//                         </Button>

//                         {onCancelEdit && (
//                             <Button
//                                 onClick={onCancelEdit}
//                                 variant="outlined"
//                                 sx={{ flex: 1, marginLeft: '8px', color: 'var(--text-color)', borderColor: '#363532', borderWidth: '2px', borderStyle: 'solid' }} // White border color
//                             >
//                                 Cancel
//                             </Button>
//                         )}
//                     </div>
//                 </form>
//             </div>
//         </>
//     );
// };

// export default CreateGpt;
