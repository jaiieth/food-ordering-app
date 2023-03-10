import React, { useState, useEffect } from "react";
import axios from "axios";

const Admin = () => {
  const [selectedConfig, setSelectedConfig] = useState(0);
  const [category, setCategory] = useState([]);
  const [fetchState, setFetchState] = useState(false);
  const [result, setResult] = useState();
  const [isAddMenuFailed, setIsAddMenuFailed] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const addCategory = (category) => {
    const data = JSON.stringify({
      name: category,
    });
    const config = {
      method: "post",
      url: "https://food-backend.vercel.app/foodOrdering/addCategory",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        setResult(true);
        document.getElementById("addCategory").reset();
      })
      .catch(function (error) {
        // console.log(error);
        setIsAddMenuFailed(true);
        document.getElementById("addCategory").reset();
      });
  };

  const addMenu = (input, imageurl) => {
    const _name = input["name"].value;
    const _price = Number(input["price"].value);
    const _url = imageurl;
    const _categoryId = Number(input["category"].value);
    const data = JSON.stringify({
      name: _name,
      price: _price,
      image: _url,
      categoryId: _categoryId,
    });
    const config = {
      method: "post",
      url: "https://food-backend.vercel.app/foodOrdering/addMenu",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        setResult(true);
        document.getElementById("addMenu").reset();
      })
      .catch(function (error) {
        // console.log("error");
        setIsAddMenuFailed(true);
        document.getElementById("addMenu").reset();
      });
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    // console.log('selectedFile', selectedFile)
    const temporaryUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(temporaryUrl);
  };

  const handleSubmit = async (event, input) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("image", file);

    const config = {
      method: "post",
      url: "https://food-backend.vercel.app/uploadImg",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    };
    axios(config)
      .then(function (response) {
        // console.log("responseAPI",response.data)
        addMenu(input, response.data);
        // event.target.reset();
      })
      .catch(function (error) {
        // console.log(error);
        setIsAddMenuFailed(true);
        // event.target.reset();
      });
  };

  useEffect(() => {
    const config = {
      method: "post",
      url: "https://food-backend.vercel.app/foodOrdering/getCategory",
      headers: {},
    };

    axios(config)
      .then(function (response) {
        setCategory(response.data);
      })
      .catch(function (error) {
        // console.log(error);
      });
  }, [fetchState]);
  return (
    <div className="mt-20 p-5 font-kanit">
      <ul className="mx-auto flex w-10/12 justify-center space-x-4 border-b p-4">
        <button
          className={selectedConfig === 0 ? "underline" : ""}
          onClick={() => setSelectedConfig(0)}
        >
          ????????????????????????????????????????????????
        </button>
        <button
          className={selectedConfig === 1 ? "underline" : ""}
          onClick={() => setSelectedConfig(1)}
        >
          ???????????????????????????
        </button>
        {/* <button
          className={selectedConfig === 2 ? "underline" : ""}
          onClick={() => setSelectedConfig(2)}
        >
          ?????????????????????????????????
        </button> */}
      </ul>
      {selectedConfig === 0 && (
        <div>
          <form
            id="addCategory"
            className="mx-auto mt-4 flex flex-col justify-center p-6 md:w-1/2"
            onSubmit={(e) => {
              e.preventDefault();
              const category = e.target[0].value;
              const result = addCategory(category);
              setResult(result);
            }}
          >
            <input
              required
              placeholder="?????????????????????????????????????????????"
              className="rounded-lg border p-2 px-4 "
            ></input>
            <button
              type="submit"
              className="mx-auto mt-4 w-20 rounded-lg bg-slate-100 p-2 shadow-md hover:bg-slate-200"
            >
              ???????????????
            </button>
          </form>
          <div className="mx-auto md:w-1/2">
            ??????????????????????????????????????????????????????
            {category?.map((e, idx) => {
              return (
                <ul key={idx} className="text">
                  <li className="list-inside list-disc">
                    ID {e.id} : {e.name}
                  </li>
                </ul>
              );
            })}
          </div>
        </div>
      )}
      {selectedConfig === 1 && (
        <form
          id="addMenu"
          className="mx-auto mt-4 flex flex-col justify-center p-6 md:w-1/2"
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.target;
            handleSubmit(e, input);
          }}
        >
          {previewUrl && (
            <img
              className="my-10 mx-auto h-[200px] w-[200px]"
              src={previewUrl}
              alt="Selected"
            />
          )}
          <label>????????????????????????</label>
          <input
            required
            id="name"
            placeholder="???????????????????????????????????????????????????"
            className="rounded-lg border p-2 px-4 "
          ></input>
          <label>????????????</label>
          <input
            id="price"
            type="number"
            placeholder="???????????????????????????????????????"
            className="rounded-lg border p-2 px-4 "
          ></input>
          <label>URL ????????????????????????</label>
          <input
            accept="image/jpeg, image/png"
            onChange={handleFileChange}
            required
            type="file"
            name="file"
            className="rounded-lg border p-2 px-4 "
          ></input>
          {/* <input
            id="url"
            placeholder="???????????? URL"
            className="rounded-lg border p-2 px-4 "
          ></input> */}
          <label>??????????????????</label>
          <input
            type="number"
            id="category"
            placeholder="???????????? ID ?????????????????????????????????"
            className="rounded-lg border p-2 px-4 "
          ></input>
          <button
            type="submit"
            className="mx-auto mt-4 w-20 rounded-lg bg-slate-100 p-2 shadow-md hover:bg-slate-200"
          >
            ???????????????????????????
          </button>
        </form>
      )}
      {/* {selectedConfig === 2 && (
        <div>
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-4 flex flex-col justify-center p-6 md:w-1/2"
          >
            <input
              onChange={handleFileChange}
              required
              type="file"
              name="file"
              className="rounded-lg border p-2 px-4 "
            ></input>
            {previewUrl && (
              <img
                className="my-10 mx-auto h-[200px] w-[200px]"
                src={previewUrl}
                alt="Selected"
              />
            )}
            <button
              type="submit"
              className="mx-auto mt-4 w-20 rounded-lg bg-slate-100 p-2 shadow-md hover:bg-slate-200"
            >
              Upload
            </button>
          </form>
        </div>
      )} */}
      <div
        className={`fixed bottom-1/2 left-auto z-10 flex h-[100px]
        w-10/12 flex-col justify-between border border-slate-100 bg-white p-5
        text-center shadow-lg duration-500 md:left-1/4 md:bottom-1/2 md:h-[150px] md:w-1/2 md:rounded-xl md:px-10
        ${result ? "" : "scale-0"}`}
      >
        <p>???????????????????????????????????????????????????</p>
        <button
          onClick={() => {
            setFetchState(!fetchState);
            setResult();
            setPreviewUrl();
          }}
          className="mx-auto w-20 rounded-lg bg-slate-50 p-2 shadow-lg hover:bg-slate-100 active:shadow-inner"
        >
          OK
        </button>
      </div>
      <div
        className={`fixed bottom-1/2 left-auto z-10 flex h-[100px]
        w-10/12 flex-col justify-between border border-slate-100 bg-white p-5
        text-center shadow-lg duration-500 md:left-1/4 md:bottom-1/2 md:h-[150px] md:w-1/2 md:rounded-xl md:px-10
        ${isAddMenuFailed ? "" : "scale-0"}`}
      >
        <p>????????????????????????????????????????????????????????????</p>
        <button
          onClick={() => {
            setFetchState(!fetchState);
            setIsAddMenuFailed(false);
            setPreviewUrl();
          }}
          className="mx-auto w-20 rounded-lg bg-slate-50 p-2 shadow-lg hover:bg-slate-100 active:shadow-inner"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default Admin;
