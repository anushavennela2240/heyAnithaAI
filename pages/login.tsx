import { IconEyeOff, IconShieldLock } from "@tabler/icons-react";
import { IconMail } from "@tabler/icons-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Image from "next/image";
import { IconEye } from "@tabler/icons-react";

function Login() {
   const router = useRouter();
const[errorMsg,setErrorMsg] =useState(false);
const[show,setShow] =useState(false);
const[loading,setLoading] =useState(false);
const signinSchema = Yup.object({
   EmailId: Yup.string().email('Invalid email').required('Email is required'),
   password: Yup.string().required('Password is required.').min(7),
 });

    const SubmitForm = ()=>{
      setErrorMsg(false)
      setLoading(true)
      const requestOptions = {
         method: 'post',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(values),
       };
   
       fetch('https://api.chatgeniusplus.ai/login', requestOptions)
         .then((response: any) => response.json())
         .then(
           (data: any) => {
            if (data && data.user_id) {
               localStorage.setItem('user',JSON.stringify(data));
               router.push('/')

            } else{
               setLoading(false)
               setErrorMsg(true)
            }
            
           },
           (error: any) => {
            setErrorMsg(true)
            setLoading(false)
           }
         );
    }

    const { values, errors, handleSubmit, handleBlur, touched, handleChange } =
    useFormik({
      initialValues: {
        EmailId: '',
        password: '',
      },
      validationSchema: signinSchema,
      onSubmit: SubmitForm,
    });    
    
   return (
      <div>
         <Head>
            <title>Heyanitha.ai</title>
            <meta name="description" content="ChatGPT but better." />
            <meta
               name="viewport"
               content="height=device-height ,width=device-width, initial-scale=1, user-scalable=no"
            />
            <link rel="icon" href="/favicon2.png" />
         </Head>

         <main
            className={`flex h-screen w-screen flex-col `}
         >
            <section className="">
               <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                  <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                     <Image height={264} width={1237} className="w-48 " src="/logo.png" alt="logo" />

                  </a>
                  <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                     <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                           Login
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit} action="">
                           <div>
                              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                              {/* <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" /> */}
                              <div className="relative flex w-full flex-wrap items-stretch mb-3">
                                 <input type="email" placeholder="Your Email Id" 
                                 onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.EmailId}
                         name="EmailId" 
                         className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full pr-10" />
                                 <span className="z-10 h-full leading-snug font-normal absolute text-center text-slate-300 absolute bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-3 py-3">
                                    <IconMail />
                                 </span>
                              </div>
                              {touched.EmailId && errors.EmailId && ( <p className="text-red-600">{errors.EmailId}</p>)}

                           </div>
                           <div>
                              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                              {/* <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" /> */}
                              <div>
                                 <div className="relative flex w-full flex-wrap items-stretch mb-3">
                                    <input type={show? "text":"password"} name="password" id="password" onChange={handleChange}
                        onBlur={handleBlur}
                        
                        value={values.password} placeholder="••••••••" className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full pr-10" />
                                    <span onClick={()=>setShow(!show)} className="cursor-pointer z-10 h-full leading-snug font-normal absolute text-center text-slate-300 absolute bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-3 py-3">
                                     {show?  <IconEye/>:<IconEyeOff />}
                                    </span>
                                 </div>
                                {touched.password && errors.password && ( <p className="text-red-600">{errors.password}</p>)}


                              </div>
                           </div>
                           <div>
                              {errorMsg && (<p className="text-red-600">Please check your Email-id & Password !</p>)}
                           </div>
                           <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                            {loading? 'Loading.....': "SIGN IN"}
                              </button>
                           <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                              Don&apos;t have an account yet? <a href="sign-up" className="font-medium text-primary-600 hover:underline dark:text-primary-500">REQUEST ACCESS</a>
                           </p>
                        </form>
                     </div>
                  </div>
               </div>
            </section>
         </main>

      </div>
   );
}

export default Login
