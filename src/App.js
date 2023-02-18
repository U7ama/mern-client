import { useState } from 'react';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [carModel, setCarModel] = useState('');
  const [price, setPrice] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [token, setToken] = useState();
  const [files, setFiles] = useState();
  const [error, setError] = useState(false);
  const [successDataInput, setSuccessDataInput] = useState(false);

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    const min = event.target.getAttribute('min');
    const max = event.target.getAttribute('max');

    if (selectedFiles.length < min) {
      alert(`Please select at least ${min} file(s).`);
    } else if (selectedFiles.length > max) {
      alert(`Please select no more than ${max} file(s).`);
    } else {
      setFiles(selectedFiles);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(event)
    const response = await fetch('https://mern-backend-gold.vercel.app/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem('token', token);
      console.log(token)
      setToken(token)

    } else {
      setError(true)
    }
  };

  const handleSubmitForm = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('carModel', carModel);
    formData.append('price', price);
    formData.append('phoneNo', phoneNo);
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      const response = await fetch('https://mern-backend-gold.vercel.app/submit-form', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setError(false)
        console.log('Form data submitted successfully!');
        setSuccessDataInput(true);
      } else {
        console.error('Form submission failed.');
      }
    } catch (error) {
      console.error('Error submitting form data:', error);
    }
  };
  return (
    <>
      <header class="bg-blue-500 text-white py-4">
        <div class="container mx-auto flex justify-between items-center px-4 cursor-pointer" onClick={() => setToken(null)}>
          <div class="text-xl font-bold">Home</div>
        </div>
      </header>

      <div className='flex h-screen w-screen items-center justify-center'>
        {token ? <form onSubmit={handleSubmitForm} className="max-w-md mx-auto">
          <div className="mb-4">
            <label htmlFor="carModel" className="block font-medium text-gray-700 mb-2">
              Car Model:
            </label>
            <input
              type="text"
              id="carModel"
              value={carModel}
              onChange={(event) => setCarModel(event.target.value)}
              className="border border-gray-400 rounded-lg px-3 py-2 w-full"
              minLength={3}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block font-medium text-gray-700 mb-2">
              Price:
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className="border border-gray-400 rounded-lg px-3 py-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phoneNo" className="block font-medium text-gray-700 mb-2">
              Phone No:
            </label>
            <input
              type="text"
              id="phoneNo"
              value={phoneNo}
              onChange={(event) => setPhoneNo(event.target.value)}
              className="border border-gray-400 rounded-lg px-3 py-2 w-full"
              minLength={11}
              maxLength={11}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="picture" className="block font-medium text-gray-700 mb-2">
              Picture:
            </label>

            <input className="border border-gray-400 rounded-lg px-3 py-2 w-full" type="file" name="images[]" multiple accept=".jpg,.jpeg,.png" min="1" max="10" onChange={handleFileChange} required />
            <p>{files?.length} file(s) selected.</p>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg px-3 py-2 hover:bg-blue-600"
          >
            Submit
          </button>
          {
            successDataInput && <p className='text-center mt-[10px]'>Successfully Data Submited for {username}</p>
          }
        </form> : <form onSubmit={handleSubmit} onClick={() => setError(false)} className="w-full max-w-md mx-auto">
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Sign In
          </button>
          {
            error && (<div class="flex justify-center mt-[10px]">
              <div class="flex-shrink-0 bg-red-100 border border-red-400 text-red-700 px-10 py-3 rounded relative w-full sm:w-auto" role="alert">
                <div class="flex items-center">

                  <div>
                    <p class="font-bold">Error</p>
                    <p class="text-sm">Unauthrized User</p>
                  </div>
                  <div class="pl-10">
                    <button class="flex-shrink-0 focus:outline-none" onClick={() => setError(false)}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
            )
          }
        </form>}

      </div>
    </>
  );
};

export default App;
