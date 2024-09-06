import { IconBuildingFactory2, IconCaretDown, IconHomeQuestion, IconPhone, IconShieldLock, IconUser } from "@tabler/icons-react";
import { IconShieldCheck } from "@tabler/icons-react";
import { IconMail } from "@tabler/icons-react";
import { useFormik, useFormikContext } from "formik";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import * as Yup from 'yup';
const phoneRegExp = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;
function SignUp() {
    const router = useRouter();
    const [errorMsg, setErrorMsg] = useState('');
    const signupSchema = Yup.object({
        username: Yup.string().required('username is required.'),
        email: Yup.string().email().required('email is required.'),
        phone_no: Yup.string()
            .required('phone is required.')
            .matches(phoneRegExp, 'Phone number is not valid')
            .required('User contact is required.'),
        industry: Yup.string().required('Industry is required.').min(3),
        purpose: Yup.string().required('Purpose is required.').min(3),
        secretquestion: Yup.string().required('Select security question'),
        secretanswer: Yup.string().required('Security answer required').max(255),

    });

    const SubmitForm = () => {
        const requestOptions = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formik.values),
        };

        fetch('https://api.chatgeniusplus.ai/createuser', requestOptions)
            .then((response: any) => response.json())
            .then(
                (data: any) => {
                    //    console.log(data,data.user_id);

                    if (data && data.status == "success") {

                        router.push('/login')
                    } else {
                        setErrorMsg(data.message ? data.message : 'Something went wrong');
                    }

                },
                (error: any) => {
                    setErrorMsg('Something went wrong')
                }
            );
    }
    const secretQuestion = [
        { value: 'What was your favorite subject in high school?' },
        { value: 'What is your first employee ID number?' },
        { value: 'Where did you go on your favorite vacation as a child?' },
        { value: 'What is your graduation score?' },
    ]
    const [isOpen, setIsOpen] = useState(false);
    const formik: any = useFormik({
        initialValues: {
            username: '',
            industry: '',
            purpose: '',
            email: '',
            phone_no: '',
            secretquestion: '',
            secretanswer: ''
        },
        validationSchema: signupSchema,
        onSubmit: SubmitForm,
    });


    const selectOption = (val: any) => {
        formik.setFieldValue('secretquestion', val);
        setIsOpen(false)
    }

    const fields = [
        { lable: 'Name', name: 'username', placeholder: 'Enter your Name', error: formik.errors.username, icon: <IconUser /> },
        { lable: 'Email Id', name: 'email', placeholder: 'Enter your Email id', error: formik.errors.email, icon: <IconMail /> },
        { lable: 'What industry do you work in?', name: 'industry', placeholder: 'Enter your Industry Name', error: formik.errors.industry, icon: <IconBuildingFactory2 /> },
        { lable: 'What is the purpose for requirement?', name: 'purpose', placeholder: 'Enter your Purpose', error: formik.errors.purpose, icon: <IconHomeQuestion /> },
        { lable: 'Phone No', name: 'phone_no', placeholder: 'Enter your Phone no', error: formik.errors.phone_no, icon: <IconPhone /> },
        { lable: 'Secret Question', name: 'secretquestion', placeholder: 'Enter your Secret question', error: formik.errors.secretquestion, icon: <IconCaretDown /> },
        { lable: 'Secret Answer', name: 'secretanswer', placeholder: 'Enter your Secret Answer', error: formik.errors.secretanswer, icon: <IconShieldCheck /> },
    ]

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
                    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
                        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                            <Image className="w-48 " height={264} width={1237} src="/logo.png" alt="logo" />
                        </a>
                        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                    Request Access
                                </h1>
                                <form onSubmit={formik.handleSubmit}>
                                    {fields.map((item: any, index) => (
                                        <div key={'fiels-' + index}>
                                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{item.lable}</label>
                                            {item.name == 'secretquestion' ?
                                                <div className="relative pb-2">
                                                    <div className="relative flex w-full flex-wrap items-stretch mb-3">
                                                        <input
                                                            type="text"
                                                            autoComplete="off"
                                                            placeholder={item.placeholder}
                                                            //    onChange={formik.handleChange}
                                                            name="secretquestion"
                                                            // onBlur={formik.handleBlur}
                                                            value={formik.values.secretquestion}
                                                            className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full pr-10" />
                                                        <span onClick={() => setIsOpen(!isOpen)} className="cursor-pointer z-10 h-full leading-snug font-normal absolute text-center text-slate-300 absolute bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-3 py-3">
                                                            {item.icon}
                                                        </span>
                                                    </div>

                                                    {isOpen && secretQuestion.length > 0 && (
                                                        <div className="z-10 absolute mt-1 bg-white border rounded-md shadow-md">

                                                            <ul className="py-2">
                                                                {secretQuestion.map((option, index) => (
                                                                    <li
                                                                        onClick={() => selectOption(option.value)}
                                                                        key={index} className="px-4 py-2 hover:bg-gray-100">
                                                                        {option.value}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                                :

                                                <div className="relative flex w-full flex-wrap items-stretch mb-3">
                                                    <input autoComplete="off" onBlur={formik.handleBlur} onChange={formik.handleChange} name={item.name} type="text" placeholder={item.placeholder} className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full pr-10" />
                                                    <span className="z-10 h-full leading-snug font-normal absolute text-center text-slate-300 absolute bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-3 py-3">
                                                        {item.icon}
                                                    </span>
                                                </div>
                                            }
                                            {formik.touched[item.name] && item.error && (<p className="text-red-600">{item.error}</p>)}
                                        </div>
                                    ))}

                                    {errorMsg && (<p className="text-red-600 py-3">{errorMsg}</p>)
                                    }
                                    <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                                    <p className="text-sm py-3 font-light text-gray-500 dark:text-gray-400">
                                        Do you have an account? <a href="login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login</a>
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

export default SignUp
